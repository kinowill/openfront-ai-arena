# Strategy Framework

## Objectif

Definir comment laisser une vraie liberte strategique aux modeles sans perdre le controle mecanique.

## Principe central

On ne veut pas un bot "bride".
On veut un bot :

- mecaniquement sur ;
- strategiquement libre ;
- comparable a d'autres bots ;
- explicable.

## Separation des responsabilites

### Le moteur decide

- ce qui est legal ;
- ce qui est atteignable ;
- ce qui est payable ;
- ce qui existe reellement sur la carte ;
- quelles actions concretement executables sont disponibles.

### Le modele decide

- quelle direction strategique prendre ;
- quel front prioriser ;
- quel risque accepter ;
- quand construire ;
- quand attaquer ;
- quand temporiser ;
- quand cooperer ou trahir ;
- quel vecteur d'action est le meilleur a ce tick.

## Ce qu'il faut eviter

### Trop de liberte

Le modele hallucine :

- des actions impossibles ;
- des cibles non atteignables ;
- des constructions illegales ;
- des timings absurdes.

### Trop peu de liberte

Le modele devient :

- previsible ;
- sans style ;
- incapable d'innover ;
- limite a un simple selecteur de "meilleure action valide" selon une checklist rigide.

## Cadre recommande

Le meilleur compromis pour OpenFront est :

1. observation riche
2. plusieurs actions valides
3. contexte strategique visible
4. selection d'une action concrete
5. memoire courte des choix precedents

## Trois niveaux de liberte

### Liberte de style

Le bot peut etre :

- expansionniste ;
- defensif ;
- opportuniste ;
- diplomatique ;
- naval ;
- nucleaire ;
- economique ;
- hybride.

### Liberte de priorite

Le bot choisit entre :

- defendre ;
- construire ;
- s'etendre ;
- aider un allie ;
- ouvrir un front ;
- preparer un timing.

Il n'y a pas d'ordre universel impose entre ces familles. Le bon choix depend de la carte, du tick, des voisins, du tempo et du cout d'opportunite.

### Liberte de tempo

Le bot decide :

- d'attendre ;
- de stocker ;
- de harceler ;
- de full-send ;
- de prendre un risque calcule.

## Point cle sur le naval

Le naval ne doit pas etre modele comme un simple fallback quand la terre est impossible.

Une action navale peut etre meilleure qu'une action terrestre meme si une frontiere terrestre existe deja, par exemple pour :

- contourner une ligne dense ;
- ouvrir un second front ;
- menacer un arriere plus faible ;
- gagner un meilleur tempo ;
- forcer une mauvaise repartition adverse.

## Recommandation d'implementation

Au lieu de demander seulement :

- `choisis une action`

demander :

- `quel est ton objectif strategique pour ce tick ?`
- `pourquoi ?`
- `quelle action valide s'y conforme le mieux ?`

## Effet attendu

Cette approche permet d'obtenir :

- des agents plus interessants ;
- des comportements plus divers ;
- des logs plus lisibles ;
- une meilleure capacite a diagnostiquer les erreurs.
