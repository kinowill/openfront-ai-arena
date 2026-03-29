# Arena Spec

## Objectif

Définir le fonctionnement d'une arène OpenFront permettant de comparer plusieurs agents dans des conditions justes.

## Exigences

- parties reproductibles ;
- mêmes règles pour tous les agents ;
- même cadence de tick ;
- logs et replay complets ;
- isolation des backends ;
- versionnement des configurations.
- possibilité de supervision live locale.

## Entités

### Match

Une partie unique, définie par :

- `match_id`
- `seed`
- `map`
- `mode`
- `game_config`
- `rules_version`
- `observation_version`
- `prompt_version`
- `bot_assignments`

### Bot Assignment

Associe un bot à un slot de joueur.

Champs utiles :

- `bot_id`
- `bot_version`
- `runtime_type`
- `team`
- `spawn_slot`

### Season

Un ensemble de matchs joués sous les mêmes conventions de versionnement.

Permet :

- comparaisons propres ;
- suivi d'évolution ;
- rollback analytique.

## Scheduling

Le scheduler doit pouvoir lancer :

- round robin ;
- séries par seed ;
- best-of ;
- évaluations par carte ;
- évaluations par mode.

## Boucle de match

1. initialiser la partie
2. figer la configuration du match
3. à chaque tick, construire les observations par joueur
4. interroger les bots éligibles
5. résoudre et valider les actions
6. exécuter
7. enregistrer événements + métriques
8. diffuser les mises à jour vers la supervision locale
9. terminer sur condition de victoire ou limite de ticks

## Politique de décision

Recommandation :

- au plus une décision par bot et par tick pour le MVP ;
- timeout strict ;
- aucun blocage global d'un match par un bot lent.

## Replays

Un replay doit permettre de reconstituer :

- l'état de la partie ;
- les actions demandées ;
- les actions réellement exécutées ;
- les erreurs de validation ;
- les raisons textuelles des bots.

## Supervision locale

L'arène doit pouvoir alimenter une interface locale avec :

- état de partie live ;
- stats live ;
- décisions des bots ;
- timeline ;
- commentaires IA ;
- questions/réponses opérateur.

Deux modes sont recommandés :

- `competitive_mode`
  aucun message opérateur n'influence la partie

- `interactive_mode`
  l'opérateur peut parler aux bots ou injecter des consignes

## Diagnostic

Chaque match devrait produire :

- un résumé global ;
- un résumé par bot ;
- une liste des erreurs d'intégration ;
- une timeline des décisions importantes.
