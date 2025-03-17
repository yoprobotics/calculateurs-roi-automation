import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle
const CalculateurROI = () => {
  // États pour les données d'entrée
  const [coutSysteme, setCoutSysteme] = useState(150000);
  const [coutInstallation, setCoutInstallation] = useState(25000);
  const [coutIngenierie, setCoutIngenierie] = useState(20000);
  const [coutFormation, setCoutFormation] = useState(10000);
  const [coutMaintenance, setCoutMaintenance] = useState(5000);
  const [coutEnergie, setCoutEnergie] = useState(3000);
  const [dureeVie, setDureeVie] = useState(10);
  const [tauxAmortissement, setTauxAmortissement] = useState(20);
  const [coutMainOeuvre, setCoutMainOeuvre] = useState(45000);
  const [nbEmployesRemplaces, setNbEmployesRemplaces] = useState(1.5);
  const [nombreEmployesActuel, setNombreEmployesActuel] = useState(5);
  const [coutErrorHumaine, setCoutErrorHumaine] = useState(15000);
  const [augmentationProduction, setAugmentationProduction] = useState(15);
  const [tauxProblemeQualite, setTauxProblemeQualite] = useState(8);
  const [coutQualite, setCoutQualite] = useState(20000);
  const [production, setProduction] = useState(100000);
  const [margeUnitaire, setMargeUnitaire] = useState(0.2);
  const [tauxInflation, setTauxInflation] = useState(2);
  const [tauxActualisation, setTauxActualisation] = useState(5);
  const [subventions, setSubventions] = useState(0);
  const [coutFormationContinue, setCoutFormationContinue] = useState(3000);
  
  // État pour gérer les erreurs de validation
  const [erreurs, setErreurs] = useState({});
  
  // États pour les résultats
  const [resultatAnnuel, setResultatAnnuel] = useState([]);
  const [roi, setRoi] = useState(0);
  const [delaiRecuperation, setDelaiRecuperation] = useState(0);
  const [van, setVan] = useState(0);
  const [tri, setTri] = useState(0);
  
  // États pour la comparaison de scénarios
  const [scenarios, setScenarios] = useState([]);
  const [scenarioActif, setScenarioActif] = useState('actuel');
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  const [analyseMode, setAnalyseMode] = useState('standard'); // 'standard', 'comparaison', 'sensibilite'
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  const [variationSensibilite, setVariationSensibilite] = useState(20); // variation en pourcentage
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);
  const [viewMode, setViewMode] = useState('basique'); // 'basique', 'avance'
  
  // Fonction de validation des entrées
  const validerEntrees = () => {
    const nouvellesErreurs = {};
    
    // Validation des pourcentages (ne peuvent pas dépasser 100%)
    if (augmentationProduction < 0 || augmentationProduction > 100) {
      nouvellesErreurs.augmentationProduction = "L'augmentation de production doit être entre 0 et 100%";
    }
    
    if (tauxProblemeQualite < 0 || tauxProblemeQualite > 100) {
      nouvellesErreurs.tauxProblemeQualite = "Le taux de problème de qualité doit être entre 0 et 100%";
    }
    
    if (tauxAmortissement < 0 || tauxAmortissement > 100) {
      nouvellesErreurs.tauxAmortissement = "Le taux d'amortissement doit être entre 0 et 100%";
    }
    
    // Validation du nombre d'employés remplacés
    if (nbEmployesRemplaces > nombreEmployesActuel) {
      nouvellesErreurs.nbEmployesRemplaces = "Le nombre d'employés remplacés ne peut pas être supérieur au nombre total d'employés";
    }
    
    if (nbEmployesRemplaces < 0) {
      nouvellesErreurs.nbEmployesRemplaces = "Le nombre d'employés remplacés doit être positif";
    }
    
    if (nombreEmployesActuel <= 0) {
      nouvellesErreurs.nombreEmployesActuel = "Le nombre d'employés actuels doit être supérieur à 0";
    }
    
    // Validation des valeurs négatives pour les coûts
    if (coutSysteme < 0) nouvellesErreurs.coutSysteme = "Le coût doit être positif";
    if (coutInstallation < 0) nouvellesErreurs.coutInstallation = "Le coût doit être positif";
    if (coutIngenierie < 0) nouvellesErreurs.coutIngenierie = "Le coût doit être positif";
    if (coutFormation < 0) nouvellesErreurs.coutFormation = "Le coût doit être positif";
    if (coutMaintenance < 0) nouvellesErreurs.coutMaintenance = "Le coût doit être positif";
    if (coutEnergie < 0) nouvellesErreurs.coutEnergie = "Le coût doit être positif";
    if (coutMainOeuvre < 0) nouvellesErreurs.coutMainOeuvre = "Le coût doit être positif";
    if (coutErrorHumaine < 0) nouvellesErreurs.coutErrorHumaine = "Le coût doit être positif";
    if (coutQualite < 0) nouvellesErreurs.coutQualite = "Le coût doit être positif";
    if (coutFormationContinue < 0) nouvellesErreurs.coutFormationContinue = "Le coût doit être positif";
    
    // Validation de la durée de vie et des taux
    if (dureeVie <= 0) nouvellesErreurs.dureeVie = "La durée de vie doit être supérieure à 0";
    if (tauxInflation < 0) nouvellesErreurs.tauxInflation = "Le taux d'inflation doit être positif";
    if (tauxActualisation < 0) nouvellesErreurs.tauxActualisation = "Le taux d'actualisation doit être positif";
    
    // Validation de la production et de la marge
    if (production <= 0) nouvellesErreurs.production = "La production doit être supérieure à 0";
    if (margeUnitaire < 0) nouvellesErreurs.margeUnitaire = "La marge unitaire doit être positive";
    
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };
  
  // Fonction pour calculer l'analyse de sensibilité
  const calculerSensibilite = () => {
    if (!validerEntrees()) return; // Ne pas calculer si les entrées sont invalides
    
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    const resultats = [];
    
    // Valeur actuelle du paramètre
    const valeurBase = {
      coutSysteme, 
      coutInstallation, 
      coutIngenierie, 
      coutFormation,
      coutMaintenance, 
      coutEnergie, 
      nbEmployesRemplaces,
      augmentationProduction,
      coutMainOeuvre,
      production
    }[parametreSensibilite];
    
    // Pour chaque variation, calculer les nouveaux résultats
    for (const variation of variations) {
      // Appliquer la variation
      const facteur = 1 + variation / 100;
      const valeurModifiee = valeurBase * facteur;
      
      // Créer un clone des états actuels
      const nouveauParams = {
        coutSysteme, 
        coutInstallation, 
        coutIngenierie, 
        coutFormation,
        coutMaintenance, 
        coutEnergie, 
        dureeVie,
        tauxAmortissement,
        coutMainOeuvre,
        nbEmployesRemplaces,
        coutErrorHumaine,
        augmentationProduction,
        tauxProblemeQualite,
        coutQualite,
        production,
        margeUnitaire,
        tauxInflation,
        tauxActualisation,
        subventions,
        coutFormationContinue
      };
      
      // Mettre à jour le paramètre concerné
      nouveauParams[parametreSensibilite] = valeurModifiee;
      
      // Calculer ROI, VAN, délai de récupération avec ces nouveaux paramètres
      const investissementInitial = nouveauParams.coutSysteme + nouveauParams.coutInstallation + 
                                   nouveauParams.coutIngenierie + nouveauParams.coutFormation - 
                                   nouveauParams.subventions;
      
      let fluxTresorerie = [];
      let cumulFluxTresorerie = 0;
      let valeurActuelleNette = -investissementInitial;
      let periodeRecuperation = nouveauParams.dureeVie;
      let recuperationAtteinte = false;
      
      // Calcul des flux de trésorerie annuels
      for (let annee = 1; annee <= nouveauParams.dureeVie; annee++) {
        // Calcul des coûts ajustés avec l'inflation
        const facteurInflation = Math.pow(1 + nouveauParams.tauxInflation / 100, annee - 1);
        const maintenanceAnnuelle = nouveauParams.coutMaintenance * facteurInflation;
        const energieAnnuelle = nouveauParams.coutEnergie * facteurInflation;
        const coutEmployeAnnuel = nouveauParams.coutMainOeuvre * facteurInflation;
        const formationContinueAnnuelle = nouveauParams.coutFormationContinue * facteurInflation;
        
        // Calcul des économies et bénéfices
        const economiePersonnel = coutEmployeAnnuel * nouveauParams.nbEmployesRemplaces;
        const economieErreurs = nouveauParams.coutErrorHumaine * facteurInflation;
        const economieQualite = nouveauParams.production * (nouveauParams.tauxProblemeQualite / 100) * 
                              (nouveauParams.coutQualite / nouveauParams.production) * facteurInflation;
        
        const productionSupplementaire = nouveauParams.production * (nouveauParams.augmentationProduction / 100);
        const beneficeSupplementaire = productionSupplementaire * nouveauParams.margeUnitaire * facteurInflation;
        
        const amortissement = (investissementInitial / nouveauParams.dureeVie) * (nouveauParams.tauxAmortissement / 100);
        
        // Calcul du flux de trésorerie annuel
        const fluxAnnuel = economiePersonnel + economieErreurs + economieQualite + 
                         beneficeSupplementaire - maintenanceAnnuelle - energieAnnuelle - 
                         formationContinueAnnuelle + amortissement;
        
        // Flux actualisé
        const facteurActualisation = Math.pow(1 + nouveauParams.tauxActualisation / 100, annee);
        const fluxActualise = fluxAnnuel / facteurActualisation;
        
        // VAN cumulative
        valeurActuelleNette += fluxActualise;
        
        // Délai de récupération
        cumulFluxTresorerie += fluxAnnuel;
        if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
          const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
          const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
          periodeRecuperation = annee - 1 + fractionAnnee;
          recuperationAtteinte = true;
        }
        
        fluxTresorerie.push({ annee, fluxAnnuel, fluxActualise, cumulFluxTresorerie });
      }
      
      // Calcul du ROI
      const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
      const roiCalcule = (totalBenefices / investissementInitial) * 100;
      
      // Ajouter les résultats à notre tableau
      resultats.push({
        variation,
        roi: roiCalcule,
        delaiRecuperation: periodeRecuperation,
        van: valeurActuelleNette
      });
    }
    
    setResultatsSensibilite(resultats);
  };
  
  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    if (!validerEntrees()) {
      alert("Veuillez corriger les erreurs de validation avant de sauvegarder ce scénario.");
      return;
    }
    
    const scenarioActuel = {
      id: Date.now().toString(),
      nom: nomScenario,
      parametres: {
        coutSysteme,
        coutInstallation,
        coutIngenierie,
        coutFormation,
        coutMaintenance,
        coutEnergie,
        dureeVie,
        tauxAmortissement,
        coutMainOeuvre,
        nbEmployesRemplaces,
        nombreEmployesActuel,
        coutErrorHumaine,
        augmentationProduction,
        tauxProblemeQualite,
        coutQualite,
        production,
        margeUnitaire,
        tauxInflation,
        tauxActualisation,
        subventions,
        coutFormationContinue
      },
      resultats: {
        roi,
        delaiRecuperation,
        van,
        tri
      }
    };
    
    setScenarios([...scenarios, scenarioActuel]);
  };
  
  // Fonction pour charger un scénario
  const chargerScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      const { parametres } = scenario;
      
      setCoutSysteme(parametres.coutSysteme);
      setCoutInstallation(parametres.coutInstallation);
      setCoutIngenierie(parametres.coutIngenierie);
      setCoutFormation(parametres.coutFormation);
      setCoutMaintenance(parametres.coutMaintenance);
      setCoutEnergie(parametres.coutEnergie);
      setDureeVie(parametres.dureeVie);
      setTauxAmortissement(parametres.tauxAmortissement);
      setCoutMainOeuvre(parametres.coutMainOeuvre);
      setNbEmployesRemplaces(parametres.nbEmployesRemplaces);
      setNombreEmployesActuel(parametres.nombreEmployesActuel || 5); // Valeur par défaut si non définie
      setCoutErrorHumaine(parametres.coutErrorHumaine);
      setAugmentationProduction(parametres.augmentationProduction);
      setTauxProblemeQualite(parametres.tauxProblemeQualite);
      setCoutQualite(parametres.coutQualite);
      setProduction(parametres.production);
      setMargeUnitaire(parametres.margeUnitaire);
      setTauxInflation(parametres.tauxInflation);
      setTauxActualisation(parametres.tauxActualisation);
      setSubventions(parametres.subventions);
      setCoutFormationContinue(parametres.coutFormationContinue || 3000); // Valeur par défaut si non définie
      
      setScenarioActif(scenarioId);
      setNomScenario(scenario.nom);
    }
  };
  
  // Fonction pour supprimer un scénario
  const supprimerScenario = (scenarioId) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
    if (scenarioActif === scenarioId) {
      setScenarioActif('actuel');
    }
  };
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    if (!validerEntrees()) {
      console.log("Calcul interrompu en raison d'erreurs de validation");
      return;
    }
    
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    
    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const energieAnnuelle = coutEnergie * facteurInflation;
      const coutEmployeAnnuel = coutMainOeuvre * facteurInflation;
      const formationContinueAnnuelle = coutFormationContinue * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = coutEmployeAnnuel * nbEmployesRemplaces;
      const economieErreurs = coutErrorHumaine * facteurInflation;
      const economieQualite = production * (tauxProblemeQualite / 100) * (coutQualite / production) * facteurInflation;
      
      // Calcul des bénéfices supplémentaires
      const productionSupplementaire = production * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeUnitaire * facteurInflation;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieErreurs + economieQualite + 
                       beneficeSupplementaire - maintenanceAnnuelle - energieAnnuelle - 
                       formationContinueAnnuelle + amortissement;
      
      // Calcul du flux de trésorerie actualisé
      const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
      const fluxActualise = fluxAnnuel / facteurActualisation;
      
      // Mise à jour de la VAN
      valeurActuelleNette += fluxActualise;
      
      // Calcul du délai de récupération
      cumulFluxTresorerie += fluxAnnuel;
      if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
        // Calcul plus précis avec interpolation
        const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
        const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
        periodeRecuperation = annee - 1 + fractionAnnee;
        recuperationAtteinte = true;
      }
      
      // Ajout des résultats annuels
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie,
        economiePersonnel,
        economieErreurs,
        economieQualite,
        beneficeSupplementaire,
        maintenanceAnnuelle,
        energieAnnuelle,
        formationContinueAnnuelle,
        amortissement
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = 0;
    for (let r = 1; r <= 100; r++) {
      let npv = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + r / 100, t + 1);
      }
      if (npv <= 0) {
        triApprox = r - 1;
        break;
      }
    }
    
    // Mise à jour des états
    setResultatAnnuel(fluxTresorerie);
    setRoi(roiCalcule);
    setDelaiRecuperation(periodeRecuperation);
    setVan(valeurActuelleNette);
    setTri(triApprox);
  };
  
  // Calcul initial et lors des changements
  useEffect(() => {
    calculerROI();
    if (analyseMode === 'sensibilite') {
      calculerSensibilite();
    }
  }, [
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, coutEnergie,
    dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces, nombreEmployesActuel,
    coutErrorHumaine, augmentationProduction, tauxProblemeQualite, coutQualite,
    production, margeUnitaire, tauxInflation, tauxActualisation, subventions, coutFormationContinue,
    analyseMode, parametreSensibilite
  ]);
  
  // Données pour les graphiques d'analyse de sensibilité
  const dataSensibiliteROI = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    roi: item.roi
  }));
  
  const dataSensibiliteVAN = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    van: item.van
  }));
  
  const dataSensibilitePayback = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    delaiRecuperation: item.delaiRecuperation
  }));
  
  // Données pour le graphique des flux de trésorerie
  const dataFluxTresorerie = resultatAnnuel.map(item => ({
    annee: `Année ${item.annee}`,
    fluxTresorerie: item.fluxAnnuel,
    fluxActualise: item.fluxActualise
  }));
  
  // Données pour le graphique de rentabilité cumulative
  const dataCumulatif = resultatAnnuel.map(item => ({
    annee: `Année ${item.annee}`,
    cumulatif: item.cumulFluxTresorerie
  }));
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
        <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
            <p>Augmentation du volume de production et réduction des temps d'arrêt.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Qualité Constante</h4>
            <p>Élimination des erreurs humaines et amélioration de la répétabilité des processus.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Réduction des Coûts</h4>
            <p>Diminution des coûts de main d'œuvre et optimisation de la consommation d'énergie et de matières.</p>
          </div>
        </div>
      </div>
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setViewMode('basique')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'basique'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Basique
          </button>
          <button
            onClick={() => setViewMode('avance')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'avance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Avancé
          </button>
        </div>
        
        {viewMode === 'avance' && (
          <div className="flex space-x-4">
            <button
              onClick={() => setAnalyseMode('standard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analyseMode === 'standard'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Standard
            </button>
            <button
              onClick={() => setAnalyseMode('comparaison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analyseMode === 'comparaison'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Comparer Scénarios
            </button>
            <button
              onClick={() => setAnalyseMode('sensibilite')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analyseMode === 'sensibilite'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Sensibilité
            </button>
          </div>
        )}
      </div>
      
      {/* Gestion des scénarios - Mode Avancé */}
      {viewMode === 'avance' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Gestion des Scénarios</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Nom du scénario actuel</label>
              <input
                type="text"
                value={nomScenario}
                onChange={(e) => setNomScenario(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: Projet A - Version économique"
              />
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-6">
              <button
                onClick={sauvegarderScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
              >
                Sauvegarder ce scénario
              </button>
            </div>
          </div>
          
          {scenarios.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Scénarios sauvegardés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map(scenario => (
                  <div key={scenario.id} className="border rounded p-3 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{scenario.nom}</p>
                      <p className="text-sm text-gray-600">ROI: {scenario.resultats.roi.toFixed(2)}% | Délai: {scenario.resultats.delaiRecuperation.toFixed(2)} ans</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => chargerScenario(scenario.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Charger
                      </button>
                      <button
                        onClick={() => supprimerScenario(scenario.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Analyse de sensibilité - Mode Avancé */}
      {viewMode === 'avance' && analyseMode === 'sensibilite' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse de Sensibilité</h2>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paramètre à analyser</label>
              <select
                value={parametreSensibilite}
                onChange={(e) => setParametreSensibilite(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="coutSysteme">Coût du système</option>
                <option value="coutInstallation">Coût d'installation</option>
                <option value="coutIngenierie">Coût d'ingénierie</option>
                <option value="nbEmployesRemplaces">Nombre d'employés remplacés</option>
                <option value="augmentationProduction">Augmentation de production</option>
                <option value="coutMainOeuvre">Coût de main d'œuvre</option>
                <option value="production">Volume de production</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Voir l'impact de la variation de ce paramètre sur les résultats</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64">
              <h3 className="font-medium text-gray-700 mb-2">Impact sur le ROI</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataSensibiliteROI}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variation" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'ROI']} />
                  <Bar dataKey="roi" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Comparaison des scénarios - Mode Avancé */}
      {viewMode === 'avance' && analyseMode === 'comparaison' && scenarios.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Comparaison des Scénarios</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Scénario</th>
                  <th className="px-4 py-2 text-right">Investissement</th>
                  <th className="px-4 py-2 text-right">ROI</th>
                  <th className="px-4 py-2 text-right">Délai</th>
                  <th className="px-4 py-2 text-right">VAN</th>
                  <th className="px-4 py-2 text-right">TRI</th>
                </tr>
              </thead>
              <tbody>
                {/* Scénario actuel */}
                <tr className="border-t">
                  <td className="px-4 py-2 font-medium">{nomScenario} (actuel)</td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions)}
                  </td>
                  <td className="px-4 py-2 text-right">{roi.toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right">{delaiRecuperation.toFixed(2)} ans</td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(van)}
                  </td>
                  <td className="px-4 py-2 text-right">{tri.toFixed(2)}%</td>
                </tr>
                
                {/* Scénarios sauvegardés */}
                {scenarios.map(scenario => (
                  <tr key={scenario.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{scenario.nom}</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                        scenario.parametres.coutSysteme + 
                        scenario.parametres.coutInstallation + 
                        scenario.parametres.coutIngenierie + 
                        scenario.parametres.coutFormation - 
                        scenario.parametres.subventions
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">{scenario.resultats.roi.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-right">{scenario.resultats.delaiRecuperation.toFixed(2)} ans</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(scenario.resultats.van)}
                    </td>
                    <td className="px-4 py-2 text-right">{scenario.resultats.tri.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire d'entrée */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Paramètres d'investissement</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts initiaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coût du système (€)</label>
                <input
                  type="number"
                  value={coutSysteme}
                  onChange={(e) => setCoutSysteme(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.coutSysteme ? 'border-red-500' : ''}`}
                />
                {erreurs.coutSysteme && <p className="text-xs text-red-500 mt-1">{erreurs.coutSysteme}</p>}
                <p className="text-xs text-gray-500 mt-1">Prix d'achat de l'équipement d'automatisation</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'installation (€)</label>
                <input
                  type="number"
                  value={coutInstallation}
                  onChange={(e) => setCoutInstallation(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.coutInstallation ? 'border-red-500' : ''}`}
                />
                {erreurs.coutInstallation && <p className="text-xs text-red-500 mt-1">{erreurs.coutInstallation}</p>}
                <p className="text-xs text-gray-500 mt-1">Coûts liés à l'installation physique</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Économies de main d'œuvre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre d'employés actuels</label>
                <input
                  type="number"
                  step="0.1"
                  value={nombreEmployesActuel}
                  onChange={(e) => setNombreEmployesActuel(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.nombreEmployesActuel ? 'border-red-500' : ''}`}
                />
                {erreurs.nombreEmployesActuel && <p className="text-xs text-red-500 mt-1">{erreurs.nombreEmployesActuel}</p>}
                <p className="text-xs text-gray-500 mt-1">Nombre total d'employés avant automatisation</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre d'employés remplacés</label>
                <input
                  type="number"
                  step="0.1"
                  value={nbEmployesRemplaces}
                  onChange={(e) => setNbEmployesRemplaces(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.nbEmployesRemplaces ? 'border-red-500' : ''}`}
                />
                {erreurs.nbEmployesRemplaces && <p className="text-xs text-red-500 mt-1">{erreurs.nbEmployesRemplaces}</p>}
                <p className="text-xs text-gray-500 mt-1">Équivalent temps plein (ETP) remplacé</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût annuel employé (€)</label>
                <input
                  type="number"
                  value={coutMainOeuvre}
                  onChange={(e) => setCoutMainOeuvre(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.coutMainOeuvre ? 'border-red-500' : ''}`}
                />
                {erreurs.coutMainOeuvre && <p className="text-xs text-red-500 mt-1">{erreurs.coutMainOeuvre}</p>}
                <p className="text-xs text-gray-500 mt-1">Salaire annuel incluant charges sociales</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée de vie (années)</label>
                <input
                  type="number"
                  value={dureeVie}
                  onChange={(e) => setDureeVie(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.dureeVie ? 'border-red-500' : ''}`}
                />
                {erreurs.dureeVie && <p className="text-xs text-red-500 mt-1">{erreurs.dureeVie}</p>}
                <p className="text-xs text-gray-500 mt-1">Durée d'utilisation prévue</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tauxActualisation}
                  onChange={(e) => setTauxActualisation(Number(e.target.value))}
                  className={`w-full p-2 border rounded ${erreurs.tauxActualisation ? 'border-red-500' : ''}`}
                />
                {erreurs.tauxActualisation && <p className="text-xs text-red-500 mt-1">{erreurs.tauxActualisation}</p>}
                <p className="text-xs text-gray-500 mt-1">Taux utilisé pour calculer la valeur actuelle</p>
              </div>
            </div>
          </div>
          
          {viewMode === 'avance' && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Paramètres avancés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coût erreurs humaines/an (€)</label>
                  <input
                    type="number"
                    value={coutErrorHumaine}
                    onChange={(e) => setCoutErrorHumaine(Number(e.target.value))}
                    className={`w-full p-2 border rounded ${erreurs.coutErrorHumaine ? 'border-red-500' : ''}`}
                  />
                  {erreurs.coutErrorHumaine && <p className="text-xs text-red-500 mt-1">{erreurs.coutErrorHumaine}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aug. production (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={augmentationProduction}
                    onChange={(e) => setAugmentationProduction(Number(e.target.value))}
                    className={`w-full p-2 border rounded ${erreurs.augmentationProduction ? 'border-red-500' : ''}`}
                  />
                  {erreurs.augmentationProduction && <p className="text-xs text-red-500 mt-1">{erreurs.augmentationProduction}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taux problèmes qualité (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tauxProblemeQualite}
                    onChange={(e) => setTauxProblemeQualite(Number(e.target.value))}
                    className={`w-full p-2 border rounded ${erreurs.tauxProblemeQualite ? 'border-red-500' : ''}`}
                  />
                  {erreurs.tauxProblemeQualite && <p className="text-xs text-red-500 mt-1">{erreurs.tauxProblemeQualite}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subventions (€)</label>
                  <input
                    type="number"
                    value={subventions}
                    onChange={(e) => setSubventions(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Résultats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Résultats</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                <p className="text-2xl font-bold text-blue-800">{roi.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Pourcentage de retour sur l'investissement total</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
                <p className="text-2xl font-bold text-green-800">{delaiRecuperation.toFixed(2)} ans</p>
                <p className="text-xs text-gray-600 mt-1">Temps pour récupérer l'investissement</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">VAN</h3>
                <p className="text-2xl font-bold text-purple-800">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(van)}
                </p>
                <p className="text-xs text-gray-600 mt-1">Valeur Actuelle Nette</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Taux de Rendement Interne</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Interprétation des résultats</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="font-medium">ROI &gt; 100%</span> : L'investissement génère plus de valeur qu'il n'en coûte.</li>
                <li><span className="font-medium">Délai de récupération &lt; 3 ans</span> : Considéré comme un très bon investissement dans l'industrie.</li>
                <li><span className="font-medium">VAN positive</span> : Le projet crée de la valeur pour l'entreprise.</li>
                <li><span className="font-medium">TRI &gt; taux d'actualisation</span> : Le projet est financièrement viable.</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
              {van > 0 && tri > tauxActualisation ? (
                <p className="text-green-700">
                  <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation semble financièrement viable avec un ROI positif et un délai de récupération raisonnable.
                </p>
              ) : (
                <p className="text-yellow-700">
                  <span className="font-bold">⚠ À réévaluer</span> - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.
                </p>
              )}
            </div>
          </div>
          
          {viewMode === 'avance' && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Flux de trésorerie</h2>
              
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataFluxTresorerie}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value), 'Montant']} 
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="fluxTresorerie" 
                      name="Flux annuel" 
                      stroke="#3B82F6" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fluxActualise" 
                      name="Flux actualisé" 
                      stroke="#10B981" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="font-medium text-gray-700 mb-2">Récupération de l'investissement</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataCumulatif}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value), 'Montant cumulé']} 
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulatif" 
                      name="Flux cumulé" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={() => coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions} 
                      name="Investissement initial" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateurROI;