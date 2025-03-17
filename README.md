# Calculateurs ROI pour l'Automatisation Industrielle

Application web interactive permettant d'évaluer le retour sur investissement (ROI) de projets d'automatisation industrielle.

## Fonctionnalités

L'application propose deux calculateurs spécialisés :

### Calculateur d'Automatisation Générale
Évaluez la rentabilité de tout projet d'automatisation industrielle en prenant en compte :
- Coûts d'investissement (système, installation, ingénierie, formation)
- Coûts opérationnels (maintenance, énergie)
- Économies de main d'œuvre
- Économies liées à la qualité et réduction des erreurs
- Gains de productivité

### Calculateur Spécifique - Pâtes et Papiers
Calculateur spécialisé pour l'automatisation du désempilement et débrochage de ballots dans l'industrie des pâtes et papiers, incluant :
- Réduction des déchets et des rejets de fils métalliques
- Économies d'énergie et d'eau
- Amélioration de la qualité du produit
- Impact environnemental (réduction de l'empreinte CO2)

## Caractéristiques Techniques

- Application React interactive avec état local
- Visualisation des données avec Recharts
- Analyse financière complète (ROI, VAN, TRI, délai de récupération)
- Mode d'analyse avancé avec comparaison de scénarios et analyse de sensibilité
- Interface responsive et intuitive

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
│   ├── CalculateurROI.jsx           # Calculateur général
│   ├── CalculateurPatesPapiers.jsx  # Calculateur spécifique pâtes et papiers
│   └── AppCalculateursROI.jsx       # Composant principal intégrant les deux calculateurs
├── utils/
│   └── calculationHelpers.js        # Fonctions utilitaires pour les calculs financiers
└── App.js                           # Point d'entrée de l'application
```

## Déploiement

Cette application est déployée automatiquement à chaque push sur la branche principale. Pour forcer un déploiement, vous pouvez :
- Déclencher un déploiement manuel depuis l'interface de votre plateforme (Vercel/Netlify)
- Vérifier les journaux de déploiement pour identifier d'éventuels problèmes

## Licence

[MIT](LICENSE)
