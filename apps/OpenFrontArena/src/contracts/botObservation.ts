import type {
  BotPlaystyle,
  DistanceBand,
  FrontStatus,
  FrontType,
  ID,
  MapArchetype,
  MatchRef,
  OpportunityType,
  Ratio,
  ReachabilityType,
  RelationType,
  Score,
  StructureType,
  ThreatType,
  TileCandidate,
  TimedEvent,
  VisibilityMode,
} from "./shared";
import type { ValidAction } from "./validActions";

export const BOT_OBSERVATION_VERSION = "1.0.0";
export const BOT_RULES_VERSION = "openfront-rules-1";

export interface BotPlayerState {
  id: ID;
  team: ID | null;
  alive: boolean;
  tilesOwned: number;
  gold: number;
  troops: number;
  maxTroopsEstimate: number | null;
  reserveRatio: Ratio;
  spawned: boolean;
  isDisconnected: boolean;
}

export interface BotEconomyState {
  incomeEstimate: number | null;
  floatingGoldRisk: Ratio;
  expansionPotential: Ratio;
  infrastructureBalance: "underbuilt" | "balanced" | "overbuilt" | "unknown";
}

export interface BotMilitaryState {
  incomingAttackPressure: Ratio;
  outgoingAttackPressure: Ratio;
  landPressure: Ratio;
  navalPressure: Ratio;
  nuclearThreatLevel: Ratio;
  canProjectNaval: boolean;
}

export interface BotDiplomacyState {
  allies: ID[];
  sameTeam: ID[];
  targets: ID[];
  allianceRequestsIncoming: ID[];
  allianceRequestsOutgoing: ID[];
  donationOpportunities: ID[];
  betrayalRiskEstimate: Ratio;
}

export interface BotMapProfile {
  archetype: MapArchetype;
  coastalImportance: Ratio;
  navalRelevance: Ratio;
  frontComplexity: Ratio;
  neutralExpansionPotential: Ratio;
  chokepointDensity: Ratio;
}

export interface BotNeighbor {
  playerId: ID;
  relation: RelationType;
  reachability: ReachabilityType;
  troops: number | null;
  tilesOwned: number | null;
  pressureFromOthers: Ratio;
  vulnerability: Ratio;
  hasPorts: boolean;
  hasSams: boolean;
  hasSilos: boolean;
  isDisconnected: boolean;
  lastSeenTick: number | null;
}

export interface BotFront {
  frontId: ID;
  type: FrontType;
  enemyPlayerId: ID | null;
  status: FrontStatus;
  myPressure: Ratio;
  enemyPressure: Ratio;
  strategicValue: Score;
  neutralTilesAvailable: number;
  distanceToEnemyCore: DistanceBand;
  recommendedModes: string[];
}

export interface BotStructuresState {
  cities: number;
  factories: number;
  ports: number;
  defensePosts: number;
  sams: number;
  silos: number;
  criticalAssetsExposed: string[];
  bestBuildCandidates: Array<
    TileCandidate & {
      type: StructureType;
    }
  >;
}

export interface BotOpportunity {
  type: OpportunityType;
  priority: Score;
  frontId: ID | null;
  targetPlayerId: ID | null;
  linkedActionIds: ID[];
}

export interface BotThreat {
  type: ThreatType;
  severity: Score;
  frontId: ID | null;
  targetPlayerId: ID | null;
  recommendedResponseTypes: string[];
}

export interface BotObservationV1 {
  observationVersion: typeof BOT_OBSERVATION_VERSION;
  rulesVersion: typeof BOT_RULES_VERSION;
  validActionsVersion: string;
  mapVersion: string;
  visibilityMode: VisibilityMode;
  match: MatchRef;
  player: BotPlayerState;
  economy: BotEconomyState;
  military: BotMilitaryState;
  diplomacy: BotDiplomacyState;
  mapProfile: BotMapProfile;
  neighbors: BotNeighbor[];
  fronts: BotFront[];
  structures: BotStructuresState;
  opportunities: BotOpportunity[];
  threats: BotThreat[];
  recentEvents: TimedEvent[];
  strategicSummary: string[];
  validActions: ValidAction[];
  currentStyle?: BotPlaystyle;
  secondaryStyle?: BotPlaystyle | null;
}
