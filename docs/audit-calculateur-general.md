# Audit du Calculateur ROI Général

Ce document présente une analyse détaillée des incohérences et opportunités d'amélioration identifiées dans le calculateur ROI général, visant à le rendre plus flexible et applicable à différents contextes industriels.

## 1. Incohérences dans la nomenclature des composants

### Problèmes identifiés:
- **Incohérence de nommage**: Le composant principal du calculateur s'appelle `CalculateurGeneral` dans la structure des fichiers (`src/components/calculateurs/general/CalculateurGeneral.jsx`), alors que d'autres éléments du code font référence à un "calculateur ROI" (`src/components/CalculateurROI.jsx`).
- **Confusion entre les fichiers**: Le fichier `src/components/CalculateurROI.jsx` existe mais est vide, créant une ambiguïté sur le composant principal à utiliser.
- **Nomenclature désorganisée**: Mélange entre les termes "general", "roi", "calculateur" sans convention claire.

### Recommandation:
- Adopter une convention de nommage cohérente pour tous les composants.
- Renommer les composants pour refléter précisément leur fonction.
- Supprimer les fichiers inutilisés ou vides pour éviter toute confusion.
- Proposition de structure de nommage:
  ```
  src/components/calculateurs/
  ├── general/
  │   ├── CalculateurROIGeneral.jsx  (renommer de CalculateurGeneral.jsx)
  │   └── [autres composants]
  ├── patespapiers/
  │   ├── CalculateurROIPatesPapiers.jsx
  │   └── [autres composants]
  └── [autres types de calculateurs]
  ```

## 2. Incohérences dans les paramètres de production

### Problèmes identifiés:
- **Relation implicite entre temps de cycle et capacité**: Les deux paramètres (`tempsCycle` et `capacite`) sont définis indépendamment, mais sont en réalité mathématiquement liés.
- **Absence de synchronisation**: Aucun mécanisme n'assure que si l'utilisateur modifie le temps de cycle, la capacité soit automatiquement mise à jour, et vice versa.
- **Unités de production non personnalisables**: Rigidité dans la définition des unités (ballots, unités, etc.) qui ne s'adaptent pas aux différents contextes industriels.

### Recommandation:
- Implémenter une synchronisation optionnelle entre les paramètres liés:
  ```javascript
  const synchroniserTempsCycleCapacite = (tempsCycle, setCapacite) => {
    if (tempsCycle > 0) {
      // 3600 secondes dans une heure
      setCapacite(Math.round(3600 / tempsCycle));
    }
  };
  
  const synchroniserCapaciteTempsCycle = (capacite, setTempsCycle) => {
    if (capacite > 0) {
      setTempsCycle(Math.round(3600 / capacite));
    }
  };
  ```
- Ajouter des champs pour personnaliser les unités de mesure:
  ```javascript
  const [uniteProduction, setUniteProduction] = useState('unités');
  const [uniteTempsCycle, setUniteTempsCycle] = useState('secondes');
  ```

## 3. Absence de distinction claire entre système actuel et automatisé

### Problèmes identifiés:
- **Interface non optimisée pour la comparaison**: L'interface actuelle ne permet pas une comparaison visuelle claire des deux systèmes.
- **Paramètres similaires dupliqués**: Plusieurs paramètres sont répétés entre les systèmes actuel et automatisé sans structure commune.

### Recommandation:
- Restructurer l'interface en deux colonnes parallèles pour visualiser directement les différences:
  ```jsx
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Système actuel */}
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-red-700">
        Système Actuel
      </h2>
      {/* Formulaires pour le système actuel */}
    </div>
    
    {/* Système automatisé */}
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Système Automatisé
      </h2>
      {/* Formulaires pour le système automatisé */}
    </div>
  </div>
  ```
- Créer une structure de données commune pour les paramètres partagés entre les systèmes.

## 4. Paramètres manquants ou incomplets pour une analyse complète

### Problèmes identifiés:
- **Coûts cachés insuffisamment modélisés**: Certains coûts indirects ou cachés sont absents ou insuffisamment pris en compte.
- **Paramètres environnementaux limités**: Impact environnemental insuffisamment modélisé pour certaines industries.
- **Aspects réglementaires négligés**: Pas de prise en compte des contraintes ou avantages réglementaires (normes, certifications).

### Recommandation:
Ajouter les paramètres suivants:
```javascript
// Coûts cachés
const [coutsMisesANiveauSoftware, setCoutsMisesANiveauSoftware] = useState(12000); // $ tous les 2 ans
const [coutsIntegrationSysteme, setCoutsIntegrationSysteme] = useState(18000); // $ à l'installation
const [coutsArretProduction, setCoutsArretProduction] = useState(15000); // $ pendant l'installation

// Aspects réglementaires
const [economiesCertifications, setEconomiesCertifications] = useState(8000); // $/an
const [reductionCoutsAssurance, setReductionCoutsAssurance] = useState(15); // % par an
```

## 5. Flexibilité limitée pour différents contextes industriels

### Problèmes identifiés:
- **Hypothèses rigides**: Certaines valeurs par défaut sont trop spécifiques et ne s'adaptent pas à tous les secteurs industriels.
- **Terminologie spécifique**: L'interface utilise des termes qui peuvent ne pas être applicables à tous les types d'automatisation.

### Recommandation:
- Permettre la sélection d'un secteur industriel pour adapter automatiquement les valeurs par défaut:
  ```javascript
  const secteurs = {
    general: { /* valeurs par défaut générales */ },
    alimentaire: { /* valeurs par défaut pour l'industrie alimentaire */ },
    automobile: { /* valeurs par défaut pour l'industrie automobile */ },
    pharmaceutique: { /* valeurs par défaut pour l'industrie pharmaceutique */ }
  };
  
  const [secteurSelectionne, setSecteurSelectionne] = useState('general');
  
  // Au changement de secteur
  useEffect(() => {
    const parametresDefaut = secteurs[secteurSelectionne];
    // Mettre à jour les états avec les valeurs par défaut du secteur
  }, [secteurSelectionne]);
  ```
