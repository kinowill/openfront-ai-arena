import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  type Game,
  GameMapType,
  PlayerType,
} from "../../../../OpenFrontIO/src/core/game/Game";
import { GreedyExpandBot } from "../../bots/GreedyExpandBot";
import { AggressiveFrontlineBot } from "../../bots/AggressiveFrontlineBot";
import { EconomicGrowthBot } from "../../bots/EconomicGrowthBot";
import { NavalPressureBot } from "../../bots/NavalPressureBot";
import type { OpenFrontBot } from "../../bots/types";
import { JsonlTickLogger } from "../../runtime/tickLogger";
import { LocalLlmBot } from "../../runtimes/localLlmBot";
import { RemoteApiBot } from "../../runtimes/remoteApiBot";
import type {
  ControlRoomCapabilities,
  ControlRoomLiveMap,
  ControlRoomMapOption,
  ControlRoomOperatorPanel,
  ControlRoomSessionConfig,
  ControlRoomSessionRuntime,
  ControlRoomSessionSnapshot,
  ControlRoomSlotConfig,
} from "./contracts";
import {
  buildLobbyInfo,
  buildPrivateLobbyConfig,
  createPrivateLobby,
  fetchLobbyState,
  mapThumbnailPath,
  startPrivateLobby,
} from "./openfrontBridge";
import { HeadlessBotClient } from "./headlessBotClient";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");
const LOG_FILE = path.join(ROOT_DIR, "logs", "local-harness.jsonl");
const DEBUG_LOG_FILE = path.join(ROOT_DIR, "logs", "headless-bots.jsonl");
const AVAILABLE_MAPS = Object.values(GameMapType);
const RANDOM_MAP_VALUE = "__random__";
const TEAM_COLORS = ["Red", "Blue", "Teal", "Purple", "Yellow", "Orange", "Green"] as const;
const MAP_OPTIONS: ControlRoomMapOption[] = AVAILABLE_MAPS.map((name) => ({
  name,
  previewUrl: `/api/maps/preview?name=${encodeURIComponent(name)}`,
}));
const LIVE_MAP_MAX_DIMENSION = 96;

function defaultConfig(): ControlRoomSessionConfig {
  return {
    mapName: RANDOM_MAP_VALUE,
    gameMode: "ffa",
    teamCount: 2,
    tickDelayMs: 700,
    maxTicks: 500,
    infiniteGold: false,
    infiniteTroops: false,
    instantBuild: false,
    nativeBotCount: 0,
    slots: [],
  };
}

function defaultRuntime(): ControlRoomSessionRuntime {
  return {
    status: "idle",
    activeMatchId: null,
    tick: null,
    startedAt: null,
    stoppedAt: null,
    lastError: null,
    lastSummary: null,
    joinSupport: "openfront_client_lobby",
    joinNotes: [
      "La control room prepare maintenant un vrai lobby OpenFrontIO.",
      "Les slots bot rejoignent le vrai match via le transport reseau.",
      "Un slot humain reserve doit rejoindre le lobby OpenFront avant le lancement effectif.",
    ],
    surfaceUrl: null,
    joinUrl: null,
    connectedPlayers: null,
    requiredPlayers: null,
  };
}

function capabilities(): ControlRoomCapabilities {
  return {
    canConfigureSlots: true,
    canLaunchCustomMatches: true,
    canRunRuleBasedBots: true,
    canRunLocalLlmBots: true,
    canRunRemoteApiBots: true,
    canReserveHumanSlots: true,
    canJoinLiveMatchDirectly: true,
  };
}

function sanitizeSlot(slot: ControlRoomSlotConfig, index: number): ControlRoomSlotConfig {
  const preset =
    slot.preset === "greedy_expand" ||
    slot.preset === "aggressive_frontline" ||
    slot.preset === "economic_growth" ||
    slot.preset === "naval_pressure" ||
    slot.preset === "local_llm" ||
    slot.preset === "remote_api" ||
    slot.preset === "human_operator"
      ? slot.preset
      : "greedy_expand";
  const secretMode =
    preset === "remote_api" && (slot.secretMode === "env" || slot.secretMode === "direct" || slot.secretMode === "vault")
      ? slot.secretMode
      : preset === "remote_api"
        ? slot.secretRef?.trim()
          ? "vault"
          : slot.apiKeyEnv?.trim()
            ? "env"
            : "direct"
        : null;

  return {
    slotId: slot.slotId || `slot_${index + 1}`,
    enabled: Boolean(slot.enabled),
    label: slot.label?.trim() || `Slot ${index + 1}`,
    slotKind: slot.slotKind === "human_reserved" ? "human_reserved" : "bot",
    preset,
    providerPreset: slot.providerPreset?.trim() || null,
    model: slot.model?.trim() || null,
    baseUrl: slot.baseUrl?.trim() || null,
    secretMode,
    secretRef: preset === "remote_api" ? slot.secretRef?.trim() || null : null,
    apiKeyEnv: slot.apiKeyEnv?.trim() || null,
    teamPreference:
      slot.teamPreference && TEAM_COLORS.includes(slot.teamPreference as (typeof TEAM_COLORS)[number])
        ? slot.teamPreference
        : null,
  };
}

