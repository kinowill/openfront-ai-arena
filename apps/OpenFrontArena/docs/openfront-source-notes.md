# OpenFront Source Notes

Cette note rattache le cadrage du projet aux fichiers réellement utiles dans OpenFrontIO.

## Architecture générale

Fichier source :

- `OpenFrontIO/docs/Architecture.md`

Constat :

- la simulation est déterministe côté `core` ;
- le serveur relaie des intents ;
- les exécutions modifient l'état ;
- les updates de tick sont propagées vers le client.

Conséquence pour le projet bots :

- il faut brancher l'adapter au niveau du `core` ou d'une projection stable du `core` ;
- il ne faut pas piloter l'UI.

## Etat utile disponible

Fichiers sources :

- `OpenFrontIO/src/core/game/Game.ts`
- `OpenFrontIO/src/core/game/GameUpdates.ts`
- `OpenFrontIO/src/core/game/GameView.ts`

Ce qu'on peut déjà exploiter :

- infos joueur : or, troupes, tuiles, alliances, attaques, embargoes, cibles ;
- infos unités : type, niveau, position, état de construction, cooldown ;
- infos carte : terrain, voisinage, côte, distances, ownership ;
- updates par tick ;
- accès aux unités proches et à des opérations spatiales.

Conséquence :

- le socle pour construire une observation riche existe déjà ;
- il faut surtout sélectionner et restructurer l'information.

## Comportement d'attaque IA existant

Fichier source :

- `OpenFrontIO/src/core/execution/utils/AiAttackBehavior.ts`

Ce que l'IA native prend déjà en compte :

- frontières réelles ;
- voisins amis / ennemis ;
- Terra Nullius ;
- attaques entrantes ;
- trahison ;
- cibles faibles ;
- assistance aux alliés ;
- accès naval ;
- réserve de troupes ;
- différence de difficulté.

Conséquence :

- ton intuition est correcte : le problème n'est pas que le jeu ne sait pas raisonner ;
- le problème est qu'un bot externe doit recevoir explicitement ces concepts.

## Comportement de construction existant

Fichier source :

- `OpenFrontIO/src/core/execution/nation/NationStructureBehavior.ts`

Ce que l'IA native prend déjà en compte :

- ratios par type de structure ;
- présence de côte ;
- sauvegarde d'or pour le nucléaire ;
- densité de structures ;
- distance à la frontière ;
- altitude ;
- espacement ;
- connectivité ferroviaire ;
- couverture SAM ;
- exposition aux ennemis.

Conséquence :

- pour des bots externes, il faut dériver des "opportunités de build" déjà scorées ;
- sinon le modèle construira de façon incohérente.

## Conclusion

Le moteur expose déjà les briques nécessaires.

Le vrai chantier est :

1. fabriquer une observation stratégique lisible ;
2. borner les actions ;
3. valider systématiquement les décisions ;
4. journaliser les ticks pour comparer les modèles.
