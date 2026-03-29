import type { BotObservationV1 } from "../contracts/botObservation";
import type { BotDecisionV1 } from "../contracts/validActions";
import { chooseTopAction } from "./actionSelection";
import type {
  BotDecisionContext,
  BotIdentity,
  BotRuntimeDecision,
  OpenFrontBot,
} from "./types";

function buildStrategicGoal(observation: BotObservationV1): string {
  if (
    observation.threats.some((entry) => entry.type === "major_incoming_attack")
  ) {
    return "stabilize_border";
  }
  if (
    observation.opportunities.some(
      (entry) => entry.type === "build_port_for_offshore_access",
    )
  ) {
    return "prepare_naval_access";
  }
  if (
    observation.opportunities.some(
      (entry) => entry.type === "assist_ally_under_attack",
    )
  ) {
    return "support_ally_front";
  }
  if (
    observation.opportunities.some(
      (entry) => entry.type === "expand_into_terra_nullius",
    )
  ) {
    return "expand_safely";
  }
  if (
    observation.opportunities.some((entry) => entry.type === "attack_weak_neighbor")
  ) {
    return "pressure_weak_neighbor";
  }
  return "hold_and_scale";
}

function buildTacticalReason(
  observation: BotObservationV1,
  reasons: string[],
): string {
  if (
    observation.threats.some((entry) => entry.type === "major_incoming_attack")
  ) {
    return "Incoming pressure is high, so the bot prioritizes stabilization over greed.";
  }
  if (
    observation.opportunities.some(
      (entry) => entry.type === "build_port_for_offshore_access",
    )
  ) {
    return "A coastal opening exists and a port can unlock additional projection options.";
  }
  if (
    observation.opportunities.some(
      (entry) => entry.type === "expand_into_terra_nullius",
    )
  ) {
    return "Neutral expansion remains available and is the safest way to gain tempo.";
  }
  if (reasons.length > 0) {
    return `Selected from weighted valid actions: ${reasons.join(", ")}.`;
  }
  return "Selected the highest-ranked safe action from the current valid action set.";
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
      strategicGoal: buildStrategicGoal(observation),
      tacticalReason: buildTacticalReason(observation, ranked.reasons),
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
