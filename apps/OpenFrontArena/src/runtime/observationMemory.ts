import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionRecord } from "../contracts/controlRoomState";
import type { TimedEvent } from "../contracts/shared";
import type { OpenFrontExecutionResult } from "./openfrontExecutor";
import type { TickLogEntry } from "./tickLogger";

function territoryDelta(
  current: BotObservationV1,
  previous: BotObservationV1,
): TimedEvent | null {
  const delta = current.player.tilesOwned - previous.player.tilesOwned;
  if (delta === 0) {
    return null;
  }

  return {
    tick: current.match.tick,
    type: delta > 0 ? "territory_gained" : "territory_lost",
    playerId: current.player.id,
    summary:
      delta > 0
        ? `Territory increased by ${delta} tile(s) since the previous observed tick.`
        : `Territory decreased by ${Math.abs(delta)} tile(s) since the previous observed tick.`,
  };
}

function attackPressureDelta(
  current: BotObservationV1,
  previous: BotObservationV1,
): TimedEvent | null {
  const delta =
    current.military.incomingAttackPressure -
    previous.military.incomingAttackPressure;

  if (Math.abs(delta) < 0.15) {
    return null;
  }

  return {
    tick: current.match.tick,
    type: delta > 0 ? "under_attack" : "front_changed",
    playerId: current.player.id,
    summary:
      delta > 0
        ? "Incoming attack pressure increased sharply since the previous tick."
        : "Incoming attack pressure relaxed compared with the previous tick.",
  };
}

function structureDelta(
  current: BotObservationV1,
  previous: BotObservationV1,
): TimedEvent[] {
  const fields: Array<
    [keyof Pick<BotObservationV1["structures"], "cities" | "factories" | "ports" | "defensePosts" | "sams" | "silos">, string]
  > = [
    ["cities", "City"],
    ["factories", "Factory"],
    ["ports", "Port"],
    ["defensePosts", "Defense Post"],
    ["sams", "SAM Launcher"],
    ["silos", "Missile Silo"],
  ];

  const events: TimedEvent[] = [];
  for (const [field, label] of fields) {
    const delta = current.structures[field] - previous.structures[field];
    if (delta > 0) {
      events.push({
        tick: current.match.tick,
        type: "structure_built",
        playerId: current.player.id,
        summary: `${delta} ${label}(s) added since the previous observed tick.`,
      });
    }
    if (delta < 0) {
      events.push({
        tick: current.match.tick,
        type: "structure_destroyed",
        playerId: current.player.id,
        summary: `${Math.abs(delta)} ${label}(s) lost since the previous observed tick.`,
      });
    }
  }
  return events;
}

function executionEvent(
  tick: number,
  playerId: string,
  decisionRecord: BotDecisionRecord,
  execution: OpenFrontExecutionResult,
): TimedEvent {
  return {
    tick,
    type: execution.accepted ? "attack_started" : "unknown",
    playerId,
    summary: execution.accepted
      ? `Executed action ${decisionRecord.executedActionId ?? "unknown"}: ${execution.summary}`
      : `Execution rejected for action ${decisionRecord.executedActionId ?? "unknown"}: ${execution.summary}`,
  };
}

function validationEvents(record: BotDecisionRecord): TimedEvent[] {
  return record.validationErrors.map((error) => ({
    tick: record.tick,
    type: "unknown",
    playerId: record.playerId,
    summary: error,
  }));
}

export function buildRecentEvents(params: {
  currentObservation: BotObservationV1;
  previousObservation?: BotObservationV1 | null;
  history: TickLogEntry[];
  maxEvents?: number;
}): TimedEvent[] {
  const { currentObservation, previousObservation, history } = params;
  const maxEvents = params.maxEvents ?? 10;
  const events: TimedEvent[] = [];

  if (previousObservation) {
    const territory = territoryDelta(currentObservation, previousObservation);
    if (territory) {
      events.push(territory);
    }

    const pressure = attackPressureDelta(currentObservation, previousObservation);
    if (pressure) {
      events.push(pressure);
    }

    events.push(...structureDelta(currentObservation, previousObservation));
  }

  const recentHistory = history.slice(-4).reverse();
  for (const entry of recentHistory) {
    events.push(
      executionEvent(
        entry.decisionRecord.tick,
        entry.decisionRecord.playerId,
        entry.decisionRecord,
        entry.execution,
      ),
      ...validationEvents(entry.decisionRecord),
    );
  }

  return events
    .sort((a, b) => b.tick - a.tick)
    .slice(0, maxEvents);
}
