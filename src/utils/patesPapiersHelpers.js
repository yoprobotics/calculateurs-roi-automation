import { calculerFluxActualise, appliquerInflation } from './calculationHelpers';

/**
 * Calcule le retour sur investissement (ROI) pour un projet d'automatisation dans l'industrie des pâtes et papiers
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} - Les résultats du calcul incluant ROI, VAN, TRI, etc.
 */
export const calculerROIPatesPapiers = (parametresSystemeAutomatise, parametresSystemeActuel, parametresGeneraux) => {
  const {
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, 
    coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
    reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
    coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
    reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
    subventions
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
  
  // Résultats
  return {
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
  };
};

/**
 * Ajuste les paramètres par défaut en fonction du type de système actuel
 * @param {string} typeSystemeActuel - Type de système actuel
 * @param {Object} parametresActuels - Paramètres actuels
 * @returns {Object} - Paramètres ajustés
 */
export const ajusterParametresSystemeActuel = (typeSystemeActuel, parametresActuels) => {
  let parametresAjustes = { ...parametresActuels };
  
  if (typeSystemeActuel === 'manuel') {
    parametresAjustes = {
      ...parametresActuels,
      capacite: 45,
      nombreEmployes: 2.5,
      coutSysteme: 15000, 
      maintenance: 6000,
      energie: 4000,
      tauxRejets: 8,
      perteProduction: 12,
      frequenceAccident: 5.2
    };
  } else if (typeSystemeActuel === 'semi-auto') {
    parametresAjustes = {
      ...parametresActuels,
      capacite: 80,
      nombreEmployes: 1.5,
      coutSysteme: 120000,
      maintenance: 18000,
      energie: 8000,
      tauxRejets: 5.5,
      perteProduction: 8,
      frequenceAccident: 3.8
    };
  } else if (typeSystemeActuel === 'auto-ancien') {
    parametresAjustes = {
      ...parametresActuels,
      capacite: 100,
      nombreEmployes: 1,
      coutSysteme: 250000,
      maintenance: 25000,
      energie: 10000,
      tauxRejets: 4.2,
      perteProduction: 5,
      frequenceAccident: 1.5
    };
  }
  
  return parametresAjustes;
};

/**
 * Prépare les données pour les graphiques
 * @param {Object} resultats - Résultats des calculs
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} - Données pour les graphiques
 */
export const preparerDonneesGraphiques = (resultats, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux) => {
  const { 
    capacite: capaciteActuelle, nombreEmployes: nombreEmployesActuel,
    tauxRejets: tauxRejetsManuel, frequenceAccident: frequenceAccidentActuel,
    maintenanceActuelle = parametresSystemeActuel.maintenance,
    energieActuelle = parametresSystemeActuel.energie
  } = parametresSystemeActuel;
  
  const {
    capaciteTraitement, tauxRejets: tauxRejetsFils, reductionAccidents, 
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance,
    coutEnergie, nbEmployesRemplaces, subventions
  } = parametresSystemeAutomatise;
  
  const { margeBrute, tonnageAnnuel } = parametresGeneraux;
  
  const {
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, fluxTresorerie
  } = resultats;
  
  // Comparaison des capacités
  const dataComparaisonCapacite = [
    { name: 'Système Actuel', value: capaciteActuelle, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: capaciteTraitement, fill: '#22c55e' }
  ];
  
  // Comparaison du nombre d'employés
  const dataComparaisonEmployes = [
    { name: 'Système Actuel', value: nombreEmployesActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: nombreEmployesActuel - nbEmployesRemplaces, fill: '#22c55e' }
  ];
  
  // Comparaison des taux de rejets
  const dataComparaisonRejets = [
    { name: 'Système Actuel', value: tauxRejetsManuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: tauxRejetsFils, fill: '#22c55e' }
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
    { name: 'Sécurité', value: economiesSecurite + economiesTempsArret > 0 ? economiesSecurite + economiesTempsArret : 0 },
    { name: 'Production', value: differenceProduction * (margeBrute / tonnageAnnuel) > 0 ? differenceProduction * (margeBrute / tonnageAnnuel) : 0 },
    { name: 'Maintenance', value: maintenanceActuelle - coutMaintenance > 0 ? maintenanceActuelle - coutMaintenance : 0 },
    { name: 'Énergie', value: energieActuelle - coutEnergie > 0 ? energieActuelle - coutEnergie : 0 }
  ];
  
  // Données pour le graphique de ROI cumulatif
  const dataCumulatif = fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    cumulatif: item.cumulFluxTresorerie,
    seuil: coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
  }));
  
  return {
    dataComparaisonCapacite,
    dataComparaisonEmployes,
    dataComparaisonRejets,
    dataComparaisonAccidents,
    dataEconomies,
    dataCumulatif
  };
};

/**
 * Sauvegarde les paramètres de calcul dans le localStorage
 * @param {Object} parametres - Paramètres à sauvegarder
 */
export const sauvegarderParametres = (parametres) => {
  try {
    localStorage.setItem('patesPapiers.parametres', JSON.stringify(parametres));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
  }
};

/**
 * Charge les paramètres de calcul depuis le localStorage
 * @returns {Object|null} - Paramètres chargés ou null en cas d'erreur
 */
export const chargerParametres = () => {
  try {
    const parametresString = localStorage.getItem('patesPapiers.parametres');
    return parametresString ? JSON.parse(parametresString) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    return null;
  }
};

/**
 * Valide un champ numérique
 * @param {any} valeur - Valeur à valider
 * @param {Object} options - Options de validation (min, max, requis)
 * @returns {boolean} - true si la valeur est valide
 */
export const validerChampNumerique = (valeur, options = {}) => {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, requis = true } = options;
  
  if (valeur === '' || valeur === null || valeur === undefined) {
    return !requis;
  }
  
  const nombre = Number(valeur);
  return !isNaN(nombre) && nombre >= min && nombre <= max;
};

/**
 * Valide un objet de paramètres complet
 * @param {Object} parametres - Paramètres à valider
 * @returns {Object} - Objet contenant les erreurs de validation
 */
export const validerParametres = (parametres) => {
  const { parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux } = parametres;
  let erreurs = {};
  
  // Validation des paramètres généraux
  if (!validerChampNumerique(parametresGeneraux.margeBrute, { min: 0 })) {
    erreurs.margeBrute = "La marge brute doit être un nombre positif";
  }
  
  if (!validerChampNumerique(parametresGeneraux.tonnageAnnuel, { min: 1 })) {
    erreurs.tonnageAnnuel = "Le tonnage annuel doit être supérieur à 0";
  }
  
  if (!validerChampNumerique(parametresGeneraux.heuresOperationParJour, { min: 1, max: 24 })) {
    erreurs.heuresOperationParJour = "Les heures d'opération doivent être entre 1 et 24";
  }
  
  if (!validerChampNumerique(parametresGeneraux.joursOperationParAn, { min: 1, max: 365 })) {
    erreurs.joursOperationParAn = "Les jours d'opération doivent être entre 1 et 365";
  }
  
  // Validation du système automatisé
  if (!validerChampNumerique(parametresSystemeAutomatise.capaciteTraitement, { min: 1 })) {
    erreurs.capaciteTraitement = "La capacité de traitement doit être supérieure à 0";
  }
  
  if (!validerChampNumerique(parametresSystemeAutomatise.coutSysteme, { min: 0 })) {
    erreurs.coutSysteme = "Le coût du système doit être un nombre positif";
  }
  
  // Ajoutez d'autres validations selon vos besoins...
  
  return erreurs;
};
