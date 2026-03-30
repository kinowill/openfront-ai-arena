import type { BotIdentity } from "./types";
import { WeightedBaselineBot } from "./WeightedBaselineBot";

export class EconomicGrowthBot extends WeightedBaselineBot {
  constructor(identity?: Partial<BotIdentity>) {
    super(
      {
        id: identity?.id ?? "economic-growth-bot",
        displayName: identity?.displayName ?? "EconomicGrowthBot",
        backend: "rule_based",
        version: identity?.version ?? "1.0.0",
      },
      {
        build_structure: 0.28,
        upgrade_structure: 0.22,
        expand: 0.16,
        assist_ally: 0.04,
        attack_land: -0.04,
        attack_naval: -0.06,
        wait: -0.08,
      },
    );
  }
}
