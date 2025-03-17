# Documentation du Calculateur ROI - Pâtes et Papiers

## Vue d'ensemble

Le calculateur de ROI pour l'industrie des pâtes et papiers est un outil spécialisé qui permet d'évaluer la rentabilité d'un investissement dans l'automatisation du désempilement et du débrochage de ballots. Il prend en compte les spécificités de cette industrie et fournit une analyse détaillée incluant l'impact financier, la sécurité et l'aspect environnemental.

## Architecture technique

Le calculateur a été restructuré pour suivre les meilleures pratiques de développement React, avec une architecture modulaire et optimisée:

### Structure des fichiers

```
src/
├── components/
│   ├── calculateurs/
│   │   ├── patespapiers/
│   │   │   ├── index.js                    # Point d'entrée du calculateur
│   │   │   ├── CalculateurPatesPapiers.jsx # Composant principal
│   │   │   └── CalculateurPatesPapiers.test.js # Tests unitaires
│   ├── AppCalculateursROI.jsx              # Composant conteneur
│   └── CalculateurROI.jsx                  # Autre calculateur (général)
├── utils/
│   ├── calculationHelpers.js               # Fonctions utilitaires générales
│   ├── patesPapiersHelpers.js              # Fonctions utilitaires spécifiques
│   └── patesPapiersHelpers.test.js         # Tests unitaires
```

## Améliorations apportées

### 1. Extraction de la logique métier

La logique de calcul a été extraite du composant React et déplacée dans des fonctions utilitaires spécifiques dans le fichier `patesPapiersHelpers.js`. Cela permet :
- Une meilleure séparation des préoccupations (UI vs logique métier)
- Une testabilité accrue
- Une réutilisation potentielle dans d'autres composants

Les principales fonctions extraites sont :
- `calculerROIPatesPapiers`: Calcule tous les indicateurs financiers
- `ajusterParametresSystemeActuel`: Ajuste les paramètres en fonction du type de système
- `preparerDonneesGraphiques`: Prépare les données pour les graphiques

### 2. Persistance des données

Les paramètres utilisateur sont maintenant sauvegardés automatiquement dans le localStorage :
- `sauvegarderParametres`: Sauvegarde l'état actuel dans le localStorage
- `chargerParametres`: Récupère les paramètres sauvegardés au chargement

Cela permet aux utilisateurs de retrouver leurs derniers calculs même après avoir quitté l'application ou rafraîchi la page.

### 3. Validation des données

Une validation complète des données d'entrée a été mise en place :
- Vérification des types et plages de valeurs
- Affichage d'erreurs contextuelles
- Prévention des calculs avec des données invalides

Les fonctions de validation :
- `validerChampNumerique`: Vérifie qu'une valeur est un nombre valide dans une plage donnée
- `validerParametres`: Valide l'ensemble des paramètres avant calcul

### 4. Optimisation des performances

Plusieurs techniques ont été utilisées pour améliorer les performances :
- Utilisation de `useCallback` pour les fonctions de mise à jour des états
- Utilisation de `useMemo` pour mémoriser les données de graphiques calculées
- Réduction des rendus inutiles en regroupant les états connexes

Ces optimisations sont particulièrement importantes pour une application interactive avec des calculs complexes et des graphiques.

### 5. Tests unitaires complets

Des tests unitaires ont été ajoutés pour les fonctions utilitaires et le composant principal :
- Tests des fonctions de calcul
- Tests de validation des données
- Tests de l'interface utilisateur
- Tests d'interaction utilisateur
- Tests pour la persistance

## Utilisation du calculateur

### Paramètres d'entrée principaux

1. **Type de système actuel**
   - Manuel
   - Semi-automatisé
   - Auto. (ancien)

2. **Paramètres de base**
   - Capacité actuelle (ballots/heure)
   - Nombre d'employés (ETP)
   - Heures d'opération par jour
   - Jours d'opération par an
   - Tonnage annuel
   - Marge brute par tonne

3. **Paramètres avancés**
   - Système automatisé (capacité, taux de rejets, etc.)
   - Coûts d'exploitation (maintenance, énergie, etc.)
   - Avantages du système (réduction des déchets, amélioration qualité, etc.)

### Résultats fournis

Le calculateur produit plusieurs indicateurs financiers et analyses :

1. **Indicateurs financiers**
   - ROI (Retour sur Investissement)
   - Délai de récupération (années)
   - VAN (Valeur Actuelle Nette)
   - TRI (Taux de Rendement Interne)
   - Économie annuelle moyenne

2. **Analyses graphiques**
   - Comparaison des capacités de traitement
   - Comparaison de la main d'œuvre requise
   - Économies annuelles par catégorie
   - Projection des flux de trésorerie

3. **Analyses spécifiques**
   - Impact sur la sécurité (réduction des accidents)
   - Impact environnemental (réduction des émissions de CO2)

## Maintenance et évolution

### Pour ajouter de nouveaux paramètres

1. Ajouter le paramètre dans l'état approprié dans le composant
2. Ajouter la validation correspondante dans les fonctions de validation
3. Incorporer le paramètre dans les calculs dans `calculerROIPatesPapiers`
4. Mettre à jour les tests unitaires

### Pour ajouter de nouvelles visualisations

1. Créer les données nécessaires dans `preparerDonneesGraphiques`
2. Ajouter le graphique dans l'onglet approprié du composant

## Dépendances

- React 18.x
- Recharts pour les visualisations graphiques
- TailwindCSS pour les styles