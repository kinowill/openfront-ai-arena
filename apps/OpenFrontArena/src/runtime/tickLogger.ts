import fs from "node:fs/promises";
import path from "node:path";
import type { BotDecisionRecord } from "../contracts/controlRoomState";
import type { BotObservationV1 } from "../contracts/botObservation";
import type { OpenFrontExecutionResult } from "./openfrontExecutor";

export interface TickLogEntry {
  decisionRecord: BotDecisionRecord;
  observation: BotObservationV1;
  execution: OpenFrontExecutionResult;
  botId: string;
  createdAt: string;
}

export class JsonlTickLogger {
  constructor(private readonly filePath: string) {}

  async log(entry: TickLogEntry): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.appendFile(this.filePath, `${JSON.stringify(entry)}\n`, "utf8");
  }
}
