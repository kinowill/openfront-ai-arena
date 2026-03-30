import {
  BOT_OBSERVATION_VERSION,
  BOT_RULES_VERSION,
  type BotFront,
  type BotNeighbor,
  type BotObservationV1,
  type BotOpportunity,
  type BotThreat,
} from "../../contracts/botObservation";
import {
  CONTROL_ROOM_STATE_VERSION,
  type ControlRoomStateV1,
} from "../../contracts/controlRoomState";
import type {
  DistanceBand,
  FrontStatus,
  FrontType,
  MapArchetype,
  MatchRef,
  Ratio,
  RelationType,
  StructureType,
  TileCandidate,
} from "../../contracts/shared";
import {
  VALID_ACTIONS_VERSION,
  type ValidAction,
} from "../../contracts/validActions";
import type {
  BotObservationProducer,
  ControlRoomStateProducer,
  OpenFrontAdapterDependencies,
  OpenFrontGame,
  OpenFrontPlayer,
  OpenFrontTerraNullius,
  OpenFrontUnitType,
  ValidActionProducer,
} from "./types";

const RELATION_DISTRUSTFUL = 1;
const RELATION_NEUTRAL = 2;

const UNIT_TRANSPORT: OpenFrontUnitType = "Transport";
const UNIT_PORT: OpenFrontUnitType = "Port";
const UNIT_MISSILE_SILO: OpenFrontUnitType = "Missile Silo";
const UNIT_DEFENSE_POST: OpenFrontUnitType = "Defense Post";
const UNIT_SAM_LAUNCHER: OpenFrontUnitType = "SAM Launcher";
const UNIT_CITY: OpenFrontUnitType = "City";
const UNIT_FACTORY: OpenFrontUnitType = "Factory";

const STRUCTURE_TYPE_MAP = {
  [UNIT_CITY]: "City",
  [UNIT_FACTORY]: "Factory",
  [UNIT_PORT]: "Port",
  [UNIT_DEFENSE_POST]: "DefensePost",
  [UNIT_SAM_LAUNCHER]: "SAMLauncher",
  [UNIT_MISSILE_SILO]: "MissileSilo",
} as const satisfies Partial<Record<OpenFrontUnitType, StructureType>>;

const BUILDABLE_STRUCTURE_TYPES = [
  UNIT_CITY,
  UNIT_FACTORY,
  UNIT_PORT,
  UNIT_DEFENSE_POST,
  UNIT_SAM_LAUNCHER,
  UNIT_MISSILE_SILO,
] as const;

type BuildActionCandidate = {
  tile: number;
  structureType: StructureType;
  unitType: OpenFrontUnitType;
  score: number;
  reason: string;
  cost: bigint;
};

