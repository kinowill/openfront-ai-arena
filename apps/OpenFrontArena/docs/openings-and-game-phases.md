# Openings and Game Phases

## Objectif

Aider les bots à ne pas jouer chaque tick comme un problème isolé.

## Phases utiles

### Early Game

Caractéristiques :

- beaucoup d'incertitude ;
- expansion disponible ;
- peu d'infrastructure ;
- fronts pas encore stabilisés.

Priorités :

- expansion sûre ;
- lecture de carte ;
- premiers voisins ;
- éviter le sur-engagement ;
- préparer l'infrastructure adaptée à la géographie.

### Mid Game

Caractéristiques :

- premiers fronts sérieux ;
- choix entre build, guerre, diplomatie ;
- capture de petits voisins ;
- ports/factories/soutien deviennent structurants.

Priorités :

- choisir quels fronts compteront vraiment ;
- transformer l'espace gagné en puissance durable ;
- exploiter les ennemis faibles ;
- ne pas garder trop de ressources inutilisées.

### Late Game

Caractéristiques :

- moins de joueurs ;
- grands empires ;
- lignes plus stables ou fronts massifs ;
- valeur croissante des structures et du jeu stratégique.

Priorités :

- casser les positions fortes ;
- protéger les actifs critiques ;
- coordonner les focus ;
- préparer les conditions de victoire.

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

- en early, éviter de sacrifier l'avenir pour une attaque médiocre ;
- en mid, convertir l'espace en structures et en fronts gagnables ;
- en late, privilégier les décisions qui changent réellement la carte stratégique.
