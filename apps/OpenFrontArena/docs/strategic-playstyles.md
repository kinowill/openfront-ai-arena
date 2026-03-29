# Strategic Playstyles

## Objectif

Donner aux modèles des styles de jeu cohérents qu'ils peuvent adopter, combiner ou quitter selon le contexte.

## Important

Un style n'est pas une règle dure.

C'est :

- une préférence ;
- une manière de prioriser ;
- une lecture du risque ;
- une façon d'utiliser les mêmes actions valides.

## Safe Expansion

### Idée

Prendre un maximum d'espace à faible risque avant de surinvestir dans le combat.

### Signaux favorables

- beaucoup de Terra Nullius ;
- peu de pression directe ;
- voisins éloignés ou dispersés ;
- faible menace immédiate.

### Risques

- retard d'infrastructure ;
- front fragile au premier vrai contact ;
- sur-expansion sans réserve.

### Bon pour

- early game ;
- cartes larges ;
- parties FFA ouvertes.

## Turtle / Fortify

### Idée

Consolider, construire et rendre les fronts coûteux avant de pousser.

### Signaux favorables

- voisin plus fort ;
- carte à chokepoints ;
- match avec menaces nucléaires ;
- économie déjà correcte.

### Risques

- perdre l'initiative ;
- laisser un rival snowball ;
- construire trop sans convertir en pression.

### Bon pour

- fronts chauds ;
- parties longues ;
- situations de survie.

## Opportunistic Predator

### Idée

Punir rapidement les ennemis faibles, engagés ailleurs, AFK, trahis ou déjà sous attaque.

### Signaux favorables

- voisin avec peu de troupes ;
- cible recevant déjà beaucoup de pression ;
- ennemi très étendu mais peu dense ;
- trou tactique sur un front.

### Risques

- overcommit ;
- ouvrir un front de trop ;
- négliger une menace plus sérieuse.

### Bon pour

- mid game ;
- FFA ;
- environnement très dynamique.

## Naval Pressure

### Idée

Utiliser ports et transports pour ouvrir un angle que le front terrestre ne donne pas.

### Signaux favorables

- carte maritime ;
- cibles hors de portée terrestre ;
- côte sûre ;
- arrière ennemi accessible.

### Risques

- investissement mort si aucun follow-up ;
- sous-développement terrestre ;
- débarquement trop faible.

### Bon pour

- îles ;
- cartes à plusieurs masses terrestres ;
- contournement d'un front bloqué.

## Alliance Operator

### Idée

Utiliser diplomatie, target calls, assistance et donations pour survivre ou prendre l'avantage.

### Signaux favorables

- partie team ;
- voisinage complexe ;
- plusieurs ennemis proches ;
- opportunité de focus commun.

### Risques

- dépendance excessive à un allié ;
- mauvaise lecture d'un traître ;
- dilution du tempo personnel.

### Bon pour

- modes équipe ;
- cartes multi-fronts ;
- situations d'encerclement.

## Tech / Strategic Weapons

### Idée

Construire une économie et une protection suffisantes pour jouer la menace stratégique.

### Signaux favorables

- partie longue ;
- économie stable ;
- structures protégées ;
- règles nucléaires actives.

### Risques

- mourir avant retour sur investissement ;
- silo exposé ;
- manque de front presence pendant la phase de préparation.

### Bon pour

- late game ;
- parties où plusieurs joueurs se neutralisent ;
- lignes stabilisées.

## Changement de style

Un bon bot ne reste pas prisonnier d'un style.

Transitions classiques :

- `safe_expansion` -> `turtle` si un voisin fort apparaît ;
- `turtle` -> `opportunistic_predator` si un ennemi s'effondre ;
- `safe_expansion` -> `naval_pressure` si le terrain terrestre bloque ;
- `alliance_operator` -> `predator` si un allié ouvre une fenêtre ;
- `eco/tech` -> `strategic_weapons` si l'économie est sécurisée.

## Utilisation pour les bots

Le prompt ou la mémoire du bot peut contenir :

- `current_style`
- `secondary_style`
- `style_confidence`
- `style_switch_reason`

Exemple :

```json
{
  "current_style": "safe_expansion",
  "secondary_style": "naval_pressure",
  "style_switch_reason": "land expansion nearly exhausted and offshore weak target detected"
}
```

## Recommandation

Ne pas figer un bot sur un style unique.

Le plus intéressant est :

- un style de départ ;
- des conditions de bascule ;
- des préférences de construction, combat et diplomatie liées à ce style.
