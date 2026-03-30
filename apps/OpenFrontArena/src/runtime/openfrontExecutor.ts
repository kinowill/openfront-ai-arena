import { AllianceRejectExecution } from "../../../OpenFrontIO/src/core/execution/alliance/AllianceRejectExecution";
import { AllianceRequestExecution } from "../../../OpenFrontIO/src/core/execution/alliance/AllianceRequestExecution";
import { BreakAllianceExecution } from "../../../OpenFrontIO/src/core/execution/alliance/BreakAllianceExecution";
import { AttackExecution } from "../../../OpenFrontIO/src/core/execution/AttackExecution";
import { ConstructionExecution } from "../../../OpenFrontIO/src/core/execution/ConstructionExecution";
import { DonateGoldExecution } from "../../../OpenFrontIO/src/core/execution/DonateGoldExecution";
import { DonateTroopsExecution } from "../../../OpenFrontIO/src/core/execution/DonateTroopExecution";
import { SpawnExecution } from "../../../OpenFrontIO/src/core/execution/SpawnExecution";
import { TargetPlayerExecution } from "../../../OpenFrontIO/src/core/execution/TargetPlayerExecution";
import { TransportShipExecution } from "../../../OpenFrontIO/src/core/execution/TransportShipExecution";
import { UpgradeStructureExecution } from "../../../OpenFrontIO/src/core/execution/UpgradeStructureExecution";
import {
  type Game,
  type Player,
  UnitType,
} from "../../../OpenFrontIO/src/core/game/Game";
import type { StructureType } from "../contracts/shared";
import type { ValidAction } from "../contracts/validActions";

export interface OpenFrontExecutionResult {
  accepted: boolean;
  executedActionId: string;
  summary: string;
  ticksAdvanced: number;
  executionKind: string;
}

function structureTypeToUnitType(structureType: StructureType): UnitType {
  switch (structureType) {
    case "City":
      return UnitType.City;
    case "Factory":
      return UnitType.Factory;
    case "Port":
      return UnitType.Port;
    case "DefensePost":
      return UnitType.DefensePost;
    case "SAMLauncher":
      return UnitType.SAMLauncher;
    case "MissileSilo":
      return UnitType.MissileSilo;
  }
}

function advanceTicks(game: Game, ticks: number): void {
  for (let i = 0; i < ticks; i++) {
    game.executeNextTick();
  }
}

function defaultAttackTroops(player: Player, ratio = 0.3): number {
  return Math.max(1, Math.floor(player.troops() * ratio));
}

export class OpenFrontActionExecutor {
  constructor(
    private readonly game: Game,
    private readonly defaultTicksPerAction: number = 1,
  ) {}

