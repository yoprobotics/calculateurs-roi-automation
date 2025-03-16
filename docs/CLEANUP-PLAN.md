# Plan de nettoyage de code - Calculateurs ROI

Ce document détaille les éléments à nettoyer dans le cadre de la restructuration du calculateur général.

## Étape 1: Suppression des fichiers obsolètes (Complété ✓)

- Suppression du fichier `src/components/CalculateurROI.jsx` qui n'est plus utilisé
- Ajout d'un README.md dans `src/components/calculateurs/general/` pour clarifier la structure

## Étape 2: Identification des éléments à nettoyer

### Dossier calculateur-roi
Le dossier `src/components/calculateur-roi/` contient des composants qui ne semblent plus être utilisés dans la nouvelle structure:

1. `src/components/calculateur-roi/AnalyseComparative.jsx`
2. `src/components/calculateur-roi/ParametresGeneraux.jsx`
3. `src/components/calculateur-roi/ParametresSystemeActuel.jsx`
4. `src/components/calculateur-roi/ParametresSystemeAutomatise.jsx`
5. `src/components/calculateur-roi/ResultatsFinanciers.jsx`
6. `src/components/calculateur-roi/utils/calculFinancier.js` (à vérifier s'il est encore référencé)

**Action recommandée**: Vérifier si ces composants sont encore référencés dans le code. Si ce n'est pas le cas, supprimer le dossier entier.

### Autres références potentielles

Des traces de l'ancienne structure pourraient exister dans:

1. Documentation et commentaires dans le code
2. Imports non utilisés dans d'autres fichiers
3. Tests qui pourraient encore faire référence à l'ancienne structure

**Action recommandée**: Effectuer une recherche globale pour "calculateur-roi" et "CalculateurROI" dans tout le projet.

## Étape 3: Plan de migration complet

Pour assurer une transition complète vers la nouvelle structure:

1. **Unification des outils de calcul**  
   Si `calculateur-roi/utils/calculFinancier.js` contient des fonctions utiles, elles devraient être migrées vers un emplacement plus approprié comme `src/utils/` ou `src/hooks/`.

2. **Revue de l'architecture**  
   Vérifier que toutes les fonctionnalités de l'ancien calculateur ont bien été migrées vers la nouvelle structure.

3. **Normalisation des noms**  
   Adopter une convention de nommage cohérente pour tous les composants et hooks liés au calculateur général.

4. **Documentation**  
   Mettre à jour la documentation du projet, notamment le README principal, pour refléter la nouvelle structure.

5. **Optimisation des imports**  
   Revoir tous les imports dans le projet pour s'assurer qu'ils pointent vers les bons composants et qu'il n'y a pas de code mort.

## Étape 4: Tests et validation

1. **Tests fonctionnels**  
   Vérifier que toutes les fonctionnalités sont bien préservées après le nettoyage.

2. **Vérification des builds**  
   S'assurer que le projet compile sans avertissements liés à des imports manquants ou inutilisés.

3. **Revue de code**  
   Effectuer une revue de code complète pour s'assurer de la qualité et de la cohérence du code après nettoyage.

## Chronologie suggérée

1. **Immédiat (PR actuelle)** : Suppression du fichier CalculateurROI.jsx et ajout de documentation
2. **Court terme** : Investigation approfondie et suppression sécurisée du dossier `calculateur-roi`
3. **Moyen terme** : Normalisation des noms et optimisation des imports
4. **Long terme** : Revue complète de l'architecture et de la documentation

## Notes importantes

- Il est recommandé de procéder par petites PR ciblées plutôt que par une grande refactorisation.
- Chaque étape doit être testée rigoureusement pour éviter les régressions.
- La communication avec l'équipe est essentielle pour s'assurer que tout le monde comprend la nouvelle structure.
