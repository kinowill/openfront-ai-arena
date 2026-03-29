import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpawnExecution } from "../../../OpenFrontIO/src/core/execution/SpawnExecution";
import { DefaultConfig } from "../../../OpenFrontIO/src/core/configuration/DefaultConfig";
import { createGame } from "../../../OpenFrontIO/src/core/game/GameImpl";
import { genTerrainFromBin } from "../../../OpenFrontIO/src/core/game/TerrainMapLoader";
import { UserSettings } from "../../../OpenFrontIO/src/core/game/UserSettings";
import {
  Difficulty,
  GameMapSize,
  GameMapType,
  GameMode,
  GameType,
  PlayerInfo,
  PlayerType,
  type Game,
  type Player,
} from "../../../OpenFrontIO/src/core/game/Game";
import type { GameConfig, GameID } from "../../../OpenFrontIO/src/core/Schemas";
import { TestServerConfig } from "../../../OpenFrontIO/tests/util/TestServerConfig";
import { GreedyExpandBot } from "../bots/GreedyExpandBot";
import type { MatchRef } from "../contracts/shared";
import { OpenFrontBotLoop } from "../runtime/openfrontLoop";
import { JsonlTickLogger } from "../runtime/tickLogger";

export interface HarnessMatch {
  game: Game;
  botPlayer: Player;
  enemyPlayer: Player;
  matchRef: MatchRef;
}

export interface ConfiguredHarnessSlot {
  id: string;
  name: string;
  playerType: PlayerType;
}

export interface ConfiguredHarnessMatch {
  game: Game;
  playersById: Record<string, Player>;
  matchRef: MatchRef;
}

const HARNESS_GAME_ID: GameID = "openfront-arena-local-harness";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");
const OPENFRONT_ROOT = path.resolve(ROOT_DIR, "..", "OpenFrontIO");

class HarnessConfig extends DefaultConfig {
  disableNavMesh(): boolean {
    return true;
  }

  radiusPortSpawn(): number {
    return 1;
  }
}

async function setupHarnessGame(
  mapName: string,
  overrides: Partial<GameConfig> = {},
): Promise<Game> {
  const mapDir = path.join(
    OPENFRONT_ROOT,
    "tests",
    "testdata",
    "maps",
    mapName,
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(mapDir, "manifest.json"), "utf8"),
  ) as {
    map: { width: number; height: number; num_land_tiles: number };
    map4x: { width: number; height: number; num_land_tiles: number };
  };

  const mapBin = fs.readFileSync(path.join(mapDir, "map.bin"));
  const miniMapBin = fs.readFileSync(path.join(mapDir, "map4x.bin"));

  const gameMap = await genTerrainFromBin(manifest.map, mapBin);
  const miniGameMap = await genTerrainFromBin(manifest.map4x, miniMapBin);

  const gameConfig: GameConfig = {
    gameMap: GameMapType.Asia,
    gameMapSize: GameMapSize.Normal,
    gameMode: GameMode.FFA,
    gameType: GameType.Singleplayer,
    difficulty: Difficulty.Medium,
    nations: "default",
    donateGold: true,
    donateTroops: true,
    bots: 0,
    infiniteGold: true,
    infiniteTroops: true,
    instantBuild: true,
    randomSpawn: false,
    ...overrides,
  };

  const config = new HarnessConfig(
    new TestServerConfig(),
    gameConfig,
    new UserSettings(),
    false,
  );

  return createGame([], [], gameMap, miniGameMap, config);
}

function selectSpawnTiles(game: Game, count: number) {
  const landTiles: number[] = [];
  game.forEachTile((tile) => {
    if (game.isLand(tile)) {
      landTiles.push(tile);
    }
  });

  if (landTiles.length < count) {
    throw new Error(`Not enough land tiles to place ${count} players.`);
  }

  const chosen: number[] = [landTiles[0]];
  while (chosen.length < count) {
    let bestTile = landTiles[0];
    let bestScore = -1;
    for (const candidate of landTiles) {
      if (chosen.includes(candidate)) {
        continue;
      }
      const minDistance = Math.min(
        ...chosen.map((selected) => game.manhattanDist(candidate, selected)),
      );
      if (minDistance > bestScore) {
        bestScore = minDistance;
        bestTile = candidate;
      }
    }
    chosen.push(bestTile);
  }
  return chosen;
}

export async function createConfiguredHarnessMatch(options: {
  mapName?: string;
  gameMode?: "ffa" | "team";
  overrides?: Partial<GameConfig>;
  slots: ConfiguredHarnessSlot[];
}): Promise<ConfiguredHarnessMatch> {
  const mapName = options.mapName ?? "ocean_and_land";
  const game = await setupHarnessGame(mapName, options.overrides);
  const spawnTiles = selectSpawnTiles(game, options.slots.length);
  const playersById: Record<string, Player> = {};

  options.slots.forEach((slot, index) => {
    const info = new PlayerInfo(slot.name, slot.playerType, null, slot.id);
    const team =
      options.gameMode === "team"
        ? index % 2 === 0
          ? "Red"
          : "Blue"
        : null;
    if (team === null) {
      game.addPlayer(info);
    } else {
      (game as Game & {
        addPlayer(playerInfo: PlayerInfo, team: string | null): Player;
      }).addPlayer(info, team);
    }
    game.addExecution(
      new SpawnExecution(HARNESS_GAME_ID, info, spawnTiles[index]),
    );
    playersById[slot.id] = game.player(info.id);
  });

  while (game.inSpawnPhase()) {
    game.executeNextTick();
  }

  return {
    game,
    playersById,
    matchRef: {
      id: HARNESS_GAME_ID,
      tick: game.ticks(),
      phase: "early",
      seed: null,
      maxTicks: null,
      mode: options.gameMode ?? "ffa",
      mapName,
    },
  };
}

export async function createLocalHarnessMatch(): Promise<HarnessMatch> {
  const game = await setupHarnessGame("ocean_and_land");

  const botInfo = new PlayerInfo("baseline_bot", PlayerType.Human, null, "bot_id");
  const enemyInfo = new PlayerInfo("enemy_bot", PlayerType.Human, null, "enemy_id");

  game.addPlayer(botInfo);
  game.addPlayer(enemyInfo);

  game.addExecution(
    new SpawnExecution(HARNESS_GAME_ID, botInfo, game.ref(0, 10)),
    new SpawnExecution(HARNESS_GAME_ID, enemyInfo, game.ref(0, 15)),
  );

  while (game.inSpawnPhase()) {
    game.executeNextTick();
  }

  return {
    game,
    botPlayer: game.player(botInfo.id),
    enemyPlayer: game.player(enemyInfo.id),
    matchRef: {
      id: HARNESS_GAME_ID,
      tick: game.ticks(),
      phase: "early",
      seed: null,
      maxTicks: null,
      mode: "ffa",
      mapName: "ocean_and_land",
    },
  };
}

export async function runLocalHarnessTick() {
  const { game, botPlayer, matchRef } = await createLocalHarnessMatch();
  const bot = new GreedyExpandBot();
  const loop = new OpenFrontBotLoop(game, matchRef, {
    mapVersion: "ocean_and_land@test",
    tickLogger: new JsonlTickLogger(
      path.join(ROOT_DIR, "logs", "local-harness.jsonl"),
    ),
  });

  return await loop.tick(bot, botPlayer);
}
