const ALLOWED_REMOTE_API_KEY_ENV_NAMES = new Set([
  "OPENFRONT_BOTS_REMOTE_API_KEY",
  "OPENAI_API_KEY",
  "MISTRAL_API_KEY",
  "OPENROUTER_API_KEY",
  "DEEPSEEK_API_KEY",
  "GROQ_API_KEY",
  "TOGETHER_API_KEY",
  "FIREWORKS_API_KEY",
]);

export function isAllowedRemoteApiKeyEnvName(value: string | null | undefined): boolean {
  const normalized = value?.trim();
  return Boolean(normalized && ALLOWED_REMOTE_API_KEY_ENV_NAMES.has(normalized));
}

export function resolveAllowedRemoteApiKeyFromEnv(
  value: string | null | undefined,
): string | undefined {
  const normalized = value?.trim();
  if (!normalized || !isAllowedRemoteApiKeyEnvName(normalized)) {
    return undefined;
  }
  return process.env[normalized];
}
