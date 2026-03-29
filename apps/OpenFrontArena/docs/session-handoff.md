# Session Handoff

## État du projet

Le projet est encore en pré-implémentation, mais il possède maintenant une base documentaire solide et un premier socle de contrats TypeScript.

Le dépôt `OpenFrontIO` est présent localement dans :

- `C:\Users\ArtLi\Desktop\ETPS\projet 4\apps\OpenFrontIO`

Le sous-projet de cadrage bots est ici :

- `C:\Users\ArtLi\Desktop\ETPS\projet 4\apps\OpenFrontArena`

## Intention générale

Construire un système de bots IA pour OpenFrontIO qui :

- respecte strictement les mécaniques du jeu ;
- laisse une vraie liberté stratégique aux modèles ;
- permet la comparaison propre entre bots locaux, API et scriptés ;
- fournit une interface locale de supervision live.

## Décisions à conserver

### 1. Source de vérité

La vérité mécanique doit venir :

- d'abord du code OpenFrontIO ;
- ensuite des tests ;
- ensuite des sources communautaires pour la pédagogie et les heuristiques.

### 2. Forme de décision des bots

Le meilleur compromis retenu jusqu'ici :

```json
{
  "strategic_goal": "prepare_naval_access",
  "tactical_reason": "No port built while an offshore weak target exists.",
  "selected_action_id": "act_0027",
  "confidence": 0.82
}
```

### 3. Philosophie produit

- liberté stratégique oui ;
- liberté mécanique non ;
- plusieurs actions valides oui ;
- action libre non bornée seulement si nécessaire pour des bots internes fiables.

### 4. Nouvelle exigence produit

Prévoir une `Local Control Room` capable de :

- voir la partie en direct ;
- suivre les stats ;
- lire les décisions des bots ;
- poser des questions aux bots ;
- afficher un commentaire IA périodique.

## Prochaines étapes recommandées

Ordre conseillé :

1. enrichir la base documentaire de stratégie avec davantage d'exemples et de détails ;
2. implémenter les producteurs des contrats TypeScript déjà créés ;
3. définir plus finement le contenu calculé de `valid_actions` v1 ;
4. implémenter un adapter OpenFront minimal ;
5. implémenter un bot baseline `GreedyExpandBot` ;
6. brancher un runtime LLM simple avec `selected_action_id` ;
7. préparer le contrat de flux pour la `Local Control Room`.

## Tâches prioritaires documentaires

Les fichiers suivants ont été créés :

- `docs/alliances-and-diplomacy.md`
- `docs/naval-and-coastal-play.md`
- `docs/nukes-and-sam-play.md`
- `docs/openings-and-game-phases.md`
- `docs/map-archetypes.md`

Le schéma d'observation v1 existe aussi :

- `docs/observation-schema-v1.md`

Et les contrats TypeScript existent dans :

- `src/contracts/shared.ts`
- `src/contracts/validActions.ts`
- `src/contracts/botObservation.ts`
- `src/contracts/controlRoomState.ts`
- `src/contracts/index.ts`

Un premier squelette technique existe aussi :

- `src/adapters/openfront/types.ts`
- `src/adapters/openfront/snapshotAdapter.ts`
- `src/control-room/streams/contracts.ts`
- `src/index.ts`

## Tâches prioritaires techniques

### Adapter

Créer un premier adaptateur qui sait produire pour un joueur :

- résumé joueur ;
- voisins ;
- fronts ;
- structures ;
- menaces ;
- opportunités ;
- événements récents ;
- `valid_actions`.

Premier point d'entrée recommandé :

- un adaptateur read-only qui ne fait encore qu'un snapshot d'observation.

Statut :

- un snapshot adapter minimal existe ;
- il retourne encore un état mostly placeholder ;
- il sert maintenant de point de branchement concret au moteur.

### Action space

Définir une première génération de `valid_actions` couvrant :

- `wait`
- `expand`
- `attack_land`
- `attack_naval`
- `build_structure`
- `assist_ally`

### Baseline

Créer d'abord un bot non LLM.

Pourquoi :

- valider la chaîne observation -> décision -> action ;
- disposer d'un point de comparaison ;
- distinguer les problèmes de protocole des problèmes de modèle.

### Control Room

Définir ensuite deux contrats séparés :

- `bot_observation_v1`
- `control_room_state_v1`

Le second pourra être plus riche et plus global que le premier.

Le contrat TypeScript `control_room_state_v1` existe maintenant, mais aucun producteur n'est encore codé.

Un contrat de flux de stream existe aussi pour la Control Room, mais aucun transport live n'est branché.

## Références locales à relire en priorité

- `OpenFrontIO/docs/Architecture.md`
- `OpenFrontIO/src/core/game/Game.ts`
- `OpenFrontIO/src/core/game/GameView.ts`
- `OpenFrontIO/src/core/game/GameUpdates.ts`
- `OpenFrontIO/src/core/execution/utils/AiAttackBehavior.ts`
- `OpenFrontIO/src/core/execution/nation/NationStructureBehavior.ts`

## Ce qu'il ne faut pas faire

- ne pas brancher un modèle directement sur l'UI ;
- ne pas faire un payload d'action libre par défaut ;
- ne pas supposer des mécaniques non confirmées par le code ;
- ne pas lancer d'implémentation avant d'avoir un schéma d'observation/action stable.

## Si reprise immédiate dans une autre session

Message de reprise recommandé :

`Reprends le projet OpenFrontArena depuis docs/session-handoff.md et continue par le branchement réel du snapshot adapter OpenFront, puis implémente valid_actions v1 à partir du moteur.`
