import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkOpenAICompatibleIntegration } from "../integrations/health";
import {
  controlRoomSessionManager,
  mapThumbnailPath,
  RANDOM_MAP_VALUE,
} from "../session/manager";
import { buildControlRoomSnapshot } from "../state/buildState";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");
const UI_DIR = path.join(ROOT_DIR, "src", "control-room", "ui");
const LOG_FILE = path.join(ROOT_DIR, "logs", "local-harness.jsonl");

function contentType(filePath: string): string {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  return "text/plain; charset=utf-8";
}

async function serveFile(
  res: http.ServerResponse,
  filePath: string,
): Promise<void> {
  try {
    const body = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

function routeToUiFile(urlPath: string): string {
  if (urlPath === "/" || urlPath === "") {
    return path.join(UI_DIR, "index.html");
  }
  return path.join(UI_DIR, urlPath.replace(/^\//, ""));
}

async function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

export function startControlRoomServer(port = 4318): http.Server {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const dashboard = async () => ({
      controlRoom: await buildControlRoomSnapshot(LOG_FILE),
      session: controlRoomSessionManager.snapshot(),
    });

    if (url.pathname === "/api/state") {
      const snapshot = await buildControlRoomSnapshot(LOG_FILE);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(snapshot));
      return;
    }

    if (url.pathname === "/api/session" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(controlRoomSessionManager.snapshot()));
      return;
    }

    if (url.pathname === "/api/session" && req.method === "PUT") {
      const body = (await readJsonBody(req)) as Record<string, unknown>;
      const snapshot = controlRoomSessionManager.updateConfig(body as any);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(snapshot));
      return;
    }

    if (url.pathname === "/api/session/start" && req.method === "POST") {
      const body = (await readJsonBody(req)) as {
        slotSecrets?: Array<{ slotId?: string; apiKey?: string | null }>;
      };
      const snapshot = await controlRoomSessionManager.start(body);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(snapshot));
      return;
    }

    if (url.pathname === "/api/session/stop" && req.method === "POST") {
      const snapshot = await controlRoomSessionManager.stop();
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(snapshot));
      return;
    }

    if (url.pathname === "/api/dashboard") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(await dashboard()));
      return;
    }

    if (url.pathname === "/api/maps/preview" && req.method === "GET") {
      const mapName = url.searchParams.get("name")?.trim();
      if (!mapName || mapName === RANDOM_MAP_VALUE) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Map preview not found");
        return;
      }
      try {
        await serveFile(res, mapThumbnailPath(mapName));
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Map preview not found");
      }
      return;
    }

    if (url.pathname === "/api/logs/clear" && req.method === "POST") {
      await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
      await fs.writeFile(LOG_FILE, "", "utf8");
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(await dashboard()));
      return;
    }

    if (url.pathname === "/api/integrations/check" && req.method === "POST") {
      const body = (await readJsonBody(req)) as {
        backend?: string;
        baseUrl?: string | null;
        model?: string | null;
        apiKeyEnv?: string | null;
        apiKey?: string | null;
      };

      if (body.backend !== "local_llm" && body.backend !== "remote_api") {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({ error: "backend must be local_llm or remote_api" }),
        );
        return;
      }

      const defaultBaseUrl =
        body.backend === "local_llm"
          ? process.env.OPENFRONT_BOTS_LOCAL_LLM_BASE_URL ??
            "http://127.0.0.1:11434/v1"
          : process.env.OPENFRONT_BOTS_REMOTE_API_BASE_URL ?? null;
      const apiKey =
        body.backend === "remote_api"
          ? body.apiKey?.trim() ||
            ((body.apiKeyEnv ? process.env[body.apiKeyEnv] : undefined) ??
              process.env.OPENFRONT_BOTS_REMOTE_API_KEY)
          : undefined;

      const result = await checkOpenAICompatibleIntegration({
        backend: body.backend,
        baseUrl: body.baseUrl?.trim() || defaultBaseUrl || "",
        model: body.model?.trim() || null,
        apiKey,
      });

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(result));
      return;
    }

    if (url.pathname === "/api/operator/execute" && req.method === "POST") {
      const body = (await readJsonBody(req)) as {
        playerId?: string;
        actionId?: string;
      };
      const snapshot = controlRoomSessionManager.executeOperatorAction(
        body.playerId ?? "",
        body.actionId ?? "",
      );
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(snapshot));
      return;
    }

    if (url.pathname === "/api/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const send = async () => {
        res.write(`data: ${JSON.stringify(await dashboard())}\n\n`);
      };

      await send();
      const interval = setInterval(send, 2000);
      req.on("close", () => clearInterval(interval));
      return;
    }

    await serveFile(res, routeToUiFile(url.pathname));
  });

  server.listen(port, "127.0.0.1");
  return server;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const port = Number(process.env.OPENFRONT_BOTS_CONTROL_ROOM_PORT ?? 4318);
  startControlRoomServer(port);
  console.log(`Control Room running on http://127.0.0.1:${port}`);
}
