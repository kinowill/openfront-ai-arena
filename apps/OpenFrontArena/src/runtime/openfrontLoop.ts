import type { Game, Player } from "../../../OpenFrontIO/src/core/game/Game";
import type { OpenFrontBot } from "../bots/types";
import { OpenFrontSnapshotAdapter } from "../adapters/openfront/snapshotAdapter";
import type { MatchRef } from "../contracts/shared";
import { arbitrateDecision, buildDecisionRecord } from "./arbiter";
import { buildRecentEvents } from "./observationMemory";
import {
  type OpenFrontExecutionResult,
  OpenFrontActionExecutor,
} from "./openfrontExecutor";
import type { JsonlTickLogger, TickLogEntry } from "./tickLogger";

export interface OpenFrontBotLoopOptions {
  rulesVersion?: string;
  mapVersion?: string;
  tickLogger?: JsonlTickLogger;
}

export interface OpenFrontBotTickResult {
  observation: ReturnType<OpenFrontSnapshotAdapter["produce"]>;
  execution: OpenFrontExecutionResult;
  decisionRecord: ReturnType<typeof buildDecisionRecord>;
}

export class OpenFrontBotLoop {
  private readonly adapter = new OpenFrontSnapshotAdapter();
  private readonly executor: OpenFrontActionExecutor;
  private readonly botHistory = new Map<string, TickLogEntry[]>();

  constructor(
    private readonly game: Game,
    private readonly matchRef: MatchRef,
    private readonly options: OpenFrontBotLoopOptions = {},
  ) {
    this.executor = new OpenFrontActionExecutor(game);
  }

  async tick(bot: OpenFrontBot, player: Player): Promise<OpenFrontBotTickResult> {
    const history = this.botHistory.get(bot.identity.id) ?? [];
    const previousObservation = history.at(-1)?.observation ?? null;

    const observation = this.adapter.produce({
      game: this.game as any,
      player: player as any,
      context: {
        match: this.matchRef,
        mapVersion: this.options.mapVersion ?? this.matchRef.mapName,
        rulesVersion: this.options.rulesVersion ?? "openfront-rules-1",
      },
    });
    observation.recentEvents = buildRecentEvents({
      currentObservation: observation,
      previousObservation,
      history,
    });

    const runtimeDecision = await bot.decide(observation, {
      tick: observation.match.tick,
      recentEvents: observation.recentEvents,
      recentDecisions: history
        .slice(-5)
        .map((entry) => entry.decisionRecord),
    });
    const arbitration = arbitrateDecision(observation, runtimeDecision.decision);
    const execution = this.executor.execute(player, arbitration.executedAction);

    const decisionRecord = buildDecisionRecord({
      playerId: player.id(),
      tick: observation.match.tick,
      observation,
      decision: runtimeDecision.decision,
      executedActionId: execution.executedActionId,
      validationErrors: [
        ...arbitration.validationErrors,
        ...(execution.accepted ? [] : [execution.summary]),
      ],
    });

    const result = {
      observation,
      execution,
      decisionRecord,
    };

    const tickEntry: TickLogEntry = {
      decisionRecord,
      observation,
      execution,
      botId: bot.identity.id,
      createdAt: new Date().toISOString(),
    };

    this.botHistory.set(bot.identity.id, [...history, tickEntry].slice(-12));

    if (this.options.tickLogger) {
      await this.options.tickLogger.log(tickEntry);
    }

    return result;
  }
}