function pickRandomMap(): string {
  return AVAILABLE_MAPS[Math.floor(Math.random() * AVAILABLE_MAPS.length)] ?? "World";
}

function resolveConfiguredMapName(config: ControlRoomSessionConfig): string {
  return config.mapName === RANDOM_MAP_VALUE ? pickRandomMap() : config.mapName;
}

function sanitizeConfig(next: Partial<ControlRoomSessionConfig>): ControlRoomSessionConfig {
  const base = defaultConfig();
  const gameMode = next.gameMode === "team" ? "team" : "ffa";
  const slots = (next.slots ?? base.slots)
    .map((slot, index) => {
      const sanitized = sanitizeSlot(slot, index);
      return gameMode === "team" ? sanitized : { ...sanitized, teamPreference: null };
    });
  const requestedMapName = next.mapName?.trim();
  const mapName =
    requestedMapName === RANDOM_MAP_VALUE
      ? RANDOM_MAP_VALUE
      : requestedMapName && AVAILABLE_MAPS.some((map) => map === requestedMapName)
        ? requestedMapName
        : base.mapName;

  return {
    mapName,
    gameMode,
    teamCount: Math.max(2, Math.min(7, Number(next.teamCount ?? base.teamCount))),
    tickDelayMs: Math.max(50, Math.min(5000, Number(next.tickDelayMs ?? base.tickDelayMs))),
    maxTicks: Math.max(1, Math.min(5000, Number(next.maxTicks ?? base.maxTicks))),
    infiniteGold:
      typeof next.infiniteGold === "boolean" ? next.infiniteGold : base.infiniteGold,
    infiniteTroops:
      typeof next.infiniteTroops === "boolean"
        ? next.infiniteTroops
        : base.infiniteTroops,
    instantBuild:
      typeof next.instantBuild === "boolean" ? next.instantBuild : base.instantBuild,
    nativeBotCount: Math.max(
      0,
      Math.min(400, Number(next.nativeBotCount ?? base.nativeBotCount)),
    ),
    slots: slots.length > 0 ? slots : base.slots,
  };
}

export class ControlRoomSessionManager {
  private config: ControlRoomSessionConfig = defaultConfig();
  private runtime: ControlRoomSessionRuntime = defaultRuntime();
  private currentGame: Game | null = null;
  private currentMatchActive = false;
  private botClients: HeadlessBotClient[] = [];
  private readonly tickLogger = new JsonlTickLogger(LOG_FILE);
  private slotApiKeys = new Map<string, string>();

  private buildLiveMap(): ControlRoomLiveMap | null {
    if (!this.currentGame) {
      return null;
    }

    const sourceWidth = this.currentGame.width();
    const sourceHeight = this.currentGame.height();
    const width = Math.min(sourceWidth, LIVE_MAP_MAX_DIMENSION);
    const height = Math.min(sourceHeight, LIVE_MAP_MAX_DIMENSION);
    const stepX = sourceWidth / width;
    const stepY = sourceHeight / height;
    const tiles: ControlRoomLiveMap["tiles"] = [];
    for (let sampleY = 0; sampleY < height; sampleY += 1) {
      for (let sampleX = 0; sampleX < width; sampleX += 1) {
        const tileX = Math.min(
          sourceWidth - 1,
          Math.floor((sampleX + 0.5) * stepX),
        );
        const tileY = Math.min(
          sourceHeight - 1,
          Math.floor((sampleY + 0.5) * stepY),
        );
        const tile = tileY * sourceWidth + tileX;
        const isLand = this.currentGame!.isLand(tile);
        tiles.push({
          terrain: isLand ? "land" : "water",
          ownerId:
            isLand && this.currentGame!.hasOwner(tile)
              ? this.currentGame!.owner(tile).id()
              : null,
        });
      }
    }

    return {
      width,
      height,
      tiles,
      activePlayers: this.currentGame.players().map((player) => player.id()),
    };
  }