  execute(player: Player, action: ValidAction): OpenFrontExecutionResult {
    try {
      switch (action.type) {
        case "spawn":
          this.game.addExecution(
            new SpawnExecution("local-harness", player.info(), action.targetTile),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Spawn queued at tile ${action.targetTile}.`,
            ticksAdvanced: 1,
            executionKind: "spawn",
          };
        case "wait":
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: "No-op tick advanced.",
            ticksAdvanced: 1,
            executionKind: "wait",
          };

        case "expand":
          this.game.addExecution(
            new AttackExecution(
              defaultAttackTroops(player, 0.18),
              player,
              this.game.terraNullius().id(),
              null,
            ),
          );
          advanceTicks(this.game, this.defaultTicksPerAction);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Expand triggered toward terra nullius from target tile ${action.targetTile}.`,
            ticksAdvanced: this.defaultTicksPerAction,
            executionKind: "attack_terra_nullius",
          };

        case "attack_land":
          if (!this.game.hasPlayer(action.targetPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Land attack rejected: target ${action.targetPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "attack_land_invalid_target",
            };
          }
          this.game.addExecution(
            new AttackExecution(
              defaultAttackTroops(player, action.estimatedCommitRatio ?? 0.28),
              player,
              action.targetPlayerId,
              null,
            ),
          );
          advanceTicks(this.game, this.defaultTicksPerAction);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Land attack queued against ${action.targetPlayerId}.`,
            ticksAdvanced: this.defaultTicksPerAction,
            executionKind: "attack_land",
          };

        case "attack_naval":
          this.game.addExecution(
            new TransportShipExecution(
              player,
              action.landingTile ?? action.launchTile,
              defaultAttackTroops(player, action.estimatedCommitRatio ?? 0.2),
            ),
          );
          advanceTicks(this.game, this.defaultTicksPerAction);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Naval attack queued toward tile ${action.landingTile ?? action.launchTile}.`,
            ticksAdvanced: this.defaultTicksPerAction,
            executionKind: "attack_naval",
          };

        case "build_structure":
          this.game.addExecution(
            new ConstructionExecution(
              player,
              structureTypeToUnitType(action.structureType),
              action.tile,
            ),
          );
          advanceTicks(this.game, 4);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Construction queued for ${action.structureType} on tile ${action.tile}.`,
            ticksAdvanced: 4,
            executionKind: "build_structure",
          };

        case "upgrade_structure":
          this.game.addExecution(
            new UpgradeStructureExecution(player, action.unitId),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Upgrade queued for structure #${action.unitId}.`,
            ticksAdvanced: 1,
            executionKind: "upgrade_structure",
          };

        case "assist_ally": {
          if (!this.game.hasPlayer(action.allyPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Assist action rejected: ally ${action.allyPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "assist_ally_invalid_target",
            };
          }
          const ally = this.game.player(action.allyPlayerId);
          if (player.canDonateTroops(ally)) {
            this.game.addExecution(
              new DonateTroopsExecution(
                player,
                ally.id(),
                Math.max(100, Math.floor(player.troops() * 0.12)),
              ),
            );
            advanceTicks(this.game, 1);
            return {
              accepted: true,
              executedActionId: action.id,
              summary: `Troop assistance queued for ally ${ally.id()}.`,
              ticksAdvanced: 1,
              executionKind: "donate_troops",
            };
          }
          if (player.canDonateGold(ally)) {
            this.game.addExecution(
              new DonateGoldExecution(
                player,
                ally.id(),
                Math.max(100, Math.floor(Number(player.gold()) * 0.15)),
              ),
            );
            advanceTicks(this.game, 1);
            return {
              accepted: true,
              executedActionId: action.id,
              summary: `Gold assistance queued for ally ${ally.id()}.`,
              ticksAdvanced: 1,
              executionKind: "donate_gold",
            };
          }
          return {
            accepted: false,
            executedActionId: action.id,
            summary: `Assist action rejected: no valid donation path for ally ${action.allyPlayerId}.`,
            ticksAdvanced: 0,
            executionKind: "assist_ally_unavailable",
          };
        }

        case "set_target":
          if (!this.game.hasPlayer(action.targetPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Target action rejected: target ${action.targetPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "set_target_invalid_target",
            };
          }
          this.game.addExecution(
            new TargetPlayerExecution(player, action.targetPlayerId),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Target marker queued for ${action.targetPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "set_target",
          };

        case "accept_alliance":
          if (!this.game.hasPlayer(action.requestingPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Alliance acceptance rejected: player ${action.requestingPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "accept_alliance_invalid_target",
            };
          }
          this.game.addExecution(
            new AllianceRequestExecution(player, action.requestingPlayerId),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Alliance acceptance path queued for ${action.requestingPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "accept_alliance",
          };

        case "reject_alliance":
          if (!this.game.hasPlayer(action.requestingPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Alliance rejection rejected: player ${action.requestingPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "reject_alliance_invalid_target",
            };
          }
          this.game.addExecution(
            new AllianceRejectExecution(action.requestingPlayerId, player),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Alliance rejection queued for ${action.requestingPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "reject_alliance",
          };

        case "break_alliance":
          if (!this.game.hasPlayer(action.alliedPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Break alliance rejected: player ${action.alliedPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "break_alliance_invalid_target",
            };
          }
          this.game.addExecution(
            new BreakAllianceExecution(player, action.alliedPlayerId),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Alliance break queued for ${action.alliedPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "break_alliance",
          };

        case "donate_gold":
          if (!this.game.hasPlayer(action.allyPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Gold donation rejected: ally ${action.allyPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "donate_gold_invalid_target",
            };
          }
          this.game.addExecution(
            new DonateGoldExecution(player, action.allyPlayerId, action.amount),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Gold donation queued for ${action.allyPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "donate_gold",
          };

        case "donate_troops":
          if (!this.game.hasPlayer(action.allyPlayerId)) {
            return {
              accepted: false,
              executedActionId: action.id,
              summary: `Troop donation rejected: ally ${action.allyPlayerId} not found.`,
              ticksAdvanced: 0,
              executionKind: "donate_troops_invalid_target",
            };
          }
          this.game.addExecution(
            new DonateTroopsExecution(
              player,
              action.allyPlayerId,
              action.amount,
            ),
          );
          advanceTicks(this.game, 1);
          return {
            accepted: true,
            executedActionId: action.id,
            summary: `Troop donation queued for ${action.allyPlayerId}.`,
            ticksAdvanced: 1,
            executionKind: "donate_troops",
          };
      }
    } catch (error) {
      return {
        accepted: false,
        executedActionId: action.id,
        summary:
          error instanceof Error
            ? `Execution failed: ${error.message}`
            : "Execution failed with unknown error.",
        ticksAdvanced: 0,
        executionKind: "runtime_error",
      };
    }
  }
}
