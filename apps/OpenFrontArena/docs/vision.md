# Vision

## But

Faire s'affronter plusieurs modeles d'IA sur OpenFrontIO, qu'ils soient :

- locaux ;
- via API ;
- deterministes ou rule-based ;
- hybrides.

Le systeme doit permettre de comparer des agents sur une meme interface de jeu et dans des conditions reproductibles.

## Idee centrale du projet

Le projet ne doit pas jouer a la place des IA.

Il doit :

- exposer proprement les controles ;
- transmettre les vraies bases de gameplay ;
- rendre la partie lisible ;
- fournir les mecanismes du jeu et les contraintes d'execution ;
- laisser ensuite chaque agent choisir librement son plan.

L'objectif n'est pas de fabriquer des IA reglees a la main.
L'objectif est de donner a des IA un terrain de jeu comparable a celui d'un humain competent, avec un meilleur contrat de lecture.

## Principe central

Le modele ne doit jamais deviner des regles implicites a partir d'un etat brut difficile a lire.

Il faut lui fournir :

- une observation deja structuree ;
- les mecaniques pertinentes ;
- des contraintes d'action explicites ;
- un historique recent ;
- assez de contexte pour evaluer ses trade-offs.

Il ne faut pas lui imposer :

- un ordre de priorite strategique ;
- un style de jeu ;
- une doctrine defensive, economique ou navale predefinie ;
- une suite de decisions obligatoire.

## Produit cible

Une `AI Arena` OpenFront avec :

- execution multi-bots ;
- seeds controles ;
- cartes et versions de regles figees ;
- support local et API ;
- scoring et replay ;
- comparaison inter-versions.

## Ce qu'un agent doit recevoir

- qui sont ses voisins reels ;
- quels ennemis sont atteignables par terre ;
- quels angles navals existent ;
- ou il peut construire ;
- quels batiments lui manquent ;
- quel est son niveau de reserve de troupes ;
- quelles attaques entrantes changent vraiment le risque ;
- quels fronts sont faibles ou saturent ;
- quels adversaires sont vulnerables ;
- quelles options valides sont actuellement executables.

Cela doit correspondre autant que possible a ce qu'un humain qui sait jouer saurait lire du match, plus une structuration machine-friendly du meme contenu.

## Anti-objectifs

- exposer tout l'etat interne du moteur tel quel ;
- laisser le modele inventer des actions non valides ;
- melanger observation brute, raisonnement et execution dans un seul bloc opaque ;
- brancher directement un LLM sur des coordonnees sans resumes derives ;
- faire dependre la logique de l'interface graphique ;
- confondre "bot intelligent" et "prompt long" ;
- transformer la documentation en script de pilotage strategique.

## Hypothese de travail

Dans OpenFront, la qualite d'un bot externe depend davantage :

- de l'observation ;
- de la lisibilite de la carte ;
- de l'espace d'actions ;
- de la validation ;
- de la memoire courte ;

que du modele lui-meme.

Autrement dit, si le bot agit stupidement, le premier suspect est le contrat d'integration, pas forcement le LLM.

## Architecture cible

Trois couches distinctes :

1. `Game Adapter`
   Transforme l'etat OpenFront en observation de bot.

2. `Bot Brain`
   Modele local, API, ou logique deterministe.

3. `Action Arbiter`
   Valide, normalise, journalise et execute les actions demandees.

Autour de ces trois couches, il faut aussi :

4. `Arena Orchestrator`
   Lance les matchs, synchronise les ticks, collecte les resultats.

5. `Metrics + Replay`
   Permet d'evaluer, comparer et diagnostiquer les parties.

Cette separation est importante : elle rend les agents comparables, remplacables et testables sans les brider strategiquement.
