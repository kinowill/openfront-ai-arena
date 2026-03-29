# Sources and Confidence

## Objectif

Éviter de mélanger :

- règles certaines ;
- documentation communautaire ;
- heuristiques déduites ;
- hypothèses stratégiques.

## Hiérarchie de confiance

### Niveau 1 : code source OpenFrontIO

À utiliser pour :

- règles mécaniques ;
- types d'actions ;
- structures ;
- relations ;
- pathfinding ;
- updates ;
- heuristiques IA natives.

Confiance : très forte.

### Niveau 2 : tests OpenFrontIO

À utiliser pour :

- cas limites ;
- comportement attendu ;
- invariants ;
- détails de diplomatie et d'interaction.

Confiance : forte.

### Niveau 3 : documentation officielle / semi-officielle de la communauté

Exemples utiles :

- wiki OpenFront Pro ;
- Fandom OpenFront.

À utiliser pour :

- explication pédagogique ;
- résumés de mécaniques ;
- conseils stratégiques ;
- taxonomie des cartes et styles.

Confiance : moyenne à bonne selon le sujet.

### Niveau 4 : hypothèses stratégiques

À utiliser pour :

- playbooks ;
- recommandations ;
- styles de jeu ;
- prompts de coaching.

Confiance : variable.

## Règle pratique

Chaque morceau de savoir important dans la future base documentaire devrait être annoté avec :

- `confidence`
- `source_type`
- `source_ref`

## Sources externes identifiées

- OpenFrontIO GitHub README et docs d'architecture
- Openfront Wiki Fandom
- OpenFront Pro wiki/guides

## Usage recommandé

- code pour la vérité ;
- wiki pour la lisibilité ;
- guides pour les heuristiques ;
- nos propres tests pour valider les points ambigus.
