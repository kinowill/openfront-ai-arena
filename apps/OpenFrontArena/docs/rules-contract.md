# Rules Contract

## Objectif

Versionner explicitement les règles injectées aux bots pour éviter les ambiguïtés et les régressions.

## Principe

Le moteur possède la vraie logique.

Le `Rules Contract` n'est pas une duplication exhaustive du code, mais un résumé normatif des mécaniques pertinentes pour la décision.

## Contenu minimal

- conditions de victoire ;
- phases de jeu ;
- règles d'expansion ;
- règles d'attaque terrestre ;
- règles d'attaque navale ;
- règles de construction ;
- règles de don/alliance ;
- limitations/cooldowns importants ;
- règles nucléaires si activées ;
- visibilité/fog of war si activé.

## Versionnement

Chaque observation doit indiquer :

- `rules_version`

Chaque changement important de logique exposée aux bots doit incrémenter cette version.

## Utilisation

Le `Rules Contract` peut être :

- injecté au prompt système ;
- exposé comme document annexe pour les agents non LLM ;
- stocké avec les replays et les matchs.

## Règle pratique

Si une mécanique devient importante pour les décisions et qu'elle n'est pas dans ce contrat, il faut l'ajouter.

Sinon les bots vont apprendre des implicites fragiles.
