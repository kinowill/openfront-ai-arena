# Openings and Game Phases

## Objectif

Aider les bots a ne pas jouer chaque tick comme un probleme isole.

## Principe

Les phases de partie ne donnent pas un ordre d'actions obligatoire.

Elles servent a lire :

- quels leviers ont le plus de valeur maintenant ;
- quels investissements deviennent plausibles ;
- quels risques coutent le plus cher selon le moment de la partie.

## Phases utiles

### Early Game

Caracteristiques :

- beaucoup d'incertitude ;
- expansion disponible ;
- peu d'infrastructure ;
- fronts pas encore stabilises.

Questions utiles :

- combien de neutre vaut encore plus qu'un combat precoce ;
- quels voisins vont vraiment compter ;
- quelle infrastructure preparer selon la geographie ;
- combien de risque accepter avant d'avoir une base saine.

### Mid Game

Caracteristiques :

- premiers fronts serieux ;
- choix entre build, guerre, diplomatie ;
- capture de petits voisins ;
- ports, factories et soutien deviennent structurants.

Questions utiles :

- quels fronts compteront vraiment ;
- comment transformer l'espace gagne en puissance durable ;
- quels ennemis faibles ou exposes peuvent etre punis ;
- ou un angle naval ou diplomatique vaut plus qu'un simple push frontal.

### Late Game

Caracteristiques :

- moins de joueurs ;
- grands empires ;
- lignes plus stables ou fronts massifs ;
- valeur croissante des structures et du jeu strategique.

Questions utiles :

- quelle decision change vraiment la carte strategique ;
- quels actifs critiques proteger ;
- quels focus coordonner ;
- quelles conditions de victoire preparer.

## Openings types

- `fast_expand`
- `stabilize_first`
- `early_port_setup`
- `early_diplomacy`

## Signaux de transition

- `neutral_expansion_low`
- `multiple_real_fronts`
- `first_major_structure_cluster`
- `naval_path_now_relevant`
- `nuclear_threat_now_relevant`

## Heuristiques bot

- en early, eviter de sacrifier l'avenir pour une attaque mediocre ;
- en mid, convertir l'espace en structures et en fronts gagnables ;
- en late, privilegier les decisions qui changent reellement la carte strategique.

Ces heuristiques doivent rester souples. Elles n'annulent pas un coup tactique fort qui contredit le profil moyen de la phase.
