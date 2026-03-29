# Progress Log

## 2026-03-29

### Ce qui a Ã©tÃ© fait

- Branchement rÃ©el du `snapshotAdapter` OpenFront sur un `Game` et un `Player`.
- Ajout de types d'adaptation OpenFront concrets dans `src/adapters/openfront/types.ts`.
- Remplacement du snapshot placeholder par une observation calculÃ©e depuis le moteur dans `src/adapters/openfront/snapshotAdapter.ts`.
- Production d'un `bot_observation_v1` avec :
  - `player`
  - `economy`
  - `military`
  - `diplomacy`
  - `mapProfile`
  - `neighbors`
  - `fronts`
  - `structures`
  - `opportunities`
  - `threats`
  - `strategicSummary`
  - `validActions`
- Ajout d'un premier gÃ©nÃ©rateur non statique de `valid_actions`.
- Couverture actuelle des actions :
  - `wait`
  - `expand`
  - `attack_land`
  - `attack_naval`
  - `build_structure`
  - `upgrade_structure`
  - `assist_ally`
  - `set_target`
  - `accept_alliance`
  - `reject_alliance`
  - `donate_gold`
  - `donate_troops`
- CrÃ©ation d'un module `src/bots/`.
- Ajout d'un contrat de bot runtime dans `src/bots/types.ts`.
- Ajout d'helpers de ranking/sÃ©lection d'actions dans `src/bots/actionSelection.ts`.
- Ajout d'un premier bot baseline dÃ©terministe :
  - `src/bots/GreedyExpandBot.ts`
- Export du module bots depuis `src/index.ts`.

### Ce qui est maintenant vrai

- le projet n'est plus seulement documentaire ;
- un adaptateur moteur read-only existe vraiment ;
- un premier `valid_actions v1` existe vraiment ;
- un baseline `GreedyExpandBot` existe vraiment ;
- l'architecture est maintenant prÃªte Ã  accueillir un backend `local-llm` ou `remote-api` sans changer le contrat de dÃ©cision.

### Ce qui manque encore

- un petit harness exÃ©cutable pour instancier le snapshot sur une vraie partie ;
- un action arbiter/executor qui traduit `selected_action_id` en exÃ©cution OpenFront ;
- une boucle `observation -> decision -> execution` par tick ;
- un runtime `local-llm` ;
- un runtime `remote-api` ;
- des logs de tick ;
- des tests ou une vÃ©rification TypeScript locale.

### Point de vigilance

- Le workspace ne contient pas de compilateur TypeScript directement utilisable pour ce sous-projet.
- La cohÃ©rence a Ã©tÃ© vÃ©rifiÃ©e par lecture et recoupement de types, mais pas encore par un `tsc` local.

## 2026-03-28

### Décisions prises

- Le projet cible est une `AI Arena` pour OpenFrontIO.
- Le moteur OpenFrontIO reste la source de vérité mécanique.
- Les modèles doivent garder une liberté stratégique réelle.
- Les actions concrètes doivent rester bornées et validées.
- Le protocole recommandé côté LLM est :
  - `strategic_goal`
  - `tactical_reason`
  - `selected_action_id`
- La comparaison entre bots doit être reproductible et versionnée.

### Ce qui a été fait

- Clonage local du dépôt OpenFrontIO dans le workspace.
- Inspection des fichiers clés du moteur :
  - `docs/Architecture.md`
  - `src/core/game/Game.ts`
  - `src/core/game/GameView.ts`
  - `src/core/game/GameUpdates.ts`
  - `src/core/execution/utils/AiAttackBehavior.ts`
  - `src/core/execution/nation/NationStructureBehavior.ts`
- Création du sous-projet documentaire `OpenFrontArena/`.
- Mise en place d'une base de cadrage :
  - vision produit
  - règles
  - observation
  - action model
  - architecture d'intégration
  - arène
  - métriques
  - roadmap
