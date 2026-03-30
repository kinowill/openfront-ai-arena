# Buildings and Infrastructure

## Objectif

Donner aux bots une lecture strategique des structures d'OpenFront, pas seulement leur nom.

## Principe

Une structure n'est pas seulement "buildable".
Elle doit etre comprise comme :

- un investissement ;
- un signal strategique ;
- un levier de tempo ;
- un point faible potentiel.

Les indications de ce document sont des heuristiques. Elles ne remplacent pas la legalite moteur ni la lecture du contexte.

## City

### Role

- croissance ;
- capacite ;
- ancrage economique de base.

### Quand c'est fort

- quand tu controles deja un espace relativement sur ;
- quand tu peux convertir ce developpement en reserve de troupes ;
- quand ta croissance stagne faute d'infrastructure.

### Quand c'est mauvais

- en front ultra expose ;
- si tu meurs avant d'amortir l'investissement ;
- si une menace immediate exige defense ou contre-attaque.

### Heuristiques bot

- preferer une zone interieure plutot qu'une bordure chaude ;
- eviter de construire si un front critique manque de defense ;
- reevaluer a la hausse si le territoire est large mais sous-infrastructure.

## Factory

### Role

- moteur economique et logistique ;
- meilleure valorisation de zones bien connectees ;
- structure qui profite d'un environnement relativement stable.

### Ce que montre le code

Le moteur natif valorise fortement :

- l'altitude ;
- la distance a la frontiere ;
- l'espacement ;
- la connectivite ferroviaire ;
- la proximite utile avec d'autres structures.

### Quand c'est fort

- a l'arriere ou dans un coeur economique ;
- quand le reseau de structures existe deja ;
- quand tu peux proteger l'investissement.

### Quand c'est mauvais

- en tout debut de partie sur une carte tres agressive ;
- si la cote est plus urgente qu'une deuxieme structure economique ;
- si le front bouge trop vite.

### Heuristiques bot

- monter sa valeur si la partie se stabilise ;
- monter sa valeur si plusieurs villes ou structures sont deja presentes ;
- baisser sa valeur sur cartes tres maritimes tant qu'aucun port n'existe.

## Port

### Role

- acces naval ;
- mobilite ;
- commerce ;
- ouverture de fronts impossibles ou moins bons par terre.

### Quand c'est critique

- carte insulaire ou semi-insulaire ;
- opportunite de contourner une ligne terrestre ;
- besoin de projection sur un autre cluster ;
- angle cotier plus fort qu'un push terrestre ;
- creation d'un second front utile.

### Quand c'est secondaire

- carte presque entierement terrestre ;
- aucune opportunite navale credible ;
- front terrestre urgent avec meilleur rendement immediat.

### Heuristiques bot

- monter fortement sa valeur si une projection navale promet un meilleur angle ;
- monter sa valeur si plusieurs tuiles cotieres sures existent ;
- baisser sa valeur si aucune suite navale n'est disponible.

## Defense Post

### Role

- durcissement local ;
- ralentissement ou securisation d'un front ;
- reponse a un voisin plus fort.

### Ce que montre le code

Le moteur natif tend a le valoriser si :

- un voisin hostile non-bot est plus fort ;
- la zone est proche de la frontiere ;
- l'altitude est bonne ;
- le placement couvre un front pertinent.

### Quand c'est fort

- frontiere chaude ;
- ennemi plus riche ou plus massif ;
- goulet ou chokepoint ;
- phase de stabilisation.

### Quand c'est faible

- zone interieure ;
- front deja gagne ;
- si tu dois encore d'abord prendre de l'espace ou de l'eco.

### Heuristiques bot

- construire si un front est `critical` ou `contested` contre un voisin superieur ;
- preferer points hauts et couloirs ;
- eviter de spammer s'il n'y a pas de menace reelle.

## SAM Launcher

### Role

- couverture anti-missile ;
- protection des structures critiques ;
- assurance contre jeu nucleaire.

### Quand c'est fort

- presence de silos ennemis ;
- milieu ou fin de partie ;
- cluster de villes, factories ou silos a proteger ;
- match ou l'arsenal nucleaire est active.

### Quand c'est faible

- arsenal nucleaire desactive ;
- debut de partie sans menace lointaine ;
- zone vide sans actifs importants.

### Heuristiques bot

- prioriser autour de `City`, `Factory`, `Port`, `Missile Silo` ;
- reevaluer a la hausse si la menace nuke est non nulle ;
- eviter une construction trop tot si les regles du match la rendent inutile.

## Missile Silo

### Role

- menace strategique ;
- pression psychologique ;
- capacite d'ouverture ou de punition.

### Ce que montre le code

Le moteur natif tend a :

- limiter leur nombre ;
- les placer loin de la frontiere ;
- preferer altitude et espacement ;
- economiser l'or pour l'arsenal nucleaire si pertinent.

### Quand c'est fort

- partie longue ;
- economie deja solide ;
- couverture SAM possible ;
- cibles strategiques identifiees.

### Quand c'est faible

- economie fragile ;
- aucune couverture ;
- match court ou ultra-chaotique ;
- impossibilite de proteger l'arriere.

### Heuristiques bot

- ne pas construire si les bases economiques ne sont pas encore assez solides ;
- ne l'envisager que si le contexte nucleaire existe reellement ;
- eviter les placements de bordure.

## Valeur relative par archetype

Les archetypes ci-dessous donnent une lecture moyenne, pas un classement rigide.

### Partie terrestre rapide

- `City` et `Defense Post` montent souvent en valeur
- `Factory` suit si la ligne se stabilise
- `Port` reste secondaire sauf angle exceptionnel

### Partie maritime

- `Port` peut devenir structurant tres tot
- `City` et `Factory` dependent de la securite de l'arriere
- `Defense Post` reste utile sur les points d'entree

### Partie longue avec nukes

- `City` et `Factory` soutiennent la profondeur economique
- `SAM` devient central
- `Silo` n'a de valeur que si l'economie et la couverture suivent

## Regle de synthese pour bots

Avant de construire, un bot devrait repondre a trois questions :

1. quelle faiblesse cela corrige-t-il ?
2. quel gain concret cela promet-il dans cette partie ?
3. quelle autre action valide abandonne-t-on en faisant cet investissement ?
