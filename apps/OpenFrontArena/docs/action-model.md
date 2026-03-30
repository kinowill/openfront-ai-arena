# Action Model

## Objectif

Definir un contrat d'actions assez strict pour eviter les erreurs mecaniques, sans transformer la strategie en script rigide.

## Principe

Le moteur doit fournir au bot un ensemble d'actions valides ou validables, avec assez de contexte pour comparer leurs trade-offs.

Le modele ne doit pas reinventer les regles. Il doit choisir intelligemment entre les options.

## Familles d'actions

- `wait`
- `expand`
- `build_structure`
- `attack_land`
- `attack_naval`
- `assist_ally`
- `set_target`
- `diplomacy`

## Intention strategique

Chaque action candidate peut etre accompagnee d'une intention ou d'un but, par exemple :

- `safe_expansion`
- `stabilize_front`
- `convert_eco`
- `prepare_naval_access`
- `open_second_front`
- `punish_exposed_enemy`
- `assist_ally_under_pressure`

Ces intentions servent a expliquer et comparer. Elles ne remplacent pas la validation mecanique.

## Contraintes par action

### `expand`

Doit cibler :

- `Terra Nullius`
- ou une region explicitement marquee comme expansion faisable.

### `attack_land`

Conditions :

- frontiere terrestre ou chemin terrestre confirme ;
- cible non alliee ;
- cout et execution possibles ;
- action coherente avec l'etat reel du front.

### `attack_naval`

Conditions :

- zone cotiere de depart disponible ;
- projection navale reelle ou preparable selon les actions autorisees ;
- cible non alliee ;
- interet strategique reel.

Important :

- une action navale n'exige pas que la cible soit impossible a atteindre par terre ;
- elle est valide si la projection navale existe et si elle correspond a un angle utile.

Usages typiques :

- atteindre une cible hors portee terrestre ;
- contourner un front dense ;
- ouvrir un second front ;
- frapper une cote ou un arriere plus faible ;
- accelerer un timing offensif.

### `build_structure`

Conditions :

- type de batiment autorise ;
- tuile buildable ;
- cout disponible ;
- justification strategique.

### `assist_ally`

Conditions :

- allie existant ;
- front d'assistance atteignable ;
- aide qui n'ouvre pas un risque disproportionne ailleurs ;
- action executable.

## Ce qu'il ne faut pas faire

- encoder une heuristique comme si c'etait une condition legale ;
- imposer un ordre global entre defense, build, expansion et attaque ;
- faire du naval une simple case "sinon impossible par terre" ;
- transformer `wait` en comportement refuge systematique.

## Format recommande pour une action candidate

```json
{
  "action_type": "attack_naval",
  "target": "player_3",
  "reason": "Naval flank opens a weaker coastal angle than the saturated land border.",
  "confidence": 0.74,
  "strategic_goal": "open_second_front"
}
```
