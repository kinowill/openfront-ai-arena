# OpenFrontArena

Arena et control room locale pour tester des agents OpenFrontIO avec :

- bots scriptes
- modeles locaux OpenAI-compatibles
- APIs distantes OpenAI-compatibles
- supervision live et slots humains reserves

## Demarrage rapide

Depuis la racine du workspace :

- double-clique `Launch OpenFront Arena.cmd`
- pour tout arreter : `Stop OpenFront Arena.cmd`

## Structure

- `src/` : code source
- `docs/` : docs produit, technique et handoff
- `prompts/` : prompts systeme
- `scripts/windows/` : scripts PowerShell internes
- `logs/` : sorties locales temporaires, non versionnees

## Notes

- La control room est accessible sur `http://127.0.0.1:4318`
- OpenFrontIO local tourne sur `9000 / 3000 / 3001 / 3002`
- Les checks `Local LLM` et `Remote API` dans l'UI testent la connectivite reelle du endpoint
- Les IA locales se branchent depuis l'interface, pas via un lanceur separe
