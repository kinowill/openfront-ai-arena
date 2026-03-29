# Local Control Room

## Objectif

La control room locale sert de couche d'exploitation pour `OpenFrontArena`.
Elle permet de :

- suivre un match en direct depuis les logs de tick
- visualiser les joueurs, fronts, decisions et commentaires
- configurer les slots, les backends IA et les options de partie
- lancer ou arreter une partie custom locale
- verifier si un backend `local_llm` ou `remote_api` est configure
- preparer une interface unique avant de brancher une UI plus riche ou multi-match

## Etat actuel

Le MVP expose :

- `GET /api/state` : snapshot complet du dernier etat agrege
- `GET /api/dashboard` : payload unifie `controlRoom + session`
- `GET /api/events` : flux SSE pour mise a jour live
- `GET /api/session` : config et runtime de session
- `PUT /api/session` : mise a jour de la configuration
- `POST /api/session/start` : lancement d'une partie custom locale
- `POST /api/session/stop` : arret de la session courante
- `src/control-room/ui/index.html` : dashboard local
- `src/control-room/ui/app.js` : rendu client
- `src/control-room/ui/styles.css` : presentation accessible

Le backend lit le fichier :

- `OpenFrontArena/logs/local-harness.jsonl`

## Lancement

Depuis `OpenFrontArena` :

```powershell
npm run control-room:start
```

Puis ouvrir :

```text
http://127.0.0.1:4318
```

## Lanceur sans commande

Depuis l'explorateur Windows, tu peux maintenant utiliser :

- `launch-control-room.cmd` : demarre la control room sur un port libre entre `4318` et `4330`, puis ouvre le navigateur
- `launch-control-room-suite.cmd` : demarre la control room et le client OpenFront local pour avoir une vraie surface de match a cote
- `stop-control-room.cmd` : ferme les instances Node de control room sur cette plage de ports

## Alimenter le flux live

Pour generer un tick unique :

```powershell
npm run harness:local
```

Pour lancer un mini match de dev en continu :

```powershell
npm run harness:live
```

Variables utiles :

- `OPENFRONT_BOTS_LIVE_TICKS` : nombre de ticks a jouer
- `OPENFRONT_BOTS_LIVE_DELAY_MS` : pause entre ticks
- `OPENFRONT_BOTS_CONTROL_ROOM_PORT` : port HTTP de la control room

## Composition de match

L'interface permet maintenant de :

- activer ou desactiver chaque slot
- choisir `bot` ou `human_reserved`
- choisir `greedy_expand`, `local_llm`, `remote_api` ou `human_operator`
- renseigner `model`, `baseUrl` et `apiKeyEnv` par slot
- choisir `ffa` ou `team`
- regler `tickDelayMs`, `maxTicks`, `infiniteGold`, `infiniteTroops`, `instantBuild`

## Vue OpenFront

La control room embarque maintenant aussi une surface OpenFront via iframe :

- cible par defaut : `http://127.0.0.1:9000`
- bouton pour ouvrir la vue dans un onglet
- bouton pour recharger la vue

Le lanceur `launch-control-room-suite.cmd` est la facon la plus simple de demarrer :

- la control room
- la vue OpenFront locale

## Integrations IA

Statut local LLM :

- `OPENFRONT_BOTS_LOCAL_LLM_BASE_URL`
- `OPENFRONT_BOTS_LOCAL_LLM_MODEL`

Statut remote API :

- `OPENFRONT_BOTS_REMOTE_API_BASE_URL`
- `OPENFRONT_BOTS_REMOTE_API_MODEL`
- `OPENFRONT_BOTS_REMOTE_API_KEY`

Ces variables ne declenchent pas encore automatiquement le choix du bot dans le harness live. Elles sont exposees dans l'UI pour preparer l'integration operateur.

## Limites actuelles

- la partie custom tourne sur le harness local et la carte de dev `ocean_and_land`
- le join direct d'un humain dans le match n'est pas encore cable au client multijoueur OpenFrontIO
- un slot `human_reserved` reserve bien une place dans la composition, mais sans transport reseau pour l'instant
- la vue OpenFront embarquee est une surface locale separee, pas encore branchee au meme match que la control room

## Suite recommandee

Les prochaines ameliorations utiles sont :

- passer du harness local a un vrai bridge match OpenFrontIO joignable
- support multi-bots et multi-match
- cartes et overlays plus riches pour le theatre d'operations
- comparaison cote a cote entre baseline, local LLM et API distante