- Ajout d'une couche spécifique sur la liberté stratégique du modèle.
- Début d'une base de connaissance stratégique :
  - structures
  - styles de jeu
  - provenance et confiance des sources
- Extension de la base stratégique :
  - diplomatie
  - naval/côtier
  - nucléaire/SAM
  - phases de partie
  - archétypes de cartes
- Rédaction d'un premier schéma concret `observation-schema-v1.md`.
- Ajout d'une exigence produit supplémentaire :
  - interface locale de supervision live
  - interaction opérateur avec les bots
  - résumé/commentateur IA périodique
- Ajout d'une première spec dédiée :
  - `docs/local-control-room.md`
- Début de la phase technique :
  - création des contrats TypeScript dans `src/contracts/`
  - `botObservation.ts`
  - `validActions.ts`
  - `controlRoomState.ts`
  - `shared.ts`
  - `index.ts`
- Création d'un premier squelette technique :
  - `src/adapters/openfront/types.ts`
  - `src/adapters/openfront/snapshotAdapter.ts`
  - `src/control-room/streams/contracts.ts`
  - `src/index.ts`

### Documents actuellement présents

- `README.md`
- `docs/vision.md`
- `docs/game-mechanics.md`
- `docs/openfront-source-notes.md`
- `docs/observation-model.md`
- `docs/action-model.md`
- `docs/map-encoding.md`
- `docs/integration-architecture.md`
- `docs/arena-spec.md`
- `docs/metrics.md`
- `docs/rules-contract.md`
- `docs/strategy-framework.md`
- `docs/strategy-knowledge-pack.md`
- `docs/buildings-and-infrastructure.md`
- `docs/strategic-playstyles.md`
- `docs/alliances-and-diplomacy.md`
- `docs/naval-and-coastal-play.md`
- `docs/nukes-and-sam-play.md`
- `docs/openings-and-game-phases.md`
- `docs/map-archetypes.md`
- `docs/sources-and-confidence.md`
- `docs/observation-schema-v1.md`
- `docs/local-control-room.md`
- `docs/progress-log.md`
- `docs/session-handoff.md`
- `docs/roadmap.md`
- `prompts/system-fr.md`

### Ce qui est clarifié

- Le problème initial n'est pas un manque d'accès au moteur.
- Le vrai besoin est une projection d'état plus intelligente pour les bots.
- Le bot ne doit pas piloter l'UI.
- Le bot doit raisonner sur :
  - fronts
  - voisins
  - structures
  - opportunités
  - menaces
  - styles de jeu
- Une simple liste de `valid_actions` ne suffit pas seule.
- Il faut laisser au modèle une capacité d'intention et de style.

### Ce qui n'est pas encore implémenté

- aucun adapter runtime ;
- aucune extraction réelle d'observation depuis OpenFrontIO ;
- aucun générateur de `valid_actions` ;
- aucun bot baseline exécutable ;
- aucun backend local/API branché ;
- aucune boucle d'arène exécutable ;
- aucun replay spécifique bots ;
- aucune interface locale exécutable.
- aucun adaptateur branché au vrai `Game` OpenFrontIO.

### Dette documentaire actuelle

Les documents de stratégie sont bien cadrés mais encore incomplets.

Il manque notamment :

- openings ;
- heuristiques par mode de jeu.
- dictionnaire détaillé des `valid_actions` ;
- exemples d'observation sur de vrais états de partie ;
- traduction de l'observation v1 en types concrets côté code.
- contrat `control_room_state_v1` ;
- séparation claire entre flux bot, flux opérateur et flux commentateur.
- branchement réel du snapshot adapter au moteur ;
- premier générateur non statique de `valid_actions`.

Statut :

- la traduction en types concrets a commencé ;
- il reste maintenant à coder les producteurs de ces contrats.

### Point d'attention

L'affichage PowerShell du contenu texte montre parfois des caractères mal encodés.
Les fichiers écrits dans le projet doivent être conservés en UTF-8.
