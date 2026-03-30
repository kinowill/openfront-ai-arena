# Game Mechanics

## Objectif

Poser un resume mecanique clair pour les bots, sans y glisser de doctrine strategique deguisee.

## Territoire et frontieres

- Un joueur possede des tuiles.
- Les frontieres definissent l'adjacence terrestre.
- Une attaque terrestre n'a de sens que contre une cible atteignable par voie terrestre.
- Certaines expansions se font contre `Terra Nullius` plutot que contre un joueur.

## Troupes

- Les troupes servent a attaquer et a defendre.
- Le bot ne doit pas raisonner comme si toute reserve devait toujours etre preservee au maximum.
- Une attaque doit etre evaluee en tenant compte du risque de contre-attaque, du tempo et du gain attendu.

## Types de voisins

- `land_neighbor` : voisin atteignable par voie terrestre
- `naval_neighbor` : voisin atteignable par projection navale, qu'il soit ou non deja joignable par terre
- `friendly_neighbor` : allie ou meme equipe
- `hostile_neighbor` : cible potentielle

Le terme `naval_neighbor` ne doit pas vouloir dire "uniquement joignable par mer". Il decrit un vecteur de projection naval pertinent.

## Structures

Le moteur valorise deja plusieurs batiments, qu'il faut rendre explicites au bot :

- `City` : croissance ou capacite
- `Factory` : economie ou logistique
- `Port` : projection navale et commerce
- `Defense Post` : defense de front
- `SAM Launcher` : couverture anti-missile
- `Missile Silo` : projection nucleaire

Le bot doit savoir :

- combien il en possede ;
- lesquels sont absents ;
- lesquels sont en construction ;
- lesquels sont exposes ;
- ou ils seraient utiles.

## Diplomatie

- Alliances
- Equipes
- Embargos
- Cibles designees
- Trahisons

Le bot doit distinguer :

- ennemi reel ;
- allie ;
- cible alliee d'un autre allie ;
- joueur hostile non encore engage.

## Naval

Le moteur gere des transports navals. Il faut donc indiquer clairement :

- si une cible est atteignable par terre ;
- si une projection navale est disponible ;
- depuis quelles zones cotieres un transport est raisonnable ;
- quels fronts cotiers sont disponibles ;
- quelle valeur strategique a un angle naval par rapport a la voie terrestre.

Le naval ne doit pas etre presente comme une simple solution de secours quand la terre est impossible. C'est un vecteur d'attaque a part entiere.

## Nucleaire et anti-nucleaire

Si ces mecaniques sont actives, le bot doit recevoir :

- l'etat des silos ;
- la couverture SAM ;
- le niveau de risque nucleaire ;
- la liste des cibles strategiques adverses.

## Erreurs classiques a eviter

- attaquer un joueur non atteignable par le vecteur choisi ;
- lancer une attaque terrestre sans acces terrestre ;
- sous-estimer une menace entrante majeure ;
- construire au hasard sans logique de front ou de couverture ;
- ignorer un angle naval fort sous pretexte qu'une frontiere terrestre existe aussi ;
- confondre "heuristique souvent utile" et "regle dure du jeu".
