# Naval and Coastal Play

## Objectif

Donner aux bots une vraie compréhension du jeu côtier et naval.

Sur certaines cartes, le naval transforme entièrement la structure stratégique de la partie.

## Ce qu'un bot doit comprendre

- la différence entre cible terrestre et cible navale ;
- la valeur d'une côte sûre ;
- le coût d'un port ;
- l'intérêt d'un débarquement ;
- la possibilité de contourner un front ;
- le risque d'ouvrir un investissement sans suite.

## Quand le naval est important

- cartes insulaires ;
- cartes multi-continents ;
- cartes à détroits et clusters séparés ;
- lignes terrestres bloquées ;
- ennemi faible hors portée terrestre.

## Quand le naval est secondaire

- carte presque entièrement terrestre ;
- énormes fronts terrestres actifs ;
- absence de cible maritime exploitable ;
- début de partie sous forte pression locale.

## Types d'usage naval

### Expansion indirecte

Atteindre des zones non accessibles par terre.

### Contournement

Éviter un front terrestre dense.

### Harcèlement

Forcer l'adversaire à défendre un arrière ou une île.

### Projection décisive

Ouvrir une vraie tête de pont permettant une capture.

## Mauvais usages fréquents

- construire un port trop tôt sans cible ;
- débarquer trop peu de troupes ;
- négliger sa propre frontière terrestre ;
- répéter des transports vers une cible trop forte ;
- lancer du naval alors que Terra Nullius reste largement disponible.

## Signaux favorables à un plan naval

- `no_land_path_to_target`
- `reachable_coastal_target_exists`
- `coastal_border_tiles_available`
- `enemy_rear_is_exposed`
- `land_front_stalemate`

## Signaux défavorables

- `urgent_land_threat`
- `no_safe_coast`
- `target_stronger_than_me`
- `no_follow_up_after_landing`

## Heuristiques bot

- construire un port si au moins une opportunité navale crédible existe ;
- préférer un plan naval pour contourner plutôt que forcer un front saturé ;
- éviter le naval "par principe" si l'expansion terrestre reste meilleure ;
- considérer le naval comme une option de géographie, pas comme une doctrine fixe.

## Observation utile

- `coastal_border_tiles_count`
- `safe_coastal_regions`
- `naval_targets`
- `land_blocked_targets`
- `best_port_candidates`
- `naval_opportunities`
- `naval_risk_estimate`
