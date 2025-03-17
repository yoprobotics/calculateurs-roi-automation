# Calculateur ROI pour l'industrie des pâtes et papiers

Ce module propose un calculateur de retour sur investissement (ROI) spécifique pour l'automatisation du désempilement et débrochage de ballots dans l'industrie des pâtes et papiers.

## Structure modulaire

Le calculateur est organisé en composants modulaires qui correspondent aux différents onglets de l'interface utilisateur :

```
patespapiers/
├── CalculateurPatesPapiers.jsx    # Composant principal
├── ParametresSysteme.jsx          # Onglet "Vue générale"
├── ComparatifSystemes.jsx         # Onglet "Analyse comparative"
├── ResultatsFinanciers.jsx        # Onglet "Détails financiers"
└── ImpactEnvironnemental.jsx      # Onglet "Sécurité & Environnement"
```

## Contexte

La gestion de l'état est centralisée dans un contexte React (`CalculateurPapierContext`) qui contient :
- Les paramètres du système actuel
- Les paramètres du système automatisé
- Les paramètres généraux de l'entreprise
- Les résultats calculés
- Les fonctions de calcul du ROI

## Fonctionnalités principales

1. **Comparaison de systèmes actuels** :
   - Système manuel
   - Système semi-automatisé
   - Système automatisé ancien

2. **Calculs financiers** :
   - ROI (Retour sur Investissement)
   - VAN (Valeur Actuelle Nette)
   - TRI (Taux de Rendement Interne)
   - Délai de récupération

3. **Analyse des économies** :
   - Économies de main d'œuvre
   - Gains de productivité
   - Économies liées à la réduction des déchets
   - Économies énergétiques
   - Économies liées à la sécurité

4. **Impact environnemental et sécurité** :
   - Réduction des émissions de CO2
   - Réduction de la consommation d'eau
   - Réduction des accidents de travail

## Utilisation

Le calculateur s'intègre dans l'application principale via le composant `AppCalculateursROI` :

```jsx
import CalculateurPatesPapiers from './calculateurs/patespapiers/CalculateurPatesPapiers';

// Dans le composant AppCalculateursROI
{calculateurActif === 'patespapiers' && (
  <CalculateurPatesPapiers />
)}
```

## Visualisations

Le calculateur utilise la bibliothèque Recharts pour proposer diverses visualisations :
- Graphiques à barres pour la comparaison des systèmes
- Graphiques linéaires pour l'analyse des flux de trésorerie
- Visualisations des économies par catégorie

## Extensions futures

Voici quelques pistes d'amélioration pour les futures versions :
- Ajout d'une fonctionnalité d'export PDF des résultats
- Intégration de scénarios personnalisés sauvegardables
- Ajout d'une analyse de sensibilité
- Intégration avec des données réelles de l'industrie des pâtes et papiers
