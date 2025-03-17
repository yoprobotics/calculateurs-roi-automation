# Structure Modulaire du Calculateur Pâtes et Papiers

Ce dossier contient l'implémentation restructurée du calculateur spécifique pour l'industrie des pâtes et papiers, suivant une architecture modulaire pour améliorer la maintenabilité et la testabilité.

## Organisation

- `CalculateurPatesPapiers.jsx` : Composant principal qui orchestre les sous-composants
- `ParametresSysteme.jsx` : Gestion de la vue générale et des paramètres de base
- `ComparatifSystemes.jsx` : Visualisations et tableaux comparatifs
- `ResultatsFinanciers.jsx` : Détails financiers et flux de trésorerie
- `ImpactEnvironnemental.jsx` : Analyses de sécurité et impact environnemental

## Architecture

L'architecture suit un modèle de composants modulaires avec un contexte React partagé pour la gestion d'état. Chaque composant a une responsabilité spécifique :

1. **CalculateurPatesPapiers** : 
   - Composant racine qui orchestre les autres composants
   - Gère la navigation entre les onglets
   - Maintient le contexte global pour les paramètres et les résultats

2. **ParametresSysteme** :
   - Gère l'affichage et la modification des paramètres de base
   - Affiche la vue générale du système
   - Permet la configuration du type de système actuel

3. **ComparatifSystemes** :
   - Affiche les visualisations comparatives entre le système actuel et automatisé
   - Génère des graphiques de comparaison de capacité, d'employés, etc.
   - Présente les économies annuelles par catégorie

4. **ResultatsFinanciers** :
   - Affiche les détails financiers et flux de trésorerie
   - Visualise le ROI, la VAN, le TRI, etc.
   - Présente les projections financières

5. **ImpactEnvironnemental** :
   - Affiche les analyses de sécurité et impact environnemental
   - Visualise les réductions d'émissions CO2
   - Présente les améliorations de sécurité

## Avantages de cette architecture

1. **Maintenance simplifiée** : Chaque composant est plus petit et plus facile à comprendre
2. **Responsabilités séparées** : Chaque composant a une responsabilité unique
3. **Réutilisation facilitée** : Les composants peuvent être réutilisés dans d'autres parties de l'application
4. **Tests unitaires** : Structure plus adaptée aux tests unitaires
5. **Évolutivité** : Facilite l'ajout de nouvelles fonctionnalités

## Utilisation

Pour utiliser ce calculateur dans l'application :

```jsx
import CalculateurPatesPapiers from './components/calculateurs/patespapiers';

function App() {
  return (
    <div className="App">
      <CalculateurPatesPapiers />
    </div>
  );
}
```
