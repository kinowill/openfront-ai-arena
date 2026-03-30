import type { BotIdentity } from "./types";
import { WeightedBaselineBot } from "./WeightedBaselineBot";

export class NavalPressureBot extends WeightedBaselineBot {
  constructor(identity?: Partial<BotIdentity>) {
    super(
      {
        id: identity?.id ?? "naval-pressure-bot",
        displayName: identity?.displayName ?? "NavalPressureBot",
        backend: "rule_based",
        version: identity?.version ?? "1.0.0",
      },
      {
        attack_naval: 0.32,
        build_structure: 0.14,
        expand: 0.08,
        attack_land: 0.04,
        set_target: 0.04,
        wait: -0.1,
      },
    );
  }
}
