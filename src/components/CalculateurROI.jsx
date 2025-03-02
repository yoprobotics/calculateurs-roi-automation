import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle avec comparaison avant/après
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États regroupés pour le système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    tempsDesCycle: 60, // secondes par unité
    capacite: 60, // unités/heure (dérivé du temps de cycle)
    nombreEmployes: 2.5, // ETP
    coutSysteme: 15000, // $ équipement actuel
    maintenance: 6000, // $/an
    energie: 4000, // $/an
    tauxRejets: 8, // % de rejets
    perteProduction: 12, // % perte due aux arrêts et retards
    frequenceAccident: 5.2, // accidents par an
    coutMoyenAccident: 12500, // coût moyen par accident
    tempsArretAccident: 24 // heures d'arrêt par accident
  });
  
  // États regroupés pour le système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 10000,
    coutFormationContinue: 5000, // Coût de formation continue annuelle
    coutMaintenance: 8000,
    coutEnergie: 5000,
    dureeVie: 10,
    tauxAmortissement: 20,
    tempsDesCycle: 20, // secondes par unité
    capaciteTraitement: 180, // unités/heure (dérivé du temps de cycle)
    nombreEmployes: 1.0, // ETP nécessaires avec le système automatisé
    coutMainOeuvre: 45000, // Coût annuel par employé
    reductionDechet: 14, // % de réduction des déchets
    coutDechet: 230, // $ par unité de déchet
    tauxRejets: 3.5, // % de rejets avec le nouveau système
    augmentationProduction: 15, // % d'augmentation de la capacité
    reductionEnergie: 12, // % de réduction de la consommation d'énergie
    ameliorationQualite: 5, // % d'amélioration de la qualité
    reductionAccidents: 85, // % de réduction des accidents
    subventions: 0 // $ subventions gouvernementales
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    margeUnitaire: 0.2, // $ par unité
    tauxInflation: 2, // %
    tauxActualisation: 5, // %
    productionAnnuelle: 100000, // unités par an
    heuresOperationParJour: 16,
    joursOperationParAn: 250
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    economiesCO2: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0
  });
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    mode: "comparatif", // "comparatif", "detaille", "analyse"
    ongletActif: "general", // "general", "production", "qualite", "securite", "financier" 
    analyseMode: "standard", // "standard", "sensibilite", "comparaison"
    parametreSensibilite: "coutSysteme",
    afficherDetails: false,
    scenarios: [],
    scenarioActif: 'actuel',
    nomScenario: 'Scénario de base',
    resultatsSensibilite: []
  });
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsDesCycle: 60,
        capacite: 60,
        nombreEmployes: 2.5,
        coutSysteme: 15000,
        maintenance: 6000,
        energie: 4000,
        tauxRejets: 8,
        perteProduction: 12,
        frequenceAccident: 5.2
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsDesCycle: 40,
        capacite: 90,
        nombreEmployes: 1.5,
        coutSysteme: 80000,
        maintenance: 12000,
        energie: 6000,
        tauxRejets: 5,
        perteProduction: 8,
        frequenceAccident: 3.5
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsDesCycle: 30,
        capacite: 120,
        nombreEmployes: 1.2,
        coutSysteme: 120000,
        maintenance: 18000,
        energie: 8000,
        tauxRejets: 4.5,
        perteProduction: 6,
        frequenceAccident: 2.8
      });
    }
  }, [typeSystemeActuel]);
  
  // Effet pour synchroniser temps de cycle et capacité pour le système actuel
  useEffect(() => {
    const { tempsDesCycle, capacite } = parametresSystemeActuel;
    // Si la capacité a été modifiée par l'utilisateur, mettre à jour le temps de cycle
    if (3600 / tempsDesCycle !== capacite) {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsDesCycle: 3600 / capacite
      });
    }
  }, [parametresSystemeActuel.capacite]);

  // Effet pour synchroniser temps de cycle et capacité pour le système automatisé
  useEffect(() => {
    const { tempsDesCycle, capaciteTraitement } = parametresSystemeAutomatise;
    // Si la capacité a été modifiée par l'utilisateur, mettre à jour le temps de cycle
    if (3600 / tempsDesCycle !== capaciteTraitement) {
      setParametresSystemeAutomatise({
        ...parametresSystemeAutomatise,
        tempsDesCycle: 3600 / capaciteTraitement
      });
    }
  }, [parametresSystemeAutomatise.capaciteTraitement]);
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutFormationContinue,
      coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, nombreEmployes,
      reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
      ameliorationQualite, reductionAccidents, capaciteTraitement, tauxRejets: tauxRejetsAuto,
      subventions
    } = parametresSystemeAutomatise;

    const {
      capacite: capaciteActuelle, nombreEmployes: nombreEmployesActuel,
      maintenance: maintenanceActuelle, energie: energieActuelle, tauxRejets: tauxRejetsActuel,
      perteProduction, frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = parametresSystemeActuel;

    const {
      margeUnitaire, tauxInflation, tauxActualisation, productionAnnuelle,
      heuresOperationParJour, joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables de calcul
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée) en tenant compte des pertes
    const productionActuelle = capaciteActuelle * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies liées à la réduction du nombre d'employés
    const reductionMainOeuvreCalc = (nombreEmployesActuel - nombreEmployes) * parametresSystemeAutomatise.coutMainOeuvre;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (productionAnnuelle * margeUnitaire) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Variable pour stocker le bénéfice de qualité de la dernière année (pour l'affichage)
    let dernierBeneficeQualite = 0;
    
    // Calcul des flux de trésorerie annuels
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      
      // Maintenance et énergie
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      
      // Coût de formation continue (coût caché)
      const formationContinueAnnuelle = coutFormationContinue * facteurInflation;
      
      // Économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (productionAnnuelle * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets
      const economieRejets = productionAnnuelle * (tauxRejetsActuel - tauxRejetsAuto) / 100 * coutDechet * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie dans le processus
      const economieEnergieProcessus = (productionAnnuelle * reductionEnergie / 100) * 0.05 * facteurInflation; // Hypothèse: 0.05$ par unité
      
      // Économies liées à la réduction d'eau (estimation approximative)
      const economieEau = (productionAnnuelle * 0.03) * facteurInflation; // Hypothèse: 0.03$ par unité
      
      // Bénéfices liés à l'augmentation de la production
      const productionSupplementaire = productionAnnuelle * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeUnitaire * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (productionAnnuelle * ameliorationQualite / 100) * (margeUnitaire * 0.2) * facteurInflation;
      
      // Stockage de la dernière valeur pour l'affichage
      if (annee === dureeVie) {
        dernierBeneficeQualite = beneficeQualite;
      }
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (estimation: 10kg CO2 par unité économisée)
      const tonnesCO2Economisees = (productionAnnuelle * reductionEnergie / 100) * 0.01; // 10kg = 0.01 tonnes
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets +
                       beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       formationContinueAnnuelle - maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
      
      // Calcul du flux de trésorerie actualisé
      const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
      const fluxActualise = fluxAnnuel / facteurActualisation;
      
      // Mise à jour de la VAN
      valeurActuelleNette += fluxActualise;
      
      // Calcul du délai de récupération
      cumulFluxTresorerie += fluxAnnuel;
      if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
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
        economieDechet,
        economieMaintenance,
        economieEnergie,
        economieEnergieProcessus,
        economieEau,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        formationContinueAnnuelle,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        amortissement,
        tonnesCO2Economisees
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = calculerTRI(investissementInitial, fluxTresorerie.map(item => item.fluxAnnuel));
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents + economiesTempsArretCalc,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  };
  
  // Calcul de l'analyse de sensibilité
  const calculerSensibilite = () => {
    const { parametreSensibilite } = ui;
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    const resultats = [];
    
    // Obtenir la valeur de base du paramètre à analyser
    let valeurBase = 0;
    if (parametreSensibilite in parametresSystemeAutomatise) {
      valeurBase = parametresSystemeAutomatise[parametreSensibilite];
    } else if (parametreSensibilite in parametresGeneraux) {
      valeurBase = parametresGeneraux[parametreSensibilite];
    }
    
    // Calculer les résultats pour chaque variation
    for (const variation of variations) {
      // Créer une copie des paramètres avec la variation appliquée
      const paramsCopie = { ...parametresSystemeAutomatise };
      const facteur = 1 + variation / 100;
      
      if (parametreSensibilite in parametresSystemeAutomatise) {
        paramsCopie[parametreSensibilite] = valeurBase * facteur;
      }
      
      // Calculer l'investissement initial avec cette variation
      const investissementInitial = paramsCopie.coutSysteme + 
                                   paramsCopie.coutInstallation + 
                                   paramsCopie.coutIngenierie + 
                                   paramsCopie.coutFormation - 
                                   paramsCopie.subventions;
      
      // Calculs des flux de trésorerie simplifiés
      // Note: Ceci est une simplification pour l'analyse de sensibilité
      const nombreEmployesReduits = parametresSystemeActuel.nombreEmployes - paramsCopie.nombreEmployes;
      const economieMainOeuvre = nombreEmployesReduits * paramsCopie.coutMainOeuvre;
      const economiesAccidents = (parametresSystemeActuel.frequenceAccident * 
                               parametresSystemeActuel.coutMoyenAccident * 
                               paramsCopie.reductionAccidents / 100);
      
      // Estimer les flux annuels
      let fluxAnnuels = [];
      for (let annee = 1; annee <= paramsCopie.dureeVie; annee++) {
        const facteurInflation = Math.pow(1 + parametresGeneraux.tauxInflation / 100, annee - 1);
        const economiesAnnuelles = (economieMainOeuvre + economiesAccidents) * facteurInflation;
        const coutsMaintenance = paramsCopie.coutMaintenance * facteurInflation;
        
        fluxAnnuels.push(economiesAnnuelles - coutsMaintenance);
      }
      
      // Calcul du ROI simplifié
      const totalBenefices = fluxAnnuels.reduce((a, b) => a + b, 0);
      const roiCalcule = (totalBenefices / investissementInitial) * 100;
      
      // Calcul du délai de récupération simplifié
      let cumulFlux = 0;
      let periodeRecuperation = paramsCopie.dureeVie;
      
      for (let i = 0; i < fluxAnnuels.length; i++) {
        cumulFlux += fluxAnnuels[i];
        if (cumulFlux >= investissementInitial) {
          periodeRecuperation = i + 1;
          break;
        }
      }
      
      // Calcul de la VAN simplifiée
      let van = -investissementInitial;
      for (let i = 0; i < fluxAnnuels.length; i++) {
        van += fluxAnnuels[i] / Math.pow(1 + parametresGeneraux.tauxActualisation / 100, i + 1);
      }
      
      // Ajouter les résultats à notre tableau
      resultats.push({
        variation,
        roi: roiCalcule,
        delaiRecuperation: periodeRecuperation,
        van
      });
    }
    
    // Mettre à jour l'état UI avec les résultats de l'analyse de sensibilité
    setUi({
      ...ui,
      resultatsSensibilite: resultats
    });
  };
  
  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    const nouveauScenario = {
      id: Date.now().toString(),
      nom: ui.nomScenario,
      systemeActuel: { ...parametresSystemeActuel },
      systemeAutomatise: { ...parametresSystemeAutomatise },
      parametresGeneraux: { ...parametresGeneraux },
      resultats: { ...resultats }
    };
    
    setUi({
      ...ui,
      scenarios: [...ui.scenarios, nouveauScenario],
      scenarioActif: nouveauScenario.id
    });
  };
  
  // Fonction pour charger un scénario
  const chargerScenario = (id) => {
    const scenario = ui.scenarios.find(s => s.id === id);
    if (scenario) {
      setParametresSystemeActuel(scenario.systemeActuel);
      setParametresSystemeAutomatise(scenario.systemeAutomatise);
      setParametresGeneraux(scenario.parametresGeneraux);
      
      setUi({
        ...ui,
        scenarioActif: id,
        nomScenario: scenario.nom
      });
    }
  };
  
  // Fonction pour supprimer un scénario
  const supprimerScenario = (id) => {
    const nouveauxScenarios = ui.scenarios.filter(s => s.id !== id);
    
    setUi({
      ...ui,
      scenarios: nouveauxScenarios,
      scenarioActif: ui.scenarioActif === id ? 'actuel' : ui.scenarioActif
    });
  };
  
  // Fonctions pour changer l'onglet et le mode d'affichage
  const changerOnglet = (onglet) => {
    setUi({ ...ui, ongletActif: onglet });
  };
  
  const changerMode = (mode) => {
    setUi({ ...ui, mode });
  };
  
  const changerAnalyseMode = (analyseMode) => {
    setUi({ ...ui, analyseMode });
    if (analyseMode === 'sensibilite') {
      calculerSensibilite();
    }
  };
  
  const toggleDetails = () => {
    setUi({ ...ui, afficherDetails: !ui.afficherDetails });
  };

  // Mettre à jour le temps de cycle quand la capacité change (et vice versa)
  const updateCapacite = (value) => {
    const tempsDesCycle = 3600 / value;
    setParametresSystemeActuel({
      ...parametresSystemeActuel,
      capacite: value,
      tempsDesCycle
    });
  };

  const updateTempsDesCycle = (value) => {
    const capacite = 3600 / value;
    setParametresSystemeActuel({
      ...parametresSystemeActuel,
      tempsDesCycle: value,
      capacite
    });
  };

  const updateCapaciteAutomatisee = (value) => {
    const tempsDesCycle = 3600 / value;
    setParametresSystemeAutomatise({
      ...parametresSystemeAutomatise,
      capaciteTraitement: value,
      tempsDesCycle
    });
  };

  const updateTempsDesCycleAutomatise = (value) => {
    const capaciteTraitement = 3600 / value;
    setParametresSystemeAutomatise({
      ...parametresSystemeAutomatise,
      tempsDesCycle: value,
      capaciteTraitement
    });
  };
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
    if (ui.analyseMode === 'sensibilite') {
      calculerSensibilite();
    }
  }, [
    parametresSystemeActuel, 
    parametresSystemeAutomatise, 
    parametresGeneraux, 
    typeSystemeActuel
  ]);
  
  // Extraction des valeurs pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, economiesCO2, differenceProduction, 
    economieAnnuelle, reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret, fluxTresorerie 
  } = resultats;
  
  // Extraction des valeurs du système actuel
  const {
    capacite: capaciteActuelle, nombreEmployes: nombreEmployesActuel,
    maintenance: maintenanceActuelle, energie: energieActuelle,
    tauxRejets: tauxRejetsActuel, frequenceAccident: frequenceAccidentActuel,
    tempsDesCycle: tempsDesCycleActuel
  } = parametresSystemeActuel;
  
  // Extraction des valeurs du système automatisé
  const {
    capaciteTraitement, tauxRejets: tauxRejetsAutomatise, reductionAccidents, 
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, 
    coutFormationContinue, coutMaintenance, nombreEmployes: nombreEmployesAutomatise,
    coutEnergie, dureeVie, subventions, tempsDesCycle: tempsDesCycleAutomatise
  } = parametresSystemeAutomatise;
  
  // Extraction des valeurs des paramètres généraux
  const { 
    margeUnitaire, tauxInflation, tauxActualisation, productionAnnuelle,
    heuresOperationParJour, joursOperationParAn 
  } = parametresGeneraux;
  
  // Extraction des valeurs de l'UI
  const { 
    mode, ongletActif, analyseMode, afficherDetails, 
    scenarios, scenarioActif, nomScenario, resultatsSensibilite 
  } = ui;
  
  // Données pour les graphiques
  const dataComparaison = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: capaciteActuelle, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: capaciteTraitement, fill: '#22c55e' }
    ];
    
    // Comparaison des temps de cycle
    const dataComparaisonTempsCycle = [
      { name: 'Système Actuel', value: tempsDesCycleActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: tempsDesCycleAutomatise, fill: '#22c55e' }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { name: 'Système Actuel', value: nombreEmployesActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: nombreEmployesAutomatise, fill: '#22c55e' }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { name: 'Système Actuel', value: tauxRejetsActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: tauxRejetsAutomatise, fill: '#22c55e' }
    ];
    
    // Comparaison des fréquences d'accidents
    const dataComparaisonAccidents = [
      { name: 'Système Actuel', value: frequenceAccidentActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: frequenceAccidentActuel * (1 - reductionAccidents/100), fill: '#22c55e' }
    ];
    
    // Données pour le graphique des économies
    const dataEconomies = [
      { name: 'Main d\'œuvre', value: reductionMainOeuvre > 0 ? reductionMainOeuvre : 0 },
      { name: 'Qualité', value: economiesQualite > 0 ? economiesQualite : 0 },
      { name: 'Sécurité', value: economiesSecurite > 0 ? economiesSecurite : 0 },
      { name: 'Production', value: differenceProduction * (margeUnitaire) > 0 ? differenceProduction * (margeUnitaire) : 0 },
      { name: 'Maintenance', value: maintenanceActuelle - coutMaintenance > 0 ? maintenanceActuelle - coutMaintenance : 0 },
      { name: 'Énergie', value: energieActuelle - coutEnergie > 0 ? energieActuelle - coutEnergie : 0 }
    ];
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
    }));

    // Données pour les graphiques d'analyse de sensibilité
    const dataSensibiliteROI = resultatsSensibilite.map(item => ({
      variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
      roi: item.roi
    }));
    
    return {
      dataComparaisonCapacite,
      dataComparaisonTempsCycle,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataEconomies,
      dataCumulatif,
      dataSensibiliteROI
    };
  }, [
    capaciteActuelle, capaciteTraitement, nombreEmployesActuel, nombreEmployesAutomatise,
    tauxRejetsActuel, tauxRejetsAutomatise, frequenceAccidentActuel, reductionAccidents,
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, margeUnitaire, maintenanceActuelle, coutMaintenance,
    energieActuelle, coutEnergie, fluxTresorerie, coutSysteme, coutInstallation,
    coutIngenierie, coutFormation, subventions, resultatsSensibilite, 
    tempsDesCycleActuel, tempsDesCycleAutomatise
  ]);
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      {/* En-tête explicatif */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
        <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
            <p>Réduction des temps de cycle et augmentation de la capacité de production.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Réduction des risques</h4>
            <p>Diminution des accidents du travail et amélioration de la sécurité de vos employés.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Qualité supérieure</h4>
            <p>Réduction des taux de rejet et amélioration constante de la qualité des produits.</p>
          </div>
        </div>
      </div>
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => changerMode('comparatif')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'comparatif'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Comparaison Avant/Après
          </button>
          <button
            onClick={() => changerMode('detaille')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'detaille'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Détaillé
          </button>
          <button
            onClick={() => changerMode('analyse')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'analyse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Analyse
          </button>
        </div>
        
        {mode === 'analyse' && (
          <div className="flex space-x-4">
            <button
              onClick={() => changerAnalyseMode('standard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analyseMode === 'standard'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Standard
            </button>
            <button
              onClick={() => changerAnalyseMode('comparaison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analyseMode === 'comparaison'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Comparer Scénarios
            </button>
            <button
              onClick={() => changerAnalyseMode('sensibilite')}
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
      
      {/* Navigation par onglets quand en mode détaillé */}
      {mode === 'detaille' && (
        <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
          <button
            onClick={() => changerOnglet('general')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'general'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Paramètres généraux
          </button>
          <button
            onClick={() => changerOnglet('production')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'production'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Production
          </button>
          <button
            onClick={() => changerOnglet('qualite')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'qualite'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Qualité
          </button>
          <button
            onClick={() => changerOnglet('securite')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'securite'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sécurité
          </button>
          <button
            onClick={() => changerOnglet('financier')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'financier'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Financier
          </button>
        </div>
      )}
      
      {/* Gestion des scénarios - Mode Analyse */}
      {mode === 'analyse' && analyseMode === 'comparaison' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Gestion des Scénarios</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Nom du scénario actuel</label>
              <input
                type="text"
                value={nomScenario}
                onChange={(e) => setUi({...ui, nomScenario: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Ex: Projet A - Version standard"
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
                      <p className="text-sm text-gray-600">
                        ROI: {scenario.resultats.roi?.toFixed(2)}% | 
                        Délai: {scenario.resultats.delaiRecuperation?.toFixed(2)} ans
                      </p>
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
          
          {scenarios.length > 1 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-4">Comparaison des scénarios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Scénario</th>
                      <th className="px-4 py-2 text-right">Investissement</th>
                      <th className="px-4 py-2 text-right">ROI</th>
                      <th className="px-4 py-2 text-right">Délai</th>
                      <th className="px-4 py-2 text-right">Capacité</th>
                      <th className="px-4 py-2 text-right">Employés</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-medium text-blue-700">{nomScenario} (actuel)</td>
                      <td className="px-4 py-2 text-right">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                          coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">{roi.toFixed(2)}%</td>
                      <td className="px-4 py-2 text-right">{delaiRecuperation.toFixed(2)} ans</td>
                      <td className="px-4 py-2 text-right">{capaciteTraitement} unités/h</td>
                      <td className="px-4 py-2 text-right">{nombreEmployesAutomatise} ETP</td>
                    </tr>
                    {scenarios.map(scenario => (
                      scenario.id !== scenarioActif && (
                        <tr key={scenario.id} className="border-t">
                          <td className="px-4 py-2">{scenario.nom}</td>
                          <td className="px-4 py-2 text-right">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                              scenario.systemeAutomatise.coutSysteme + 
                              scenario.systemeAutomatise.coutInstallation + 
                              scenario.systemeAutomatise.coutIngenierie + 
                              scenario.systemeAutomatise.coutFormation - 
                              scenario.systemeAutomatise.subventions
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">{scenario.resultats.roi?.toFixed(2)}%</td>
                          <td className="px-4 py-2 text-right">{scenario.resultats.delaiRecuperation?.toFixed(2)} ans</td>
                          <td className="px-4 py-2 text-right">{scenario.systemeAutomatise.capaciteTraitement} unités/h</td>
                          <td className="px-4 py-2 text-right">{scenario.systemeAutomatise.nombreEmployes} ETP</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Analyse de sensibilité - Mode Analyse */}
      {mode === 'analyse' && analyseMode === 'sensibilite' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse de Sensibilité</h2>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paramètre à analyser</label>
              <select
                value={ui.parametreSensibilite}
                onChange={(e) => setUi({...ui, parametreSensibilite: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="coutSysteme">Coût du système</option>
                <option value="coutInstallation">Coût d'installation</option>
                <option value="coutIngenierie">Coût d'ingénierie</option>
                <option value="coutFormation">Coût de formation</option>
                <option value="coutFormationContinue">Coût de formation continue</option>
                <option value="nombreEmployes">Nombre d'employés après automatisation</option>
                <option value="capaciteTraitement">Capacité de production</option>
                <option value="tempsDesCycle">Temps de cycle</option>
                <option value="tauxRejets">Taux de rejet</option>
                <option value="reductionAccidents">Réduction des accidents</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Voir l'impact de la variation de ce paramètre sur les résultats</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-64">
              <h3 className="font-medium text-gray-700 mb-2">Impact sur le ROI</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaison.dataSensibiliteROI}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variation" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'ROI']} />
                  <Bar dataKey="roi" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <h3 className="font-medium text-gray-700 mb-2">Description de l'analyse</h3>
              <div className="bg-gray-50 p-3 rounded text-sm h-full overflow-y-auto">
                <p className="mb-2">
                  <strong>Analyse de sensibilité du paramètre "{ui.parametreSensibilite}"</strong>
                </p>
                <p className="mb-2">
                  Cette analyse montre comment le ROI change lorsque le paramètre sélectionné varie. 
                  Les variations vont de -50% à +50% par rapport à la valeur actuelle.
                </p>
                <p>
                  <strong>Observations:</strong><br />
                  {ui.parametreSensibilite === 'coutSysteme' && 
                    "Le coût du système a un impact significatif sur le ROI. Une réduction de ce coût améliore considérablement la rentabilité du projet."
                  }
                  {ui.parametreSensibilite === 'nombreEmployes' && 
                    "Le nombre d'employés après automatisation affecte directement les économies de main d'œuvre, qui sont souvent la principale source d'économies."
                  }
                  {ui.parametreSensibilite === 'capaciteTraitement' && 
                    "La capacité de production a un impact direct sur les bénéfices supplémentaires générés par l'augmentation de la production."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mode Comparatif */}
      {mode === 'comparatif' && (
        <>
          {/* Paramètres de base */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Comparaison Avant / Après Automatisation</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setTypeSystemeActuel('manuel')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'manuel'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Manuel
                </button>
                <button
                  onClick={() => setTypeSystemeActuel('semi-auto')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'semi-auto'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semi-automatisé
                </button>
                <button
                  onClick={() => setTypeSystemeActuel('auto-ancien')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'auto-ancien'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Auto. (ancien)
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Système actuel */}
              <div className="border rounded-lg p-4 bg-red-50 border-red-100">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Système Actuel ({typeSystemeActuel === 'manuel' ? 'Manuel' : typeSystemeActuel === 'semi-auto' ? 'Semi-auto' : 'Auto ancien'})
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Temps de cycle (sec/unité)</label>
                      <input
                        type="number"
                        min="1"
                        value={parametresSystemeActuel.tempsDesCycle}
                        onChange={(e) => updateTempsDesCycle(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                      <input
                        type="number"
                        min="1"
                        value={parametresSystemeActuel.capacite}
                        onChange={(e) => updateCapacite(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={parametresSystemeActuel.nombreEmployes}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          nombreEmployes: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Taux de rejet (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={parametresSystemeActuel.tauxRejets}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          tauxRejets: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût maintenance/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.maintenance}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          maintenance: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût énergie/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.energie}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          energie: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fréquence accidents/an</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={parametresSystemeActuel.frequenceAccident}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          frequenceAccident: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût moyen accident ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.coutMoyenAccident}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          coutMoyenAccident: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Système automatisé */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-100">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Système Automatisé (Proposé)
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Temps de cycle (sec/unité)</label>
                      <input
                        type="number"
                        min="1"
                        value={parametresSystemeAutomatise.tempsDesCycle}
                        onChange={(e) => updateTempsDesCycleAutomatise(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                      <input
                        type="number"
                        min="1"
                        value={parametresSystemeAutomatise.capaciteTraitement}
                        onChange={(e) => updateCapaciteAutomatisee(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={parametresSystemeAutomatise.nombreEmployes}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          nombreEmployes: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Taux de rejet (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={parametresSystemeAutomatise.tauxRejets}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          tauxRejets: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût maintenance/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutMaintenance}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutMaintenance: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût énergie/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutEnergie}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutEnergie: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Réduction accidents (%)</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={parametresSystemeAutomatise.reductionAccidents}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          reductionAccidents: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Formation continue/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutFormationContinue}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutFormationContinue: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                      <p className="text-xs text-gray-500 mt-1">Coût caché souvent oublié</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Investissement nécessaire pour l'automatisation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Coût système ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeAutomatise.coutSysteme}
                    onChange={(e) => setParametresSystemeAutomatise({
                      ...parametresSystemeAutomatise,
                      coutSysteme: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Installation ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeAutomatise.coutInstallation}
                    onChange={(e) => setParametresSystemeAutomatise({
                      ...parametresSystemeAutomatise,
                      coutInstallation: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ingénierie ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeAutomatise.coutIngenierie}
                    onChange={(e) => setParametresSystemeAutomatise({
                      ...parametresSystemeAutomatise,
                      coutIngenierie: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Formation initiale ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeAutomatise.coutFormation}
                    onChange={(e) => setParametresSystemeAutomatise({
                      ...parametresSystemeAutomatise,
                      coutFormation: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium mb-1">Subventions/aides ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeAutomatise.subventions}
                    onChange={(e) => setParametresSystemeAutomatise({
                      ...parametresSystemeAutomatise,
                      subventions: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Investissement total:</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                      coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Graphiques comparatifs */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Comparaison visuelle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="h-64">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de production (unités/heure)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataComparaison.dataComparaisonCapacite} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
                    <Bar dataKey="value" fill={(entry) => entry.fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Temps de cycle (secondes/unité)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataComparaison.dataComparaisonTempsCycle} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} secondes`, 'Temps de cycle']} />
                    <Bar dataKey="value" fill={(entry) => entry.fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Main d'œuvre requise (ETP)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataComparaison.dataComparaisonEmployes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} employés`, 'Main d\'œuvre']} />
                    <Bar dataKey="value" fill={(entry) => entry.fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Taux de rejet (%)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataComparaison.dataComparaisonRejets} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejet']} />
                    <Bar dataKey="value" fill={(entry) => entry.fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Résultats financiers */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Résultats financiers</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                <p className="text-2xl font-bold text-blue-800">{roi.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Sur la durée de vie ({dureeVie} ans)</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
                <p className="text-2xl font-bold text-green-800">{delaiRecuperation.toFixed(2)} ans</p>
                <p className="text-xs text-gray-600 mt-1">Retour sur investissement</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">VAN</h3>
                <p className="text-2xl font-bold text-purple-800">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
                </p>
                <p className="text-xs text-gray-600 mt-1">Valeur Actuelle Nette</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Taux de Rendement Interne</p>
              </div>
            </div>
            
            <div className="mt-6 h-80">
              <h3 className="font-medium text-gray-700 mb-3">Économies annuelles par catégorie</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaison.dataEconomies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Économie']} />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 h-80">
              <h3 className="font-medium text-gray-700 mb-3">Récupération de l'investissement</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataComparaison.dataCumulatif}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="annee" />
                  <YAxis />
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Montant']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cumulatif" 
                    name="Flux cumulatif" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="seuil" 
                    name="Seuil d'investissement" 
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 italic">
                * Le point d'intersection représente le délai de récupération de l'investissement.
              </p>
            </div>
          </div>
          
          {/* Recommandation */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Recommandation</h2>
            
            <div className="mb-4 p-4 rounded-lg border">
              {delaiRecuperation <= 3 && roi > 50 ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Projet fortement recommandé
                  </h3>
                  <p className="mb-2">
                    Ce projet d'automatisation présente un excellent retour sur investissement avec un délai de récupération de seulement <strong>{delaiRecuperation.toFixed(2)} ans</strong> et un ROI de <strong>{roi.toFixed(2)}%</strong> sur la durée de vie de {dureeVie} ans.
                  </p>
                  <p>
                    L'investissement de {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions)} génère une économie annuelle moyenne de {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}.
                  </p>
                </div>
              ) : delaiRecuperation <= 5 ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Projet recommandé
                  </h3>
                  <p className="mb-2">
                    Ce projet d'automatisation présente un bon retour sur investissement avec un délai de récupération de <strong>{delaiRecuperation.toFixed(2)} ans</strong> et un ROI de <strong>{roi.toFixed(2)}%</strong> sur la durée de vie de {dureeVie} ans.
                  </p>
                  <p>
                    L'investissement de {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions)} génère une économie annuelle moyenne de {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Projet à évaluer davantage
                  </h3>
                  <p className="mb-2">
                    Ce projet d'automatisation présente un retour sur investissement à plus long terme avec un délai de récupération de <strong>{delaiRecuperation.toFixed(2)} ans</strong>. Il est recommandé d'explorer des options pour améliorer la rentabilité.
                  </p>
                  <p>
                    Considérez: réduire les coûts initiaux, augmenter la capacité de production, ou explorer des subventions ou aides disponibles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculateurROI;