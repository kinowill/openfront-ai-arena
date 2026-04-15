import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type GameMapType,
  GameMode,
  GameType,
  type PlayerType,
  UnitType,
} from "../../../../OpenFrontIO/src/core/game/Game";
import {
  type GameMapLoader,
  type MapData,
} from "../../../../OpenFrontIO/src/core/game/GameMapLoader";
import type { MapManifest } from "../../../../OpenFrontIO/src/core/game/TerrainMapLoader";
import {
  GameMapSize,
  Difficulty,
} from "../../../../OpenFrontIO/src/core/game/Game";
import type { GameConfig, GameID, Intent } from "../../../../OpenFrontIO/src/core/Schemas";
import { GameMapType as OpenFrontGameMapType } from "../../../../OpenFrontIO/src/core/game/Game";
import type { MatchMode } from "../../contracts/shared";
import type { ValidAction } from "../../contracts/validActions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");
const OPENFRONT_ROOT = path.resolve(ROOT_DIR, "..", "OpenFrontIO");

const OPENFRONT_DEV_HOST = "localhost";
const OPENFRONT_CLIENT_PORT = 9000;
const OPENFRONT_WORKER_BASE_PORT = 3001;
const OPENFRONT_DEV_ADMIN_KEY = "WARNING_DEV_ADMIN_KEY_DO_NOT_USE_IN_PRODUCTION";
const OPENFRONT_MAPS_ROOT = path.join(OPENFRONT_ROOT, "resources", "maps");

export interface OpenFrontBridgeLobbyInfo {
  gameId: GameID;
  workerIndex: number;
  workerPort: number;
  workerPath: string;
  httpBaseUrl: string;
  wsUrl: string;
  surfaceUrl: string;
  joinUrl: string;
}

function simpleHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function workerIndexForGame(gameId: GameID): number {
  return simpleHash(gameId) % 2;
}

export function buildLobbyInfo(gameId: GameID): OpenFrontBridgeLobbyInfo {
  const workerIndex = workerIndexForGame(gameId);
  const workerPort = OPENFRONT_WORKER_BASE_PORT + workerIndex;
  const workerPath = `w${workerIndex}`;
  const httpBaseUrl = `http://${OPENFRONT_DEV_HOST}:${workerPort}`;

  return {
    gameId,
    workerIndex,
    workerPort,
    workerPath,
    httpBaseUrl,
    wsUrl: `ws://${OPENFRONT_DEV_HOST}:${workerPort}/${workerPath}`,
    surfaceUrl: `http://${OPENFRONT_DEV_HOST}:${OPENFRONT_CLIENT_PORT}/${workerPath}/game/${gameId}?lobby`,
    joinUrl: `http://${OPENFRONT_DEV_HOST}:${OPENFRONT_CLIENT_PORT}/${workerPath}/game/${gameId}?lobby`,
  };
}

export function resolveOpenFrontMapType(mapName: string): GameMapType {
  const normalized = mapName.trim().toLowerCase();
  const aliases = new Map<string, GameMapType>([
    ["world", OpenFrontGameMapType.World],
    ["asia", OpenFrontGameMapType.Asia],
    ["africa", OpenFrontGameMapType.Africa],
    ["oceania", OpenFrontGameMapType.Oceania],
    ["ocean_and_land", OpenFrontGameMapType.World],
  ]);

  const alias = aliases.get(normalized);
  if (alias) {
    return alias;
  }

  const direct = Object.values(OpenFrontGameMapType).find(
    (value) => value.toLowerCase() === normalized,
  );
  if (!direct) {
    throw new Error(
      `Unsupported OpenFront map '${mapName}'. Use a real OpenFront map name such as World or Asia.`,
    );
  }
  return direct;
}

export function mapSlugForName(mapName: string): string {
  return resolveOpenFrontMapType(mapName).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function mapThumbnailPath(mapName: string): string {
  return path.join(OPENFRONT_MAPS_ROOT, mapSlugForName(mapName), "thumbnail.webp");
}

function openFrontMode(mode: MatchMode): GameMode {
  return mode === "team" ? GameMode.Team : GameMode.FFA;
}

export function buildPrivateLobbyConfig(params: {
  mapName: string;
  gameMode: MatchMode;
  maxPlayers: number;
  nativeBotCount: number;
  playerTeams?: number;
  infiniteGold: boolean;
  infiniteTroops: boolean;
  instantBuild: boolean;
}): GameConfig {
  return {
    gameMap: resolveOpenFrontMapType(params.mapName),
    gameMapSize: GameMapSize.Normal,
    difficulty: Difficulty.Easy,
    donateGold: true,
    donateTroops: true,
    gameType: GameType.Private,
    gameMode: openFrontMode(params.gameMode),
    playerTeams: params.gameMode === "team" ? params.playerTeams ?? 2 : undefined,
    nations: "default",
    bots: params.nativeBotCount,
    infiniteGold: params.infiniteGold,
    infiniteTroops: params.infiniteTroops,
    instantBuild: params.instantBuild,
    randomSpawn: true,
    maxPlayers: params.maxPlayers,
    disabledUnits: [],
  };
}

export async function createPrivateLobby(
  lobby: OpenFrontBridgeLobbyInfo,
  config: GameConfig,
): Promise<void> {
  const response = await fetch(
    `${lobby.httpBaseUrl}/api/create_game/${lobby.gameId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": OPENFRONT_DEV_ADMIN_KEY,
      },
      body: JSON.stringify(config),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create OpenFront lobby: HTTP ${response.status}`);
  }
}

