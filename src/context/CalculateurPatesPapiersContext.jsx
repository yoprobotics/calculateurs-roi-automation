import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
  TYPES_SYSTEME, 
  ONGLETS_CALCULATEUR,
  PARAMETRES_DEFAUT_SYSTEME_ACTUEL
} from '../utils/constants';

// Paramètres par défaut du système automatisé pour les pâtes et papiers
export const PARAMETRES_DEFAUT_SYSTEME_PATES_PAPIERS = {
  coutSysteme: 380000,
  coutInstallation: 45000,
  coutIngenierie: 25000,
  coutFormation: 15000,
  coutFormationContinue: 8000, // coût annuel de formation continue
  coutMaintenance: 12000,
  coutEnergie: 6500,
  dureeVie: 15,
  tauxAmortissement: 15,
  coutMainOeuvre: 55000,
  nbEmployesRemplaces: 2,
  reductionDechet: 14,
  coutDechet: 230,
  augmentationProduction: 10,
  reductionEnergie: 12,
  coutEnergieTonne: 40,
  reductionEau: 8,
  coutEauTonne: 4.5,
  ameliorationQualite: 5,
  reductionEmpreinteCO2: 7,
  capaciteTraitement: 120,
  tauxRejets: 3.5,
  reductionAccidents: 85,
  subventions: 40000,
  tempsCycle: 30 // secondes par unité
};

// Paramètres généraux par défaut pour les pâtes et papiers
export const PARAMETRES_GENERAUX_PATES_PAPIERS = {
  margeBrute: 110,
  tauxInflation: 2,
  tauxActualisation: 5,
  tonnageAnnuel: 20000,
  heuresOperationParJour: 16,
  joursOperationParAn: 300
};

// Création du context
const CalculateurPatesPapiersContext = createContext();

/**
 * Provider pour le context du calculateur de pâtes et papiers
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Provider du context
 */
export const CalculateurPatesPapiersProvider = ({ children }) => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState(TYPES_SYSTEME.MANUEL);

  // État pour les paramètres du système actuel
  const [systemeActuel, setSystemeActuel] = useState(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[TYPES_SYSTEME.MANUEL]);

  // État pour les paramètres du système automatisé
  const [systemeAutomatise, setSystemeAutomatise] = useState(PARAMETRES_DEFAUT_SYSTEME_PATES_PAPIERS);

  // État pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState(PARAMETRES_GENERAUX_PATES_PAPIERS);

  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    ongletActif: ONGLETS_CALCULATEUR.GENERAL,
    afficherDetails: false
  });

  // État pour les scénarios sauvegardés
  const [scenarios, setScenarios] = useLocalStorage('scenarios-calculateur-pates-papiers', []);
  
  // État pour le scénario actif
  const [scenarioActif, setScenarioActif] = useState('actuel');
  
  // État pour le nom du scénario actuel
  const [nomScenario, setNomScenario] = useState('Scénario de base - Pâtes et Papiers');
  
  // État pour les résultats
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

  // Mise à jour des paramètres du système actuel lorsque le type change
  useEffect(() => {
    setSystemeActuel(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[typeSystemeActuel]);
  }, [typeSystemeActuel]);

  // Fonction pour changer l'onglet actif
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };

  // Fonction pour basculer l'affichage des détails
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };

  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    const scenarioActuel = {
      id: Date.now().toString(),
      nom: nomScenario,
      typeSystemeActuel,
      systemeActuel,
      systemeAutomatise,
      parametresGeneraux,
      resultats: {
        roi: resultats.roi,
        delaiRecuperation: resultats.delaiRecuperation,
        van: resultats.van,
        tri: resultats.tri
      }
    };
    
    setScenarios([...scenarios, scenarioActuel]);
    setScenarioActif(scenarioActuel.id);
  };

  // Fonction pour charger un scénario
  const chargerScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setTypeSystemeActuel(scenario.typeSystemeActuel);
      setSystemeActuel(scenario.systemeActuel);
      setSystemeAutomatise(scenario.systemeAutomatise);
      setParametresGeneraux(scenario.parametresGeneraux);
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
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, 
      coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
      reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
      coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
      reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
      subventions
    } = systemeAutomatise;

    const {
      capacite, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsManuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = systemeActuel;

    const {
      margeBrute, tauxInflation, tauxActualisation, tonnageAnnuel,
      heuresOperationParJour, joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (tonnageAnnuel * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;
    
    // Variable pour stocker le bénéfice de qualité de la dernière année (pour l'affichage)
    let dernierBeneficeQualite = 0;
    
    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (tonnageAnnuel * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets (fils vs manuel)
      const economieRejets = tonnageAnnuel * (tauxRejetsManuel - tauxRejets) / 100 * coutDechet * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie dans le processus
      const economieEnergieProcessus = (tonnageAnnuel * reductionEnergie / 100) * coutEnergieTonne * facteurInflation;
      
      // Économies liées à la réduction de consommation d'eau
      const economieEau = (tonnageAnnuel * reductionEau / 100) * coutEauTonne * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const productionSupplementaire = tonnageAnnuel * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeBrute * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (tonnageAnnuel * ameliorationQualite / 100) * (margeBrute * 0.2) * facteurInflation;
      
      // Stockage de la dernière valeur pour l'affichage
      if (annee === dureeVie) {
        dernierBeneficeQualite = beneficeQualite;
      }
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (en tonnes)
      const tonnesCO2Economisees = (tonnageAnnuel * reductionEmpreinteCO2 / 100);
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets +
                       beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
      
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
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  };

  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, systemeActuel, systemeAutomatise, parametresGeneraux]);

  // Valeur fournie par le context
  const value = {
    typeSystemeActuel,
    setTypeSystemeActuel,
    systemeActuel,
    setSystemeActuel,
    systemeAutomatise,
    setSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    ui,
    setUi,
    changerOnglet,
    toggleDetails,
    resultats,
    scenarios,
    scenarioActif,
    nomScenario,
    setNomScenario,
    sauvegarderScenario,
    chargerScenario,
    supprimerScenario
  };

  return (
    <CalculateurPatesPapiersContext.Provider value={value}>
      {children}
    </CalculateurPatesPapiersContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le context du calculateur de pâtes et papiers
 * @returns {Object} - Valeurs et fonctions du context
 */
export const useCalculateurPatesPapiers = () => {
  const context = useContext(CalculateurPatesPapiersContext);
  
  if (context === undefined) {
    throw new Error('useCalculateurPatesPapiers doit être utilisé à l\\'intérieur d\\'un CalculateurPatesPapiersProvider');
  }
  
  return context;
};

export default CalculateurPatesPapiersContext;
