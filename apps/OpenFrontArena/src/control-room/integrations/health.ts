export type IntegrationHealthStatus = "ok" | "warning" | "error";

export interface IntegrationHealthResult {
  status: IntegrationHealthStatus;
  summary: string;
  detail: string;
  checkedAt: string;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

function localHint(baseUrl: string): string {
  if (baseUrl.includes("11434")) {
    return "Serveur local non joignable. Lance Ollama puis reteste.";
  }
  return "Serveur local non joignable. Verifie que le service tourne puis reteste.";
}

function compactExcerpt(raw: string | null | undefined, maxLength = 240): string | null {
  const compact = String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!compact) return null;
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 3)}...` : compact;
}

async function readErrorDetail(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    const excerpt = compactExcerpt(text);
    if (!excerpt) {
      return null;
    }

    try {
      const payload = JSON.parse(text) as {
        error?: { message?: string; code?: string; type?: string } | string;
        message?: string;
      };
      if (typeof payload.error === "string") {
        return compactExcerpt(payload.error) ?? excerpt;
      }
      if (payload.error?.message) {
        return compactExcerpt(
          [payload.error.type, payload.error.code, payload.error.message]
            .filter(Boolean)
            .join(" | "),
        ) ?? excerpt;
      }
      if (payload.message) {
        return compactExcerpt(payload.message) ?? excerpt;
      }
    } catch {
      return excerpt;
    }

    return excerpt;
  } catch {
    return null;
  }
}

export async function checkOpenAICompatibleIntegration(input: {
  backend: "local_llm" | "remote_api";
  baseUrl: string;
  model: string | null;
  apiKey?: string;
}): Promise<IntegrationHealthResult> {
  const checkedAt = new Date().toISOString();
  const baseUrl = normalizeBaseUrl(input.baseUrl);
  const modelsUrl = `${baseUrl}/models`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (input.apiKey) {
    headers.Authorization = `Bearer ${input.apiKey}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(modelsUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const errorDetail = response.ok ? null : await readErrorDetail(response);

    if (response.status === 401 || response.status === 403) {
      return {
        status: "error",
        summary: "Authentification refusee",
        detail:
          input.backend === "remote_api"
            ? errorDetail
              ? `Authentification distante refusee: ${errorDetail}`
              : "La cle API directe ou la variable d'environnement semble invalide."
            : "Le serveur local demande une authentification non attendue.",
        checkedAt,
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        summary: `HTTP ${response.status}`,
        detail: errorDetail
          ? `Le serveur a repondu avec ${response.status} ${response.statusText}: ${errorDetail}`
          : `Le serveur a repondu avec ${response.status} ${response.statusText}.`,
        checkedAt,
      };
    }

    let modelFound = false;
    if (input.model) {
      try {
        const payload = (await response.json()) as {
          data?: Array<{ id?: string }>;
          models?: Array<{ name?: string }>;
        };
        const modelIds = [
          ...(payload.data ?? []).map((entry) => entry.id).filter(Boolean),
          ...(payload.models ?? []).map((entry) => entry.name).filter(Boolean),
        ];
        modelFound = modelIds.includes(input.model);
      } catch {
        modelFound = false;
      }
    }

    if (input.model && !modelFound) {
      return {
        status: "warning",
        summary: "Connexion OK, modele introuvable",
        detail: `Le serveur repond, mais le modele '${input.model}' n'a pas ete trouve dans /models.`,
        checkedAt,
      };
    }

    return {
      status: "ok",
      summary: "Connexion OK",
      detail: input.model
        ? `Le serveur repond et le modele '${input.model}' est disponible.`
        : "Le serveur repond correctement.",
      checkedAt,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "error",
        summary: "Timeout",
        detail: "Le serveur ne repond pas assez vite.",
        checkedAt,
      };
    }

    return {
      status: "error",
      summary: "Connexion impossible",
      detail:
        input.backend === "local_llm"
          ? localHint(baseUrl)
          : "API distante non joignable. Verifie l'URL, le reseau et la cle API.",
      checkedAt,
    };
  }
}
