# Game Mechanics à Expliquer aux Bots

## Boucle du jeu

OpenFront fonctionne par ticks.

A chaque tick, un bot doit raisonner sur :

- son état courant ;
- les updates récentes ;
- les actions déjà en cours ;
- ses voisins ;
- ses ressources ;
- ses objectifs.

## Concepts que le bot doit comprendre

### Territoire

- Un joueur possède des tuiles.
- Les frontières définissent ce qui est adjacent ou non.
- Une attaque terrestre n'a de sens que contre un voisin partageant une frontière.
- Certaines expansions se font contre `Terra Nullius` plutôt que contre un joueur.

### Troupes

- Les troupes servent à attaquer et à défendre.
- Le bot ne doit pas vider totalement sa réserve.
- Une attaque doit être pensée avec une réserve minimale restante.

### Types de voisins

- `land_neighbor` : voisin atteignable par frontière terrestre
- `naval_neighbor` : voisin non adjacent par terre mais potentiellement atteignable par mer
- `friendly_neighbor` : allié ou même équipe
- `hostile_neighbor` : cible potentielle

### Structures

Le moteur valorise déjà plusieurs bâtiments, qu'il faut rendre explicites au bot :

- `City` : croissance/capacité
- `Factory` : économie/logistique
- `Port` : projection navale et commerce
- `Defense Post` : défense de front
- `SAM Launcher` : couverture anti-missile
- `Missile Silo` : projection nucléaire

Le bot doit savoir :

- combien il en possède ;
- lesquels sont absents ;
- lesquels sont en construction ;
- lesquels sont exposés ;
- où ils seraient utiles.

### Diplomatie

- Alliances
- Equipes
- Embargos
- Cibles désignées
- Trahisons

Le bot doit distinguer :

- ennemi réel ;
- allié ;
- cible alliée d'un autre allié ;
- joueur hostile mais non atteignable immédiatement.

### Naval

Le moteur gère des transports navals. Il faut donc indiquer clairement :

- si une cible est atteignable par terre ou uniquement par mer ;
- depuis quelles zones côtières un transport est raisonnable ;
- quels fronts côtiers sont disponibles.

### Nucléaire et anti-nucléaire

Si ces mécaniques sont activées, le bot doit recevoir :

- l'état des silos ;
- la couverture SAM ;
- le niveau de risque nucléaire ;
- la liste des cibles stratégiques adverses.

## Erreurs classiques à éviter

- attaquer un joueur qui n'est pas voisin ;
- lancer une attaque terrestre sans frontière commune ;
- ignorer une attaque entrante majeure ;
- construire au hasard sans logique de front ou de couverture ;
- lancer une expansion alors qu'une menace immédiate est en cours ;
- ignorer l'intérêt d'un port sur une carte maritime ;
- ignorer l'état de ses propres structures.