function clamp01(value: number): Ratio {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function safeNumberFromBigInt(value: bigint): number {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  const min = BigInt(Number.MIN_SAFE_INTEGER);
  if (value > max) {
    return Number.MAX_SAFE_INTEGER;
  }
  if (value < min) {
    return Number.MIN_SAFE_INTEGER;
  }
  return Number(value);
}

function ratioAgainst(a: number, b: number): Ratio {
  if (a <= 0 && b <= 0) {
    return 0;
  }
  return clamp01(a / Math.max(1, a + b));
}

function structureTypeFromUnitType(unitType: OpenFrontUnitType): StructureType {
  const mapped = (STRUCTURE_TYPE_MAP as Partial<
    Record<OpenFrontUnitType, StructureType>
  >)[unitType];
  if (mapped === undefined) {
    throw new Error(`Unsupported structure unit type: ${unitType}`);
  }
  return mapped;
}

function isPlayer(
  entity: OpenFrontPlayer | OpenFrontTerraNullius,
): entity is OpenFrontPlayer {
  return entity.isPlayer();
}

function relationTypeFor(
  player: OpenFrontPlayer,
  other: OpenFrontPlayer,
): RelationType {
  if (player.id() === other.id()) {
    return "self";
  }
  if (player.isOnSameTeam(other)) {
    return "same_team";
  }
  if (player.isAlliedWith(other)) {
    return "allied";
  }
  if (!player.isFriendly(other)) {
    return "hostile";
  }
  return "neutral";
}

function frontTypeForBorder(
  game: OpenFrontGame,
  myBorderTile: number,
  targetTile: number,
): FrontType {
  return game.isOceanShore(myBorderTile) || game.isOceanShore(targetTile)
    ? "coast"
    : "land";
}

function frontStatusFromPressure(
  myPressure: number,
  enemyPressure: number,
  relation: RelationType,
  neutralTilesAvailable: number,
): FrontStatus {
  if (relation === "terra_nullius" && neutralTilesAvailable > 0) {
    return "opportunity";
  }
  if (enemyPressure > myPressure + 0.15) {
    return "critical";
  }
  if (myPressure > enemyPressure + 0.2) {
    return "opportunity";
  }
  if (Math.abs(myPressure - enemyPressure) < 0.15) {
    return "contested";
  }
  return "safe";
}

function distanceBandFor(game: OpenFrontGame, a: number, b: number): DistanceBand {
  const dist = game.manhattanDist(a, b);
  if (dist <= 1) {
    return "adjacent";
  }
  if (dist <= 8) {
    return "short";
  }
  if (dist <= 20) {
    return "medium";
  }
  return "long";
}

function sampleOwnedTiles(player: OpenFrontPlayer, limit: number): number[] {
  const ownedTiles = Array.from(player.tiles());
  if (ownedTiles.length <= limit) {
    return ownedTiles;
  }

  const sampled: number[] = [];
  const step = Math.max(1, Math.floor(ownedTiles.length / limit));
  for (let i = 0; i < ownedTiles.length; i += step) {
    sampled.push(ownedTiles[i]);
    if (sampled.length >= limit) {
      break;
    }
  }
  return sampled;
}

function candidateTilesForBuilds(player: OpenFrontPlayer): number[] {
  const candidates = new Set<number>();
  for (const tile of player.borderTiles()) {
    candidates.add(tile);
  }
  for (const tile of sampleOwnedTiles(player, 48)) {
    candidates.add(tile);
  }
  const spawnTile = player.spawnTile();
  if (spawnTile !== undefined) {
    candidates.add(spawnTile);
  }
  return Array.from(candidates);
}

function summarizeBuildCandidates(
  player: OpenFrontPlayer,
  game: OpenFrontGame,
): BuildActionCandidate[] {
  const currentPorts = player.unitsOwned(UNIT_PORT);
  const coastalTiles = Array.from(player.borderTiles()).filter((tile) =>
    game.isOceanShore(tile),
  ).length;
  const hasCoast = coastalTiles > 0;
  const hostileNeighbors = player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .filter((neighbor) => !player.isFriendly(neighbor));
  const underAttack = player.incomingAttacks().length > 0;
  const results: BuildActionCandidate[] = [];

  for (const tile of candidateTilesForBuilds(player)) {
    const buildables = player.buildableUnits(tile, BUILDABLE_STRUCTURE_TYPES);
    for (const buildable of buildables) {
      if (buildable.canBuild === false) {
        continue;
      }

      let score = 0.4;
      let reason = `Build ${buildable.type} at tile ${buildable.canBuild}.`;

      switch (buildable.type) {
        case UNIT_PORT:
          score = hasCoast && currentPorts === 0 ? 0.92 : 0.6;
          reason =
            currentPorts === 0
              ? "Unlock naval projection on a coastal border."
              : "Increase coastal mobility and future naval options.";
          break;
        case UNIT_CITY:
          score = player.numTilesOwned() > 0 ? 0.8 : 0.45;
          reason = "Increase troop cap and long-term growth.";
          break;
        case UNIT_FACTORY:
          score = safeNumberFromBigInt(player.gold()) > 0 ? 0.7 : 0.5;
          reason = "Convert stable territory into stronger economy scaling.";
          break;
        case UNIT_DEFENSE_POST:
          score = underAttack || hostileNeighbors.length > 0 ? 0.84 : 0.55;
          reason = "Fortify an active border before committing more troops.";
          break;
        case UNIT_SAM_LAUNCHER:
          score = hostileNeighbors.some(
            (neighbor) => neighbor.unitsOwned(UNIT_MISSILE_SILO) > 0,
          )
            ? 0.88
            : 0.52;
          reason = "Add anti-missile cover to protect clustered assets.";
          break;
        case UNIT_MISSILE_SILO:
          score = player.unitsOwned(UNIT_MISSILE_SILO) === 0 ? 0.58 : 0.42;
          reason = "Prepare strategic weapons pressure for later phases.";
          break;
        default:
          break;
      }

      results.push({
        tile: buildable.canBuild,
        structureType: structureTypeFromUnitType(buildable.type),
        unitType: buildable.type,
        score,
        reason,
        cost: buildable.cost,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const deduped = new Map<string, BuildActionCandidate>();
  for (const candidate of results) {
    const key = `${candidate.structureType}:${candidate.tile}`;
    if (!deduped.has(key)) {
      deduped.set(key, candidate);
    }
  }
  return Array.from(deduped.values()).slice(0, 8);
}

function findUpgradeActions(player: OpenFrontPlayer): ValidAction[] {
  const actions: ValidAction[] = [];

  for (const tile of candidateTilesForBuilds(player)) {
    const buildables = player.buildableUnits(tile, BUILDABLE_STRUCTURE_TYPES);
    for (const buildable of buildables) {
      if (buildable.canUpgrade === false) {
        continue;
      }

      actions.push({
        id: `upgrade_${buildable.canUpgrade}`,
        type: "upgrade_structure",
        label: `Upgrade ${buildable.type} #${buildable.canUpgrade}`,
        structureType: structureTypeFromUnitType(buildable.type),
        unitId: buildable.canUpgrade,
        notes: [
          `Upgrade available from sampled tile ${tile}.`,
          `Estimated cost ${buildable.cost.toString()} gold.`,
        ],
      });
    }
  }

  const deduped = new Map<string, ValidAction>();
  for (const action of actions) {
    deduped.set(action.id, action);
  }
  return Array.from(deduped.values()).slice(0, 5);
}

function findExpandActions(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
): ValidAction[] {
  const candidates = new Map<number, number>();

  for (const borderTile of player.borderTiles()) {
    for (const neighborTile of game.neighbors(borderTile)) {
      if (
        !game.isLand(neighborTile) ||
        game.hasOwner(neighborTile) ||
        game.hasFallout(neighborTile)
      ) {
        continue;
      }

      const score =
        (game.isOceanShore(neighborTile) ? 0.15 : 0) +
        (game.isOceanShore(borderTile) ? 0.1 : 0) +
        0.6;
      const previous = candidates.get(neighborTile) ?? 0;
      candidates.set(neighborTile, Math.max(previous, score));
    }
  }

  return Array.from(candidates.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tile, score]) => ({
      id: `expand_${tile}`,
      type: "expand",
      label: `Expand into neutral tile ${tile}`,
      targetTile: tile,
      distanceBand: "adjacent",
      notes: [
        "Adjacent terra nullius tile on the current border.",
        game.isOceanShore(tile) ? "Tile is coastal." : "Tile is inland.",
      ],
    }));
}

function findLandAttackActions(player: OpenFrontPlayer): ValidAction[] {
  return player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .filter(
      (neighbor) =>
        !player.isFriendly(neighbor) && player.canAttackPlayer(neighbor),
    )
    .sort((a, b) => a.troops() - b.troops())
    .slice(0, 4)
    .map((enemy) => ({
      id: `attack_land_${enemy.id()}`,
      type: "attack_land",
      label: `Attack ${enemy.displayName()} by land`,
      targetPlayerId: enemy.id(),
      frontId: `front_${enemy.id()}`,
      sourceFrontId: `front_${enemy.id()}`,
      estimatedCommitRatio: clamp01(
        0.25 + enemy.troops() / Math.max(1, player.troops()),
      ),
      notes: [
        `Enemy troops ${enemy.troops()}, our troops ${player.troops()}.`,
      ],
    }));
}

function findNavalAttackActions(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
): ValidAction[] {
  const actions: ValidAction[] = [];
  const seenTargets = new Set<number>();
  const hostileNeighborIds = new Set(
    player
      .neighbors()
      .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
      .filter((neighbor) => !player.isFriendly(neighbor))
      .map((neighbor) => neighbor.id()),
  );

  game.forEachTile((tile) => {
    if (actions.length >= 3) {
      return;
    }
    if (!game.isLand(tile) || game.hasFallout(tile)) {
      return;
    }

    const owner = game.owner(tile);
    if (isPlayer(owner)) {
      if (owner.id() === player.id()) {
        return;
      }
      if (player.isFriendly(owner) || hostileNeighborIds.has(owner.id())) {
        return;
      }
    }

    const launchTile = player.canBuild(UNIT_TRANSPORT, tile);
    if (launchTile === false || seenTargets.has(tile)) {
      return;
    }

    seenTargets.add(tile);
    const baseAction = {
      id: `attack_naval_${tile}`,
      type: "attack_naval" as const,
      label: `Launch naval action toward tile ${tile}`,
      launchTile,
      landingTile: tile,
      estimatedCommitRatio: 0.35,
      notes: [
        `Transport launch confirmed from tile ${launchTile}.`,
        isPlayer(owner)
          ? `Offshore target owned by ${owner.displayName()}.`
          : "Offshore neutral landing spot.",
      ],
    };

    actions.push(
      isPlayer(owner)
        ? {
            ...baseAction,
            targetPlayerId: owner.id(),
          }
        : {
            ...baseAction,
            targetPlayerId: "terra_nullius",
          },
    );
  });

  return actions;
}

function findBuildActions(
  player: OpenFrontPlayer,
  game: OpenFrontGame,
): ValidAction[] {
  return summarizeBuildCandidates(player, game).map((candidate) => ({
    id: `build_${candidate.structureType}_${candidate.tile}`,
    type: "build_structure",
    label: `Build ${candidate.structureType} at tile ${candidate.tile}`,
    structureType: candidate.structureType,
    tile: candidate.tile,
    targetFrontType: candidate.structureType === "Port" ? "coast" : "land",
    notes: [candidate.reason, `Estimated cost ${candidate.cost.toString()} gold.`],
  }));
}

function findAssistActions(player: OpenFrontPlayer): ValidAction[] {
  return player
    .allies()
    .filter(
      (ally) =>
        ally.incomingAttacks().length > 0 ||
        ally.troops() < Math.max(1, player.troops() / 2),
    )
    .slice(0, 3)
    .map((ally) => {
      const incomingAttack = ally.incomingAttacks()[0];
      return {
        id: `assist_${ally.id()}`,
        type: "assist_ally",
        label: `Assist ally ${ally.displayName()}`,
        allyPlayerId: ally.id(),
        targetPlayerId: incomingAttack?.attacker().id() ?? null,
        notes: incomingAttack
          ? [`Ally under attack by ${incomingAttack.attacker().displayName()}.`]
          : ["Ally is materially weaker and may need support."],
      };
    });
}

function findTargetActions(player: OpenFrontPlayer): ValidAction[] {
  const currentTargets = new Set(player.targets().map((target) => target.id()));
  return player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .filter(
      (neighbor) =>
        !player.isFriendly(neighbor) &&
        !currentTargets.has(neighbor.id()) &&
        player.canTarget(neighbor),
    )
    .slice(0, 3)
    .map((enemy) => ({
      id: `target_${enemy.id()}`,
      type: "set_target",
      label: `Mark ${enemy.displayName()} as target`,
      targetPlayerId: enemy.id(),
      notes: ["Targeting is allowed by the current diplomacy state."],
    }));
}

function findAllianceActions(player: OpenFrontPlayer): ValidAction[] {
  const actions: ValidAction[] = [];

  for (const request of player.incomingAllianceRequests().slice(0, 3)) {
    const requester = request.requestor();
    actions.push({
      id: `accept_alliance_${requester.id()}`,
      type: "accept_alliance",
      label: `Accept alliance with ${requester.displayName()}`,
      requestingPlayerId: requester.id(),
      targetPlayerId: requester.id(),
      notes: ["Pending alliance request visible in the current state."],
    });
    actions.push({
      id: `reject_alliance_${requester.id()}`,
      type: "reject_alliance",
      label: `Reject alliance with ${requester.displayName()}`,
      requestingPlayerId: requester.id(),
      targetPlayerId: requester.id(),
      notes: ["Alternative to acceptance when alignment is poor."],
    });
  }

  return actions;
}

function findDonationActions(player: OpenFrontPlayer): ValidAction[] {
  const actions: ValidAction[] = [];
  const gold = safeNumberFromBigInt(player.gold());
  const troops = player.troops();

  for (const ally of player.allies().slice(0, 2)) {
    if (player.canDonateGold(ally) && gold >= 250) {
      actions.push({
        id: `donate_gold_${ally.id()}`,
        type: "donate_gold",
        label: `Donate gold to ${ally.displayName()}`,
        allyPlayerId: ally.id(),
        amount: Math.max(100, Math.floor(gold * 0.2)),
        targetPlayerId: ally.id(),
        notes: ["Gold reserve is high enough to share without stalling."],
      });
    }

    if (player.canDonateTroops(ally) && troops >= 400) {
      actions.push({
        id: `donate_troops_${ally.id()}`,
        type: "donate_troops",
        label: `Donate troops to ${ally.displayName()}`,
        allyPlayerId: ally.id(),
        amount: Math.max(100, Math.floor(troops * 0.15)),
        targetPlayerId: ally.id(),
        notes: ["Troop reserve exceeds a conservative support threshold."],
      });
    }
  }

  return actions;
}

function emptyValidActions(): ValidAction[] {
  return [
    {
      id: "wait_default",
      type: "wait",
      label: "Wait",
      notes: ["No action selected yet."],
    },
  ];
}

function buildFronts(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
): BotFront[] {
  const frontStats = new Map<
    number,
    {
      relation: RelationType;
      type: FrontType;
      borderTiles: number;
      neutralTilesAvailable: number;
      enemyPlayer: OpenFrontPlayer | null;
      myClosestTile: number | null;
      enemyClosestTile: number | null;
    }
  >();

  for (const myBorderTile of player.borderTiles()) {
    for (const otherTile of game.neighbors(myBorderTile)) {
      if (
        !game.isLand(otherTile) ||
        game.ownerID(otherTile) === player.smallID()
      ) {
        continue;
      }

      const owner = game.owner(otherTile);
      const key = isPlayer(owner) ? owner.smallID() : 0;
      const relation = isPlayer(owner)
        ? relationTypeFor(player, owner)
        : "terra_nullius";
      const current = frontStats.get(key) ?? {
        relation,
        type: frontTypeForBorder(game, myBorderTile, otherTile),
        borderTiles: 0,
        neutralTilesAvailable: 0,
        enemyPlayer: isPlayer(owner) ? owner : null,
        myClosestTile: myBorderTile,
        enemyClosestTile: otherTile,
      };

      current.borderTiles += 1;
      current.type =
        current.type === "coast" ||
        frontTypeForBorder(game, myBorderTile, otherTile) === "coast"
          ? "coast"
          : current.type;
      if (!game.hasOwner(otherTile)) {
        current.neutralTilesAvailable += 1;
      }
      frontStats.set(key, current);
    }
  }

  const myTroops = player.troops();
  return Array.from(frontStats.entries()).map(([key, stats]) => {
    const enemyTroops = stats.enemyPlayer?.troops() ?? 0;
    const myPressure = ratioAgainst(myTroops, enemyTroops);
    const enemyPressure = ratioAgainst(enemyTroops, myTroops);
    const strategicValue =
      stats.neutralTilesAvailable > 0
        ? 0.82
        : clamp01(0.3 + stats.borderTiles / 12);

    return {
      frontId:
        key === 0 ? "front_terra_nullius" : `front_${stats.enemyPlayer?.id()}`,
      type: stats.type,
      enemyPlayerId: stats.enemyPlayer?.id() ?? null,
      status: frontStatusFromPressure(
        myPressure,
        enemyPressure,
        stats.relation,
        stats.neutralTilesAvailable,
      ),
      myPressure,
      enemyPressure,
      strategicValue,
      neutralTilesAvailable: stats.neutralTilesAvailable,
      distanceToEnemyCore:
        stats.myClosestTile !== null && stats.enemyClosestTile !== null
          ? distanceBandFor(game, stats.myClosestTile, stats.enemyClosestTile)
          : "unknown",
    };
  });
}

function buildNeighbors(player: OpenFrontPlayer): BotNeighbor[] {
  const myTroops = player.troops();
  const neighbors: Array<BotNeighbor | null> = player
    .neighbors()
    .map((neighbor) => {
      if (!isPlayer(neighbor)) {
        return null;
      }

      const relation = relationTypeFor(player, neighbor);
      const vulnerability = clamp01(
        0.5 +
          (myTroops - neighbor.troops()) /
            Math.max(1, myTroops + neighbor.troops()),
      );

      return {
        playerId: neighbor.id(),
        relation,
        reachability: "land",
        troops: neighbor.troops(),
        tilesOwned: neighbor.numTilesOwned(),
        pressureFromOthers: clamp01(
          neighbor
            .incomingAttacks()
            .reduce((sum, attack) => sum + attack.troops(), 0) /
            Math.max(1, neighbor.troops()),
        ),
        vulnerability,
        hasPorts: neighbor.unitsOwned(UNIT_PORT) > 0,
        hasSams: neighbor.unitsOwned(UNIT_SAM_LAUNCHER) > 0,
        hasSilos: neighbor.unitsOwned(UNIT_MISSILE_SILO) > 0,
        isDisconnected: neighbor.isDisconnected(),
        lastSeenTick: null,
      } satisfies BotNeighbor;
    });

  return neighbors.filter((neighbor): neighbor is BotNeighbor => neighbor !== null);
}

function bestBuildCandidatesForState(
  player: OpenFrontPlayer,
  game: OpenFrontGame,
): Array<TileCandidate & { type: StructureType }> {
  return summarizeBuildCandidates(player, game)
    .slice(0, 5)
    .map((candidate) => ({
      tile: candidate.tile,
      type: candidate.structureType,
      score: candidate.score,
      reason: candidate.reason,
    }));
}

function criticalAssetsExposed(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
): string[] {
  const assets = player
    .units(
      UNIT_CITY,
      UNIT_FACTORY,
      UNIT_PORT,
      UNIT_SAM_LAUNCHER,
      UNIT_MISSILE_SILO,
    )
    .filter((unit) =>
      game.neighbors(unit.tile()).some((neighborTile) => {
        if (!game.isLand(neighborTile)) {
          return false;
        }
        const owner = game.owner(neighborTile);
        return isPlayer(owner) && !player.isFriendly(owner);
      }),
    )
    .slice(0, 4);

  return assets.map(
    (unit) =>
      `${structureTypeFromUnitType(unit.type())} at tile ${unit.tile()} is close to a hostile border.`,
  );
}

function buildOpportunities(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
  fronts: BotFront[],
): BotOpportunity[] {
  const opportunities: BotOpportunity[] = [];
  const hostileNeighbors = player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .filter((neighbor) => !player.isFriendly(neighbor));

  const terraFront = fronts.find((front) => front.enemyPlayerId === null);
  if (terraFront && terraFront.neutralTilesAvailable > 0) {
    opportunities.push({
      type: "expand_into_terra_nullius",
      signalStrength: clamp01(
        terraFront.neutralTilesAvailable / Math.max(1, player.borderTiles().size),
      ),
      frontId: terraFront.frontId,
      targetPlayerId: null,
      linkedActionIds: findExpandActions(game, player).map((action) => action.id),
    });
  }

  const weakNeighbor = hostileNeighbors
    .slice()
    .sort((a, b) => a.troops() - b.troops())[0];
  if (weakNeighbor && weakNeighbor.troops() < player.troops()) {
    opportunities.push({
      type: "attack_weak_neighbor",
      signalStrength: clamp01(
        0.55 +
          player.troops() / Math.max(1, player.troops() + weakNeighbor.troops()),
      ),
      frontId: `front_${weakNeighbor.id()}`,
      targetPlayerId: weakNeighbor.id(),
      linkedActionIds: [`attack_land_${weakNeighbor.id()}`],
    });
  }

  if (player.unitsOwned(UNIT_PORT) === 0) {
    const coastalBorder = Array.from(player.borderTiles()).some((tile) =>
      game.isOceanShore(tile),
    );
    if (coastalBorder) {
      opportunities.push({
        type: "build_port_for_offshore_access",
        signalStrength: clamp01(coastalBorder ? 0.75 : 0),
        frontId: null,
        targetPlayerId: null,
        linkedActionIds: summarizeBuildCandidates(player, game)
          .filter((candidate) => candidate.structureType === "Port")
          .slice(0, 2)
          .map((candidate) => `build_Port_${candidate.tile}`),
      });
    }
  }

  const pressuredAlly = player
    .allies()
    .find((ally) => ally.incomingAttacks().length > 0);
  if (pressuredAlly) {
    opportunities.push({
      type: "assist_ally_under_attack",
      signalStrength: clamp01(
        pressuredAlly.incomingAttacks().reduce((sum, attack) => sum + attack.troops(), 0) /
          Math.max(1, pressuredAlly.troops()),
      ),
      frontId: `front_${pressuredAlly.id()}`,
      targetPlayerId: pressuredAlly.id(),
      linkedActionIds: [`assist_${pressuredAlly.id()}`],
    });
  }

  return opportunities.slice(0, 5);
}

function buildThreats(
  game: OpenFrontGame,
  player: OpenFrontPlayer,
  fronts: BotFront[],
): BotThreat[] {
  const threats: BotThreat[] = [];
  const incomingTroops = player
    .incomingAttacks()
    .reduce((sum, attack) => sum + attack.troops(), 0);

  if (incomingTroops > 0) {
    threats.push({
      type: "major_incoming_attack",
      severity: clamp01(incomingTroops / Math.max(1, player.troops())),
      frontId: null,
      targetPlayerId: null,
    });
  }

  const strongerNeighbor = player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .filter((neighbor) => !player.isFriendly(neighbor))
    .find((neighbor) => neighbor.troops() > player.troops() * 1.15);
  if (strongerNeighbor) {
    threats.push({
      type: "border_enemy_stronger_than_me",
      severity: clamp01(
        strongerNeighbor.troops() /
          Math.max(1, player.troops() + strongerNeighbor.troops()),
      ),
      frontId: `front_${strongerNeighbor.id()}`,
      targetPlayerId: strongerNeighbor.id(),
    });
  }

  const exposedAssets = criticalAssetsExposed(game, player);
  if (exposedAssets.length > 0) {
    threats.push({
      type: "critical_asset_exposed",
      severity: clamp01(exposedAssets.length / 4),
      frontId: null,
      targetPlayerId: null,
    });
  }

  const hostileWithSilo = player
    .neighbors()
    .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
    .some(
      (neighbor) =>
        !player.isFriendly(neighbor) &&
        neighbor.unitsOwned(UNIT_MISSILE_SILO) > 0,
    );
  if (hostileWithSilo) {
    threats.push({
      type: "nuclear_threat",
      severity: 0.7,
      frontId: null,
      targetPlayerId: null,
    });
  }

  const hostileFronts = fronts.filter(
    (front) => front.enemyPlayerId !== null && front.status !== "safe",
  );
  if (hostileFronts.length >= 3 && player.troops() < player.numTilesOwned() / 2) {
    threats.push({
      type: "front_overextended",
      severity: clamp01(hostileFronts.length / 5),
      frontId: hostileFronts[0]?.frontId ?? null,
      targetPlayerId: hostileFronts[0]?.enemyPlayerId ?? null,
    });
  }

  return threats.slice(0, 5);
}

function mapArchetype(mapName: string, coastalImportance: number): MapArchetype {
  const name = mapName.toLowerCase();
  if (
    name.includes("strait") ||
    name.includes("passage") ||
    name.includes("gibraltar") ||
    name.includes("bosphorus")
  ) {
    return "chokepoint";
  }
  if (
    name.includes("island") ||
    name.includes("iceland") ||
    name.includes("hawaii") ||
    name.includes("japan")
  ) {
    return "island";
  }
  if (
    name.includes("europe") ||
    name.includes("north america") ||
    name.includes("south america") ||
    name.includes("world")
  ) {
    return "continental";
  }
  if (coastalImportance >= 0.55) {
    return "maritime";
  }
  return "regional";
}

function summarizeStrategy(
  player: OpenFrontPlayer,
  opportunities: BotOpportunity[],
  threats: BotThreat[],
): string[] {
  const summary: string[] = [];

  if (opportunities.some((entry) => entry.type === "expand_into_terra_nullius")) {
    summary.push("Neutral expansion is available on the current border.");
  }
  if (
    opportunities.some((entry) => entry.type === "build_port_for_offshore_access")
  ) {
    summary.push("A port build would unlock meaningful naval projection.");
  }
  if (threats.some((entry) => entry.type === "major_incoming_attack")) {
    summary.push(
      "Incoming attack pressure is materially high on the current position.",
    );
  }
  if (player.allies().length > 0) {
    summary.push(
      `Diplomatic state is active with ${player.allies().length} allied player(s).`,
    );
  }
  if (summary.length === 0) {
    summary.push(
      "No singular forcing event detected in the current snapshot.",
    );
  }

  return summary.slice(0, 4);
}

export class OpenFrontValidActionProducer
  implements ValidActionProducer<OpenFrontGame, OpenFrontPlayer>
{
  produce(
    input: OpenFrontAdapterDependencies<OpenFrontGame, OpenFrontPlayer>,
  ): ValidAction[] {
    const { game, player } = input;
    const actions = [
      ...emptyValidActions(),
      ...findExpandActions(game, player),
      ...findLandAttackActions(player),
      ...findNavalAttackActions(game, player),
      ...findBuildActions(player, game),
      ...findUpgradeActions(player),
      ...findAssistActions(player),
      ...findTargetActions(player),
      ...findAllianceActions(player),
      ...findDonationActions(player),
    ];

    const deduped = new Map<string, ValidAction>();
    for (const action of actions) {
      deduped.set(action.id, action);
    }

    return Array.from(deduped.values());
  }
}

export class StaticValidActionProducer<TGame = unknown, TPlayer = unknown>
  implements ValidActionProducer<TGame, TPlayer>
{
  produce(_input: OpenFrontAdapterDependencies<TGame, TPlayer>): ValidAction[] {
    return emptyValidActions();
  }
}

export class OpenFrontSnapshotAdapter
  implements BotObservationProducer<OpenFrontGame, OpenFrontPlayer>
{
  constructor(
    private readonly validActionProducer: ValidActionProducer<
      OpenFrontGame,
      OpenFrontPlayer
    > = new OpenFrontValidActionProducer(),
  ) {}

  produce(
    input: OpenFrontAdapterDependencies<OpenFrontGame, OpenFrontPlayer>,
  ): BotObservationV1 {
    const { game, player } = input;
    const validActions = this.validActionProducer.produce(input);
    const maxTroopsEstimate = game.config().maxTroops(player);
    const goldPerTick = safeNumberFromBigInt(game.config().goldAdditionRate(player));
    const incomingAttackPressure = clamp01(
      player
        .incomingAttacks()
        .reduce((sum, attack) => sum + attack.troops(), 0) /
        Math.max(1, maxTroopsEstimate),
    );
    const outgoingAttackPressure = clamp01(
      player
        .outgoingAttacks()
        .reduce((sum, attack) => sum + attack.troops(), 0) /
        Math.max(1, maxTroopsEstimate),
    );
    const neighbors = buildNeighbors(player);
    const fronts = buildFronts(game, player);
    const buildCandidates = summarizeBuildCandidates(player, game);
    const opportunities = buildOpportunities(game, player, fronts);
    const threats = buildThreats(game, player, fronts);
    const coastalTiles = Array.from(player.borderTiles()).filter((tile) =>
      game.isOceanShore(tile),
    ).length;
    const coastalImportance = clamp01(
      coastalTiles / Math.max(1, player.borderTiles().size),
    );
    const hostileNeighbors = neighbors.filter(
      (neighbor) => neighbor.relation === "hostile",
    );

    return {
      observationVersion: BOT_OBSERVATION_VERSION,
      rulesVersion: BOT_RULES_VERSION,
      validActionsVersion: VALID_ACTIONS_VERSION,
      mapVersion: input.context.mapVersion,
      visibilityMode: "player_information",
      match: {
        ...input.context.match,
        tick: game.ticks(),
        mode:
          game.config().gameConfig().gameMode === "Team" ? "team" : "ffa",
      },
      player: {
        id: player.id(),
        team: player.team(),
        alive: player.isAlive(),
        tilesOwned: player.numTilesOwned(),
        gold: safeNumberFromBigInt(player.gold()),
        troops: player.troops(),
        maxTroopsEstimate,
        reserveRatio: clamp01(player.troops() / Math.max(1, maxTroopsEstimate)),
        spawned: player.hasSpawned(),
        isDisconnected: player.isDisconnected(),
      },
      economy: {
        incomeEstimate: goldPerTick,
        floatingGoldRisk: clamp01(
          safeNumberFromBigInt(player.gold()) /
            Math.max(
              250,
              buildCandidates[0]
                ? safeNumberFromBigInt(buildCandidates[0].cost)
                : 250,
            ),
        ),
        expansionPotential: clamp01(
          fronts
            .filter((front) => front.enemyPlayerId === null)
            .reduce((sum, front) => sum + front.neutralTilesAvailable, 0) /
            Math.max(1, player.borderTiles().size),
        ),
        infrastructureBalance:
          player.unitsOwned(UNIT_CITY) === 0
            ? "underbuilt"
            : buildCandidates.length >= 3
              ? "balanced"
              : "overbuilt",
      },
      military: {
        incomingAttackPressure,
        outgoingAttackPressure,
        landPressure: clamp01(hostileNeighbors.length / Math.max(1, neighbors.length)),
        navalPressure:
          coastalImportance > 0 && player.unitsOwned(UNIT_PORT) === 0 ? 0.45 : 0,
        nuclearThreatLevel: threats.some((entry) => entry.type === "nuclear_threat")
          ? 0.7
          : 0,
        canProjectNaval:
          player.unitsOwned(UNIT_PORT) > 0 ||
          validActions.some((action) => action.type === "attack_naval"),
      },
      diplomacy: {
        allies: player.allies().map((ally) => ally.id()),
        sameTeam: player
          .neighbors()
          .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
          .filter((neighbor) => player.isOnSameTeam(neighbor))
          .map((neighbor) => neighbor.id()),
        targets: player.targets().map((target) => target.id()),
        allianceRequestsIncoming: player
          .incomingAllianceRequests()
          .map((request) => request.requestor().id()),
        allianceRequestsOutgoing: player
          .outgoingAllianceRequests()
          .map((request) => request.recipient().id()),
        donationOpportunities: player
          .allies()
          .filter(
            (ally) =>
              player.canDonateGold(ally) || player.canDonateTroops(ally),
          )
          .map((ally) => ally.id()),
        betrayalRiskEstimate: clamp01(
          player
            .neighbors()
            .filter((neighbor): neighbor is OpenFrontPlayer => isPlayer(neighbor))
            .filter(
              (neighbor) => player.relation(neighbor) <= RELATION_DISTRUSTFUL,
            )
            .length / Math.max(1, neighbors.length),
        ),
      },
      mapProfile: {
        archetype: mapArchetype(input.context.match.mapName, coastalImportance),
        coastalImportance,
        navalRelevance: clamp01(
          coastalImportance + (player.unitsOwned(UNIT_PORT) > 0 ? 0.25 : 0),
        ),
        frontComplexity: clamp01(fronts.length / 6),
        neutralExpansionPotential: clamp01(
          fronts
            .filter((front) => front.enemyPlayerId === null)
            .reduce((sum, front) => sum + front.neutralTilesAvailable, 0) / 8,
        ),
        chokepointDensity: clamp01(
          1 - player.borderTiles().size / Math.max(1, player.numTilesOwned()),
        ),
      },
      neighbors,
      fronts,
      structures: {
        cities: player.unitsOwned(UNIT_CITY),
        factories: player.unitsOwned(UNIT_FACTORY),
        ports: player.unitsOwned(UNIT_PORT),
        defensePosts: player.unitsOwned(UNIT_DEFENSE_POST),
        sams: player.unitsOwned(UNIT_SAM_LAUNCHER),
        silos: player.unitsOwned(UNIT_MISSILE_SILO),
        criticalAssetsExposed: criticalAssetsExposed(game, player),
        bestBuildCandidates: bestBuildCandidatesForState(player, game),
      },
      opportunities,
      threats,
      recentEvents: [],
      strategicSummary: summarizeStrategy(player, opportunities, threats),
      validActions,
    };
  }
}

export interface ControlRoomSnapshotInput {
  match: MatchRef;
  mode?: "competitive_mode" | "interactive_mode" | "debug_mode";
}

export class ControlRoomSnapshotAdapter<TState = unknown>
  implements ControlRoomStateProducer<TState>
{
  constructor(private readonly baseMatch: MatchRef) {}

  produce(_state: TState): ControlRoomStateV1 {
    return {
      controlRoomStateVersion: CONTROL_ROOM_STATE_VERSION,
      mode: "competitive_mode",
      match: this.baseMatch,
      players: [],
      mapState: {
        highlightedFronts: [],
        liveTerritorySummary: [],
        liveEvents: [],
        focusPlayerId: null,
        focusTile: null,
      },
      botDecisions: [],
      operatorQuestions: [],
      operatorAnswers: [],
      commentatorSummaries: [],
    };
  }
}
