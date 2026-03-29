# Integration Architecture

## Vue d'ensemble

Le système cible peut être implémenté comme une surcouche autour d'OpenFrontIO.

## Composants

### 1. OpenFront Adapter

Responsabilités :

- lire l'état utile du moteur ;
- agréger les infos par tick ;
- construire l'observation ;
- dériver voisins, fronts, opportunités et menaces ;
- exposer les actions valides.

Entrées probables côté OpenFront :

- `Game`
- `Player`
- `GameUpdates`
- `GameView`
- helpers de pathfinding et de voisinage

### 2. Bot Runtime

Responsabilités :

- appeler un modèle local ou distant ;
- injecter prompt + observation + mémoire courte ;
- récupérer une action structurée ;
- mesurer latence, coût et erreurs.

Le runtime doit supporter au minimum :

- timeout ;
- retry optionnel côté API ;
- limite de tokens ;
- journalisation brute de la réponse ;
- mode strict `selected_action_id`.

Backends possibles :

- `local-rule-based`
- `local-llm`
- `openai-api`
- `anthropic-api`
- `ollama`
- `lm-studio`

### 3. Action Arbiter

Responsabilités :

- valider l'action ;
- la corriger si possible ;
- la traduire en intent/méthode OpenFront ;
- empêcher les actions absurdes ;
- journaliser la décision.

### 4. Match Orchestrator

Responsabilités :

- lancer une partie ;
- assigner un bot à chaque joueur ;
- exécuter la boucle par tick ;
- stocker les logs et résultats ;
- comparer les bots.

Le Match Orchestrator doit aussi savoir figer :

- la seed ;
- la carte ;
- la version des règles ;
- la version du prompt ;
- la version du backend ;
- la version de l'observation.

### 5. Local Control Room

Responsabilités :

- afficher la partie en direct ;
- suivre les stats ;
- afficher les décisions des bots ;
- permettre l'interrogation opérateur ;
- afficher les résumés du commentateur IA ;
- faciliter le debug live.

## Structure de dossiers recommandée

```text
OpenFrontArena/
├─ README.md
├─ docs/
├─ prompts/
├─ adapters/
│  ├─ openfront/
│  ├─ observations/
│  └─ actions/
├─ runtimes/
│  ├─ local/
│  ├─ api/
│  └─ rule-based/
├─ arena/
│  ├─ matchmaking/
│  ├─ scheduling/
│  ├─ scoring/
│  └─ replay/
├─ control-room/
│  ├─ ui/
│  ├─ streams/
│  └─ commentator/
├─ logs/
├─ metrics/
└─ fixtures/
```

## Pipeline de décision recommandé

1. Lire l'état du tick
2. Construire l'observation enrichie
3. Générer la liste d'actions valides
4. Appeler le modèle
5. Résoudre `selected_action_id`
6. Valider l'action
7. Convertir vers les intents OpenFront
8. Exécuter
9. Journaliser
10. Diffuser l'état et la décision vers la Control Room

## Journalisation minimale

Pour chaque tick et bot :

- observation résumée ;
- action proposée ;
- action exécutée ;
- erreurs de validation ;
- latence ;
- raison textuelle ;
- résultat observé au tick suivant.

Pour chaque match :

- seed ;
- carte ;
- mode ;
- difficulté ;
- version des règles ;
- version de l'observation ;
- version du prompt ;
- version du runtime.

Pour la supervision live :

- événements push pour la carte ;
- événements push pour les décisions ;
- événements push pour les stats ;
- canal séparé pour les messages opérateur ;
- canal séparé pour le commentateur.

## Point important

Les bots externes ne doivent pas dépendre de classes UI.

Ils doivent idéalement s'appuyer sur :

- l'état `core` ;
- ou une projection dérivée stable ;
- jamais sur des composants graphiques.

## Baselines indispensables

Avant de comparer des modèles externes, il faut des bots de référence :

- `GreedyExpandBot`
- `TurtleBot`
- `RushBot`

Ils servent à vérifier si le problème vient du modèle ou du contrat d'intégration.
