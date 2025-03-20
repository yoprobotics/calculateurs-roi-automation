# Calculateur ROI - Industrie des Pâtes et Papiers

Ce module fournit un calculateur de retour sur investissement (ROI) spécialement conçu pour l'industrie des pâtes et papiers. Il permet d'évaluer la rentabilité d'une solution automatisée de désempilement et débrochage de ballots.

## Fonctionnalités

- **Analyse financière détaillée** : ROI, délai de récupération, VAN, TRI
- **Comparaison visuelle** des systèmes actuel et automatisé
- **Analyse de sécurité** et impact environnemental
- **Exportation des résultats** en PDF
- **Sauvegarde automatique** des données via le stockage local
- **Impression optimisée** avec des styles dédiés
- **Génération de rapports complets**

## Structure du module

Le calculateur est organisé de manière modulaire avec les composants suivants :

```
patesPapiers/
├── CalculateurPatesPapiers.jsx      # Composant principal
├── constants.js                     # Constantes et valeurs par défaut
├── components/                      # Sous-composants du calculateur
│   ├── ActionButtons.jsx            # Boutons d'action (export, impression)
│   ├── Header.jsx                   # En-tête du calculateur
│   ├── Navigation.jsx               # Navigation par onglets
│   ├── ParametresBase.jsx           # Formulaire des paramètres de base
│   ├── ParametresAvances.jsx        # Formulaire des paramètres avancés
│   ├── RapportComplet.jsx           # Vue du rapport complet
│   ├── ResetButton.jsx              # Bouton de réinitialisation
│   ├── ResultatsSommaire.jsx        # Résumé des résultats
│   ├── graphiques/                  # Composants de visualisation
│   └── onglets/                     # Composants pour chaque onglet
├── hooks/                          # Hooks personnalisés
│   ├── useCalculROI.js              # Calcul du ROI et résultats financiers
│   ├── useGraphiques.js             # Préparation des données pour graphiques
│   ├── useParametres.js             # Gestion des paramètres
│   └── useStorage.js                # Gestion du stockage local
├── styles/                         # Feuilles de style
│   └── printStyles.css              # Styles pour l'impression
├── utils/                          # Utilitaires
│   └── PDFExport.js                 # Export PDF avec jsPDF
└── __tests__/                      # Tests unitaires
    ├── useCalculROI.test.js         # Tests pour le hook de calcul
    ├── useParametres.test.js        # Tests pour le hook de paramètres
    └── ...                          # Autres tests
```

## Utilisation

Pour intégrer le calculateur dans une application React :

```jsx
import CalculateurPatesPapiers from './components/patesPapiers/CalculateurPatesPapiers';

function App() {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold my-4">Calculateur ROI - Pâtes et Papiers</h1>
      <CalculateurPatesPapiers />
    </div>
  );
}
```

## Tests

Ce module comprend une suite complète de tests unitaires. Pour exécuter les tests :

```bash
# À partir du répertoire patesPapiers
npm test
```

Pour voir la couverture de code :

```bash
npm run test:coverage
```

## Dépendances

- React 18+
- Recharts pour les visualisations
- jsPDF et jspdf-autotable pour l'exportation PDF
- html2canvas pour la capture du rapport

## Maintenance

Pour ajouter ou modifier des fonctionnalités :

1. Respectez l'architecture modulaire existante
2. Ajoutez des tests unitaires pour les nouvelles fonctionnalités
3. Assurez-vous que les exportations PDF et les impressions fonctionnent correctement

Pour toute question ou problème, veuillez contacter l'équipe de développement.
