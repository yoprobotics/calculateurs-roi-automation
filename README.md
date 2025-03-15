# Calculateurs ROI pour l'Automatisation Industrielle

Application web interactive permettant d'évaluer le retour sur investissement (ROI) de projets d'automatisation industrielle.

## Fonctionnalités

L'application propose deux calculateurs spécialisés :

### Calculateur d'Automatisation Générale
Évaluez la rentabilité de tout projet d'automatisation industrielle en prenant en compte :
- Coûts d'investissement (système, installation, ingénierie, formation)
- Coûts opérationnels (maintenance, énergie, formation continue)
- Économies de main d'œuvre
- Économies liées à la qualité et réduction des erreurs
- Gains de productivité
- Réduction des temps de cycle

### Calculateur Spécifique - Pâtes et Papiers
Calculateur spécialisé pour l'automatisation du désempilement et débrochage de ballots dans l'industrie des pâtes et papiers, incluant :
- Réduction des déchets et des rejets de fils métalliques
- Économies d'énergie et d'eau
- Amélioration de la qualité du produit
- Impact environnemental (réduction de l'empreinte CO2)

## Caractéristiques Techniques

- Application React interactive avec état local et contextes
- Visualisation des données avec Recharts
- Analyse financière complète (ROI, VAN, TRI, délai de récupération)
- Mode d'analyse avancé avec comparaison de scénarios et analyse de sensibilité
- Interface responsive et intuitive
- Sauvegarde locale des scénarios dans le navigateur

## Installation et lancement

```bash
# Cloner le repository
git clone https://github.com/yoprobotics/calculateurs-roi-automation.git

# Installer les dépendances
cd calculateurs-roi-automation
npm install

# Lancer l'application en mode développement
npm start
```

## Structure du Projet

```
src/
├── components/
│   ├── common/
│   │   ├── Disclaimer.jsx           # Composant d'avertissement
│   │   ├── DisclaimerModal.jsx      # Modal de disclaimer
│   │   ├── Footer.jsx               # Pied de page commun
│   │   ├── FormInput.jsx            # Input réutilisable avec validation
│   │   ├── GraphCard.jsx            # Carte pour afficher des graphiques
│   │   ├── Navbar.jsx               # Navigation principale
│   │   ├── ResultCard.jsx           # Carte pour afficher des résultats
│   │   └── Tooltip.jsx              # Infobulle réutilisable
│   ├── calculateurs/
│   │   ├── general/
│   │   │   ├── CalculateurGeneral.jsx     # Conteneur principal
│   │   │   ├── SystemeActuel.jsx          # Paramètres du système actuel
│   │   │   ├── SystemeAutomatise.jsx      # Paramètres du système automatisé
│   │   │   ├── ResultatsROI.jsx           # Affichage des résultats
│   │   │   ├── GraphiquesROI.jsx          # Visualisations des résultats
│   │   │   ├── AnalyseSensibilite.jsx     # Module d'analyse de sensibilité
│   │   │   └── GestionScenarios.jsx       # Gestion des scénarios sauvegardés
│   │   └── patespapiers/
│   │       └── CalculateurPatesPapiers.jsx # Calculateur spécifique pâtes et papiers
│   └── AppCalculateursROI.jsx        # Composant principal
├── context/
│   ├── CalculateurGeneralContext.jsx # Context pour le calculateur général
│   └── DisclaimerContext.jsx         # Context pour la gestion des disclaimers
├── hooks/
│   ├── useCalculROI.js               # Hook personnalisé pour les calculs ROI
│   ├── useFormValidation.js          # Hook pour valider les formulaires
│   └── useLocalStorage.js            # Hook pour la persistance locale
├── utils/
│   ├── calculationHelpers.js         # Fonctions de calcul
│   ├── formatters.js                 # Formatage des nombres, devises, etc.
│   ├── validators.js                 # Validation des entrées
│   └── constants.js                  # Constantes de l'application
├── App.js                            # Point d'entrée de l'application
└── index.js                          # Rendu React
```

## Fonctionnalités à venir

- Module d'export PDF des résultats
- Calculateur spécifique pour l'industrie automobile
- Calculateur spécifique pour l'industrie agroalimentaire
- Visualisations 3D des équipements
- Analyse comparative multi-scénarios
- Base de données de composants d'automatisation avec leurs coûts estimés

## Licence

[MIT](LICENSE)
