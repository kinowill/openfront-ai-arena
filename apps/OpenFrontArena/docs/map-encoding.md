# Map Encoding

## Probleme

Un LLM ne voit pas naturellement la carte comme un humain.

Lui donner une matrice brute de milliers de tuiles est rarement utile. Il faut une representation intermediaire plus lisible.

## Intention

L'encodage de carte doit donner a l'IA une lecture jouable du terrain.

Il ne doit pas :

- la noyer dans la grille brute ;
- cacher la geographie utile ;
- prescrire une strategie ;
- confondre resume de carte et plan de jeu.

## Principe

La "visualisation de la carte" pour le bot doit etre textuelle et structurelle, pas graphique.

Il faut exposer trois niveaux.

## Niveau 1 : resume global

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

Un front est le meilleur compromis entre precision et lisibilite.

Exemple :

```text
Front NW
- type: land
- adjacent_to: player_red
- my_border_strength: medium
- enemy_strength: high
- distance_to_enemy_core: short
- neutral_tiles_available: no
- notable_options: defend, reinforce, counterattack_if_window_opens
```

## Niveau 3 : regions et points d'interet

Decouper la carte en zones utiles :

- front nord ;
- cote sud ;
- coeur economique ;
- couloir d'expansion est ;
- ile ennemie ;
- arriere-ligne protegee.

Chaque region peut avoir :

- un centre ;
- une superficie ;
- un statut ;
- des structures ;
- une importance contextuelle ;
- des voisins regionaux.

## Encodages recommandes

### Encodage tabulaire

Bon pour API et modeles generalistes.

```json
{
  "regions": [
    {
      "id": "north_front",
      "role": "land_front",
      "owner": "self",
      "importance_hint": "high",
      "hostile_neighbors": ["player_red"],
      "friendly_neighbors": [],
      "key_structures": ["DefensePost"],
      "risk": 0.78
    }
  ]
}
```

### Encodage graphe

Le plus propre a terme.

Noeuds :

- regions ;
- joueurs ;
- structures ;
- fronts.

Aretes :

- adjacent ;
- attacks ;
- allied_with ;
- reachable_by_sea ;
- protects ;
- threatens.

### Encodage hybride

Le plus realiste pour un premier MVP :

- resume global ;
- liste de fronts ;
- liste de voisins ;
- liste de structures ;
- liste de regions importantes ;
- liste d'actions valides.

## Regle pratique

Pour le premier prototype, ne pas exposer toute la grille.

Exposer plutot :

- 1 resume global ;
- 3 a 8 fronts ;
- 5 a 20 points d'interet ;
- un ensemble d'actions valides annotees.

C'est suffisant pour que le modele "comprenne la carte" sans etre noye.
