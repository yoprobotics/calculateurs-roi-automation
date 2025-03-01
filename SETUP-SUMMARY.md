# Résumé de l'organisation du projet GitHub

Ce document résume la configuration et l'organisation mises en place pour le projet Calculateurs ROI Automation.

## Structure du projet

```
calculateurs-roi-automation/
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # Configuration CI/CD pour GitHub Actions
├── docs/
│   └── formules-financieres.md  # Documentation des formules utilisées
├── public/                   # Fichiers statiques
├── src/
│   ├── components/
│   │   ├── AppCalculateursROI.jsx  # Composant principal 
│   │   ├── CalculateurROI.jsx      # Calculateur général
│   │   ├── CalculateurPatesPapiers.jsx  # Calculateur pâtes et papiers
│   │   └── PDFExport.jsx      # Composant d'export PDF (en développement)
│   ├── utils/
│   │   ├── calculationHelpers.js     # Fonctions utilitaires de calcul
│   │   └── calculationHelpers.test.js  # Tests unitaires
│   ├── App.js                # Point d'entrée de l'application
│   └── index.js              # Fichier d'initialisation
├── .gitignore                # Configuration des fichiers ignorés
├── CONTRIBUTING.md           # Guide de contribution
├── LICENSE                   # Licence du projet
├── package.json              # Configuration des dépendances
├── README.md                 # Documentation principale
└── ROADMAP.md                # Feuille de route du projet
```

## Issues et suivi du projet

### Issues principales ouvertes

1. **Issue #1**: Configuration initiale du projet React
2. **Issue #2**: Implémentation du calculateur général d'automatisation
3. **Issue #3**: Implémentation du calculateur spécifique aux pâtes et papiers
4. **Issue #4**: Implémentation de l'export PDF des résultats
5. **Issue #6**: Fonctionnalité de sauvegarde persistante des calculs
6. **Issue #7**: Amélioration de l'interface utilisateur pour mobile
7. **Issue #8**: Mise en place de tests unitaires et d'intégration complets

### Pull Requests

1. **PR #5**: Ajout de la fonctionnalité d'export PDF (en attente d'améliorations)

## Branches

1. **main**: Branche principale avec code stable
2. **feature/export-pdf**: Développement de la fonctionnalité d'export PDF

## Workflow de développement

1. **Gestion des issues**: Toute nouvelle fonctionnalité commence par une issue
2. **Branches de fonctionnalités**: Création d'une branche spécifique pour chaque fonctionnalité
3. **Pull Requests**: Code review obligatoire avant merge dans main
4. **Tests**: Tests automatisés via GitHub Actions
5. **Déploiement**: Déploiement automatique après merge dans main

## CI/CD

Un workflow GitHub Actions a été configuré pour:
- Lancer les tests automatiquement lors des PR et des push sur main
- Construire l'application
- Préparer le déploiement (à configurer selon votre plateforme de déploiement)

## Prochaines étapes suggérées

1. **Finaliser l'export PDF**: Finaliser la PR #5 avec les améliorations suggérées
2. **Implémentation des tests**: Commencer à travailler sur l'issue #8
3. **Optimisation mobile**: Adapter l'interface pour les appareils mobiles (issue #7)
4. **Sauvegarde persistante**: Implémenter la sauvegarde en local storage (issue #6)

## Comment utiliser cette configuration

Cette organisation vous permet de:
1. **Suivre l'avancement**: Utiliser les issues pour suivre le progrès
2. **Collaborer efficacement**: Le workflow de branches et PR facilite la collaboration
3. **Maintenir la qualité**: Les tests et le CI/CD assurent la qualité du code
4. **Planifier le développement**: La feuille de route (ROADMAP.md) définit les priorités

Pour commencer à travailler sur une nouvelle fonctionnalité:
```bash
# Cloner le repository
git clone https://github.com/yoprobotics/calculateurs-roi-automation.git
cd calculateurs-roi-automation

# Créer une branche pour la fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Développer et tester localement
npm install
npm start

# Soumettre les modifications
git add .
git commit -m "Description des modifications"
git push origin feature/nom-de-la-fonctionnalite

# Créer une Pull Request via l'interface GitHub
```