  private buildOperatorPanel(): ControlRoomOperatorPanel {
    return {
      available: false,
      slots: [],
      lastExecutionSummary: null,
    };
  }

  snapshot(): ControlRoomSessionSnapshot {
    return {
      config: this.config,
      runtime: this.runtime,
      liveMap: this.buildLiveMap(),
      operator: this.buildOperatorPanel(),
      capabilities: capabilities(),
      availableMaps: AVAILABLE_MAPS,
      mapOptions: MAP_OPTIONS,
    };
  }

  updateConfig(next: Partial<ControlRoomSessionConfig>): ControlRoomSessionSnapshot {
    this.config = sanitizeConfig({ ...this.config, ...next });
    return this.snapshot();
  }

  async stop(): Promise<ControlRoomSessionSnapshot> {
    for (const client of this.botClients) {
      await client.stop();
    }
    this.botClients = [];
    this.slotApiKeys.clear();
    this.currentGame = null;
    this.currentMatchActive = false;
    this.runtime = {
      ...this.runtime,
      status: "stopped",
      stoppedAt: new Date().toISOString(),
      lastSummary: "Session stopped.",
    };
    return this.snapshot();
  }

  async start(runtimeSecrets?: {
    slotSecrets?: Array<{ slotId?: string; apiKey?: string | null }>;
  }): Promise<ControlRoomSessionSnapshot> {
    try {
      if (runtimeSecrets?.slotSecrets) {
        this.slotApiKeys.clear();
        for (const slotSecret of runtimeSecrets.slotSecrets) {
          const slotId = slotSecret.slotId?.trim();
          const apiKey = slotSecret.apiKey?.trim();
          if (slotId && apiKey) {
            this.slotApiKeys.set(slotId, apiKey);
          }
        }
      }

      if (this.runtime.status === "running") {
        return this.snapshot();
      }

      if (this.runtime.status === "lobby" && this.runtime.activeMatchId) {
        await this.refreshLobbyCounts();
        const requiredPlayers = this.runtime.requiredPlayers ?? 0;
        const connectedPlayers = this.runtime.connectedPlayers ?? 0;
        if (connectedPlayers < requiredPlayers) {
          this.runtime = {
            ...this.runtime,
            lastSummary: `Lobby ready. ${connectedPlayers}/${requiredPlayers} players connected. Join the reserved human slot(s), then press start again.`,
          };
          return this.snapshot();
        }
        await this.launchPreparedLobby();
        return this.snapshot();
      }

      await fs.writeFile(LOG_FILE, "", "utf8");
      await fs.writeFile(DEBUG_LOG_FILE, "", "utf8");

      const enabledSlots = this.config.slots.filter((slot) => slot.enabled);
      const totalParticipants = enabledSlots.length + this.config.nativeBotCount;
      if (totalParticipants < 2) {
        throw new Error("At least two total participants are required.");
      }

      const botSlots = enabledSlots.filter((slot) => slot.slotKind === "bot");
      const resolvedMapName = resolveConfiguredMapName(this.config);
      const lobby = buildLobbyInfo(randomUUID().replace(/-/g, "").slice(0, 8));

      await createPrivateLobby(
        lobby,
        buildPrivateLobbyConfig({
          mapName: resolvedMapName,
          gameMode: this.config.gameMode,
          maxPlayers: enabledSlots.length,
          nativeBotCount: this.config.nativeBotCount,
          playerTeams: this.config.gameMode === "team" ? this.config.teamCount : undefined,
          infiniteGold: this.config.infiniteGold,
          infiniteTroops: this.config.infiniteTroops,
          instantBuild: this.config.instantBuild,
        }),
      );

      this.runtime = {
        ...defaultRuntime(),
        status: "lobby",
        activeMatchId: lobby.gameId,
        startedAt: new Date().toISOString(),
        tick: 0,
        surfaceUrl: lobby.surfaceUrl,
        joinUrl: lobby.joinUrl,
        requiredPlayers: enabledSlots.length,
        connectedPlayers: 0,
        lastSummary: `OpenFront lobby prepared on ${resolvedMapName}. Bots can join now. Launch the match when the lobby is ready.`,
      };

      this.botClients = [];
      for (const slot of botSlots) {
        const bot = this.createBot(slot);
        if (!bot) {
          continue;
        }
        const client = new HeadlessBotClient({
          bot,
          displayName: slot.label,
          lobby,
          tickLogger: this.tickLogger,
          debugLogPath: DEBUG_LOG_FILE,
          matchRef: {
            id: lobby.gameId,
            tick: 0,
            phase: "spawn",
            seed: null,
            maxTicks: this.config.maxTicks,
            mode: this.config.gameMode,
            mapName: resolvedMapName,
          },
          onSummary: (summary, tick) => {
            this.currentGame = (client as any).runner?.game ?? this.currentGame;
            this.runtime = {
              ...this.runtime,
              tick: tick ?? this.runtime.tick,
              lastSummary: summary,
            };
            this.currentMatchActive = this.runtime.status === "running";
          },
        });
        await client.connect();
        this.botClients.push(client);
      }

      await this.refreshLobbyCounts();

      return this.snapshot();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown start failure";
      for (const client of this.botClients) {
        await client.stop();
      }
      this.botClients = [];
      this.currentGame = null;
      this.currentMatchActive = false;
      this.runtime = {
        ...this.runtime,
        status: "error",
        stoppedAt: new Date().toISOString(),
        lastError: message,
        lastSummary: `Session start failed: ${message}`,
      };
      return this.snapshot();
    }
  }

