# Nukes and SAM Play

## Objectif

Donner aux bots une lecture strategique des mecaniques nucleaires et anti-nucleaires.

## Principe

Le jeu nucleaire affecte :

- le positionnement ;
- la valeur des structures ;
- la protection de l'arriere ;
- l'economie de guerre ;
- la densite acceptable d'actifs.

Le but n'est pas d'imposer un script "si menace nuke alors SAM".
Le but est d'exposer les informations qui permettent a l'agent de juger lui-meme quand la defense, l'economie ou la projection nucleaire valent le plus.

## Ce qu'un agent doit comprendre

- si les regles nucleaires sont activees ;
- s'il existe une menace nucleaire credible ;
- quels actifs doivent etre proteges ;
- si construire un SAM est urgent ou non ;
- quand un silo est rentable ;
- quand l'adversaire est vulnerable au jeu strategique.

## Lecture defensive

### Menace faible

- debut de partie ;
- aucun silo identifie ;
- economie adverse immature ;
- regles desactivees ou couts prohibitifs.

### Menace serieuse

- partie prolongee ;
- silos visibles ou probables ;
- clusters de structures precieuses ;
- fronts stabilises ;
- economie ennemie mature.

## SAM Launcher

Monte en valeur si :

- plusieurs structures denses existent ;
- un silo ennemi existe ;
- l'agent joue lui-meme nucleaire ;
- l'arriere contient des villes ou factories importantes.

Baisse en valeur si :

- la partie est encore tres precoce ;
- les nukes sont desactivees ;
- rien de precieux n'est a proteger.

## Missile Silo

Conditions favorables :

- economie stable ;
- bonne profondeur territoriale ;
- possibilite de protection ;
- cibles strategiques identifiees ;
- temps de jeu restant suffisant.

Conditions defavorables :

- front terrestre urgent ;
- economie faible ;
- silo expose ;
- aucun follow-up strategique.

## Heuristiques bot

- si `nuclear_threat_level` monte, la valeur du SAM monte souvent aussi ;
- un silo sans plan de valeur n'est qu'un cout ;
- proteger un cluster economique dense vaut souvent plus qu'etendre quelques tuiles ;
- le nucleaire est plus fort quand les fronts terrestres se figent.

Ces heuristiques ne remplacent pas le jugement strategique de l'agent.

## Champs d'observation utiles

- `nukes_enabled`
- `enemy_silo_count_known`
- `enemy_silo_count_estimated`
- `my_sam_coverage_score`
- `critical_assets_exposed`
- `nuclear_threat_level`
- `best_sam_candidates`
- `best_silo_candidates`
