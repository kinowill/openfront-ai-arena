import { OpenAICompatibleBot } from "./openaiCompatible";

export interface LocalLlmBotOptions {
  model: string;
  baseUrl?: string;
  systemPrompt?: string;
}

export class LocalLlmBot extends OpenAICompatibleBot {
  constructor(options: LocalLlmBotOptions) {
    super({
      identity: {
        id: `local-llm-${options.model}`,
        displayName: `LocalLlm(${options.model})`,
        backend: "local_llm",
        version: "1.0.0",
      },
      baseUrl: options.baseUrl ?? "http://127.0.0.1:11434/v1",
      model: options.model,
      systemPrompt: options.systemPrompt,
    });
  }
}
