# Map Archetypes

## Objectif

Aider les bots a relier leurs decisions a la geographie de la carte.

## Principe

La carte doit orienter la lecture du match, pas enfermer le bot dans un playbook fixe.

Un archetype sert a repondre a des questions comme :

- quels vecteurs d'action comptent vraiment ;
- combien de fronts vont emerger ;
- quelle valeur relative a le naval ;
- quelle vitesse de contact attendre ;
- quels investissements deviennent plausibles.

## Archetypes principaux

### Continental / Open Land

- expansion terrestre importante ;
- nombreux fronts potentiels ;
- importance du tempo et de la densite.

### Regional / Mixed

- plusieurs fronts ;
- geographie plus structuree ;
- parfois quelques cotes decisives.

### Island / Maritime

- mobilite navale critique ;
- clusters separes ;
- risque de sous-jouer le naval.

### Chokepoint

- passages limites ;
- fronts tres concentres ;
- valeur forte des positions defensives.

### Split Landmass

- plusieurs masses terrestres separees par eau ;
- guerre terrestre locale plus opportunites navales globales.

## Ce qu'un agent doit pouvoir inferer

- taux de cote utile ;
- densite de neutre ;
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
