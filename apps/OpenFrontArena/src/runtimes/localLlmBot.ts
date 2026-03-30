import { OpenAICompatibleBot } from "./openaiCompatible";

export interface LocalLlmBotOptions {
  identityId?: string;
  displayName?: string;
  model: string;
  baseUrl?: string;
  systemPrompt?: string;
}

export class LocalLlmBot extends OpenAICompatibleBot {
  constructor(options: LocalLlmBotOptions) {
    super({
      identity: {
        id: options.identityId ?? `local-llm-${options.model}`,
        displayName: options.displayName ?? `LocalLlm(${options.model})`,
        backend: "local_llm",
        version: "1.0.0",
      },
      baseUrl: options.baseUrl ?? "http://localhost:11434/v1",
      model: options.model,
      systemPrompt: options.systemPrompt,
    });
  }
}
