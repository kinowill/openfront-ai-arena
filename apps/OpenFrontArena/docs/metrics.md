# Metrics

## Objectif

Comparer les agents de façon utile, pas seulement compter les victoires.

## Métriques cœur

- `win_rate`
- `placement_avg`
- `survival_ticks`
- `tiles_controlled_peak`
- `tiles_controlled_end`
- `gold_spent_ratio`
- `build_count_by_type`
- `offensive_efficiency`
- `defensive_efficiency`
- `assist_efficiency`
- `invalid_action_rate`
- `timeout_rate`
- `json_failure_rate`
- `decision_latency_ms_avg`

## Métriques de qualité d'intégration

- fréquence des actions non atteignables proposées ;
- fréquence des actions corrigées par l'arbiter ;
- fréquence des fallbacks `wait` ;
- fréquence des actions sur fronts critiques ;
- corrélation entre menace immédiate et réponse défensive.

## Métriques de coût

Pour les modèles API :

- tokens d'entrée ;
- tokens de sortie ;
- coût estimé ;
- latence ;
- variance de latence.

## Agrégation

Les résultats doivent être groupés au minimum par :

- carte ;
- mode ;
- seed ;
- version de règles ;
- version d'observation ;
- version de prompt ;
- version de bot.

## Rating

Deux options réalistes :

- `Elo` pour une première version simple ;
- `TrueSkill` si l'arène multi-agents devient plus avancée.

## Règle d'interprétation

Une baisse du `win_rate` n'est pas suffisante pour conclure qu'un bot est mauvais.

Il faut toujours la relire avec :

- `invalid_action_rate`
- `timeout_rate`
- `latency`
- profil par carte
- profil par type de partie

Sinon on risque de juger le modèle alors que le protocole est en faute.
