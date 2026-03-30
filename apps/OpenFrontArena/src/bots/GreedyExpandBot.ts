import type { BotIdentity } from "./types";
import { WeightedBaselineBot } from "./WeightedBaselineBot";

export class GreedyExpandBot extends WeightedBaselineBot {
  constructor(identity?: Partial<BotIdentity>) {
    super(
      {
        id: identity?.id ?? "greedy-expand-bot",
        displayName: identity?.displayName ?? "GreedyExpandBot",
        backend: "rule_based",
        version: identity?.version ?? "1.0.0",
      },
      {
        expand: 0.3,
        build_structure: 0.18,
        attack_land: 0.14,
        upgrade_structure: 0.1,
        assist_ally: 0.08,
        attack_naval: 0.06,
        wait: -0.1,
      },
    );
  }
}
