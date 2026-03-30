import { OpenAICompatibleBot } from "./openaiCompatible";

export interface RemoteApiBotOptions {
  identityId?: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  displayName?: string;
  systemPrompt?: string;
}

export class RemoteApiBot extends OpenAICompatibleBot {
  constructor(options: RemoteApiBotOptions) {
    super({
      identity: {
        id: options.identityId ?? `remote-api-${options.model}`,
        displayName: options.displayName ?? `RemoteApi(${options.model})`,
        backend: "remote_api",
        version: "1.0.0",
      },
      baseUrl: options.baseUrl,
      model: options.model,
      apiKey: options.apiKey,
      systemPrompt: options.systemPrompt,
    });
  }
}
