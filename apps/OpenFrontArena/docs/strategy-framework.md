# Strategy Framework

## Objectif

Définir comment laisser une vraie liberté stratégique aux modèles sans perdre le contrôle mécanique.

## Principe central

On ne veut pas un bot "bridé".
On veut un bot :

- mécaniquement sûr ;
- stratégiquement libre ;
- comparable à d'autres bots ;
- explicable.

## Séparation des responsabilités

### Le moteur décide

- ce qui est légal ;
- ce qui est atteignable ;
- ce qui est payable ;
- ce qui existe réellement sur la carte.

### Le modèle décide

- quelle direction stratégique prendre ;
- quel front prioriser ;
- quel risque accepter ;
- quand construire ;
- quand attaquer ;
- quand temporiser ;
- quand coopérer ou trahir.

## Ce qu'il faut éviter

### Trop de liberté

Le modèle hallucine :

- des actions impossibles ;
- des cibles non adjacentes ;
- des constructions illégales ;
- des timings absurdes.

### Trop peu de liberté

Le modèle devient :

- prévisible ;
- sans style ;
- incapable d'innover ;
- limité à un "top-1 valid action picker".

## Cadre recommandé

Le meilleur compromis pour OpenFront est :

1. observation riche
2. plusieurs actions valides
3. intention stratégique explicite
4. sélection d'une action concrète
5. mémoire courte des choix précédents

## Trois niveaux de liberté

### Liberté de style

Le bot peut être :

- expansionniste ;
- défensif ;
- opportuniste ;
- diplomatique ;
- naval ;
- nucléaire ;
- économique ;
- hybride.

### Liberté de priorité

Le bot choisit entre :

- défendre ;
- construire ;
- s'étendre ;
- aider un allié ;
- ouvrir un front ;
- préparer un timing.

### Liberté de tempo

Le bot décide :

- d'attendre ;
- de stocker ;
- de harceler ;
- de full-send ;
- de prendre un risque calculé.

## Recommandation d'implémentation

Au lieu de demander seulement :

- `choisis une action`

demander :

- `quel est ton objectif stratégique pour ce tick ?`
- `pourquoi ?`
- `quelle action valide s'y conforme le mieux ?`

## Effet attendu

Cette approche permet d'obtenir :

- des agents plus intéressants ;
- des comportements plus divers ;
- des logs plus lisibles ;
- une meilleure capacité à diagnostiquer les erreurs.
