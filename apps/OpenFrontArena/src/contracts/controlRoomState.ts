import type {
  ID,
  MatchRef,
  Ratio,
  Score,
  StructureType,
  Tick,
  TileRef,
  TimestampISO,
} from "./shared";
import type { BotDecisionV1 } from "./validActions";

export const CONTROL_ROOM_STATE_VERSION = "1.0.0";

export type ControlRoomMode =
  | "competitive_mode"
  | "interactive_mode"
  | "debug_mode";

export interface ControlRoomPlayerStats {
  playerId: ID;
  displayName: string;
  alive: boolean;
  tilesOwned: number;
  troops: number;
  gold: number;
  structures: Partial<Record<StructureType, number>>;
  incomingAttackPressure: Ratio;
  outgoingAttackPressure: Ratio;
  reserveRatio: Ratio;
  invalidActionRate: Ratio;
  decisionLatencyMsAvg: number | null;
}

export interface ControlRoomFrontSnapshot {
  frontId: ID;
  label: string;
  status: string;
  leadPlayerId: ID | null;
  intensity: Score;
}

export interface ControlRoomMapState {
  highlightedFronts: ControlRoomFrontSnapshot[];
  liveTerritorySummary: string[];
  liveEvents: string[];
  focusPlayerId?: ID | null;
  focusTile?: TileRef | null;
}

export interface BotDecisionRecord {
  playerId: ID;
  tick: Tick;
  decision: BotDecisionV1 | null;
  executedActionId: ID | null;
  validationErrors: string[];
  observationSummary: string[];
  createdAt: TimestampISO;
}

export interface OperatorQuestion {
  id: ID;
  playerId: ID;
  question: string;
  createdAt: TimestampISO;
  mode: "interview" | "coaching" | "debug";
}

export interface OperatorAnswer {
  id: ID;
  questionId: ID;
  playerId: ID;
  answer: string;
  createdAt: TimestampISO;
}

export interface CommentatorSummary {
  id: ID;
  tick: Tick;
  createdAt: TimestampISO;
  trigger:
    | "interval"
    | "leader_change"
    | "player_eliminated"
    | "major_naval_front"
    | "nuclear_shift"
    | "manual";
  lines: string[];
}

export interface ControlRoomStateV1 {
  controlRoomStateVersion: typeof CONTROL_ROOM_STATE_VERSION;
  mode: ControlRoomMode;
  match: MatchRef;
  players: ControlRoomPlayerStats[];
  mapState: ControlRoomMapState;
  botDecisions: BotDecisionRecord[];
  operatorQuestions: OperatorQuestion[];
  operatorAnswers: OperatorAnswer[];
  commentatorSummaries: CommentatorSummary[];
}
