import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculerTRI, calculerDelaiRecuperation } from '../utils/calculationHelpers';

// Création du contexte
const CalculateurGeneralContext = createContext();

// État initial du calculateur
const etatInitial = {
  // Système actuel
  systemeActuel: {
    type: 'manuel', // manuel, semi-auto, auto-ancien
    capacite: 35, // unités/heure
    tempsCycle: 103, // secondes/unité
    nombreEmployes: 2, // ETP
    coutMaintenance: 6000, // $/an
    coutEnergie: 4000, // $/an
    tauxRejets: 8, // % de rejets
    perteProduction: 12, // % perte due aux arrêts et retards
    frequenceAccident: 4.5, // accidents par an
    coutMoyenAccident: 10000, // coût moyen par accident
    tempsArretAccident: 24, // heures d'arrêt par accident
  },
  
  // Paramètres du système automatisé
  parametresSystemeAutomatise: {
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 10000,
    coutFormationContinue: 5000, // Nouveau paramètre: formation continue
    coutMaintenance: 5000,
    coutEnergie: 3000,
    dureeVie: 10,
    tauxAmortissement: 20,
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 1.5,
    coutErrorHumaine: 15000,
    augmentationProduction: 15,
    capaciteTraitement: 85, // unités/heure
    tempsCycle: 42, // secondes/unité
    tauxRejets: 3, // % de rejets
    reductionAccidents: 80, // % de réduction des accidents
    reductionEnergie: 25, // % de réduction d'énergie
    reductionDechet: 60, // % de réduction des déchets
    tempsArretReduit: 70, // % de réduction des temps d'arrêt
    coutLogiciel: 12000, // Nouveau paramètre: coûts des logiciels et licences
    coutMiseAJour: 8000, // Nouveau paramètre: coûts des mises à jour
    subventions: 0,
  },
  
  // Paramètres généraux
  parametresGeneraux: {
    production: 100000, // production annuelle en unités
    margeUnitaire: 0.2, // marge par unité produite
    tauxProblemeQualite: 8, // % de problèmes de qualité
    coutQualite: 20000, // coût annuel lié aux problèmes de qualité
    tauxInflation: 2, // % d'inflation annuelle
    tauxActualisation: 5, // % de taux d'actualisation
    heuresOperationParJour: 16, // heures d'opération par jour
    joursOperationParAn: 250, // jours d'opération par an
    coutDechet: 200, // coût par unité de déchet
  },
  
  // Résultats des calculs
  resultats: {
    resultatAnnuel: [],
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
    economiesTempsArret: 0,
  },
  
  // Interface utilisateur
  ui: {
    analyseMode: 'standard', // 'standard', 'comparaison', 'sensibilite'
    viewMode: 'basique', // 'basique', 'avance'
    afficherDetails: false,
    ongletActif: 'general', // 'general', 'details', 'financier', 'comparatif'
    parametreSensibilite: 'coutSysteme',
    resultatsSensibilite: [],
    scenarios: [],
    scenarioActif: 'actuel',
    nomScenario: 'Scénario de base',
  }
};

