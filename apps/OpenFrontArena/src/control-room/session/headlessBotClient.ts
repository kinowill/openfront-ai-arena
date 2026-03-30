import { randomUUID } from "node:crypto";
import type { Game, Player } from "../../../../OpenFrontIO/src/core/game/Game";
import { createGameRunner, type GameRunner } from "../../../../OpenFrontIO/src/core/GameRunner";
import type {
  ClientJoinMessage,
  ClientMessage,
  ClientPingMessage,
  ServerMessage,
  ServerStartGameMessage,
  Turn,
} from "../../../../OpenFrontIO/src/core/Schemas";
import { OpenFrontSnapshotAdapter } from "../../adapters/openfront/snapshotAdapter";
import type { OpenFrontBot } from "../../bots/types";
import { arbitrateDecision, buildDecisionRecord } from "../../runtime/arbiter";
import type { MatchRef } from "../../contracts/shared";
import { JsonlTickLogger } from "../../runtime/tickLogger";
import {
  LocalOpenFrontMapLoader,
  buildIntentFromValidAction,
  type OpenFrontBridgeLobbyInfo,
} from "./openfrontBridge";

export interface HeadlessBotClientOptions {
  bot: OpenFrontBot;
  displayName: string;
  lobby: OpenFrontBridgeLobbyInfo;
  tickLogger: JsonlTickLogger;
  matchRef: MatchRef;
  onSummary?: (summary: string, tick?: number | null) => void;
}

function safeJsonParse(raw: string): ServerMessage | null {
  try {
    return JSON.parse(raw) as ServerMessage;
  } catch {
    return null;
  }
}

export class HeadlessBotClient {
  private readonly token = randomUUID();
  private readonly mapLoader = new LocalOpenFrontMapLoader();
  private readonly snapshotAdapter = new OpenFrontSnapshotAdapter();
  private socket: any = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private runner: GameRunner | null = null;
  private assignedClientId: string | null = null;
  private latestTurn = -1;
  private stopped = false;
  private joinResolve: (() => void) | null = null;
  private joinReject: ((error: Error) => void) | null = null;
  private joinedLobby = false;

  constructor(private readonly options: HeadlessBotClientOptions) {}

