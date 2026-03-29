# Observation Model

## Objectif

Fournir au modèle une observation compacte, stable et suffisamment riche pour prendre une décision correcte sans devoir reconstruire seul les règles du jeu.

## Règle de conception

L'observation envoyée à un bot doit être un contrat versionné.

Elle doit donc porter explicitement :

- une `observation_version` ;
- une `rules_version` ;
- une `map_version` ;
- une `bot_api_version`.

## Niveaux d'observation

### 1. Observation brute contrôlée

Etat vérifiable fourni par le moteur :

- tick courant ;
- phase de spawn ou non ;
- joueur courant ;
- or ;
- troupes ;
- tuiles possédées ;
- attaques entrantes/sortantes ;
- alliés ;
- cibles ;
- unités et structures ;
- voisins ;
- updates récentes.

Cette couche doit rester proche du moteur pour être auditable.

### 2. Observation dérivée

Résumés calculés par l'adapter :

- réserve de troupes disponible ;
- pression défensive par front ;
- meilleur front d'expansion ;
- meilleure cible attaquable ;
- structures manquantes ;
- zones côtières utiles ;
- structures exposées ;
- fronts non défendus ;
- niveau de danger nucléaire ;
- opportunités d'assistance à un allié.

Cette couche est celle qui aide réellement les modèles généralistes.

### 3. Mémoire courte

Historique glissant des `N` derniers ticks :

- actions émises ;
- résultat des actions ;
- changements de voisins ;
- conquêtes/pertes importantes ;
- nouvelles menaces ;
- messages diplomatiques utiles.

Recommandation :

- garder une mémoire courte de `5` à `20` ticks ;
- ne pas réinjecter toute l'histoire ;
- résumer les événements répétitifs.

## Principe de visibilité

Deux modes doivent être supportés explicitement :

- `full_information`
- `player_information`

Le mode choisi doit être indiqué dans l'observation. Il ne faut pas mélanger les deux implicitement.

## Contrat d'observation recommandé

```json
{
  "observation_version": "0.2.0",
  "rules_version": "openfront-rules-1",
  "map_version": "world@main",
  "visibility_mode": "player_information",
  "tick": 412,
  "phase": "main",
  "match": {
    "id": "match_00142",
    "seed": 884221,
    "max_ticks": 2400
  },
  "player": {
    "id": "bot_alpha",
    "troops": 12450,
    "gold": 3100,
    "tiles_owned": 1842,
    "reserve_ratio": 0.61,
    "max_troops_estimate": 20400
  },
  "economy": {
    "cities": 3,
    "factories": 1,
    "ports": 0,
    "sams": 0,
    "silos": 0,
    "defense_posts": 1
  },
  "neighbors": {
    "land_hostile": [],
    "land_friendly": [],
    "naval_hostile": [],
    "naval_friendly": []
  },
  "fronts": [],
  "opportunities": [],
  "threats": [],
  "recent_events": [],
  "strategic_summary": [],
  "valid_actions": []
}
```

## Champs indispensables

### `player`

- `troops`
- `gold`
- `tiles_owned`
- `reserve_ratio`
- `incoming_attack_pressure`
- `outgoing_attack_pressure`

### `neighbors`

Pour chaque voisin :

- identifiant ;
- type de relation ;
- atteignable par terre ou mer ;
- puissance estimée ;
- nombre de tuiles ;
- structures clés détectées ;
- pression reçue d'autres joueurs ;
- niveau de vulnérabilité.
- dernier tick de visibilité si fog of war actif.

### `fronts`

Un front est une abstraction plus utile qu'une simple liste de tuiles.

Par front :

- type : `land`, `coast`, `naval`
- ennemi principal ;
- largeur approximative ;
- pression amie ;
- pression ennemie ;
- tuiles/frontières clés ;
- statut : `safe`, `contested`, `critical`, `opportunity`

Chaque front devrait aussi idéalement contenir un `front_id` stable sur quelques ticks pour faciliter la mémoire et les logs.

### `opportunities`

Exemples :

- `expand_into_terra_nullius`
- `attack_weak_neighbor`
- `assist_ally_under_attack`
- `build_port_for_island_access`
- `build_city_for_growth`
- `build_sam_cover`

Chaque opportunité peut être reliée à une ou plusieurs actions valides.

### `threats`

Exemples :

- `major_incoming_attack`
- `border_enemy_stronger_than_me`
- `coast_unprotected`
- `silo_exposed`
- `no_port_on_maritime_map`

Chaque menace peut inclure :

- une sévérité ;
- un horizon temporel ;
- un front concerné ;
- une recommandation de réponse.

### `recent_events`

Cette section doit résumer les événements les plus utiles pour la décision :

- attaque entrante ;
- front perdu/gagné ;
- structure détruite ou construite ;
- alliance acceptée/refusée ;
- nouvelle cible détectée ;
- opportunité navale ouverte.

### `strategic_summary`

Courte liste textuelle générée automatiquement pour aider les modèles moins bons sur les structures JSON complexes.

Exemple :

- `Main threat: red_player on north-west land front`
- `Best opportunity: 14 neutral border tiles on east corridor`
- `No port built while 2 naval targets are reachable`

## Règle importante

Le modèle ne doit jamais déduire lui-même si une action est légalement faisable.

L'observation doit inclure :

- des actions valides ;
- ou au minimum des cibles/actions annotées `reachable`, `buildable`, `legal`.

Sans cela, il hallucine des actions impossibles.

## Recommandation forte

La vraie cible n'est pas seulement `valid_actions`, mais :

- `valid_actions` avec identifiants stables ;
- regroupement par catégorie ;
- score/priorité éventuelle ;
- explication machine-friendly.

Exemple :

```json
{
  "id": "act_0027",
  "type": "build_structure",
  "label": "Build Port on south coast",
  "legal": true,
  "priority_hint": 0.78
}
```
