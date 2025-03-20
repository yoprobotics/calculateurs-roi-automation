# Guide de contribution - Calculateur ROI Pâtes et Papiers

Ce document fournit des directives pour contribuer au développement du calculateur ROI pour l'industrie des pâtes et papiers.

## Environnement de développement

1. Clonez le dépôt
2. Installez les dépendances avec `npm install`
3. Lancez l'environnement de développement avec `npm start`

## Standards de code

- Respectez la structure modulaire existante
- Utilisez des composants fonctionnels avec hooks
- Suivez les conventions de nommage camelCase pour les variables et fonctions
- Documentez les fonctions et composants avec JSDoc

## Tests

- Écrivez des tests unitaires pour tous les nouveaux composants et fonctionnalités
- Exécutez les tests avec `npm test`
- Maintenez une couverture de code élevée

### Commandes pour les tests

```bash
# Exécuter tous les tests
npm test

# Mode surveillance pour le développement
npm run test:watch

# Vérifier la couverture de code
npm run test:coverage
```

## Processus de contribution

1. Créez une nouvelle branche depuis `main`
2. Développez votre fonctionnalité ou correction
3. Écrivez les tests unitaires appropriés
4. Mettez à jour la documentation si nécessaire
5. Soumettez une pull request

## Conseils pour les revues de code

- Les PR doivent avoir au moins un approbateur
- Tous les tests doivent passer
- Le code doit respecter les standards définis

## Conseils pour les nouvelles fonctionnalités

Si vous souhaitez ajouter une nouvelle fonctionnalité majeure, veuillez d'abord ouvrir une issue pour discuter de l'implémentation prévue.

Pour les extensions courantes, voici quelques conseils :

1. **Ajout d'un nouveau type de graphique** :
   - Créez un nouveau composant dans le dossier `graphiques/`
   - Ajoutez les données nécessaires dans le hook `useGraphiques.js`
   - Ajoutez des tests pour le nouveau composant

2. **Modification des calculs financiers** :
   - Mettez à jour le hook `useCalculROI.js`
   - Ajoutez des tests unitaires pour les nouveaux calculs
   - Mettez à jour la documentation si nécessaire

3. **Extension pour une autre industrie** :
   - Créez un nouveau dossier au même niveau que `patesPapiers/`
   - Réutilisez la structure modulaire et adaptez les calculs spécifiques
   - Créez des tests pour le nouveau module

## Rapport de bugs

Si vous rencontrez un bug, veuillez ouvrir une issue avec :
- Une description claire du problème
- Les étapes pour reproduire
- Le comportement attendu vs. observé
- Captures d'écran si pertinent
