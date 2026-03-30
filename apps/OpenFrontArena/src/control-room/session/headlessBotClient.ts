import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
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
  debugLogPath?: string;
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
  private playInFlight = false;
  private playQueued = false;
  private spawnAttempt = 0;
  private runnerBroken = false;
  private lastActedTick = -1;
  private lastIntentSentAt = 0;

  constructor(private readonly options: HeadlessBotClientOptions) {}

  private async debug(event: string, payload: Record<string, unknown> = {}): Promise<void> {
    if (!this.options.debugLogPath) {
      return;
    }
    await fs.mkdir(path.dirname(this.options.debugLogPath), { recursive: true });
    await fs.appendFile(
      this.options.debugLogPath,
      `${JSON.stringify({
        ts: new Date().toISOString(),
        bot: this.options.displayName,
        event,
        ...payload,
      })}\n`,
      "utf8",
    );
  }

  private async decideWithTimeout(
    observation: any,
    tick: number,
  ): Promise<Awaited<ReturnType<HeadlessBotClientOptions["bot"]["decide"]>>> {
    const timeoutMs =
      this.options.bot.identity.backend === "rule_based" ? 2000 : 15000;

    await this.debug("decision_begin", {
      tick,
      backend: this.options.bot.identity.backend,
      timeoutMs,
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`bot_decide_timeout_${timeoutMs}ms`)), timeoutMs);
    });

    const result = (await Promise.race([
      Promise.resolve(this.options.bot.decide(observation, { tick })),
      timeoutPromise,
    ])) as Awaited<ReturnType<HeadlessBotClientOptions["bot"]["decide"]>>;

    await this.debug("decision_done", {
      tick,
      backend: this.options.bot.identity.backend,
    });

    return result;
  }

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
        await this.debug("socket_open", { lobby: this.options.lobby.gameId });
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
          void this.debug("message_error", {
            error: error instanceof Error ? error.message : "unknown error",
          });
          this.options.onSummary?.(
            `${this.options.displayName} runtime error: ${error instanceof Error ? error.message : "unknown error"}`,
            null,
          );
        });
      });
      this.socket.addEventListener("close", () => {
        this.stopPing();
        void this.debug("socket_close", { joinedLobby: this.joinedLobby });
        if (!this.joinedLobby && this.joinReject) {
          this.joinReject(new Error(`Bot ${this.options.displayName} disconnected before lobby join.`));
        }
      });
      this.socket.addEventListener("error", () => {
        void this.debug("socket_error");
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
        await this.debug("lobby_info", {
          assignedClientId: message.myClientID,
          connectedPlayers: message.lobby.clients?.length ?? null,
        });
        this.assignedClientId = message.myClientID;
        this.joinedLobby = true;
        this.options.onSummary?.(
          `${this.options.displayName} joined lobby ${message.lobby.gameID}.`,
          null,
        );
        this.joinResolve?.();
        break;
      case "start":
        await this.debug("start", {
          assignedClientId: message.myClientID ?? this.assignedClientId,
          players: message.gameStartInfo.players.length,
          turnBacklog: message.turns.length,
        });
        await this.onStart(message);
        break;
      case "turn":
        if (message.turn.turnNumber <= 3 || message.turn.turnNumber % 25 === 0) {
          await this.debug("turn", {
            turn: message.turn.turnNumber,
            intents: message.turn.intents.length,
          });
        }
        await this.onTurn(message.turn);
        break;
      case "error":
        await this.debug("transport_error", { error: message.error });
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
    // OpenFrontIO game logic expects a bundled GAME_ENV even when reused from Node.
    process.env.GAME_ENV ??= "dev";
    await this.debug("start_runner_begin", {
      gameId: message.gameStartInfo.gameID,
      map: message.gameStartInfo.config.gameMap,
      mapSize: message.gameStartInfo.config.gameMapSize,
      players: message.gameStartInfo.players.length,
    });
    this.runner = await createGameRunner(
      message.gameStartInfo,
      this.assignedClientId ?? undefined,
      this.mapLoader,
      (update) => {
        if (!("errMsg" in update)) {
          return;
        }
        this.runnerBroken = true;
        void this.debug("runner_error", {
          errMsg: update.errMsg,
          stack: update.stack ?? null,
          latestTurn: this.latestTurn,
        });
        this.options.onSummary?.(
          `${this.options.displayName} runner error: ${update.errMsg}`,
          this.runner?.game.ticks() ?? null,
        );
      },
    );
    this.runnerBroken = false;
    await this.debug("start_runner_ready", {
      assignedClientId: this.assignedClientId,
      ticks: this.runner.game.ticks(),
    });

    for (const turn of message.turns) {
      this.runner.addTurn(turn);
      this.runner.executeNextTick();
      this.latestTurn = Math.max(this.latestTurn, turn.turnNumber);
    }
    await this.debug("start_backlog_applied", {
      latestTurn: this.latestTurn,
      backlog: message.turns.length,
    });

    await this.runPlayLoop();
    await this.debug("start_first_play_completed", {
      latestTurn: this.latestTurn,
    });
  }

  private async onTurn(turn: Turn): Promise<void> {
    if (!this.runner || turn.turnNumber <= this.latestTurn) {
      return;
    }

    this.runner.addTurn(turn);
    this.runner.executeNextTick();
    this.latestTurn = turn.turnNumber;
    await this.runPlayLoop();
  }

  private async runPlayLoop(): Promise<void> {
    if (this.playInFlight) {
      this.playQueued = true;
      return;
    }

    this.playInFlight = true;
    try {
      do {
        this.playQueued = false;
        await this.playCurrentTurn();
      } while (this.playQueued);
    } finally {
      this.playInFlight = false;
    }
  }

  private async playCurrentTurn(): Promise<void> {
    await this.debug("play_begin", {
      hasRunner: Boolean(this.runner),
      assignedClientId: this.assignedClientId,
    });
    if (!this.runner || !this.assignedClientId) {
      await this.debug("play_skipped", {
        reason: !this.runner ? "no_runner" : "no_assigned_client_id",
      });
      return;
    }
    if (this.runnerBroken) {
      await this.debug("play_skipped", {
        reason: "runner_broken",
      });
      return;
    }

    const game = this.runner.game;
    await this.debug("play_game_loaded", {
      tick: game.ticks(),
    });
    const player = game.playerByClientID(this.assignedClientId);
    if (!player) {
      await this.debug("play_skipped", {
        reason: "player_not_found",
        assignedClientId: this.assignedClientId,
      });
      return;
    }
    if (player.hasSpawned() && !player.isAlive()) {
      await this.debug("play_skipped", {
        reason: "dead_player",
        playerId: player.id(),
      });
      return;
    }
    await this.debug("play_player_ready", {
      playerId: player.id(),
      alive: player.isAlive(),
      spawned: player.hasSpawned(),
    });

    this.options.matchRef.tick = game.ticks();
    this.options.matchRef.phase = game.inSpawnPhase() ? "spawn" : "early";

    const produceStartedAt = Date.now();
    await this.debug("produce_begin", {
      tick: game.ticks(),
      spawned: player.hasSpawned(),
    });
    let observation;
    try {
      observation = this.snapshotAdapter.produce({
        game: game as any,
        player: player as any,
        context: {
          match: this.options.matchRef,
          mapVersion: `${this.options.matchRef.mapName}@openfrontio`,
          rulesVersion: "openfront-rules-1",
        },
      });
    } catch (error) {
      await this.debug("produce_error", {
        tick: game.ticks(),
        spawned: player.hasSpawned(),
        error: error instanceof Error ? error.message : "unknown error",
      });
      throw error;
    }
    await this.debug("produce_done", {
      tick: observation.match.tick,
      spawned: observation.player.spawned,
      durationMs: Date.now() - produceStartedAt,
    });
    await this.debug("play_observation_ready", {
      tick: observation.match.tick,
      validActions: observation.validActions.length,
      spawned: observation.player.spawned,
    });

    if (observation.player.spawned && observation.match.tick <= this.lastActedTick) {
      await this.debug("intent_skipped", {
        tick: observation.match.tick,
        selectedActionType: "already_acted_this_tick",
      });
      return;
    }

    if (!player.hasSpawned()) {
      const spawnActions = observation.validActions.filter((action) => action.type === "spawn");
      const preferredOffset =
        Math.abs(
          Array.from(this.options.bot.identity.id).reduce(
            (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
            0,
          ),
        ) % Math.max(1, spawnActions.length);
      const spawnAction =
        spawnActions[(preferredOffset + this.spawnAttempt) % Math.max(1, spawnActions.length)];
      if (!spawnAction) {
        await this.debug("intent_skipped", {
          tick: observation.match.tick,
          selectedActionType: "no_spawn_action_available",
        });
        return;
      }
      this.spawnAttempt += 1;

      const spawnIntent = buildIntentFromValidAction(
        spawnAction,
        player,
        game,
      );
      if (spawnIntent) {
        await this.send({
          type: "intent",
          intent: spawnIntent,
        });
        await this.debug("intent_sent", {
          tick: observation.match.tick,
          intentType: spawnIntent.type,
          forced: true,
          selectedActionId: spawnAction.id,
        });
      }
      return;
    }

    this.spawnAttempt = 0;

    const runtimeDecision = await this.decideWithTimeout(
      observation,
      observation.match.tick,
    );
    const arbitration = arbitrateDecision(observation, runtimeDecision.decision);
    await this.debug("decision", {
      tick: observation.match.tick,
      playerId: player.id(),
      spawned: player.hasSpawned(),
      selectedActionId: runtimeDecision.decision.selectedActionId,
      selectedActionType: arbitration.executedAction.type,
      validActions: observation.validActions.length,
    });
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
      this.lastActedTick = observation.match.tick;
      await this.debug("intent_sent", {
        tick: observation.match.tick,
        intentType: intent.type,
      });
    } else {
      await this.debug("intent_skipped", {
        tick: observation.match.tick,
        selectedActionType: arbitration.executedAction.type,
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
    if (message.type === "intent") {
      const minIntentIntervalMs =
        this.options.bot.identity.backend === "rule_based" ? 250 : 400;
      const now = Date.now();
      const elapsed = now - this.lastIntentSentAt;
      if (elapsed < minIntentIntervalMs) {
        await this.debug("intent_skipped", {
          selectedActionType: "rate_limited_locally",
          minIntentIntervalMs,
          elapsedMs: elapsed,
        });
        return;
      }
      this.lastIntentSentAt = now;
    }
    this.socket.send(JSON.stringify(message));
  }
}
