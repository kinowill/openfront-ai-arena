import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionV1, ValidAction } from "../contracts/validActions";
import { chooseTopAction } from "./actionSelection";
import type {
  BotDecisionContext,
  BotIdentity,
  BotRuntimeDecision,
  OpenFrontBot,
} from "./types";

function strategicGoalFromAction(action: ValidAction): string {
  const taggedGoal = action.goalTags?.[0];
  if (taggedGoal) {
    return taggedGoal;
  }

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

export class GreedyExpandBot implements OpenFrontBot {
  readonly identity: BotIdentity;

  constructor(identity?: Partial<BotIdentity>) {
    this.identity = {
      id: identity?.id ?? "greedy-expand-bot",
      displayName: identity?.displayName ?? "GreedyExpandBot",
      backend: "rule_based",
      version: identity?.version ?? "1.0.0",
    };
  }

  decide(
    observation: BotObservationV1,
    _context?: BotDecisionContext,
  ): BotRuntimeDecision {
    const ranked = chooseTopAction(observation, {
      expand: 0.3,
      build_structure: 0.18,
      attack_land: 0.14,
      upgrade_structure: 0.1,
      assist_ally: 0.08,
      attack_naval: 0.06,
      wait: -0.1,
    });

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

    return {
      decision,
      selectedAction: ranked.action,
      fallbackUsed: ranked.action.type === "wait",
      diagnostics: ranked.reasons,
      confidence: ranked.score,
    };
  }
}
