import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionRecord } from "../contracts/controlRoomState";
import type { TimestampISO } from "../contracts/shared";
import type { BotDecisionV1, ValidAction } from "../contracts/validActions";

export interface ArbitrationResult {
  requestedActionId: string;
  executedAction: ValidAction;
  validationErrors: string[];
  fallbackUsed: boolean;
}

function nowIso(): TimestampISO {
  return new Date().toISOString();
}

function syntheticWaitAction(): ValidAction {
  return {
    id: "wait_fallback",
    type: "wait",
    label: "Wait",
    notes: ["Synthetic fallback because validActions was empty."],
  };
}

function waitFallback(observation: BotObservationV1): ValidAction {
  return (
    observation.validActions.find((action) => action.type === "wait") ??
    observation.validActions[0] ??
    syntheticWaitAction()
  );
}

export function arbitrateDecision(
  observation: BotObservationV1,
  decision: BotDecisionV1,
): ArbitrationResult {
  const selected = observation.validActions.find(
    (action) => action.id === decision.selectedActionId,
  );

  if (selected) {
    return {
      requestedActionId: decision.selectedActionId,
      executedAction: selected,
      validationErrors: [],
      fallbackUsed: false,
    };
  }

  const fallback = waitFallback(observation);
  return {
    requestedActionId: decision.selectedActionId,
    executedAction: fallback,
    validationErrors: [
      `selected_action_id '${decision.selectedActionId}' not found in validActions`,
    ],
    fallbackUsed: true,
  };
}

export function buildDecisionRecord(params: {
  playerId: string;
  tick: number;
  observation: BotObservationV1;
  decision: BotDecisionV1 | null;
  executedActionId: string | null;
  validationErrors?: string[];
  createdAt?: TimestampISO;
}): BotDecisionRecord {
  return {
    playerId: params.playerId,
    tick: params.tick,
    decision: params.decision,
    executedActionId: params.executedActionId,
    validationErrors: params.validationErrors ?? [],
    observationSummary: params.observation.strategicSummary,
    createdAt: params.createdAt ?? nowIso(),
  };
}
