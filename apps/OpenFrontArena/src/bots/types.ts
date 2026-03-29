import type { BotObservationV1 } from "../contracts/botObservation";
import type { Ratio } from "../contracts/shared";
import type { BotDecisionV1, ValidAction } from "../contracts/validActions";

export type BotBackendKind =
  | "rule_based"
  | "local_llm"
  | "remote_api"
  | "human_operator";

export interface BotIdentity {
  id: string;
  displayName: string;
  backend: BotBackendKind;
  version: string;
}

export interface BotDecisionContext {
  tick: number;
  timeoutMs?: number;
}

export interface BotRuntimeDecision {
  decision: BotDecisionV1;
  selectedAction: ValidAction;
  fallbackUsed: boolean;
  diagnostics: string[];
  confidence: Ratio;
}

export interface OpenFrontBot {
  readonly identity: BotIdentity;
  decide(
    observation: BotObservationV1,
    context?: BotDecisionContext,
  ): BotRuntimeDecision | Promise<BotRuntimeDecision>;
}
