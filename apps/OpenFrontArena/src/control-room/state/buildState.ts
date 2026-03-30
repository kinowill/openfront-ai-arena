import fs from "node:fs/promises";
import type { BotObservationV1 } from "../../contracts/botObservation";
import {
  CONTROL_ROOM_STATE_VERSION,
  type BotDecisionRecord,
  type CommentatorSummary,
  type ControlRoomPlayerStats,
  type ControlRoomStateV1,
} from "../../contracts/controlRoomState";
import type { MatchRef, StructureType } from "../../contracts/shared";
import type { TickLogEntry } from "../../runtime/tickLogger";

export interface ControlRoomIntegrationStatus {
  localLlm: {
    configured: boolean;
    baseUrl: string | null;
    model: string | null;
  };
  remoteApi: {
    configured: boolean;
    baseUrl: string | null;
    model: string | null;
  };
}

export interface ControlRoomSnapshot {
  state: ControlRoomStateV1;
  integrations: ControlRoomIntegrationStatus;
  latestTick: number | null;
  entries: number;
}

function parseJsonLine(line: string): TickLogEntry | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as TickLogEntry;
  } catch {
    return null;
  }
}

async function readEntries(logFilePath: string): Promise<TickLogEntry[]> {
  try {
    const raw = await fs.readFile(logFilePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map(parseJsonLine)
      .filter((entry): entry is TickLogEntry => entry !== null);
  } catch {
    return [];
  }
}

function defaultMatch(): MatchRef {
  return {
    id: "no-match",
    tick: 0,
    phase: "early",
    seed: null,
    maxTicks: null,
    mode: "unknown",
    mapName: "unknown",
  };
}

function structuresFromObservation(
  observation: BotObservationV1,
): Partial<Record<StructureType, number>> {
  return {
    City: observation.structures.cities,
    Factory: observation.structures.factories,
    Port: observation.structures.ports,
    DefensePost: observation.structures.defensePosts,
    SAMLauncher: observation.structures.sams,
    MissileSilo: observation.structures.silos,
  };
}

function playerStatsFromLatest(
  entries: TickLogEntry[],
): ControlRoomPlayerStats[] {
  const latestByPlayer = new Map<string, TickLogEntry>();

  for (const entry of entries) {
    latestByPlayer.set(entry.observation.player.id, entry);
  }

  const observedPlayers = Array.from(latestByPlayer.values()).map((entry) => {
    const observation = entry.observation;
    const invalidActionRate =
      entry.decisionRecord.validationErrors.length > 0 ? 1 : 0;

    return {
      playerId: observation.player.id,
      displayName: observation.player.id,
      alive: observation.player.alive,
      tilesOwned: observation.player.tilesOwned,
      troops: observation.player.troops,
      gold: observation.player.gold,
      structures: structuresFromObservation(observation),
      incomingAttackPressure: observation.military.incomingAttackPressure,
      outgoingAttackPressure: observation.military.outgoingAttackPressure,
      reserveRatio: observation.player.reserveRatio,
      invalidActionRate,
      decisionLatencyMsAvg: null,
      inferredStyle: observation.inferredStyle ?? "unknown",
    };
  });

  const visibleNeighbors = new Map<string, ControlRoomPlayerStats>();
  for (const entry of latestByPlayer.values()) {
    for (const neighbor of entry.observation.neighbors) {
      if (latestByPlayer.has(neighbor.playerId)) {
        continue;
      }

      visibleNeighbors.set(neighbor.playerId, {
        playerId: neighbor.playerId,
        displayName: `${neighbor.playerId} (intel)`,
        alive: !neighbor.isDisconnected,
        tilesOwned: neighbor.tilesOwned ?? 0,
        troops: neighbor.troops ?? 0,
        gold: 0,
        structures: {
          Port: neighbor.hasPorts ? 1 : 0,
          SAMLauncher: neighbor.hasSams ? 1 : 0,
          MissileSilo: neighbor.hasSilos ? 1 : 0,
        },
        incomingAttackPressure: neighbor.pressureFromOthers,
        outgoingAttackPressure: neighbor.vulnerability,
        reserveRatio: 0,
        invalidActionRate: 0,
        decisionLatencyMsAvg: null,
        inferredStyle: "unknown",
      });
    }
  }

  return [...observedPlayers, ...visibleNeighbors.values()].sort(
    (a, b) => b.tilesOwned - a.tilesOwned,
  );
}

function buildCommentatorSummary(entries: TickLogEntry[]): CommentatorSummary[] {
  const latest = entries[entries.length - 1];
  if (!latest) {
    return [];
  }

  return [
    {
      id: `commentary_${latest.decisionRecord.tick}`,
      tick: latest.decisionRecord.tick,
      createdAt: latest.createdAt,
      trigger: "interval",
      lines: [
        ...latest.observation.strategicSummary,
        `Derniere action executee: ${latest.execution.executedActionId}.`,
      ],
    },
  ];
}

function buildState(entries: TickLogEntry[]): ControlRoomStateV1 {
  const latest = entries[entries.length - 1];
  const observation = latest?.observation;
  const match = observation?.match ?? defaultMatch();
  const recentDecisions: BotDecisionRecord[] = entries
    .slice(-12)
    .map((entry) => entry.decisionRecord)
    .reverse();

  return {
    controlRoomStateVersion: CONTROL_ROOM_STATE_VERSION,
    mode: "debug_mode",
    match,
    players: playerStatsFromLatest(entries),
    mapState: {
      highlightedFronts:
        observation?.fronts.map((front) => ({
          frontId: front.frontId,
          label:
            front.enemyPlayerId === null
              ? "Neutral Front"
              : `Front vs ${front.enemyPlayerId}`,
          status: front.status,
          leadPlayerId:
            front.myPressure >= front.enemyPressure
              ? observation.player.id
              : front.enemyPlayerId,
          intensity: Math.max(front.myPressure, front.enemyPressure),
        })) ?? [],
      liveTerritorySummary: observation
        ? [
            `${observation.player.id}: ${observation.player.tilesOwned} tiles`,
            `${observation.neighbors.length} voisins visibles`,
          ]
        : [],
      liveEvents: latest
        ? [
            latest.execution.summary,
            ...latest.decisionRecord.validationErrors,
          ].filter(Boolean)
        : [],
      focusPlayerId: observation?.player.id ?? null,
      focusTile: null,
    },
    botDecisions: recentDecisions,
    operatorQuestions: [],
    operatorAnswers: [],
    commentatorSummaries: buildCommentatorSummary(entries),
  };
}

function integrationStatus(): ControlRoomIntegrationStatus {
  const localBaseUrl = process.env.OPENFRONT_BOTS_LOCAL_LLM_BASE_URL ?? null;
  const localModel = process.env.OPENFRONT_BOTS_LOCAL_LLM_MODEL ?? null;
  const remoteBaseUrl = process.env.OPENFRONT_BOTS_REMOTE_API_BASE_URL ?? null;
  const remoteModel = process.env.OPENFRONT_BOTS_REMOTE_API_MODEL ?? null;

  return {
    localLlm: {
      configured: Boolean(localBaseUrl && localModel),
      baseUrl: localBaseUrl,
      model: localModel,
    },
    remoteApi: {
      configured: Boolean(
        remoteBaseUrl &&
          remoteModel &&
          process.env.OPENFRONT_BOTS_REMOTE_API_KEY,
      ),
      baseUrl: remoteBaseUrl,
      model: remoteModel,
    },
  };
}

export async function buildControlRoomSnapshot(
  logFilePath: string,
): Promise<ControlRoomSnapshot> {
  const entries = await readEntries(logFilePath);
  const state = buildState(entries);

  return {
    state,
    integrations: integrationStatus(),
    latestTick: entries.at(-1)?.decisionRecord.tick ?? null,
    entries: entries.length,
  };
}
