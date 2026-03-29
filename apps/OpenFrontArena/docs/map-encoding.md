# Map Encoding

## Problème

Un LLM ne voit pas naturellement la carte comme un humain.

Lui donner une matrice brute de milliers de tuiles est rarement utile. Il faut une représentation intermédiaire plus lisible.

## Principe

La "visualisation de la carte" pour le bot doit être textuelle et structurelle, pas graphique.

Il faut exposer trois niveaux.

## Niveau 1 : résumé global

Exemple :

```text
Map summary
- Land tiles owned: 1842
- Coastal border tiles: 73
- Land hostile neighbors: 2
- Naval hostile neighbors: 1
- Expandable neutral border tiles: 41
- Main threat: player_red on north-west land front
- Main opportunity: undefended neutral corridor on east front
```

## Niveau 2 : fronts

Un front est le meilleur compromis entre précision et lisibilité.

Exemple :

```text
Front NW
- type: land
- adjacent_to: player_red
- my_border_strength: medium
- enemy_strength: high
- distance_to_enemy_core: short
- neutral_tiles_available: no
- recommended_modes: defend, build_defense_post, attack_if_reinforced
```

## Niveau 3 : régions / points d'intérêt

Découper la carte en zones utiles :

- front nord ;
- côte sud ;
- coeur économique ;
- couloir d'expansion est ;
- île ennemie ;
- arrière-ligne protégée.

Chaque région peut avoir :

- un centre ;
- une superficie ;
- un statut ;
- des structures ;
- une importance ;
- des voisins régionaux.

## Encodages recommandés

### Encodage tabulaire

Bon pour API et modèles généralistes.

```json
{
  "regions": [
    {
      "id": "north_front",
      "role": "land_front",
      "owner": "self",
      "priority": "high",
      "hostile_neighbors": ["player_red"],
      "friendly_neighbors": [],
      "key_structures": ["DefensePost"],
      "risk": 0.78
    }
  ]
}
```

### Encodage graphe

Le plus propre à terme.

Noeuds :

- régions ;
- joueurs ;
- structures ;
- fronts.

Arêtes :

- adjacent ;
- attacks ;
- allied_with ;
- reachable_by_sea ;
- protects ;
- threatens.

### Encodage hybride

Le plus réaliste pour un premier MVP :

- résumé global ;
- liste de fronts ;
- liste de voisins ;
- liste de structures ;
- liste de régions prioritaires ;
- liste d'actions valides.

## Recommandation pratique

Pour le premier prototype, ne pas exposer toute la grille.

Exposer plutôt :

- 1 résumé global ;
- 3 à 8 fronts ;
- 5 à 20 points d'intérêt ;
- un ensemble d'actions valides annotées.

C'est suffisant pour que le modèle "comprenne la carte" sans être noyé.
