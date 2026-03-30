# Strategy Knowledge Pack

## Objectif

Preparer une base documentaire riche pour aider les bots a comprendre OpenFront au-dela des seules regles brutes.

Cette documentation doit servir a terme de socle pour :

- prompts systeme ;
- fine-tuning eventuel ;
- retrieval local ;
- bots hybrides regle + modele ;
- generation de playbooks.

## Principe d'organisation

La base doit separer clairement quatre niveaux :

1. regles du jeu
2. contrat d'action
3. heuristiques locales
4. playbooks strategiques

Melanger ces couches produit des bots soit hallucines, soit brides.

## Structure recommandee

### 1. Core Rules

Regles exactes du jeu :

- victoire ;
- expansion ;
- attaques ;
- structures ;
- diplomatie ;
- naval ;
- nucleaire ;
- limites et cooldowns.

Ici, on ne met pas de doctrine strategique.

### 2. Action Contract

Conditions mecaniques minimales pour :

- `expand`
- `attack_land`
- `attack_naval`
- `build_structure`
- `assist_ally`
- `wait`

Ici, on decrit ce qui rend l'action recevable, pas ce qui la rend optimale.

### 3. Tactical Heuristics

Heuristiques locales :

- quand prendre un bot faible ;
- quand eviter un front ;
- quand full-send ;
- quand garder une reserve ;
- quand lancer un transport ;
- quand monter la defense.

Ces heuristiques sont revisables selon le contexte.

### 4. Strategic Playbooks

Macros de jeu :

- `safe_expansion`
- `frontline_skirmish`
- `eco_boom`
- `naval_pressure`
- `ally_assist`
- `anti_nuke_defense`
- `traitor_punish`
- `late_game_cleanup`

### 5. Map Archetypes

Types de cartes :

- continentales ;
- regionales ;
- insulaires ;
- chokepoint ;
- maritimes ;
- riches en fronts ;
- riches en expansion neutre.

### 6. Diplomacy Heuristics

- quand accepter une alliance ;
- quand refuser ;
- quand renouveler ;
- quand marquer une cible ;
- quand donner des troupes ;
- quand punir un traitre.

## Sujets a documenter en priorite

### Expansion

- expansion sure vs expansion dangereuse ;
- retarder le contact avec un gros voisin ;
- interet de capturer de petits ennemis d'abord ;
- role de Terra Nullius ;
- moment ou il faut arreter l'expansion brute.

### Combat

- interet du ratio d'attaque ;
- timing des attaques massives ;
- attaques conjointes ;
- interet de l'attaque sur ennemi faible ou deja engage ;
- difference entre offensive locale et ouverture de nouveau front.

### Batiments

- quand une `City` vaut plus qu'une expansion de tuiles ;
- quand un `Port` devient critique ;
- quand une `Factory` devient rentable ;
- comment penser les `Defense Posts` ;
- quand les `SAM Launchers` sont indispensables ;
- quand investir dans `Missile Silo` et arsenal nucleaire.

### Naval

- quand un front maritime merite un port ;
- quand un debarquement est meilleur qu'une poussee terrestre ;
- quand envoyer un petit debarquement ;
- quand eviter le naval ;
- comment exploiter les iles et arrieres-lignes.

### Diplomatie

- alliances tactiques vs alliances pieges ;
- lecture d'un refus d'alliance ;
- dangers des alliances avec joueurs sans menaces ;
- ne pas trahir sans plan d'attaque immediat.

## Forme ideale de la documentation

Chaque fiche devrait contenir :

- `mechanic`
- `what_it_does`
- `why_it_matters`
- `good_use_cases`
- `bad_use_cases`
- `signals_to_watch`
- `common_mistakes`
- `bot_heuristics`
- `source_type`

## Exemple de fiche

```yaml
mechanic: port
what_it_does: Unlocks naval mobility and trade opportunities
why_it_matters: Critical on island and maritime maps, and sometimes best even when a land border exists
good_use_cases:
  - offshore targets exist
  - coastal flank is better than land push
  - second front would stretch the opponent
bad_use_cases:
  - map is almost fully landlocked
  - no follow-up after first landing
signals_to_watch:
  - reachable coastal target exists
  - land front is saturated
common_mistakes:
  - building too late
  - building with no follow-up naval plan
bot_heuristics:
  - prefer if at least one credible naval angle exists
source_type: strategic_hypothesis
```

## Provenance des connaissances

La base doit toujours distinguer :

- `source: code`
- `source: official/community wiki`
- `source: inferred from tests`
- `source: strategic hypothesis`

Cette distinction est cruciale pour savoir ce qui est dur, mou, ou speculatif.
