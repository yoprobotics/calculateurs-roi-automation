# Modification des paramètres de temps de cycle et capacité

## Contexte

Dans la version précédente du calculateur, les paramètres "capacité" (unités/heure) et "temps de cycle" (secondes/unité) étaient liés et se mettaient à jour automatiquement l'un en fonction de l'autre. Cela créait une contrainte artificielle, car ces paramètres doivent pouvoir varier indépendamment selon le contexte industriel.

Par exemple, dans différentes industries ou avec différents types de produits :
- Un produit pourrait avoir un temps de cycle de 30 secondes mais une capacité effective de 80 unités/heure (au lieu de 120 théoriques) en raison de manipulations entre les cycles.
- Une ligne de production pourrait avoir des temps de cycle variables selon les produits mais une capacité maximale fixe due à d'autres contraintes de la ligne.

## Modifications effectuées

1. **Système actuel (SystemeActuel.jsx)** :
   - Supprimé les fonctions de synchronisation (`calculerTempsCycle`, `calculerCapacite`, `updateCapacite`, `updateTempsCycle`)
   - Modifié les gestionnaires d'événement pour mettre à jour chaque paramètre indépendamment
   - Mis à jour le texte d'aide pour indiquer que les paramètres peuvent être définis indépendamment

2. **Système automatisé (SystemeAutomatise.jsx)** :
   - Supprimé les fonctions de synchronisation similaires
   - Modifié les gestionnaires d'événement pour permettre des valeurs indépendantes
   - Mis à jour le texte d'aide pour indiquer que les paramètres peuvent être définis indépendamment

## Avantages

Cette modification offre plusieurs avantages :
- Plus grande flexibilité pour les utilisateurs pour représenter fidèlement leurs processus de production
- Meilleure adaptabilité du calculateur à différents contextes industriels
- Possibilité de modéliser des situations où la capacité effective diffère de la capacité théorique
- Amélioration de la précision des calculs de ROI dans des scénarios réels

## Note technique

Les calculs dans le hook useCalculROI.js n'ont pas nécessité de modifications car les paramètres étaient déjà utilisés de manière indépendante dans les calculs financiers.
