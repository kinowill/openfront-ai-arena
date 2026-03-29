# Current Status

## 2026-03-29

### Etat reel du code

- `src/adapters/openfront/snapshotAdapter.ts` est maintenant branche au vrai moteur OpenFront.
- Le snapshot n'est plus statique.
- Il produit un `bot_observation_v1` avec :
  - `player`
  - `economy`
  - `military`
  - `diplomacy`
  - `mapProfile`
  - `neighbors`
  - `fronts`
  - `structures`
  - `opportunities`
  - `threats`
  - `strategicSummary`
  - `validActions`

### Valid actions actuellement generees

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
- `donate_gold`
- `donate_troops`

### Nouveau socle bots

- `src/bots/types.ts` : contrat de bot et contrat de decision runtime
- `src/bots/actionSelection.ts` : ranking et selection des actions
- `src/bots/GreedyExpandBot.ts` : baseline deterministe
- `src/bots/index.ts` : exports du module bots
- `src/runtime/arbiter.ts` : validation de `selected_action_id` + fallback safe
- `src/runtime/decisionPipeline.ts` : jonction observation -> bot -> decision record
- `src/runtime/openfrontExecutor.ts` : traduction d'une action valide vers des executions OpenFront
- `src/runtime/openfrontLoop.ts` : boucle snapshot -> bot -> arbitrage -> execution
- `src/runtime/index.ts` : exports runtime
- `src/runtime/tickLogger.ts` : logger JSONL de tick
- `src/harness/localHarness.ts` : harness local de dev base sur les utilitaires de test OpenFrontIO
- `src/harness/runLiveHarness.ts` : runner live multi-ticks pour alimenter la control room
- `src/harness/index.ts` : exports harness
- `src/runtimes/openaiCompatible.ts` : backend OpenAI-compatible commun
- `src/runtimes/localLlmBot.ts` : backend `local_llm`
- `src/runtimes/remoteApiBot.ts` : backend `remote_api`
- `src/control-room/state/buildState.ts` : aggregation des logs JSONL vers `ControlRoomStateV1`
- `src/control-room/server/server.ts` : backend HTTP + SSE local
- `src/control-room/session/*` : orchestrateur de session locale avec config de slots et lancement/stop
- `src/control-room/ui/*` : control room plus lisible avec FR/EN, minimap live, navigation plus claire et panneau de participation operateur
- `docs/local-control-room.md` : doc de lancement et de reprise
- `docs/control-room-ui-status.md` : memo de reprise specifique a l'UI/control room
- `launch-control-room.cmd` / `stop-control-room.cmd` : lanceurs Windows sans commande
- `src/runtimes/index.ts` : exports runtimes IA
- `src/index.ts` : export global du module bots
- `package.json` : scripts `harness:local`, `harness:live`, `control-room:start`
- `tsconfig.json` : config locale minimale pour le sous-projet

### Ce qui manque encore

- brancher dynamiquement un vrai bot `local_llm` ou `remote_api` dans le runner live
- support multi-match / multi-bots dans la control room
- etendre encore la couverture d'actions / execution sur davantage de cas reels

### Nouveau branchement en cours

- `src/control-room/session/manager.ts` n'orchestre plus seulement un `GameImpl` local :
  - il prepare maintenant un vrai lobby prive OpenFrontIO
  - il expose l'URL reelle de surface/join pour l'iframe de la control room
  - il attend les humains reserves avant lancement effectif si necessaire
- `src/control-room/session/headlessBotClient.ts` ajoute un bot headless :
  - join WebSocket sur le vrai transport OpenFrontIO
  - reconstruction locale deterministe du match via `GameRunner`
  - generation du snapshot bot a partir du vrai flux `start/turn`
  - envoi d'intents OpenFrontIO sur le vrai match
- `src/control-room/session/openfrontBridge.ts` centralise :
  - creation de lobby prive
  - URLs worker/client dev
  - chargement local des maps OpenFrontIO
  - traduction `ValidAction -> Intent`

### Ce qui marche deja

- `npm ci --ignore-scripts` a ete execute dans `OpenFrontIO`
- `..\\OpenFrontIO\\node_modules\\.bin\\tsc -p tsconfig.json --noEmit` passe dans `OpenFrontArena`
- le harness local tourne via :
  - `npm run harness:local`
- le harness live tourne via :
  - `npm run harness:live`
- la control room locale repond via :
  - `npm run control-room:start`
- resultat verifie :
  - le jeu se cree
  - le snapshot se construit
  - `GreedyExpandBot` choisit une action
  - l'action est arbitree puis executee dans le moteur
  - un log JSONL est ecrit dans `OpenFrontArena/logs/local-harness.jsonl`
  - plusieurs ticks live ont ete verifies
- la control room locale lit ce log et expose un dashboard live via HTTP + SSE
- l'API de session permet de lancer une partie custom locale avec plusieurs slots IA
- la control room a maintenant un toggle FR/EN
- les champs de configuration ne sont plus ecrases pendant l'edition par le flux live
- un slot `human_reserved` peut maintenant jouer des actions via le panneau operateur de la control room
- `tsc` repasse apres l'introduction du bridge vers le vrai lobby OpenFrontIO
- le backend control room redemarre et repond toujours sur `/api/dashboard`

### Reprise recommandee

Si une autre session doit reprendre ici, le bon message de reprise est :

`Reprends OpenFrontArena depuis docs/current-status.md, docs/local-control-room.md et docs/control-room-ui-status.md, puis finis la validation end-to-end du vrai lobby OpenFrontIO et du join humain.`

### Point de vigilance

- Le chemin `session/start` a maintenant deux phases si un humain reserve est actif :
  - 1er appel : preparation du lobby OpenFrontIO
  - 2e appel : lancement reel une fois les humains connectes
- La validation end-to-end n'a pas encore ete refaite avec un vrai serveur/client OpenFrontIO actifs sur `9000` / `3001` / `3002`.
- La vue players de la control room melange les bots observes et les voisins visibles en mode `intel`.
- Le panneau operateur de la control room n'est plus le chemin cible pour les humains quand on passe par le vrai lobby.
