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
    
    // Calcul du TRI (approxim