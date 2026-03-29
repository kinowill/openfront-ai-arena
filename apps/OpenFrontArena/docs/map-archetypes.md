# Map Archetypes

## Objectif

Aider les bots à relier leurs décisions à la géographie de la carte.

## Archétypes principaux

### Continental / Open Land

- expansion terrestre importante ;
- nombreux fronts potentiels ;
- importance du tempo et de la densité.

### Regional / Mixed

- plusieurs fronts ;
- géographie plus structurée ;
- parfois quelques côtes décisives.

### Island / Maritime

- mobilité navale critique ;
- clusters séparés ;
- risque de sous-jouer le naval.

### Chokepoint

- passages limités ;
- fronts très concentrés ;
- valeur forte des positions défensives.

### Split Landmass

- plusieurs masses terrestres séparées par eau ;
- guerre terrestre locale + opportunités navales globales.

## Ce qu'un bot doit inférer

- taux de côte utile ;
- densité de neutre ;
- nombre de fronts probables ;
- valeur attendue du naval ;
- importance des goulets ;
- vitesse probable de contact entre joueurs.

## Champs utiles dans l'observation

- `map_archetype`
- `coastal_importance`
- `chokepoint_density`
- `neutral_expansion_potential`
- `naval_relevance`
- `front_complexity`
