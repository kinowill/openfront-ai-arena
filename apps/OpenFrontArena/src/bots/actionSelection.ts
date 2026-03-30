import type { BotObservationV1 } from "../contracts/botObservation";
import type { ValidAction, ValidActionType } from "../contracts/validActions";

type ActionTypeWeights = Partial<Record<ValidActionType, number>>;

export interface RankedAction {
  action: ValidAction;
  score: number;
  reasons: string[];
}

function syntheticWaitAction(): ValidAction {
  return {
    id: "wait_fallback",
    type: "wait",
    label: "Wait",
    notes: ["Synthetic fallback because validActions was empty."],
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function scoreActionAgainstProfile(
  observation: BotObservationV1,
  action: ValidAction,
  weights: ActionTypeWeights,
): RankedAction {
  const reasons: string[] = [];
  let score = 0.5;

  const weighted = weights[action.type];
  if (weighted !== undefined) {
    score += weighted;
    reasons.push(`profile_weight:${action.type}=${weighted.toFixed(2)}`);
  }

  if (!observation.player.spawned && action.type === "spawn") {
    score += 0.4;
    reasons.push("must_spawn_to_enter_match");
  }

  if (observation.threats.length > 0) {
    const majorThreat = observation.threats[0];
    if (
      majorThreat.type === "major_incoming_attack" &&
      (action.type === "build_structure" ||
        action.type === "assist_ally" ||
        action.type === "wait")
    ) {
      score += 0.2;
      reasons.push("response_to_major_incoming_attack");
    }
    if (
      majorThreat.type === "nuclear_threat" &&
      action.type === "build_structure"
    ) {
      score += 0.16;
      reasons.push("response_to_nuclear_threat");
    }
  }

  if (
    observation.opportunities.some(
      (entry) => entry.type === "expand_into_terra_nullius",
    ) &&
    action.type === "expand"
  ) {
    score += 0.22;
    reasons.push("matches_expand_opportunity");
  }

  if (
    observation.opportunities.some(
      (entry) => entry.type === "build_port_for_offshore_access",
    ) &&
    action.type === "build_structure" &&
    action.structureType === "Port"
  ) {
    score += 0.24;
    reasons.push("matches_port_opportunity");
  }

  if (
    observation.player.reserveRatio < 0.25 &&
    (action.type === "attack_land" || action.type === "attack_naval")
  ) {
    score -= 0.25;
    reasons.push("reserve_too_low_for_attack");
  }

  if (
    observation.military.incomingAttackPressure > 0.5 &&
    (action.type === "attack_land" || action.type === "attack_naval")
  ) {
    score -= 0.18;
    reasons.push("under_pressure_penalty");
  }

  if (
    observation.military.canProjectNaval &&
    action.type === "attack_naval" &&
    observation.mapProfile.navalRelevance > 0.45
  ) {
    score += 0.12;
    reasons.push("naval_projection_available");
  }

  if (action.notes?.length) {
    score += Math.min(0.08, action.notes.length * 0.02);
    reasons.push("action_has_contextual_notes");
  }

  return {
    action,
    score: clamp01(score),
    reasons,
  };
}

export function rankActions(
  observation: BotObservationV1,
  weights: ActionTypeWeights,
): RankedAction[] {
  return observation.validActions
    .map((action) => scoreActionAgainstProfile(observation, action, weights))
    .sort((a, b) => b.score - a.score);
}

export function chooseTopAction(
  observation: BotObservationV1,
  weights: ActionTypeWeights,
): RankedAction {
  const ranked = rankActions(observation, weights);
  const best = ranked[0];
  if (best !== undefined) {
    return best;
  }

  const waitAction =
    observation.validActions.find((action) => action.type === "wait") ??
    observation.validActions[0] ??
    syntheticWaitAction();

  return {
    action: waitAction,
    score: 0,
    reasons: ["fallback_no_ranked_action"],
  };
}
