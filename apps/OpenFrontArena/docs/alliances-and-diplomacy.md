# Alliances and Diplomacy

## Objectif

Donner aux bots une lecture exploitable de la diplomatie OpenFront.

Dans OpenFront, la diplomatie modifie directement :

- les cibles valides ;
- la geometrie des fronts ;
- la survie ;
- les fenetres d'attaque ;
- la qualite du late game.

## Principe

La diplomatie ne doit pas etre reduite a des regles fixes.

Il faut donner a l'agent :

- l'etat diplomatique reel ;
- les demandes et signaux utiles ;
- les effets mecaniques sur les cibles et les fronts ;
- les informations de contexte qui permettent d'evaluer si cooperer, temporiser ou trahir est bon.

Le choix reste strategique.

## Ce qu'un agent doit distinguer

- allie actuel ;
- coequipier ;
- neutre ;
- hostile ;
- allie fragile ;
- allie opportuniste ;
- traitre probable ;
- joueur cible par un allie ;
- joueur deja sous pression d'autres adversaires.

## Principes de base

### Une alliance doit servir un but

Bonne alliance :

- reduit un front dangereux ;
- permet de survivre ;
- cree un focus commun ;
- ouvre une opportunite de capture d'un tiers.

Mauvaise alliance :

- n'apporte aucune securite ;
- protege un futur rival sans contrepartie ;
- ralentit ton tempo ;
- t'enferme pendant qu'un autre snowball.

### Une alliance change la topologie du match

Une fois une alliance formee :

- un front peut disparaitre ;
- une cible peut devenir interdite ;
- une route de croissance peut s'ouvrir ;
- un autre voisin peut devenir plus important.

L'agent doit donc pouvoir reevaluer sa strategie apres chaque evenement diplomatique.

## Cas diplomatiques a documenter

### Accepter une alliance

Signaux favorables :

- voisin immediat dangereux ;
- encerclement potentiel ;
- cible tierce plus importante ;
- besoin de respirer economiquement ;
- allie capable d'agir reellement.

Signaux defavorables :

- l'autre joueur n'a aucune menace reelle ;
- il devient trop fort une fois protege ;
- tu perds ta meilleure cible ;
- le front qu'il ferme est deja faible.

### Refuser une alliance

A privilegier si :

- l'alliance t'empeche un kill proche ;
- le joueur est trop bien place pour snowball ;
- tu n'as rien a y gagner ;
- une autre cible est deja alignee avec ton plan.

### Renouveler une alliance

Bon choix si :

- l'equilibre des fronts l'exige encore ;
- l'allie reste utile ;
- un ennemi majeur reste a gerer ;
- la rupture serait plus couteuse que le maintien.

Mauvais choix si :

- l'allie est devenu la prochaine cible naturelle ;
- l'alliance fige le jeu en sa faveur ;
- ton meilleur timing depend justement de sa fin.

### Marquer une cible

Utile pour :

- coordonner un focus ;
- signaler un angle commun ;
- pousser un allie a agir ;
- structurer un front commun.

### Donner or ou troupes

A faire si :

- un allie tient un front critique ;
- l'aide a un impact immediat ;
- ton propre front est stable ;
- la donation evite une percee majeure.

A eviter si :

- l'allie va perdre quand meme ;
- tu t'affaiblis plus que tu ne l'aides ;
- aucun gain de tempo reel n'en decoule.

## Trahison

La trahison doit etre un calcul.

### Conditions favorables

- la rupture ouvre un kill rapide ;
- l'allie est isole ou deja affaibli ;
- tu peux convertir immediatement en avantage territorial ;
- le cout diplomatique est supportable.

### Conditions defavorables

- aucun follow-up immediat ;
- autre front dangereux encore actif ;
- armee insuffisante ;
- autre joueur profite plus de la rupture que toi.

## Signaux faibles

Un agent peut inferer des indices de risque diplomatique :

- alliance demandee en l'absence de menace ;
- refus d'alliance alors qu'un front commun existe ;
- absence d'assistance promise ;
- marquage de cible incoherent ;
- concentration anormale de troupes pres de ta frontiere.

## Heuristiques exploitables

- accepter une alliance qui retire un front critique est souvent bon ;
- aider un allie qui combat deja est plus rentable qu'aider un allie passif ;
- un allie sans ennemi proche peut devenir un probleme plus tard ;
- un traitre doit etre puni vite si la fenetre existe ;
- la diplomatie doit toujours etre relue avec la geographie.

Ces heuristiques restent des aides de lecture, pas des ordres.

## Champs recommandes dans l'observation

- `alliances_current`
- `alliance_requests_incoming`
- `alliance_requests_outgoing`
- `ally_pressure_state`
- `target_calls_from_allies`
- `donation_opportunities`
- `betrayal_risk_estimate`
- `diplomatic_opportunities`
