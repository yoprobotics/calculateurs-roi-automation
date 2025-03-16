# Calculateur Général d'Automatisation Industrielle

Ce dossier contient les composants qui constituent le calculateur général d'automatisation industrielle.

## Structure actuelle

- `CalculateurGeneral.jsx`: Composant principal qui intègre tous les autres composants
- `NavigationParAncres.jsx`: Barre de navigation par ancres pour faciliter la navigation dans la page
- `SystemeActuel.jsx`: Formulaire pour les paramètres du système actuel
- `SystemeAutomatise.jsx`: Formulaire pour les paramètres du système automatisé
- `OngletProduction.jsx`: Analyse détaillée de la production
- `OngletSecurite.jsx`: Analyse de sécurité et impact environnemental
- `ResultatsROI.jsx`: Résultats financiers du calcul
- `GraphiquesROI.jsx`: Visualisations graphiques des comparaisons et économies

## Organisation et flux

Le calculateur suit un flux logique en commençant par la saisie des paramètres, puis en présentant les analyses et les résultats:

1. **Paramètres des systèmes**: Configuration des caractéristiques des systèmes actuel et automatisé
2. **Analyse de production**: Visualisation de l'impact sur la production
3. **Résultats financiers**: Indicateurs ROI, VAN, TRI, etc.
4. **Graphiques comparatifs**: Visualisations des économies et différences
5. **Sécurité & Environnement**: Impact sur la sécurité et l'environnement
6. **Recommandation**: Conclusion basée sur l'analyse globale

## Contexte et état

Le calculateur utilise le contexte React fourni par `CalculateurGeneralContext` pour gérer l'état global de l'application. Tous les composants accèdent aux données et aux fonctions via ce contexte en utilisant le hook `useCalculateurGeneral()`.

## Note importante

> ⚠️ **Ne plus utiliser l'ancien fichier `CalculateurROI.jsx`**. Toutes les modifications doivent être apportées dans cette nouvelle structure avec `CalculateurGeneral.jsx` comme point d'entrée.

## Structure des dossiers

```
src/
├── components/
│   ├── calculateurs/
│   │   └── general/         # Dossier actuel - Nouvelle structure
│   │       ├── CalculateurGeneral.jsx
│   │       ├── NavigationParAncres.jsx
│   │       ├── SystemeActuel.jsx
│   │       ├── SystemeAutomatise.jsx
│   │       └── ...
│   └── AppCalculateursROI.jsx  # Point d'entrée qui importe CalculateurGeneral
└── context/
    └── CalculateurGeneralContext.jsx  # Gestion de l'état global
```
