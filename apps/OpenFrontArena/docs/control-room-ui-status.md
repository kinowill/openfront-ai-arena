# Control Room UI Status

## 2026-03-29

### Etat actuel

La control room n'est plus seulement un dashboard de debug.
Elle sert maintenant aussi de console operateur locale.

Elle couvre deja :

- configuration de match locale
- slots bot / humain reserve
- choix de backend par slot
- lancement / arret de session
- supervision live
- minimap live
- participation operateur pour les slots `human_reserved`
- lanceur Windows sans commande

## Ameliorations deja faites

- interface plus evidente avec navigation :
  - `Configuration`
  - `Match Live`
  - `Participer`
  - `Analyses`
- affichage francais par defaut
- toggle `FR / EN`
- correction du bug UX ou le flux live reinitialisait les selections pendant l'edition
- ajout d'un panneau `Participer au match`
- ajout d'un endpoint `POST /api/operator/execute`

## Ce qui a ete valide

- `tsc` passe
- le dashboard repond
- une session custom peut etre lancee
- une session avec slot humain reserve a ete testee
- une action operateur a ete executee avec succes pendant une session active

## Limites actuelles

- la vue du match est une minimap, pas encore la vraie scene OpenFrontIO
- le join humain complet dans le client OpenFrontIO n'est pas encore cable
- la participation humaine passe pour l'instant par le panneau operateur de la control room
- la control room reste encore trop "outil interne" sur certains ecrans

## Suite recommandee

1. brancher une vraie vue OpenFrontIO dans la control room ou a cote
2. connecter un slot humain reserve au vrai client / transport OpenFrontIO
3. ajouter un mode `Essentiel` et un mode `Avance`
4. simplifier encore les libelles et la densite d'information