// Provider du contexte
export const CalculateurGeneralProvider = ({ children }) => {
  const [systemeActuel, setSystemeActuel] = useState(etatInitial.systemeActuel);
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState(etatInitial.parametresSystemeAutomatise);
  const [parametresGeneraux, setParametresGeneraux] = useState(etatInitial.parametresGeneraux);
  const [resultats, setResultats] = useState(etatInitial.resultats);
  const [ui, setUi] = useState(etatInitial.ui);

  // Effet pour ajuster les paramètres du système actuel en fonction du type
  useEffect(() => {
    if (systemeActuel.type === 'manuel') {
      setSystemeActuel(prevState => ({
        ...prevState,
        capacite: 35,
        tempsCycle: 103,
        nombreEmployes: 2,
        coutMaintenance: 6000,
        coutEnergie: 4000,
        tauxRejets: 8,
        perteProduction: 12,
        frequenceAccident: 4.5
      }));
    } else if (systemeActuel.type === 'semi-auto') {
      setSystemeActuel(prevState => ({
        ...prevState,
        capacite: 60,
        tempsCycle: 60,
        nombreEmployes: 1.5,
        coutMaintenance: 12000,
        coutEnergie: 6000,
        tauxRejets: 5.5,
        perteProduction: 8,
        frequenceAccident: 3.2
      }));
    } else if (systemeActuel.type === 'auto-ancien') {
      setSystemeActuel(prevState => ({
        ...prevState,
        capacite: 70,
        tempsCycle: 51,
        nombreEmployes: 1,
        coutMaintenance: 20000,
        coutEnergie: 8000,
        tauxRejets: 4.5,
        perteProduction: 6,
        frequenceAccident: 2
      }));
    }
  }, [systemeActuel.type]);

  // Synchronisation des temps de cycle et capacité
  useEffect(() => {
    // Si le temps de cycle est mis à jour, recalculer la capacité
    const capaciteCalculee = Math.round(3600 / systemeActuel.tempsCycle);
    if (capaciteCalculee !== systemeActuel.capacite) {
      setSystemeActuel(prev => ({
        ...prev,
        capacite: capaciteCalculee
      }));
    }
  }, [systemeActuel.tempsCycle]);

  useEffect(() => {
    // Si la capacité est mise à jour, recalculer le temps de cycle
    const tempsCycleCalcule = Math.round(3600 / systemeActuel.capacite);
    if (tempsCycleCalcule !== systemeActuel.tempsCycle) {
      setSystemeActuel(prev => ({
        ...prev,
        tempsCycle: tempsCycleCalcule
      }));
    }
  }, [systemeActuel.capacite]);

  // Même synchronisation pour le système automatisé
  useEffect(() => {
    const capaciteCalculee = Math.round(3600 / parametresSystemeAutomatise.tempsCycle);
    if (capaciteCalculee !== parametresSystemeAutomatise.capaciteTraitement) {
      setParametresSystemeAutomatise(prev => ({
        ...prev,
        capaciteTraitement: capaciteCalculee
      }));
    }
  }, [parametresSystemeAutomatise.tempsCycle]);

  useEffect(() => {
    const tempsCycleCalcule = Math.round(3600 / parametresSystemeAutomatise.capaciteTraitement);
    if (tempsCycleCalcule !== parametresSystemeAutomatise.tempsCycle) {
      setParametresSystemeAutomatise(prev => ({
        ...prev,
        tempsCycle: tempsCycleCalcule
      }));
    }
  }, [parametresSystemeAutomatise.capaciteTraitement]);

  // Fonction de calcul du ROI et des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutFormationContinue,
      coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, 
      nbEmployesRemplaces, coutErrorHumaine, augmentationProduction, capaciteTraitement,
      tauxRejets, reductionAccidents, reductionEnergie, reductionDechet, tempsArretReduit,
      coutLogiciel, coutMiseAJour, subventions
    } = parametresSystemeAutomatise;

    const {
      capacite, nombreEmployes, coutMaintenance: maintenanceActuelle, 
      coutEnergie: energieActuelle, perteProduction, tauxRejets: tauxRejetsActuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = systemeActuel;

    const {
      production, margeUnitaire, tauxProblemeQualite, coutQualite,
      tauxInflation, tauxActualisation, heuresOperationParJour, joursOperationParAn,
      coutDechet
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial (incluant coûts cachés)
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + 
                                coutFormation + coutLogiciel - subventions;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles * 
                                (1 - (perteProduction * (1 - tempsArretReduit / 100)) / 100);
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (production * margeUnitaire) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * 
                                  valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;

    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      
      // Coûts de maintenance (incluant mises à jour périodiques)
      const maintenanceAnnuelle = (coutMaintenance + (annee % 3 === 0 ? coutMiseAJour : 0)) * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      
      // Coûts d'énergie
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      
      // Formation continue (coût récurrent)
      const formationContinueAnnuelle = (annee > 1 ? coutFormationContinue : 0) * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle + 
                            (production * reductionEnergie / 100 * facteurInflation);
      
      // Économies liées à la réduction des déchets
      const economieDechet = (production * reductionDechet / 100) * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets
      const economieRejets = production * (tauxRejetsActuel - tauxRejets) / 100 * coutDechet * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const beneficeSupplementaire = differenceProductionCalc * margeUnitaire * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité
      const beneficeQualite = (production * tauxProblemeQualite / 100) * 
                            (coutQualite / production) * facteurInflation * 0.8; // On suppose 80% d'amélioration
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel (incluant coûts récurrents supplémentaires)
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieRejets + beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       formationContinueAnnuelle - maintenanceAnnuelle - energieOperationAnnuelle + 
                       amortissement;
      
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
        economieRejets,
        beneficeSupplementaire,
        beneficeQualite,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        formationContinueAnnuelle,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        amortissement
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    const fluxPourTRI = fluxTresorerie.map(item => item.fluxAnnuel);
    const triCalcule = calculerTRI(investissementInitial, fluxPourTRI);
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Estimation des réductions de CO2 (pourrait être paramétré)
    const economiesCO2 = production * 0.05; // hypothèse: 5% de réduction d'empreinte CO2
    
    // Mise à jour des résultats
    setResultats({
      resultatAnnuel: fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triCalcule,
      economiesCO2,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: beneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  };

  // Fonction pour gérer les analyses de sensibilité
  const calculerSensibilite = () => {
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    const resultats = [];
    
    // Valeur actuelle du paramètre
    const valeurBase = {
      coutSysteme: parametresSystemeAutomatise.coutSysteme, 
      coutInstallation: parametresSystemeAutomatise.coutInstallation, 
      coutIngenierie: parametresSystemeAutomatise.coutIngenierie, 
      coutFormation: parametresSystemeAutomatise.coutFormation,
      coutMaintenance: parametresSystemeAutomatise.coutMaintenance, 
      coutEnergie: parametresSystemeAutomatise.coutEnergie, 
      nbEmployesRemplaces: parametresSystemeAutomatise.nbEmployesRemplaces,
      augmentationProduction: parametresSystemeAutomatise.augmentationProduction,
      coutMainOeuvre: parametresSystemeAutomatise.coutMainOeuvre,
      capaciteTraitement: parametresSystemeAutomatise.capaciteTraitement
    }[ui.parametreSensibilite];
    
    // Pour chaque variation, calculer les nouveaux résultats
    for (const variation of variations) {
      // Appliquer la variation
      const facteur = 1 + variation / 100;
      const valeurModifiee = valeurBase * facteur;
      
      // Créer un clone des paramètres actuels
      const nouveauxParams = { ...parametresSystemeAutomatise };
      
      // Mettre à jour le paramètre concerné
      nouveauxParams[ui.parametreSensibilite] = valeurModifiee;
      
      // Calculer ROI pour ces nouveaux paramètres
      // Version simplifiée pour l'exemple - à refactoriser plus tard
      const investissementInitial = nouveauxParams.coutSysteme + nouveauxParams.coutInstallation + 
                                  nouveauxParams.coutIngenierie + nouveauxParams.coutFormation - 
                                  nouveauxParams.subventions;
      
      // Calculs simplifiés pour la démo
      const economiesAnnuelles = nouveauxParams.coutMainOeuvre * nouveauxParams.nbEmployesRemplaces * 
                              (nouveauxParams.capaciteTraitement / 100);
      const totalBenefices = economiesAnnuelles * nouveauxParams.dureeVie;
      const roiCalcule = (totalBenefices / investissementInitial) * 100;
      
      // Ajouter les résultats à notre tableau
      resultats.push({
        variation,
        roi: roiCalcule,
        delaiRecuperation: investissementInitial / economiesAnnuelles,
        van: totalBenefices - investissementInitial
      });
    }
    
    // Mise à jour de l'état UI avec les résultats de sensibilité
    setUi(prev => ({ ...prev, resultatsSensibilite: resultats }));
  };

  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    const scenarioActuel = {
      id: Date.now().toString(),
      nom: ui.nomScenario,
      parametresSystemeActuel: { ...systemeActuel },
      parametresSystemeAutomatise: { ...parametresSystemeAutomatise },
      parametresGeneraux: { ...parametresGeneraux },
      resultats: { ...resultats }
    };
    
    setUi(prev => ({
      ...prev,
      scenarios: [...prev.scenarios, scenarioActuel]
    }));
  };

  // Fonction pour charger un scénario
  const chargerScenario = (scenarioId) => {
    const scenario = ui.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSystemeActuel(scenario.parametresSystemeActuel);
      setParametresSystemeAutomatise(scenario.parametresSystemeAutomatise);
      setParametresGeneraux(scenario.parametresGeneraux);
      setResultats(scenario.resultats);
      
      setUi(prev => ({
        ...prev,
        scenarioActif: scenarioId,
        nomScenario: scenario.nom
      }));
    }
  };

  // Fonction pour supprimer un scénario
  const supprimerScenario = (scenarioId) => {
    setUi(prev => ({
      ...prev,
      scenarios: prev.scenarios.filter(s => s.id !== scenarioId),
      scenarioActif: prev.scenarioActif === scenarioId ? 'actuel' : prev.scenarioActif
    }));
  };

  // Effectuer les calculs lors des changements d'état
  useEffect(() => {
    calculerROI();
    if (ui.analyseMode === 'sensibilite') {
      calculerSensibilite();
    }
  }, [systemeActuel, parametresSystemeAutomatise, parametresGeneraux, ui.analyseMode, ui.parametreSensibilite]);

  // Valeur du contexte à exposer
  const contexteValeur = {
    systemeActuel,
    setSystemeActuel,
    parametresSystemeAutomatise,
    setParametresSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    resultats,
    ui,
    setUi,
    calculerROI,
    calculerSensibilite,
    sauvegarderScenario,
    chargerScenario,
    supprimerScenario
  };

  return (
    <CalculateurGeneralContext.Provider value={contexteValeur}>
      {children}
    </CalculateurGeneralContext.Provider>
  );
};

// Hook personnalisé pour utiliser ce contexte
export const useCalculateurGeneral = () => {
  const context = useContext(CalculateurGeneralContext);
  if (context === undefined) {
    throw new Error('useCalculateurGeneral doit être utilisé à l\'intérieur d\'un CalculateurGeneralProvider');
  }
  return context;
};
