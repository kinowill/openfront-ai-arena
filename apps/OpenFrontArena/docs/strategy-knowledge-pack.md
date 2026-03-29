# Strategy Knowledge Pack

## Objectif

Préparer une base documentaire riche pour aider les bots à comprendre OpenFront au-delà des seules règles brutes.

Cette documentation doit servir à terme de socle pour :

- prompts système ;
- fine-tuning éventuel ;
- retrieval local ;
- bots hybrides règle + modèle ;
- génération de playbooks.

## Structure recommandée

### 1. Core Rules

Règles exactes du jeu :

- victoire ;
- expansion ;
- attaques ;
- structures ;
- diplomatie ;
- naval ;
- nucléaire ;
- limites et cooldowns.

### 2. Tactical Heuristics

Heuristiques locales :

- quand prendre un bot faible ;
- quand éviter un front ;
- quand full-send ;
- quand garder une réserve ;
- quand lancer un transport ;
- quand monter la défense.

### 3. Strategic Playbooks

Macros de jeu :

- `safe_expansion`
- `frontline_skirmish`
- `eco_boom`
- `naval_pressure`
- `ally_assist`
- `anti_nuke_defense`
- `traitor_punish`
- `late_game_cleanup`

### 4. Map Archetypes

Types de cartes :

- continentales ;
- régionales ;
- insulaires ;
- chokepoint ;
- maritimes ;
- riches en fronts ;
- riches en expansion neutre.

### 5. Diplomacy Heuristics

- quand accepter une alliance ;
- quand refuser ;
- quand renouveler ;
- quand marquer une cible ;
- quand donner des troupes ;
- quand punir un traître.

## Sujets à documenter en priorité

### Expansion

- expansion sûre vs expansion dangereuse ;
- retarder le contact avec un gros voisin ;
- intérêt de capturer de petits ennemis d'abord ;
- rôle de Terra Nullius ;
- moment où il faut arrêter l'expansion brute.

### Combat

- intérêt du ratio d'attaque ;
- timing des attaques massives ;
- attaques conjointes ;
- intérêt de l'attaque sur ennemi faible ou déjà engagé ;
- différence entre offensive locale et ouverture de nouveau front.

### Bâtiments

- quand une `City` vaut plus qu'une expansion de tuiles ;
- quand un `Port` devient critique ;
- quand une `Factory` devient rentable ;
- comment penser les `Defense Posts` ;
- quand les `SAM Launchers` sont indispensables ;
- quand investir dans `Missile Silo` et arsenal nucléaire.

### Naval

- quand un front maritime mérite un port ;
- quand envoyer un petit débarquement ;
- quand éviter le naval ;
- comment exploiter les îles et arrières-lignes.

### Diplomatie

- alliances tactiques vs alliances pièges ;
- lecture d'un refus d'alliance ;
- dangers des alliances avec joueurs sans menaces ;
- ne pas trahir sans plan d'attaque immédiat.

## Forme idéale de la documentation

Chaque fiche devrait contenir :

- `mechanic`
- `what_it_does`
- `why_it_matters`
- `good_use_cases`
- `bad_use_cases`
- `signals_to_watch`
- `common_mistakes`
- `bot_heuristics`

## Exemple de fiche

```yaml
mechanic: port
what_it_does: Unlocks naval mobility and trade opportunities
why_it_matters: Critical on island and maritime maps
good_use_cases:
  - offshore targets exist
  - coastal frontier is uncontested
bad_use_cases:
  - map is almost fully landlocked
signals_to_watch:
  - no land path to weak enemy
  - multiple coastal border tiles available
common_mistakes:
  - building too late
  - building with no follow-up naval plan
bot_heuristics:
  - prefer if at least one reachable naval opportunity exists
```

## Provenance des connaissances

La base doit toujours distinguer :

- `source: code`
- `source: official/community wiki`
- `source: inferred from tests`
- `source: strategic hypothesis`

Cette distinction est cruciale pour savoir ce qui est dur, mou, ou spéculatif.
