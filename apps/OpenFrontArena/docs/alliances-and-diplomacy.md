# Alliances and Diplomacy

## Objectif

Donner aux bots une lecture exploitable de la diplomatie OpenFront.

Dans OpenFront, la diplomatie modifie directement :

- les cibles valides ;
- les fronts prioritaires ;
- la survie ;
- les fenêtres d'attaque ;
- la qualité du late game.

## Ce qu'un bot doit distinguer

- allié actuel ;
- coéquipier ;
- neutre ;
- hostile ;
- allié fragile ;
- allié opportuniste ;
- traître probable ;
- joueur ciblé par un allié ;
- joueur déjà sous pression d'autres adversaires.

## Principes de base

### Une alliance doit servir un but

Bonne alliance :

- réduit un front dangereux ;
- permet de survivre ;
- crée un focus commun ;
- ouvre une opportunité de capture d'un tiers.

Mauvaise alliance :

- n'apporte aucune sécurité ;
- protège un futur rival sans contrepartie ;
- ralentit ton tempo ;
- t'enferme pendant qu'un autre snowball.

### Une alliance change la topologie du match

Une fois une alliance formée :

- un front peut disparaître ;
- une cible peut devenir interdite ;
- une route de croissance peut s'ouvrir ;
- un autre voisin devient soudain prioritaire.

Le bot doit réévaluer sa stratégie après chaque événement diplomatique.

## Cas diplomatiques à documenter

### Accepter une alliance

Signaux favorables :

- voisin immédiat dangereux ;
- encerclement potentiel ;
- cible tierce plus importante ;
- besoin de respirer économiquement ;
- allié capable d'agir réellement.

Signaux défavorables :

- l'autre joueur n'a aucune menace réelle ;
- il devient trop fort une fois protégé ;
- tu perds ta meilleure cible ;
- le front qu'il ferme est déjà faible.

### Refuser une alliance

À privilégier si :

- l'alliance t'empêche un kill proche ;
- le joueur est trop bien placé pour snowball ;
- tu n'as rien à y gagner ;
- une autre cible est déjà alignée avec ton plan.

### Renouveler une alliance

Bon choix si :

- l'équilibre de fronts l'exige encore ;
- l'allié reste utile ;
- un ennemi majeur reste à gérer ;
- la rupture serait plus coûteuse que le maintien.

Mauvais choix si :

- l'allié est devenu la prochaine cible naturelle ;
- l'alliance fige le jeu en sa faveur ;
- ton meilleur timing dépend justement de sa fin.

### Marquer une cible

Utile pour :

- coordonner un focus ;
- signaler une priorité ;
- pousser un allié à agir ;
- structurer un front commun.

### Donner or ou troupes

À faire si :

- un allié tient un front critique ;
- l'aide a un impact immédiat ;
- ton propre front est stable ;
- la donation évite une percée majeure.

À éviter si :

- l'allié va perdre quand même ;
- tu t'affaiblis plus que tu ne l'aides ;
- aucun gain de tempo réel n'en découle.

## Trahison

La trahison doit être un calcul.

### Conditions favorables

- la rupture ouvre un kill rapide ;
- l'allié est isolé ou déjà affaibli ;
- tu peux convertir immédiatement en avantage territorial ;
- le coût diplomatique est supportable.

### Conditions défavorables

- aucun follow-up immédiat ;
- autre front dangereux encore actif ;
- armée insuffisante ;
- autre joueur profite plus de la rupture que toi.

## Signaux faibles

Un bot peut inférer des indices de risque diplomatique :

- alliance demandée en l'absence de menace ;
- refus d'alliance alors qu'un front commun existe ;
- absence d'assistance promise ;
- marquage de cible incohérent ;
- concentration anormale de troupes près de ta frontière.

## Heuristiques exploitables

- accepter une alliance qui retire un front critique est souvent bon ;
- aider un allié qui combat déjà est plus rentable qu'aider un allié passif ;
- un allié sans ennemi proche peut devenir un problème plus tard ;
- un traître doit être puni vite si la fenêtre existe ;
- la diplomatie doit toujours être relue avec la géographie.

## Champs recommandés dans l'observation

- `alliances_current`
- `alliance_requests_incoming`
- `alliance_requests_outgoing`
- `ally_pressure_state`
- `target_calls_from_allies`
- `donation_opportunities`
- `betrayal_risk_estimate`
- `diplomatic_opportunities`
