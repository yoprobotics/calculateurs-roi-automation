import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const CalculateurPatesPapiersContext = createContext();

// État initial du calculateur
const etatInitial = {
  // Paramètres du système actuel
  typeSystemeActuel: 'manuel',
  parametresSystemeActuel: {
    capacite: 45, // ballots/heure
    nombreEmployes: 2.5, // ETP
    coutSysteme: 85000, // Coût d'un système semi-auto
    maintenance: 18000, // $/an
    energie: 9500, // $/an
    perteProduction: 8, // % perte due aux arrêts et retards
    tauxRejets: 8, // % de rejets
    frequenceAccident: 5.2, // accidents par an
    coutMoyenAccident: 12500, // coût moyen par accident
    tempsArretAccident: 24 // heures d'arrêt par accident
  },
  
  // Paramètres du système automatisé
  parametresSystemeAutomatise: {
    coutSysteme: 380000,
    coutInstallation: 45000,
    coutIngenierie: 25000,
    coutFormation: 15000,
    coutFormationContinue: 8000, // Nouveau paramètre: formation continue
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
    coutLogiciel: 18000, // Nouveau paramètre: coûts des logiciels et licences
    coutMiseAJour: 10000, // Nouveau paramètre: coûts des mises à jour régulières
    subventions: 40000
  },
  
  // Paramètres généraux
  parametresGeneraux: {
    margeBrute: 110,
    tauxInflation: 2,
    tauxActualisation: 5,
    tonnageAnnuel: 20000,
    heuresOperationParJour: 16,
    joursOperationParAn: 300
  },
  
  // Résultats
  resultats: {
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
  },
  
  // État pour l'interface utilisateur
  ui: {
    afficherDetails: false,
    ongletActif: 'general'
  }
};

// Provider du contexte
export const CalculateurPatesPapiersProvider = ({ children }) => {
  const [typeSystemeActuel, setTypeSystemeActuel] = useState(etatInitial.typeSystemeActuel);
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState(etatInitial.parametresSystemeActuel);
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState(etatInitial.parametresSystemeAutomatise);
  const [parametresGeneraux, setParametresGeneraux] = useState(etatInitial.parametresGeneraux);
  const [resultats, setResultats] = useState(etatInitial.resultats);
  const [ui, setUi] = useState(etatInitial.ui);
  
  // Effet qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 45,
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
        capacite: 80,
        nombreEmployes: 1.5,
        coutSysteme: 120000,
        maintenance: 18000,
        energie: 8000,
        tauxRejets: 5.5,
        perteProduction: 8,
        frequenceAccident: 3.8
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 100,
        nombreEmployes: 1,
        coutSysteme: 250000,
        maintenance: 25000,
        energie: 10000,
        tauxRejets: 4.2,
        perteProduction: 5,
        frequenceAccident: 1.5
      });
    }
  }, [typeSystemeActuel]);
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutFormationContinue,
      coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
      reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
      coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
      reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
      coutLogiciel, coutMiseAJour, subventions
    } = parametresSystemeAutomatise;

    const {
      capacite, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsManuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = parametresSystemeActuel;

    const {
      margeBrute, tauxInflation, tauxActualisation, tonnageAnnuel,
      heuresOperationParJour, joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial (incluant les nouveaux coûts cachés)
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + 
                                coutFormation + coutLogiciel - subventions;
    
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
      
      // Formation continue (coût récurrent)
      const formationContinueAnnuelle = (annee > 1 ? coutFormationContinue : 0) * facteurInflation;
      
      // Mise à jour du système (coût périodique)
      const miseAJourAnnuelle = (annee % 4 === 0 ? coutMiseAJour : 0) * facteurInflation;
      
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
      
      // Calcul du flux de trésorerie annuel (incluant les nouveaux coûts récurrents)
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets +
                       beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle - 
                       formationContinueAnnuelle - miseAJourAnnuelle +
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
        economieEnergieProcessus,
        economieEau,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        formationContinueAnnuelle,
        miseAJourAnnuelle,
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
  
  // Effectuer le calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Fonctions pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };
  
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };
  
  // Valeur du contexte à exposer
  const contexteValeur = {
    typeSystemeActuel,
    setTypeSystemeActuel,
    parametresSystemeActuel,
    setParametresSystemeActuel,
    parametresSystemeAutomatise,
    setParametresSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    resultats,
    ui,
    calculerROI,
    changerOnglet,
    toggleDetails
  };
  
  return (
    <CalculateurPatesPapiersContext.Provider value={contexteValeur}>
      {children}
    </CalculateurPatesPapiersContext.Provider>
  );
};

// Hook personnalisé pour utiliser ce contexte
export const useCalculateurPatesPapiers = () => {
  const context = useContext(CalculateurPatesPapiersContext);
  if (context === undefined) {
    throw new Error('useCalculateurPatesPapiers doit être utilisé à l\'intérieur d\'un CalculateurPatesPapiersProvider');
  }
  return context;
};
