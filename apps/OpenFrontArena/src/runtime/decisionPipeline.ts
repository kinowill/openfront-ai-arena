import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionRecord } from "../contracts/controlRoomState";
import type { BotDecisionV1 } from "../contracts/validActions";
import { arbitrateDecision, buildDecisionRecord } from "./arbiter";
import type { BotDecisionContext, OpenFrontBot } from "../bots/types";

export interface DecisionTickResult {
  rawDecision: BotDecisionV1;
  record: BotDecisionRecord;
  fallbackUsed: boolean;
}

export async function runDecisionTick(params: {
  bot: OpenFrontBot;
  observation: BotObservationV1;
  context?: BotDecisionContext;
}): Promise<DecisionTickResult> {
  const runtimeDecision = await params.bot.decide(
    params.observation,
    params.context,
  );
  const arbitration = arbitrateDecision(
    params.observation,
    runtimeDecision.decision,
  );

  return {
    rawDecision: runtimeDecision.decision,
    record: buildDecisionRecord({
      playerId: params.observation.player.id,
      tick: params.observation.match.tick,
      observation: params.observation,
      decision: runtimeDecision.decision,
      executedActionId: arbitration.executedAction.id,
      validationErrors: arbitration.validationErrors,
    }),
    fallbackUsed: arbitration.fallbackUsed,
  };
}
