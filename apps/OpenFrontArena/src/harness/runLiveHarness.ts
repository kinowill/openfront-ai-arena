import path from "node:path";
import { fileURLToPath } from "node:url";
import { GreedyExpandBot } from "../bots/GreedyExpandBot";
import { OpenFrontBotLoop } from "../runtime/openfrontLoop";
import { JsonlTickLogger } from "../runtime/tickLogger";
import { createLocalHarnessMatch } from "./localHarness";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../..");
const LOG_FILE = path.join(ROOT_DIR, "logs", "local-harness.jsonl");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const tickLimit = Number(process.env.OPENFRONT_BOTS_LIVE_TICKS ?? 25);
const tickDelayMs = Number(process.env.OPENFRONT_BOTS_LIVE_DELAY_MS ?? 800);

const { game, botPlayer, matchRef } = await createLocalHarnessMatch();
const bot = new GreedyExpandBot();
const loop = new OpenFrontBotLoop(game, matchRef, {
  mapVersion: "ocean_and_land@test",
  tickLogger: new JsonlTickLogger(LOG_FILE),
});

for (let index = 0; index < tickLimit; index += 1) {
  matchRef.tick = game.ticks();
  const result = await loop.tick(bot, botPlayer);

  console.log(
    JSON.stringify(
      {
        tick: result.decisionRecord.tick,
        selectedActionId: result.decisionRecord.executedActionId,
        accepted: result.execution.accepted,
        summary: result.execution.summary,
      },
      null,
      2,
    ),
  );

  game.executeNextTick();
  await sleep(tickDelayMs);
}
