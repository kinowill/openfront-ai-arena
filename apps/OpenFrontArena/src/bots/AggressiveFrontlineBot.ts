import type { BotIdentity } from "./types";
import { WeightedBaselineBot } from "./WeightedBaselineBot";

export class AggressiveFrontlineBot extends WeightedBaselineBot {
  constructor(identity?: Partial<BotIdentity>) {
    super(
      {
        id: identity?.id ?? "aggressive-frontline-bot",
        displayName: identity?.displayName ?? "AggressiveFrontlineBot",
        backend: "rule_based",
        version: identity?.version ?? "1.0.0",
      },
      {
        attack_land: 0.34,
        attack_naval: 0.18,
        set_target: 0.12,
        expand: 0.08,
        assist_ally: 0.04,
        build_structure: -0.04,
        upgrade_structure: -0.05,
        wait: -0.16,
      },
    );
  }
}
