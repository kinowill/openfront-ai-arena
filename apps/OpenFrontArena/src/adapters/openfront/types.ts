import type { BotObservationV1 } from "../../contracts/botObservation";
import type { ControlRoomStateV1 } from "../../contracts/controlRoomState";
import type { MatchRef } from "../../contracts/shared";
import type { ValidAction } from "../../contracts/validActions";

export type OpenFrontRelationValue = 0 | 1 | 2 | 3;
export type OpenFrontGameModeValue = "Free For All" | "Team";

export type OpenFrontUnitType =
  | "Transport"
  | "Warship"
  | "Shell"
  | "SAMMissile"
  | "Port"
  | "Atom Bomb"
  | "Hydrogen Bomb"
  | "Trade Ship"
  | "Missile Silo"
  | "Defense Post"
  | "SAM Launcher"
  | "City"
  | "MIRV"
  | "MIRV Warhead"
  | "Train"
  | "Factory";

export interface OpenFrontTerraNullius {
  isPlayer(): false;
  smallID(): number;
  id(): null;
}

export interface OpenFrontUnit {
  id(): number;
  type(): OpenFrontUnitType;
  tile(): number;
  level(): number;
  isUnderConstruction(): boolean;
}

export interface OpenFrontAttack {
  id(): string;
  attacker(): OpenFrontPlayer;
  target(): OpenFrontPlayer | OpenFrontTerraNullius;
  troops(): number;
  sourceTile(): number | null;
}

export interface OpenFrontAllianceRequest {
  requestor(): OpenFrontPlayer;
  recipient(): OpenFrontPlayer;
  createdAt(): number;
  status(): "pending" | "accepted" | "rejected";
}

export interface OpenFrontAlliance {
  other(player: OpenFrontPlayer): OpenFrontPlayer;
}

export interface OpenFrontBuildableUnit {
  type: OpenFrontUnitType;
  canBuild: number | false;
  canUpgrade: number | false;
  cost: bigint;
}

export interface OpenFrontPlayer {
  id(): string;
  smallID(): number;
  displayName(): string;
  isPlayer(): this is OpenFrontPlayer;
  isAlive(): boolean;
  isDisconnected(): boolean;
  hasSpawned(): boolean;
  team(): string | null;
  gold(): bigint;
  troops(): number;
  numTilesOwned(): number;
  tiles(): ReadonlySet<number>;
  borderTiles(): ReadonlySet<number>;
  spawnTile(): number | undefined;
  units(...types: OpenFrontUnitType[]): OpenFrontUnit[];
  unitCount(type: OpenFrontUnitType): number;
  unitsOwned(type: OpenFrontUnitType): number;
  buildableUnits(
    tile: number | null,
    units?: readonly OpenFrontUnitType[],
  ): OpenFrontBuildableUnit[];
  canBuild(
    type: OpenFrontUnitType,
    targetTile: number,
    validTiles?: number[] | null,
  ): number | false;
  neighbors(): Array<OpenFrontPlayer | OpenFrontTerraNullius>;
  sharesBorderWith(other: OpenFrontPlayer | OpenFrontTerraNullius): boolean;
  relation(other: OpenFrontPlayer): OpenFrontRelationValue;
  isOnSameTeam(other: OpenFrontPlayer): boolean;
  isFriendly(other: OpenFrontPlayer, treatAFKFriendly?: boolean): boolean;
  incomingAllianceRequests(): OpenFrontAllianceRequest[];
  outgoingAllianceRequests(): OpenFrontAllianceRequest[];
  allies(): OpenFrontPlayer[];
  isAlliedWith(other: OpenFrontPlayer): boolean;
  alliances(): OpenFrontAlliance[];
  canSendAllianceRequest(other: OpenFrontPlayer): boolean;
  canTarget(other: OpenFrontPlayer): boolean;
  targets(): OpenFrontPlayer[];
  canDonateGold(recipient: OpenFrontPlayer): boolean;
  canDonateTroops(recipient: OpenFrontPlayer): boolean;
  canAttackPlayer(player: OpenFrontPlayer, treatAFKFriendly?: boolean): boolean;
  incomingAttacks(): OpenFrontAttack[];
  outgoingAttacks(): OpenFrontAttack[];
}

export interface OpenFrontConfig {
  gameConfig(): {
    gameMode: OpenFrontGameModeValue;
  };
  maxTroops(player: OpenFrontPlayer): number;
  goldAdditionRate(player: OpenFrontPlayer): bigint;
}

export interface OpenFrontGame {
  ticks(): number;
  width(): number;
  height(): number;
  config(): OpenFrontConfig;
  forEachTile(fn: (tile: number) => void): void;
  isLand(tile: number): boolean;
  isOceanShore(tile: number): boolean;
  hasFallout(tile: number): boolean;
  hasOwner(tile: number): boolean;
  owner(tile: number): OpenFrontPlayer | OpenFrontTerraNullius;
  ownerID(tile: number): number;
  neighbors(tile: number): number[];
  playerBySmallID(id: number): OpenFrontPlayer | OpenFrontTerraNullius;
  x(tile: number): number;
  y(tile: number): number;
  manhattanDist(a: number, b: number): number;
}

export interface OpenFrontSnapshotContext {
  match: MatchRef;
  mapVersion: string;
  rulesVersion: string;
}

export interface OpenFrontPlayerSnapshotInput {
  playerId: string;
  displayName?: string;
}

export interface OpenFrontAdapterDependencies<
  TGame = OpenFrontGame,
  TPlayer = OpenFrontPlayer,
> {
  game: TGame;
  player: TPlayer;
  context: OpenFrontSnapshotContext;
}

export interface ValidActionProducer<
  TGame = OpenFrontGame,
  TPlayer = OpenFrontPlayer,
> {
  produce(input: OpenFrontAdapterDependencies<TGame, TPlayer>): ValidAction[];
}

export interface BotObservationProducer<
  TGame = OpenFrontGame,
  TPlayer = OpenFrontPlayer,
> {
  produce(input: OpenFrontAdapterDependencies<TGame, TPlayer>): BotObservationV1;
}

export interface ControlRoomStateProducer<TState = unknown> {
  produce(state: TState): ControlRoomStateV1;
}
