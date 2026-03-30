# Naval and Coastal Play

## Objectif

Donner aux bots une vraie comprehension du jeu cotier et naval.

Sur certaines cartes, le naval transforme entierement la structure strategique de la partie.

## Ce qu'un bot doit comprendre

- la difference entre legalite mecanique et preference strategique ;
- la difference entre attaque terrestre et projection navale ;
- la valeur d'une cote sure ;
- le cout d'un port ;
- l'interet d'un debarquement ;
- la possibilite de contourner un front ;
- le risque d'ouvrir un investissement sans suite.

## Point cle

Une action navale n'est pas reservee aux cibles impossibles a atteindre par terre.

Le naval peut etre meilleur que la terre si :

- l'angle d'attaque est plus faible ;
- le front terrestre est sature ;
- un second front change la repartition adverse ;
- une tete de pont cree plus de tempo ;
- l'arriere ennemi est plus vulnerable depuis la cote.

## Quand le naval est important

- cartes insulaires ;
- cartes multi-continents ;
- cartes a detroits et clusters separes ;
- lignes terrestres bloquees ;
- besoin de contourner un front dense ;
- cote faible ou arriere expose ;
- ennemi faible hors bonne portee terrestre.

## Quand le naval est secondaire

- carte presque entierement terrestre ;
- enormes fronts terrestres actifs avec meilleur rendement immediat ;
- absence de cible maritime exploitable ;
- debut de partie sous forte pression locale ;
- cout d'infrastructure naval sans suite credible.

## Types d'usage naval

### Expansion indirecte

Atteindre des zones non accessibles ou mal accessibles par terre.

### Contournement

Eviter un front terrestre dense.

### Harcelement

Forcer l'adversaire a defendre un arriere ou une ile.

### Projection decisive

Ouvrir une vraie tete de pont permettant une capture.

### Second front

Creer une tension supplementaire meme contre une cible deja joignable par terre.

## Mauvais usages frequents

- construire un port trop tot sans cible ;
- debarquer trop peu de troupes ;
- negliger sa propre frontiere terrestre ;
- repeter des transports vers une cible trop forte ;
- lancer du naval alors que le terrestre a un meilleur rendement clair ;
- traiter le naval comme une doctrine automatique.

## Signaux favorables a un plan naval

- `reachable_coastal_target_exists`
- `coastal_border_tiles_available`
- `enemy_rear_is_exposed`
- `land_front_stalemate`
- `naval_angle_better_than_land`
- `second_front_has_high_value`

## Signaux defavorables

- `urgent_land_threat`
- `no_safe_coast`
- `target_stronger_than_me`
- `no_follow_up_after_landing`
- `land_option_clearly_better`

## Heuristiques bot

- construire un port si au moins une opportunite navale credible existe ;
- preferer un plan naval pour contourner plutot que forcer un front sature ;
- eviter le naval "par principe" si l'expansion terrestre reste meilleure ;
- considerer le naval comme une option de geographie et de tempo, pas comme une doctrine fixe.

## Observation utile

- `coastal_border_tiles_count`
- `safe_coastal_regions`
- `naval_targets`
- `best_port_candidates`
- `naval_opportunities`
- `naval_risk_estimate`
- `land_vs_naval_tradeoff`
