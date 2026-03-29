# Buildings and Infrastructure

## Objectif

Donner aux bots une lecture stratégique des structures d'OpenFront, pas seulement leur nom.

## Principe

Une structure n'est pas seulement "buildable".
Elle doit être comprise comme :

- un investissement ;
- un signal stratégique ;
- un levier de tempo ;
- un point faible potentiel.

## City

### Rôle

- croissance ;
- capacité ;
- ancrage économique de base.

### Quand c'est fort

- quand tu contrôles déjà un espace relativement sûr ;
- quand tu peux convertir ce développement en réserve de troupes ;
- quand ta croissance stagne faute d'infrastructure.

### Quand c'est mauvais

- en front ultra exposé ;
- si tu meurs avant d'amortir l'investissement ;
- si une menace immédiate exige défense ou contre-attaque.

### Heuristiques bot

- préférer une zone intérieure plutôt qu'une bordure chaude ;
- éviter de construire si un front critique manque de défense ;
- augmenter la priorité si le bot a beaucoup de territoire mais peu d'infrastructure.

## Factory

### Rôle

- moteur économique et logistique ;
- meilleure valorisation de zones bien connectées ;
- structure qui profite d'un environnement relativement stable.

### Ce que montre le code

Le moteur natif valorise fortement :

- l'altitude ;
- la distance à la frontière ;
- l'espacement ;
- la connectivité ferroviaire ;
- la proximité utile avec d'autres structures.

### Quand c'est fort

- à l'arrière ou dans un coeur économique ;
- quand le réseau de structures existe déjà ;
- quand tu peux protéger l'investissement.

### Quand c'est mauvais

- en tout début de partie sur une carte très agressive ;
- si la côte est plus urgente qu'une deuxième structure économique ;
- si le front bouge trop vite.

### Heuristiques bot

- prioriser si la partie se stabilise ;
- prioriser si plusieurs villes/structures sont déjà présentes ;
- déprioriser sur cartes très maritimes tant qu'aucun port n'existe.

## Port

### Rôle

- accès naval ;
- mobilité ;
- commerce ;
- ouverture de fronts impossibles par terre.

### Quand c'est critique

- carte insulaire ou semi-insulaire ;
- ennemi faible accessible seulement par mer ;
- opportunité de contourner une ligne terrestre ;
- besoin de projection sur un autre cluster.

### Quand c'est secondaire

- carte presque entièrement terrestre ;
- aucune opportunité navale crédible ;
- front terrestre urgent.

### Heuristiques bot

- augmenter fortement la priorité si un ennemi faible est atteignable seulement via la côte ;
- augmenter la priorité si plusieurs tuiles côtières sûres existent ;
- diminuer la priorité si aucune suite navale n'est disponible.

## Defense Post

### Rôle

- durcissement local ;
- ralentissement ou sécurisation d'un front ;
- réponse à un voisin plus fort.

### Ce que montre le code

Le moteur natif tend à le valoriser si :

- un voisin hostile non-bot est plus fort ;
- la zone est proche de la frontière ;
- l'altitude est bonne ;
- le placement couvre un front pertinent.

### Quand c'est fort

- frontière chaude ;
- ennemi plus riche ou plus massif ;
- goulet/chokepoint ;
- phase de stabilisation.

### Quand c'est faible

- zone intérieure ;
- front déjà gagné ;
- si tu dois encore d'abord prendre de l'espace ou de l'éco.

### Heuristiques bot

- construire si un front est `critical` ou `contested` contre un voisin supérieur ;
- préférer points hauts et couloirs ;
- éviter de spammer s'il n'y a pas de menace réelle.

## SAM Launcher

### Rôle

- couverture anti-missile ;
- protection des structures critiques ;
- assurance contre jeu nucléaire.

### Quand c'est fort

- présence de silos ennemis ;
- milieu/fin de partie ;
- cluster de villes/factories/silos à protéger ;
- match où l'arsenal nucléaire est activé.

### Quand c'est faible

- arsenal nucléaire désactivé ;
- début de partie sans menace lointaine ;
- zone vide sans actifs importants.

### Heuristiques bot

- prioriser autour de `City`, `Factory`, `Port`, `Missile Silo` ;
- augmenter la priorité si la menace nuke est non nulle ;
- éviter construction trop tôt si les règles du match la rendent inutile.

## Missile Silo

### Rôle

- menace stratégique ;
- pression psychologique ;
- capacité d'ouverture ou de punition.

### Ce que montre le code

Le moteur natif tend à :

- limiter leur nombre ;
- les placer loin de la frontière ;
- préférer altitude et espacement ;
- économiser l'or pour l'arsenal nucléaire si pertinent.

### Quand c'est fort

- partie longue ;
- économie déjà solide ;
- couverture SAM possible ;
- cibles stratégiques identifiées.

### Quand c'est faible

- économie fragile ;
- aucune couverture ;
- match court ou ultra-chaotique ;
- impossibilité de protéger l'arrière.

### Heuristiques bot

- ne pas construire si les bases économiques ne sont pas encore assez solides ;
- prioriser uniquement si le contexte nucléaire existe réellement ;
- éviter les placements de bordure.

## Priorités par archétype de partie

### Partie terrestre rapide

- City
- Defense Post
- Factory
- Port
- SAM
- Silo

### Partie maritime

- Port
- City
- Factory
- Defense Post
- SAM
- Silo

### Partie longue avec nukes

- City
- Factory
- SAM
- Silo
- Defense Post
- Port

## Règle de synthèse pour bots

Avant de construire, un bot devrait répondre à trois questions :

1. quelle faiblesse cela corrige-t-il ?
2. quel front ou quelle économie cela améliore-t-il ?
3. est-ce meilleur maintenant qu'une expansion, une défense ou une attaque ?
