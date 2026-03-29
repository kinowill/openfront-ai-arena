import type { BotDecisionV1 } from "../../contracts/validActions";
import type {
  CommentatorSummary,
  ControlRoomPlayerStats,
  ControlRoomStateV1,
  OperatorAnswer,
  OperatorQuestion,
} from "../../contracts/controlRoomState";
import type { ID, Tick, TimestampISO } from "../../contracts/shared";

export type ControlRoomEventType =
  | "match_state"
  | "player_stats"
  | "bot_decision"
  | "operator_question"
  | "operator_answer"
  | "commentator_summary";

export interface ControlRoomEventBase {
  type: ControlRoomEventType;
  matchId: ID;
  tick: Tick;
  createdAt: TimestampISO;
}

export interface MatchStateEvent extends ControlRoomEventBase {
  type: "match_state";
  payload: ControlRoomStateV1;
}

export interface PlayerStatsEvent extends ControlRoomEventBase {
  type: "player_stats";
  payload: ControlRoomPlayerStats[];
}

export interface BotDecisionEvent extends ControlRoomEventBase {
  type: "bot_decision";
  payload: {
    playerId: ID;
    decision: BotDecisionV1 | null;
    executedActionId: ID | null;
    validationErrors: string[];
  };
}

export interface OperatorQuestionEvent extends ControlRoomEventBase {
  type: "operator_question";
  payload: OperatorQuestion;
}

export interface OperatorAnswerEvent extends ControlRoomEventBase {
  type: "operator_answer";
  payload: OperatorAnswer;
}

export interface CommentatorSummaryEvent extends ControlRoomEventBase {
  type: "commentator_summary";
  payload: CommentatorSummary;
}

export type ControlRoomEvent =
  | MatchStateEvent
  | PlayerStatsEvent
  | BotDecisionEvent
  | OperatorQuestionEvent
  | OperatorAnswerEvent
  | CommentatorSummaryEvent;
