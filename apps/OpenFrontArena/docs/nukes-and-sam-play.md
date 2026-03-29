# Nukes and SAM Play

## Objectif

Donner aux bots une lecture stratégique des mécaniques nucléaires et anti-nucléaires.

## Principe

Le jeu nucléaire affecte :

- le positionnement ;
- la valeur des structures ;
- la protection de l'arrière ;
- la priorité économique ;
- la densité acceptable d'actifs.

## Ce qu'un bot doit comprendre

- si les règles nucléaires sont activées ;
- s'il existe une menace nucléaire crédible ;
- quels actifs doivent être protégés ;
- si construire un SAM est urgent ou non ;
- quand un silo est rentable ;
- quand l'adversaire est vulnérable au jeu stratégique.

## Lecture défensive

### Menace faible

- début de partie ;
- aucun silo identifié ;
- économie adverse immature ;
- règles désactivées ou coûts prohibitifs.

### Menace sérieuse

- partie prolongée ;
- silos visibles ou probables ;
- clusters de structures précieuses ;
- fronts stabilisés ;
- économie ennemie mature.

## SAM Launcher

À augmenter si :

- plusieurs structures denses existent ;
- un silo ennemi existe ;
- le bot joue lui-même nucléaire ;
- l'arrière contient des villes/factories importantes.

À baisser si :

- la partie est encore très précoce ;
- les nukes sont désactivées ;
- rien de précieux n'est à protéger.

## Missile Silo

Conditions favorables :

- économie stable ;
- bonne profondeur territoriale ;
- possibilité de protection ;
- cibles stratégiques identifiées ;
- temps de jeu restant suffisant.

Conditions défavorables :

- front terrestre urgent ;
- économie faible ;
- silo exposé ;
- aucun follow-up stratégique.

## Heuristiques bot

- si `nuclear_threat_level` monte, la priorité SAM doit monter aussi ;
- un silo sans plan de valeur n'est qu'un coût ;
- protéger un cluster économique dense vaut souvent plus qu'étendre quelques tuiles ;
- le nucléaire est plus fort quand les fronts terrestres se figent.

## Champs d'observation utiles

- `nukes_enabled`
- `enemy_silo_count_known`
- `enemy_silo_count_estimated`
- `my_sam_coverage_score`
- `critical_assets_exposed`
- `nuclear_threat_level`
- `best_sam_candidates`
- `best_silo_candidates`