export async function fetchLobbyState(
  lobby: OpenFrontBridgeLobbyInfo,
): Promise<any> {
  const response = await fetch(`${lobby.httpBaseUrl}/api/game/${lobby.gameId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenFront lobby: HTTP ${response.status}`);
  }
  return await response.json();
}

export async function startPrivateLobby(
  lobby: OpenFrontBridgeLobbyInfo,
): Promise<void> {
  const response = await fetch(
    `${lobby.httpBaseUrl}/api/start_game/${lobby.gameId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to start OpenFront lobby: HTTP ${response.status}`);
  }
}

export class LocalOpenFrontMapLoader implements GameMapLoader {
  getMapData(map: GameMapType): MapData {
    const slug = map.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const mapDir = path.join(OPENFRONT_ROOT, "resources", "maps", slug);

    const read = async (fileName: string): Promise<Uint8Array> =>
      new Uint8Array(await fs.readFile(path.join(mapDir, fileName)));

    return {
      mapBin: () => read("map.bin"),
      map4xBin: () => read("map4x.bin"),
      map16xBin: () => read("map16x.bin"),
      manifest: async () =>
        JSON.parse(
          await fs.readFile(path.join(mapDir, "manifest.json"), "utf8"),
        ) as MapManifest,
      webpPath: path.join(mapDir, "thumbnail.webp"),
    };
  }
}

export interface BridgePlayerSlot {
  slotId: string;
  label: string;
  playerType: PlayerType;
}

function structureToUnit(structureType: string): UnitType {
  switch (structureType) {
    case "City":
      return UnitType.City;
    case "Factory":
      return UnitType.Factory;
    case "Port":
      return UnitType.Port;
    case "DefensePost":
      return UnitType.DefensePost;
    case "SAMLauncher":
      return UnitType.SAMLauncher;
    case "MissileSilo":
      return UnitType.MissileSilo;
    default:
      throw new Error(`Unsupported structure type '${structureType}'.`);
  }
}

export function buildIntentFromValidAction(
  action: ValidAction,
  player: {
    troops(): number;
    gold(): bigint;
    canDonateTroops(recipient: { id(): string }): boolean;
    canDonateGold(recipient: { id(): string }): boolean;
  },
  game: {
    player(id: string): { id(): string };
    hasPlayer(id: string): boolean;
  },
): Intent | null {
  switch (action.type) {
    case "spawn":
      return {
        type: "spawn",
        tile: action.targetTile,
      };
    case "wait":
      return null;
    case "expand":
      return {
        type: "attack",
        targetID: null,
        troops: Math.max(1, Math.floor(player.troops() * 0.18)),
      };
    case "attack_land":
      return {
        type: "attack",
        targetID: action.targetPlayerId,
        troops: Math.max(
          1,
          Math.floor(player.troops() * (action.estimatedCommitRatio ?? 0.28)),
        ),
      };
    case "attack_naval":
      return {
        type: "boat",
        dst: action.landingTile ?? action.launchTile,
        troops: Math.max(
          1,
          Math.floor(player.troops() * (action.estimatedCommitRatio ?? 0.2)),
        ),
      };
    case "build_structure":
      return {
        type: "build_unit",
        unit: structureToUnit(action.structureType),
        tile: action.tile,
      };
    case "upgrade_structure":
      return {
        type: "upgrade_structure",
        unit: structureToUnit(action.structureType),
        unitId: action.unitId,
      };
    case "assist_ally": {
      if (!game.hasPlayer(action.allyPlayerId)) {
        return null;
      }
      const ally = game.player(action.allyPlayerId);
      if (player.canDonateTroops(ally)) {
        return {
          type: "donate_troops",
          recipient: ally.id(),
          troops: Math.max(100, Math.floor(player.troops() * 0.12)),
        };
      }
      if (player.canDonateGold(ally)) {
        return {
          type: "donate_gold",
          recipient: ally.id(),
          gold: Math.max(100, Math.floor(Number(player.gold()) * 0.15)),
        };
      }
      return null;
    }
    case "set_target":
      return {
        type: "targetPlayer",
        target: action.targetPlayerId,
      };
    case "accept_alliance":
      return {
        type: "allianceRequest",
        recipient: action.requestingPlayerId,
      };
    case "reject_alliance":
      return {
        type: "allianceReject",
        requestor: action.requestingPlayerId,
      };
    case "break_alliance":
      return {
        type: "breakAlliance",
        recipient: action.alliedPlayerId,
      };
    case "donate_gold":
      return {
        type: "donate_gold",
        recipient: action.allyPlayerId,
        gold: action.amount,
      };
    case "donate_troops":
      return {
        type: "donate_troops",
        recipient: action.allyPlayerId,
        troops: action.amount,
      };
  }
}