  executeOperatorAction(_playerId: string, _actionId: string): ControlRoomSessionSnapshot {
    throw new Error(
      "Direct operator actions are disabled on the real OpenFront transport. Join via the OpenFront client instead.",
    );
  }

  private async refreshLobbyCounts(): Promise<void> {
    if (!this.runtime.activeMatchId) {
      return;
    }
    const lobby = buildLobbyInfo(this.runtime.activeMatchId);
    const state = await fetchLobbyState(lobby);
    this.runtime = {
      ...this.runtime,
      connectedPlayers: Array.isArray(state.clients) ? state.clients.length : 0,
    };
  }

  private async launchPreparedLobby(): Promise<void> {
    if (!this.runtime.activeMatchId) {
      throw new Error("No prepared OpenFront lobby to launch.");
    }

    const lobby = buildLobbyInfo(this.runtime.activeMatchId);
    await startPrivateLobby(lobby);
    await this.refreshLobbyCounts();
    this.runtime = {
      ...this.runtime,
      status: "running",
      lastSummary: "Real OpenFront match launched.",
    };
    this.currentMatchActive = true;
  }

  private createBot(slot: ControlRoomSlotConfig): OpenFrontBot | null {
    switch (slot.preset) {
      case "greedy_expand":
        return new GreedyExpandBot({
          id: `${slot.slotId}_greedy_expand`,
          displayName: slot.label,
        });
      case "aggressive_frontline":
        return new AggressiveFrontlineBot({
          id: `${slot.slotId}_aggressive_frontline`,
          displayName: slot.label,
        });
      case "economic_growth":
        return new EconomicGrowthBot({
          id: `${slot.slotId}_economic_growth`,
          displayName: slot.label,
        });
      case "naval_pressure":
        return new NavalPressureBot({
          id: `${slot.slotId}_naval_pressure`,
          displayName: slot.label,
        });
      case "local_llm": {
        const model = slot.model ?? process.env.OPENFRONT_BOTS_LOCAL_LLM_MODEL;
        if (!model) {
          throw new Error(`slot ${slot.label}: local_llm requires a model`);
        }
        return new LocalLlmBot({
          model,
          baseUrl: slot.baseUrl ?? process.env.OPENFRONT_BOTS_LOCAL_LLM_BASE_URL,
        });
      }
      case "remote_api": {
        const model = slot.model ?? process.env.OPENFRONT_BOTS_REMOTE_API_MODEL;
        const baseUrl = slot.baseUrl ?? process.env.OPENFRONT_BOTS_REMOTE_API_BASE_URL;
        const apiKey =
          this.slotApiKeys.get(slot.slotId) ??
          (slot.apiKeyEnv ? process.env[slot.apiKeyEnv] : undefined) ??
          process.env.OPENFRONT_BOTS_REMOTE_API_KEY;
        if (!model || !baseUrl || !apiKey) {
          throw new Error(
            `slot ${slot.label}: remote_api requires model, baseUrl and apiKey`,
          );
        }
        return new RemoteApiBot({
          model,
          baseUrl,
          apiKey,
          displayName: slot.label,
        });
      }
      case "human_operator":
        return null;
      default:
        return new GreedyExpandBot({
          id: `${slot.slotId}_fallback`,
          displayName: slot.label,
        });
    }
  }
}

export const controlRoomSessionManager = new ControlRoomSessionManager();
export { RANDOM_MAP_VALUE, TEAM_COLORS, mapThumbnailPath };
