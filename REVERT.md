
# Annulation des PR 29, 30 et 31

Ce commit annule les Pull Requests suivantes qui ont causé une régression dans le code :

1. PR #29 : "Organisation des PRs existantes - Disclaimer et Calculateur amélioré"
2. PR #30 : "Finalisation de l'implémentation des recommandations de la PR #29"
3. PR #31 : "Correction des erreurs de hooks dans CalculateurGeneralContext"

La régression était liée à des problèmes d'implémentation du mode comparatif dans le calculateur général. 

Après cette annulation, nous ferons valider la PR #34 "HOTFIX: Correctif pour l'implémentation du mode comparatif dans le calculateur général" qui contient les corrections nécessaires.
