# Action Model

## Objectif

Limiter le bot à un ensemble d'actions explicites, validables et journalisables.

## Principe

Le modèle ne renvoie pas des commandes UI.

Il choisit une action de haut niveau parmi un petit vocabulaire ou, de préférence, sélectionne une action déjà préparée par le moteur.

L'orchestrateur transforme ensuite cette action en intent OpenFront valide.

## Important

Un espace d'actions borné ne doit pas supprimer la liberté stratégique.

La bonne cible est :

- liberté sur le "pourquoi"
- liberté sur le "quand"
- liberté sur le "quel front"
- liberté sur le "quel style"
- sécurité sur le "comment exécuter"

Autrement dit :

- le modèle choisit la stratégie ;
- le moteur sécurise l'exécution.

## Format cible recommandé

Le protocole le plus sûr pour un backend LLM n'est pas de laisser le modèle construire un payload complet.

Le protocole recommandé est :

1. le moteur calcule `valid_actions[]` ;
2. chaque action reçoit un identifiant stable ;
3. le bot répond avec `selected_action_id` ;
4. l'orchestrateur résout cet identifiant vers l'action réelle.

Ce schéma réduit fortement :

- les erreurs JSON ;
- les actions illégales ;
- les hallucinations de paramètres ;
- les ambiguïtés de coordonnées.

## Protocole recommandé à trois niveaux

### Niveau 1 : intention

Le bot exprime sa direction stratégique.

Exemples :

- `expand_east`
- `hold_north_front`
- `prepare_naval_access`
- `assist_ally_red_team`
- `greedy_capture_weak_neighbor`

### Niveau 2 : justification courte

Le bot explique brièvement sa logique à partir de l'observation.

### Niveau 3 : sélection d'action valide

Le bot sélectionne une action concrète déjà jugée légale par le moteur.

Ce format garde de la liberté sans laisser de vide mécanique.

## Actions minimales

- `wait`
- `expand`
- `attack_land`
- `attack_naval`
- `build_structure`
- `upgrade_structure`
- `assist_ally`
- `set_target`
- `accept_alliance`
- `reject_alliance`
- `break_alliance`
- `donate_gold`
- `donate_troops`

## Représentation recommandée des actions valides

```json
{
  "valid_actions": [
    {
      "id": "act_0001",
      "type": "wait",
      "label": "Hold current position"
    },
    {
      "id": "act_0027",
      "type": "build_structure",
      "label": "Build Port on south coast",
      "target": {
        "structure_type": "Port",
        "tile": 183920
      }
    }
  ]
}
```

## Réponse recommandée du bot

```json
{
  "strategic_goal": "prepare_naval_access",
  "tactical_reason": "No port built while a weak offshore target exists and south coast is available.",
  "selected_action_id": "act_0027",
  "confidence": 0.82
}
```

## Format recommandé

```json
{
  "action_type": "build_structure",
  "reason": "No port on a maritime map and at least one reachable naval target exists.",
  "target": {
    "structure_type": "Port",
    "tile": 183920
  },
  "confidence": 0.82
}
```

Ce format reste utile pour bots scriptés ou intégrations internes, mais pour les LLM la sélection par ID est préférable.

## Mode hybride possible

Si on veut laisser davantage de liberté à certains modèles plus fiables :

1. le modèle propose un petit plan libre ;
2. l'orchestrateur le convertit en sous-objectif ;
3. l'arbiter choisit parmi les actions valides celles qui satisfont le mieux ce plan.

Exemple :

```json
{
  "strategic_goal": "weaken north-west enemy before building more eco",
  "preferred_action_types": ["attack_land", "assist_ally", "set_target"],
  "selected_action_id": "act_0312",
  "confidence": 0.74
}
```

Ce mode est utile si tu veux laisser émerger davantage de personnalité de jeu.

## Contraintes par action

### `expand`

Doit cibler :

- `Terra Nullius`
- ou une région explicitement marquée comme expansion sûre.

### `attack_land`

Conditions :

- frontière terrestre confirmée ;
- cible non alliée ;
- réserve minimale préservée ;
- pression entrante acceptable ou priorisée.

### `attack_naval`

Conditions :

- cible non atteignable par terre ;
- zone côtière de départ disponible ;
- capacité navale construisible ;
- intérêt stratégique réel.

### `build_structure`

Conditions :

- type de bâtiment autorisé ;
- tuile buildable ;
- coût disponible ;
- justification stratégique.

### `assist_ally`

Conditions :

- allié existant ;
- cible non alliée ;
- front d'assistance atteignable ;
- réserve suffisante.

## Validation

Chaque action doit passer par un `Action Arbiter` qui vérifie :

- légalité ;
- atteignabilité ;
- coût ;
- cohérence avec l'état courant ;
- limite de fréquence ;
- éventuelle normalisation des cibles.

## Politique de timeout et d'échec

Pour un backend externe :

- si timeout : `wait`
- si JSON invalide : tentative de récupération minimale sinon `wait`
- si `selected_action_id` inconnu : `wait`
- si action devenue invalide entre décision et exécution : `wait`

Tous ces cas doivent être journalisés séparément.

## Politique de fallback

Si l'action proposée est invalide :

1. tentative de correction sûre ;
2. sinon `wait` ;
3. journalisation de l'échec ;
4. retour d'erreur structuré dans l'historique du bot.

Le but n'est pas de "faire quand même", mais de garder un comportement robuste et comparable.
