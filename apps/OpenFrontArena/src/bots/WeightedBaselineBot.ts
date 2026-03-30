import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionV1, ValidActionType, ValidAction } from "../contracts/validActions";
import { chooseTopAction } from "./actionSelection";
import type {
  BotDecisionContext,
  BotIdentity,
  BotRuntimeDecision,
  OpenFrontBot,
} from "./types";

type ActionTypeWeights = Partial<Record<ValidActionType, number>>;

function strategicGoalFromAction(action: ValidAction): string {
  switch (action.type) {
    case "expand":
      return "expand";
    case "attack_land":
      return "pressure_enemy";
    case "attack_naval":
      return "naval_projection";
    case "build_structure":
      return "improve_position";
    case "assist_ally":
      return "support_ally";
    case "set_target":
      return "focus_enemy";
    case "accept_alliance":
    case "reject_alliance":
    case "break_alliance":
      return "manage_diplomacy";
    case "donate_gold":
    case "donate_troops":
      return "resource_support";
    case "upgrade_structure":
      return "scale_position";
    case "wait":
    default:
      return "observe_and_hold";
  }
}

function buildTacticalReason(
  action: ValidAction,
  reasons: string[],
  observation: BotObservationV1,
): string {
  const primaryNote = action.notes?.[0];
  if (primaryNote) {
    return primaryNote;
  }

  if (reasons.length > 0) {
    return `Heuristic baseline selected '${action.label}' from the current action set: ${reasons.join(", ")}.`;
  }

  if (observation.threats.length > 0) {
    return `Heuristic baseline selected '${action.label}' while threats are present in the current snapshot.`;
  }

  return `Heuristic baseline selected '${action.label}' from the current valid actions.`;
}

export class WeightedBaselineBot implements OpenFrontBot {
  readonly identity: BotIdentity;
  private lastActionType: ValidActionType | null = null;
  private lastTick: number | null = null;

  constructor(
    identity: BotIdentity,
    private readonly weights: ActionTypeWeights,
  ) {
    this.identity = identity;
  }

  decide(
    observation: BotObservationV1,
    context?: BotDecisionContext,
  ): BotRuntimeDecision {
    const continuityWeights: ActionTypeWeights = { ...this.weights };
    const severePressure = observation.military.incomingAttackPressure > 0.45;
    const recentSetback = (context?.recentEvents ?? []).some(
      (event) =>
        event.type === "territory_lost" ||
        event.type === "under_attack" ||
        event.type === "structure_destroyed",
    );

    if (
      this.lastActionType &&
      this.lastTick !== null &&
      observation.match.tick - this.lastTick <= 6 &&
      !severePressure &&
      !recentSetback
    ) {
      continuityWeights[this.lastActionType] =
        (continuityWeights[this.lastActionType] ?? 0) + 0.06;
    }

    const ranked = chooseTopAction(observation, continuityWeights);

    const decision: BotDecisionV1 = {
      strategicGoal: strategicGoalFromAction(ranked.action),
      tacticalReason: buildTacticalReason(
        ranked.action,
        ranked.reasons,
        observation,
      ),
      selectedActionId: ranked.action.id,
      confidence: ranked.score,
    };

    this.lastActionType = ranked.action.type;
    this.lastTick = observation.match.tick;

    return {
      decision,
      selectedAction: ranked.action,
      fallbackUsed: ranked.action.type === "wait",
      diagnostics: ranked.reasons,
      confidence: ranked.score,
    };
  }
}