  async connect(): Promise<void> {
    const WebSocketCtor = (globalThis as any).WebSocket;
    if (!WebSocketCtor) {
      throw new Error("Global WebSocket client is not available in this Node runtime.");
    }

    this.socket = new WebSocketCtor(this.options.lobby.wsUrl);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.joinResolve = null;
        this.joinReject = null;
        reject(new Error(`Bot ${this.options.displayName} join timeout.`));
      }, 10000);
      this.joinResolve = () => {
        clearTimeout(timeout);
        this.joinResolve = null;
        this.joinReject = null;
        resolve();
      };
      this.joinReject = (error) => {
        clearTimeout(timeout);
        this.joinResolve = null;
        this.joinReject = null;
        reject(error);
      };

      this.socket.addEventListener("open", async () => {
        await this.send({
          type: "join",
          token: this.token,
          gameID: this.options.lobby.gameId,
          username: this.options.displayName,
          clanTag: null,
          turnstileToken: null,
        } satisfies ClientJoinMessage);
        this.startPing();
      });

      this.socket.addEventListener("message", (event: MessageEvent<string>) => {
        void this.onMessage(String(event.data)).catch((error) => {
          this.options.onSummary?.(
            `${this.options.displayName} runtime error: ${error instanceof Error ? error.message : "unknown error"}`,
            null,
          );
        });
      });
      this.socket.addEventListener("close", () => {
        this.stopPing();
        if (!this.joinedLobby && this.joinReject) {
          this.joinReject(new Error(`Bot ${this.options.displayName} disconnected before lobby join.`));
        }
      });
      this.socket.addEventListener("error", () => {
        if (this.joinReject) {
          this.joinReject(new Error(`Bot ${this.options.displayName} websocket error.`));
        }
      });
    });
  }

  async stop(): Promise<void> {
    this.stopped = true;
    this.stopPing();
    this.runner = null;
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // Ignore close errors during shutdown.
      }
    }
    this.socket = null;
  }

  private async onMessage(raw: string): Promise<void> {
    const message = safeJsonParse(raw);
    if (!message || this.stopped) {
      return;
    }

    switch (message.type) {
      case "lobby_info":
        this.assignedClientId = message.myClientID;
        this.joinedLobby = true;
        this.options.onSummary?.(
          `${this.options.displayName} joined lobby ${message.lobby.gameID}.`,
          null,
        );
        this.joinResolve?.();
        break;
      case "start":
        await this.onStart(message);
        break;
      case "turn":
        await this.onTurn(message.turn);
        break;
      case "error":
        if (!this.joinedLobby && this.joinReject) {
          this.joinReject(new Error(`${this.options.displayName} transport error: ${message.error}`));
        }
        this.options.onSummary?.(
          `${this.options.displayName} transport error: ${message.error}`,
          null,
        );
        break;
      default:
        break;
    }
  }

  private async onStart(message: ServerStartGameMessage): Promise<void> {
    this.assignedClientId = message.myClientID ?? this.assignedClientId;
    this.options.matchRef.id = message.gameStartInfo.gameID;
    this.options.matchRef.mapName = message.gameStartInfo.config.gameMap;
    this.runner = await createGameRunner(
      message.gameStartInfo,
      this.assignedClientId ?? undefined,
      this.mapLoader,
      () => {
        // The bot only needs deterministic state reconstruction here.
      },
    );

    for (const turn of message.turns) {
      this.runner.addTurn(turn);
      this.runner.executeNextTick();
      this.latestTurn = Math.max(this.latestTurn, turn.turnNumber);
    }

    await this.playCurrentTurn();
  }

  private async onTurn(turn: Turn): Promise<void> {
    if (!this.runner || turn.turnNumber <= this.latestTurn) {
      return;
    }

    this.runner.addTurn(turn);
    this.runner.executeNextTick();
    this.latestTurn = turn.turnNumber;
    await this.playCurrentTurn();
  }

  private async playCurrentTurn(): Promise<void> {
    if (!this.runner || !this.assignedClientId) {
      return;
    }

    const game = this.runner.game;
    const player = game.playerByClientID(this.assignedClientId);
    if (!player || !player.isAlive() || !player.hasSpawned()) {
      return;
    }

    this.options.matchRef.tick = game.ticks();
    this.options.matchRef.phase = game.inSpawnPhase() ? "spawn" : "early";

    const observation = this.snapshotAdapter.produce({
      game: game as any,
      player: player as any,
      context: {
        match: this.options.matchRef,
        mapVersion: `${this.options.matchRef.mapName}@openfrontio`,
        rulesVersion: "openfront-rules-1",
      },
    });

    const runtimeDecision = await this.options.bot.decide(observation, {
      tick: observation.match.tick,
    });
    const arbitration = arbitrateDecision(observation, runtimeDecision.decision);
    const intent = buildIntentFromValidAction(
      arbitration.executedAction,
      player,
      game,
    );

    if (intent) {
      await this.send({
        type: "intent",
        intent,
      });
    }

    const summary = intent
      ? `Intent sent: ${arbitration.executedAction.label}`
      : `No intent sent: ${arbitration.executedAction.label}`;
    const execution = {
      accepted: true,
      executedActionId: arbitration.executedAction.id,
      summary,
      ticksAdvanced: 0,
      executionKind: intent ? intent.type : "wait",
    };

    const decisionRecord = buildDecisionRecord({
      playerId: player.id(),
      tick: observation.match.tick,
      observation,
      decision: runtimeDecision.decision,
      executedActionId: execution.executedActionId,
      validationErrors: arbitration.validationErrors,
    });

    await this.options.tickLogger.log({
      decisionRecord,
      observation,
      execution,
      botId: this.options.bot.identity.id,
      createdAt: new Date().toISOString(),
    });

    this.options.onSummary?.(
      `${this.options.displayName}: ${summary}`,
      observation.match.tick,
    );
  }

  private startPing(): void {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      void this.send({
        type: "ping",
      } satisfies ClientPingMessage);
    }, 5000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private async send(message: ClientMessage): Promise<void> {
    if (!this.socket || this.socket.readyState !== 1) {
      return;
    }
    this.socket.send(JSON.stringify(message));
  }
}
