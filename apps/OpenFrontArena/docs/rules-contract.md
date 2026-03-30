# Rules Contract

## Objectif

Versionner explicitement les regles injectees aux bots pour eviter les ambiguites et les regressions.

## Principe

Le moteur possede la vraie logique.

Le `Rules Contract` n'est pas une doctrine strategique. C'est un resume normatif des mecanismes utiles a la decision.

Il doit decrire :

- ce qui est vrai ;
- ce qui est legal ;
- ce qui est atteignable ;
- ce qui est observable ;
- ce qui est impossible.

Il ne doit pas imposer :

- un ordre de priorite strategique ;
- un style de jeu ;
- une suite de decision obligatoire ;
- une heuristique locale presentee comme une loi du jeu.

## Contenu minimal

- conditions de victoire ;
- phases de jeu si elles ont un effet mecanique reel ;
- regles d'expansion ;
- regles d'attaque terrestre ;
- regles d'attaque navale ;
- regles de construction ;
- regles de don/alliance ;
- limitations ou cooldowns importants ;
- regles nucleaires si activees ;
- visibilite ou fog of war si actives.

## Frontiere avec les heuristiques

Le contrat de regles dit par exemple :

- qu'une attaque terrestre exige une cible atteignable par terre ;
- qu'une action navale exige un acces cotier et une projection navale valide ;
- qu'une construction exige une tuile buildable et un cout payable.

Les documents heuristiques disent ensuite :

- quand il est intelligent de construire ;
- quand il vaut mieux temporiser ;
- quand le naval est probablement meilleur ;
- quand aider un allie a plus de valeur qu'attaquer.

## Versionnement

Chaque observation doit indiquer :

- `rules_version`

Chaque changement important de logique exposee aux bots doit incrementer cette version.

## Utilisation

Le `Rules Contract` peut etre :

- injecte au prompt systeme ;
- expose comme document annexe pour les agents non LLM ;
- stocke avec les replays et les matchs.

## Regle pratique

Si une mecanique devient importante pour les decisions et qu'elle n'est pas dans ce contrat, il faut l'ajouter.

Si un conseil strategique est presente comme une regle dure, il faut le sortir du contrat.
