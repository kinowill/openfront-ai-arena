export type ID = string;
export type Tick = number;
export type TileRef = number;
export type Ratio = number;
export type Score = number;
export type TimestampISO = string;

export type VisibilityMode = "full_information" | "player_information";

export type MatchPhase = "spawn" | "early" | "mid" | "late" | "endgame";

export type MatchMode = "ffa" | "team" | "unknown";

export type RelationType =
  | "self"
  | "same_team"
  | "allied"
  | "neutral"
  | "hostile"
  | "terra_nullius";

export type ReachabilityType = "land" | "naval" | "mixed" | "unreachable";

export type FrontType = "land" | "coast" | "naval" | "mixed";

export type FrontStatus = "safe" | "contested" | "critical" | "opportunity";

export type DistanceBand = "adjacent" | "short" | "medium" | "long" | "unknown";

export type StructureType =
  | "City"
  | "Factory"
  | "Port"
  | "DefensePost"
  | "SAMLauncher"
  | "MissileSilo";

export type ThreatType =
  | "major_incoming_attack"
  | "border_enemy_stronger_than_me"
  | "coast_unprotected"
  | "critical_asset_exposed"
  | "nuclear_threat"
  | "ally_collapsing"
  | "front_overextended"
  | "unknown";

export type OpportunityType =
  | "expand_into_terra_nullius"
  | "attack_weak_neighbor"
  | "assist_ally_under_attack"
  | "build_port_for_offshore_access"
  | "build_city_for_growth"
  | "build_factory_for_scaling"
  | "build_sam_cover"
  | "build_defense_post"
  | "prepare_nuclear_play"
  | "unknown";

export type EventType =
  | "enemy_spotted"
  | "under_attack"
  | "attack_started"
  | "attack_cancelled"
  | "front_changed"
  | "territory_gained"
  | "territory_lost"
  | "structure_built"
  | "structure_destroyed"
  | "alliance_accepted"
  | "alliance_rejected"
  | "alliance_broken"
  | "target_set"
  | "donation_sent"
  | "donation_received"
  | "nuke_threat_detected"
  | "player_eliminated"
  | "unknown";

export type MapArchetype =
  | "continental"
  | "regional"
  | "island"
  | "maritime"
  | "chokepoint"
  | "split_landmass"
  | "mixed"
  | "unknown";

export type BotPlaystyle =
  | "safe_expansion"
  | "turtle"
  | "opportunistic_predator"
  | "naval_pressure"
  | "alliance_operator"
  | "strategic_weapons"
  | "hybrid"
  | "unknown";

export interface MatchRef {
  id: ID;
  tick: Tick;
  phase: MatchPhase;
  seed: number | null;
  maxTicks: Tick | null;
  mode: MatchMode;
  mapName: string;
}

export interface TileCandidate {
  tile: TileRef;
  score: Score;
  reason: string;
}

export interface PlayerRef {
  playerId: ID;
  displayName?: string;
}

export interface TimedEvent {
  tick: Tick;
  type: EventType;
  playerId?: ID | null;
  targetPlayerId?: ID | null;
  frontId?: ID | null;
  summary?: string;
}
