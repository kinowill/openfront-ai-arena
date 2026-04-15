import type { BotObservationV1 } from "../contracts/botObservation";
import type { ValidAction, BotDecisionV1 } from "../contracts/validActions";
import type {
  BotDecisionContext,
  BotIdentity,
  BotRuntimeDecision,
  OpenFrontBot,
} from "../bots/types";

export interface OpenAICompatibleRuntimeOptions {
  identity: BotIdentity;
  baseUrl: string;
  model: string;
  apiKey?: string;
  systemPrompt?: string;
}

interface ParsedDecision {
  strategic_goal?: string;
  tactical_reason?: string;
  selected_action_id?: string;
  confidence?: number;
}

const DEFAULT_SYSTEM_PROMPT = [
  "Tu pilotes un joueur dans OpenFront.",
  "Tu recois une observation structuree et une liste d'actions valides.",
  "Les actions sont deja legales ou validees par le moteur.",
  "Choisis l'action qui sert le mieux ton plan du tick.",
  "Tu dois repondre uniquement en JSON valide.",
  'Format: {"strategic_goal":"...","tactical_reason":"...","selected_action_id":"...","confidence":0.0}',
  "Ne choisis qu'une action presente dans validActions.",
].join("\n");

function fallbackAction(observation: BotObservationV1): ValidAction {
  return (
    observation.validActions.find((action) => action.type === "wait") ??
    observation.validActions[0]
  );
}

function extractJson(text: string): ParsedDecision | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(raw.slice(start, end + 1)) as ParsedDecision;
  } catch {
    return null;
  }
}

function resolveDecision(
  observation: BotObservationV1,
  parsed: ParsedDecision | null,
): BotRuntimeDecision {
  const action =
    observation.validActions.find(
      (candidate) => candidate.id === parsed?.selected_action_id,
    ) ?? fallbackAction(observation);

  const decision: BotDecisionV1 = {
    strategicGoal: parsed?.strategic_goal ?? "fallback_wait",
    tacticalReason:
      parsed?.tactical_reason ??
      "Fallback to a safe action because the model response was invalid or incomplete.",
    selectedActionId: action.id,
    confidence:
      typeof parsed?.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0,
  };

  return {
    decision,
    selectedAction: action,
    fallbackUsed: parsed?.selected_action_id !== action.id,
    diagnostics:
      parsed === null
        ? ["model_response_not_parseable_json"]
        : parsed.selected_action_id !== action.id
          ? ["selected_action_id_not_found_in_valid_actions"]
          : [],
    confidence: decision.confidence,
  };
}

export class OpenAICompatibleBot implements OpenFrontBot {
  readonly identity: BotIdentity;

  constructor(private readonly options: OpenAICompatibleRuntimeOptions) {
    this.identity = options.identity;
  }

  async decide(
    observation: BotObservationV1,
    context?: BotDecisionContext,
  ): Promise<BotRuntimeDecision> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), context?.timeoutMs ?? 15000);

    try {
      const response = await fetch(
        `${this.options.baseUrl.replace(/\/$/, "")}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.options.apiKey
              ? { Authorization: `Bearer ${this.options.apiKey}` }
              : {}),
          },
          body: JSON.stringify({
            model: this.options.model,
            temperature: 0.2,
            max_tokens: 300,
            messages: [
              {
                role: "system",
                content: this.options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: JSON.stringify(observation),
              },
            ],
          }),
          signal: controller.signal,
        },
      );

      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = json.choices?.[0]?.message?.content ?? "";
      return resolveDecision(observation, extractJson(content));
    } catch (error) {
      const action = fallbackAction(observation);
      return {
        decision: {
          strategicGoal: "fallback_wait",
          tacticalReason:
            error instanceof Error
              ? `Runtime error: ${error.message}`
              : "Runtime error",
          selectedActionId: action.id,
          confidence: 0,
        },
        selectedAction: action,
        fallbackUsed: true,
        diagnostics: ["runtime_request_failed"],
        confidence: 0,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
