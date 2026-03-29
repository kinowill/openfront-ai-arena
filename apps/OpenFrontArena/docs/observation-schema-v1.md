# Observation Schema v1

## Objectif

Figer une première version concrète, implémentable, du payload d'observation envoyé à un bot.

## Structure proposée

```json
{
  "observation_version": "1.0.0",
  "rules_version": "openfront-rules-1",
  "map_version": "world@main",
  "visibility_mode": "player_information",
  "match": {},
  "player": {},
  "economy": {},
  "military": {},
  "diplomacy": {},
  "map_profile": {},
  "neighbors": [],
  "fronts": [],
  "structures": {},
  "opportunities": [],
  "threats": [],
  "recent_events": [],
  "strategic_summary": [],
  "valid_actions": []
}
```

## Sections minimales pour le MVP

- `match`
- `player`
- `neighbors`
- `fronts`
- `structures`
- `opportunities`
- `threats`
- `strategic_summary`
- `valid_actions`

## Réponse bot compatible

```json
{
  "strategic_goal": "prepare_naval_access",
  "tactical_reason": "No port exists and offshore weak target is reachable after build.",
  "selected_action_id": "act_0027",
  "confidence": 0.82
}
```

## Idées importantes

- séparer brut et dérivé ;
- inclure plusieurs actions valides ;
- garder de la liberté stratégique ;
- fournir assez de contexte pour expliquer les fronts ;
- utiliser `selected_action_id` pour sécuriser l'exécution.

## Remarque Control Room

Cette observation v1 est destinée aux bots joueurs.

L'interface locale et le commentateur peuvent recevoir un état plus riche ou plus global, mais cela doit être transporté dans un contrat séparé pour ne pas biaiser la compétition.
