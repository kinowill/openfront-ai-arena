import type {
  DistanceBand,
  FrontType,
  ID,
  Ratio,
  Score,
  StructureType,
  TileRef,
} from "./shared";

export const VALID_ACTIONS_VERSION = "1.0.0";

export type ValidActionType =
  | "wait"
  | "expand"
  | "attack_land"
  | "attack_naval"
  | "build_structure"
  | "upgrade_structure"
  | "assist_ally"
  | "set_target"
  | "accept_alliance"
  | "reject_alliance"
  | "break_alliance"
  | "donate_gold"
  | "donate_troops";

export interface ValidActionBase {
  id: ID;
  type: ValidActionType;
  label: string;
  frontId?: ID | null;
  targetPlayerId?: ID | null;
  priorityHint?: Score;
  supportsGoals?: string[];
  notes?: string[];
}

export interface WaitAction extends ValidActionBase {
  type: "wait";
}

export interface ExpandAction extends ValidActionBase {
  type: "expand";
  targetTile: TileRef;
  distanceBand?: DistanceBand;
}

export interface AttackLandAction extends ValidActionBase {
  type: "attack_land";
  targetPlayerId: ID;
  sourceFrontId: ID;
  estimatedCommitRatio?: Ratio;
}

export interface AttackNavalAction extends ValidActionBase {
  type: "attack_naval";
  targetPlayerId: ID;
  launchTile: TileRef;
  landingTile?: TileRef;
  estimatedCommitRatio?: Ratio;
}

export interface BuildStructureAction extends ValidActionBase {
  type: "build_structure";
  structureType: StructureType;
  tile: TileRef;
  targetFrontType?: FrontType | null;
}

export interface UpgradeStructureAction extends ValidActionBase {
  type: "upgrade_structure";
  structureType: StructureType;
  unitId: number;
}

export interface AssistAllyAction extends ValidActionBase {
  type: "assist_ally";
  allyPlayerId: ID;
  targetPlayerId?: ID | null;
}

export interface SetTargetAction extends ValidActionBase {
  type: "set_target";
  targetPlayerId: ID;
}

export interface AcceptAllianceAction extends ValidActionBase {
  type: "accept_alliance";
  requestingPlayerId: ID;
}

export interface RejectAllianceAction extends ValidActionBase {
  type: "reject_alliance";
  requestingPlayerId: ID;
}

export interface BreakAllianceAction extends ValidActionBase {
  type: "break_alliance";
  alliedPlayerId: ID;
}

export interface DonateGoldAction extends ValidActionBase {
  type: "donate_gold";
  allyPlayerId: ID;
  amount: number;
}

export interface DonateTroopsAction extends ValidActionBase {
  type: "donate_troops";
  allyPlayerId: ID;
  amount: number;
}

export type ValidAction =
  | WaitAction
  | ExpandAction
  | AttackLandAction
  | AttackNavalAction
  | BuildStructureAction
  | UpgradeStructureAction
  | AssistAllyAction
  | SetTargetAction
  | AcceptAllianceAction
  | RejectAllianceAction
  | BreakAllianceAction
  | DonateGoldAction
  | DonateTroopsAction;

export interface BotDecisionV1 {
  strategicGoal: string;
  tacticalReason: string;
  selectedActionId: ID;
  confidence: Ratio;
}
