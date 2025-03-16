
# Annulation des PR problématiques

Ce commit annule les Pull Requests suivantes qui ont causé une régression dans le code :

1. PR #32 : "Intégration des onglets Production et Sécurité dans le calculateur général"
2. PR #33 : "Refactorisation du calculateur général avec mode comparatif unique"

Cette annulation, combinée avec l'annulation précédente des PR #29, #30 et #31, permet de revenir à un état stable de l'application.

Après ces annulations, nous préparons la validation de la PR #34 "HOTFIX: Correctif pour l'implémentation du mode comparatif dans le calculateur général" qui contient les corrections nécessaires pour une implémentation correcte du mode comparatif unique dans le calculateur général.
