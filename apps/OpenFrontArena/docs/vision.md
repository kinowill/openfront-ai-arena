# Vision

## But

Faire s'affronter plusieurs modèles d'IA sur OpenFrontIO, qu'ils soient :

- locaux ;
- via API ;
- déterministes/rule-based ;
- hybrides.

Le système doit permettre de comparer des agents sur une même interface de jeu et dans des conditions reproductibles.

## Principe central

Le modèle ne doit jamais deviner les règles implicites du jeu à partir d'un état brut difficile à lire.

Il faut lui fournir :

- une observation déjà structurée ;
- des objectifs explicités ;
- des contraintes d'action explicites ;
- des résumés tactiques et stratégiques ;
- un historique récent.

## Produit cible

Une `AI Arena` OpenFront avec :

- exécution multi-bots ;
- seeds contrôlées ;
- cartes/version de règles figées ;
- support local et API ;
- scoring et replay ;
- comparaison inter-versions.

## Ce que doit savoir un bot performant

- qui sont ses voisins réels ;
- quels ennemis sont atteignables par terre ;
- quels ennemis exigent une approche navale ;
- où il peut construire ;
- quels bâtiments lui manquent ;
- quel est son niveau de réserve de troupes ;
- quelles attaques entrantes exigent une réaction ;
- quels fronts sont faibles ;
- quels adversaires sont vulnérables ;
- quand il vaut mieux s'étendre, défendre, construire, aider un allié ou lancer une offensive.

## Anti-objectifs

- exposer tout l'état interne du moteur tel quel ;
- laisser le modèle inventer des actions non valides ;
- mélanger observation brute, raisonnement et exécution dans un seul bloc opaque ;
- brancher directement un LLM sur des coordonnées sans résumés dérivés ;
- faire dépendre la logique de l'interface graphique.
- confondre "bot intelligent" et "prompt long".

## Hypothèse de travail

Dans OpenFront, la qualité d'un bot externe dépend davantage :

- de l'observation ;
- de l'espace d'actions ;
- de la validation ;
- de la mémoire courte ;

que du modèle lui-même.

Autrement dit, si le bot agit stupidement, le premier suspect est le contrat d'intégration, pas forcément le LLM.

## Architecture cible

Trois couches distinctes :

1. `Game Adapter`
   Transforme l'état OpenFront en observation de bot.

2. `Bot Brain`
   Modèle local, API, ou logique déterministe.

3. `Action Arbiter`
   Valide, normalise, journalise et exécute les actions demandées.

Autour de ces trois couches, il faut aussi :

4. `Arena Orchestrator`
   Lance les matchs, synchronise les ticks, collecte les résultats.

5. `Metrics + Replay`
   Permet d'évaluer, comparer et diagnostiquer les parties.

Cette séparation est importante : elle rend les agents comparables, remplaçables et testables.
