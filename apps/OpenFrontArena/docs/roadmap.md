# Roadmap

## Phase 1

Construire un bot déterministe de référence avant tout LLM.

Objectif :

- prouver le pipeline observation -> action -> validation ;
- disposer d'un baseline pour comparer les modèles.

Livrables :

- adapter minimal ;
- action arbiter minimal ;
- bot rule-based ;
- logs de tick.
- première version de `valid_actions` avec identifiants.

## Phase 2

Construire l'observation enrichie.

Priorités :

- voisins réels ;
- fronts ;
- structures ;
- opportunités ;
- menaces ;
- actions valides.

## Phase 3

Brancher un premier backend modèle.

Ordre conseillé :

1. modèle local ou API avec sortie JSON stricte
2. réponse par `selected_action_id`
3. une action maximum par tick
4. timeout court
5. fallback `wait`

## Phase 4

Introduire le mode arène.

Fonctions :

- plusieurs bots ;
- seeds fixes ;
- mêmes cartes ;
- mêmes réglages ;
- même version de règles et d'observation ;
- score agrégé ;
- replay + logs.

## Phase 5

Améliorer la "vision carte".

Travaux :

- segmentation en fronts ;
- régions ;
- graphe stratégique ;
- importance des structures ;
- distance à la côte et aux ennemis ;
- vulnérabilité des fronts.

## Phase 6

Mesurer sérieusement les performances.

Métriques minimales :

- survie ;
- rang final ;
- tuiles contrôlées ;
- croissance ;
- constructions ;
- efficacité offensive ;
- efficacité défensive ;
- stabilité des décisions ;
- coût/token/latence pour les modèles API.

## Sprint MVP recommandé

Ordre le plus rentable :

1. produire `valid_actions` côté moteur ;
2. faire choisir un `selected_action_id` ;
3. enregistrer `invalid_action_rate` ;
4. lancer des matchs `LLM vs GreedyExpandBot` ;
5. rejouer les parties problématiques à partir des logs.
