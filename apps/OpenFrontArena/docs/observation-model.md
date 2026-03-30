# Observation Model

## Objectif

Fournir au modele une observation compacte, stable et suffisamment riche pour prendre une decision correcte sans devoir reconstruire seul les regles du jeu.

## Intention de conception

L'observation doit donner a l'IA une lecture exploitable du match comparable a celle d'un humain qui sait jouer, mais sous une forme structuree.

Elle doit donc :

- exposer les faits utiles ;
- expliciter les contraintes mecaniques ;
- rendre visibles les options realistes ;
- aider a lire la carte, les fronts et les timings ;
- laisser le choix strategique au modele.

Elle ne doit pas :

- imposer un plan ;
- cacher les regles importantes ;
- injecter une doctrine de jeu ;
- forcer un ordre de priorite.

## Regle de conception

L'observation envoyee a un bot doit etre un contrat versionne.

Elle doit donc porter explicitement :

- une `observation_version` ;
- une `rules_version` ;
- une `map_version` ;
- une `bot_api_version`.

## Niveaux d'observation

### 1. Observation brute controlee

Etat verifiable fourni par le moteur :

- tick courant ;
- phase de spawn ou non ;
- joueur courant ;
- or ;
- troupes ;
- tuiles possedees ;
- attaques entrantes ou sortantes ;
- allies ;
- cibles ;
- unites et structures ;
- voisins ;
- updates recentes.

Cette couche doit rester proche du moteur pour etre auditable.

### 2. Observation derivee

Resumes calcules par l'adapter :

- reserve de troupes disponible ;
- pression defensive par front ;
- meilleurs angles d'expansion ;
- cibles reelles selon chaque vecteur ;
- structures manquantes ;
- zones cotieres utiles ;
- structures exposees ;
- fronts non defendus ;
- niveau de danger nucleaire ;
- opportunites d'assistance a un allie.

Cette couche ne doit pas choisir a la place du modele. Elle doit rendre le jeu lisible.

### 3. Memoire courte

Historique glissant des `N` derniers ticks :

- actions emises ;
- resultat des actions ;
- changements de voisins ;
- conquetes ou pertes importantes ;
- nouvelles menaces ;
- messages diplomatiques utiles.

Recommandation :

- garder une memoire courte de `5` a `20` ticks ;
- ne pas reinjecter toute l'histoire ;
- resumer les evenements repetitifs.

## Principe de visibilite

Deux modes doivent etre supportes explicitement :

- `full_information`
- `player_information`

Le mode choisi doit etre indique dans l'observation. Il ne faut pas melanger les deux implicitement.

## Contrat d'observation recommande

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
- atteignable par terre ou par mer ;
- puissance estimee ;
- nombre de tuiles ;
- structures cles detectees ;
- pression recue d'autres joueurs ;
- niveau de vulnerabilite ;
- dernier tick de visibilite si fog of war actif.

### `fronts`

Un front est une abstraction plus utile qu'une simple liste de tuiles.

Par front :

- type : `land`, `coast`, `naval`
- ennemi principal ;
- largeur approximative ;
- pression amie ;
- pression ennemie ;
- tuiles ou frontieres cles ;
- statut : `safe`, `contested`, `critical`, `opportunity`

Chaque front devrait idealement contenir un `front_id` stable sur quelques ticks pour faciliter la memoire et les logs.

### `opportunities`

Exemples :

- `expand_into_terra_nullius`
- `attack_weak_neighbor`
- `assist_ally_under_attack`
- `build_port_for_island_access`
- `build_city_for_growth`
- `build_sam_cover`

Chaque opportunite peut etre reliee a une ou plusieurs actions valides.

### `threats`

Exemples :

- `major_incoming_attack`
- `border_enemy_stronger_than_me`
- `coast_unprotected`
- `silo_exposed`
- `no_port_on_maritime_map`

Chaque menace peut inclure :

- une severite ;
- un horizon temporel ;
- un front concerne ;
- un contexte de reponse plausible.

### `recent_events`

Cette section doit resumer les evenements les plus utiles pour la decision :

- attaque entrante ;
- front perdu ou gagne ;
- structure detruite ou construite ;
- alliance acceptee ou refusee ;
- nouvelle cible detectee ;
- opportunite navale ouverte.

### `strategic_summary`

Courte liste textuelle generee automatiquement pour aider les modeles moins bons sur les structures JSON complexes.

Exemple :

- `Main threat: red_player on north-west land front`
- `Best opportunity: 14 neutral border tiles on east corridor`
- `Coastal flank on south side is stronger than direct north push`

## Regle importante

Le modele ne doit jamais deduire lui-meme si une action est legalement faisable.

L'observation doit inclure :

- des actions valides ;
- ou au minimum des cibles ou actions annotees `reachable`, `buildable`, `legal`.

Sans cela, il hallucine des actions impossibles.

## Recommandation forte

La vraie cible n'est pas seulement `valid_actions`, mais :

- `valid_actions` avec identifiants stables ;
- regroupement par categorie ;
- metadonnees d'explication ;
- contexte de trade-off lisible.

Les hints de score sont autorises comme aides de lecture, mais ne doivent pas devenir un pilote automatique cache.

Exemple :

```json
{
  "id": "act_0027",
  "type": "build_structure",
  "label": "Build Port on south coast",
  "legal": true,
  "importance_hint": 0.78,
  "why_it_exists": "South coastal flank opens a second front with low initial resistance."
}
```