- Permettre la personnalisation des labels et unités.

## 6. Calculs financiers à enrichir

### Problèmes identifiés:
- **Calcul simpliste de l'amortissement**: Le modèle actuel d'amortissement ne tient pas compte des différentes méthodes possibles.
- **Paramètres fiscaux manquants**: L'impact fiscal des investissements et économies n'est pas modélisé.
- **Analyses de sensibilité limitées**: L'analyse de sensibilité ne permet pas d'explorer suffisamment les scénarios.

### Recommandation:
- Implémenter différentes méthodes d'amortissement:
  ```javascript
  const methodesAmortissement = {
    lineaire: (investissement, duree, annee) => investissement / duree,
    degressif: (investissement, duree, annee, taux) => {
      // Calcul d'amortissement dégressif
    },
    uniteProduction: (investissement, unitesPrevues, unitesProduites) => {
      // Calcul d'amortissement selon les unités produites
    }
  };
  ```
- Ajouter des paramètres fiscaux:
  ```javascript
  const [tauxImposition, setTauxImposition] = useState(25); // %
  const [creditImpotInnovation, setCreditImpotInnovation] = useState(0); // $
  ```

## 7. Interface utilisateur et expérience utilisateur

### Problèmes identifiés:
- **Navigation complexe**: La structure actuelle avec les modes basique/avancé n'est pas optimale pour guider l'utilisateur.
- **Feedback utilisateur limité**: Peu de feedback visuel sur l'impact des modifications de paramètres.
- **Visualisations insuffisantes**: Les graphiques actuels ne permettent pas une compréhension complète des différences.

### Recommandation:
- Restructurer l'interface avec une approche par étapes guidées:
  1. Configuration du système actuel
  2. Configuration du système automatisé
  3. Analyse comparative et résultats
  4. Analyses avancées (sensibilité, scénarios)
- Ajouter des indicateurs visuels d'impact pour chaque paramètre modifié.
- Enrichir les visualisations avec:
  - Graphiques comparatifs côte à côte
  - Diagrammes de Sankey pour visualiser les flux financiers
  - Graphiques temporels pour les économies cumulées

## 8. Documentation et aide à l'utilisateur

### Problèmes identifiés:
- **Descriptions insuffisantes**: Les libellés des champs ne sont pas toujours explicites pour tous les utilisateurs.
- **Absence de conseils contextuels**: Pas d'aide à la décision sur les valeurs à saisir.
- **Manque de références sectorielles**: Pas de benchmarks ou références pour guider l'utilisateur.

### Recommandation:
- Ajouter des infobulles détaillées pour chaque champ:
  ```jsx
  <div className="relative">
    <label className="block text-sm font-medium mb-1">
      Capacité de production ({uniteProduction}/heure)
      <span className="ml-1 text-blue-500 cursor-help" title="Nombre maximum d'unités produites par heure en fonctionnement normal">ⓘ</span>
    </label>
    <input
      type="number"
      value={capaciteActuelle}
      onChange={(e) => setCapaciteActuelle(Number(e.target.value))}
      className="w-full p-2 border rounded"
    />
  </div>
  ```
- Inclure des valeurs de référence sectorielles pour guider l'utilisateur.

## 9. Performance et optimisation du code

### Problèmes identifiés:
- **Recalculs inutiles**: Certains calculs sont effectués à chaque rendu même lorsque les dépendances n'ont pas changé.
- **Structure de composants à optimiser**: La séparation des composants peut être améliorée pour éviter les re-rendus inutiles.

### Recommandation:
- Utiliser davantage `useMemo` et `useCallback` pour les fonctions et valeurs calculées.
- Appliquer React.memo aux composants qui n'ont pas besoin de se re-rendre à chaque modification.
- Consolider les états connexes dans des objets pour réduire le nombre de mises à jour d'état.

## 10. Accessibilité et internationalisation

### Problèmes identifiés:
- **Manque de support pour l'accessibilité**: Les composants ne respectent pas toujours les meilleures pratiques d'accessibilité.
- **Interface monolingue**: Pas de support pour d'autres langues que le français.

### Recommandation:
- Améliorer l'accessibilité en ajoutant des attributs ARIA appropriés.
- Structurer le code pour faciliter l'internationalisation future:
  ```javascript
  const translations = {
    fr: {
      capaciteProduction: "Capacité de production",
      tempsCycle: "Temps de cycle",
      // ...
    },
    en: {
      capaciteProduction: "Production capacity",
      tempsCycle: "Cycle time",
      // ...
    }
  };
  
  const [langue, setLangue] = useState('fr');
  const t = translations[langue];
  ```

## Plan d'action recommandé

1. **Phase 1: Restructuration du code**
   - Résoudre les problèmes de nomenclature
   - Implémenter la synchronisation des paramètres liés
   - Restructurer l'interface pour la comparaison claire des systèmes

2. **Phase 2: Enrichissement des fonctionnalités**
   - Ajouter les paramètres manquants
   - Implémenter les calculs financiers avancés
   - Améliorer les visualisations

3. **Phase 3: Améliorations UX/UI**
   - Mettre en place l'interface guidée par étapes
   - Ajouter l'aide contextuelle et la documentation
   - Améliorer l'accessibilité

4. **Phase 4: Optimisation et extension**
   - Optimiser les performances
   - Ajouter le support multilingue
   - Développer l'adaptabilité sectorielle
