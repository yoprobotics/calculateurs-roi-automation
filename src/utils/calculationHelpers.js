/**
 * Calcule le flux de trésorerie actualisé
 * @param {number} flux - Flux de trésorerie
 * @param {number} tauxActualisation - Taux d'actualisation (en pourcentage)
 * @param {number} annee - Année du flux
 * @returns {number} - Flux actualisé
 */
export const calculerFluxActualise = (flux, tauxActualisation, annee) => {
  const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
  return flux / facteurActualisation;
};

/**
 * Calcule le délai de récupération précis avec interpolation
 * @param {number} investissementInitial - Montant de l'investissement initial
 * @param {Array} fluxTresorerie - Tableau des flux de trésorerie annuels
 * @param {number} dureeMax - Durée maximale à considérer
 * @returns {number} - Délai de récupération en années
 */
export const calculerDelaiRecuperation = (investissementInitial, fluxTresorerie, dureeMax) => {
  let cumulFluxTresorerie = 0;
  let periodeRecuperation = dureeMax;
  let recuperationAtteinte = false;
  
  for (let annee = 0; annee < fluxTresorerie.length; annee++) {
    cumulFluxTresorerie += fluxTresorerie[annee];
    
    if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
      const cumulPrecedent = cumulFluxTresorerie - fluxTresorerie[annee];
      const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxTresorerie[annee];
      periodeRecuperation = annee + fractionAnnee;
      recuperationAtteinte = true;
      break;
    }
  }
  
  return periodeRecuperation;
};

/**
 * Calcule le TRI (Taux de Rendement Interne) par approximation
 * @param {number} investissementInitial - Montant de l'investissement initial
 * @param {Array} fluxTresorerie - Tableau des flux de trésorerie annuels
 * @returns {number} - TRI en pourcentage
 */
export const calculerTRI = (investissementInitial, fluxTresorerie) => {
  let triApprox = 0;
  
  for (let r = 1; r <= 100; r++) {
    let npv = -investissementInitial;
    
    for (let t = 0; t < fluxTresorerie.length; t++) {
      npv += fluxTresorerie[t] / Math.pow(1 + r / 100, t + 1);
    }
    
    if (npv <= 0) {
      triApprox = r - 1;
      break;
    }
  }
  
  return triApprox;
};

/**
 * Applique l'inflation à une valeur
 * @param {number} valeur - Valeur initiale
 * @param {number} tauxInflation - Taux d'inflation annuel (en pourcentage)
 * @param {number} annees - Nombre d'années
 * @returns {number} - Valeur ajustée avec l'inflation
 */
export const appliquerInflation = (valeur, tauxInflation, annees) => {
  const facteurInflation = Math.pow(1 + tauxInflation / 100, annees);
  return valeur * facteurInflation;
};

/**
 * Calcule les résultats financiers pour l'industrie des pâtes et papiers
 * @param {string} typeSystemeActuel - Type de système actuel ('manuel', 'semi-auto', 'auto-ancien')
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} - Résultats du calcul ROI
 */
export const calculerROIPatesPapiers = (
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux
) => {
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
  const fluxAnnuels = fluxTresorerie.map(item => item.fluxAnnuel);
  const triApprox = calculerTRI(investissementInitial, fluxAnnuels);
  
  // Calcul de l'économie annuelle moyenne
  const economieAnnuelleCalc = totalBenefices / dureeVie;
  
  // Retour des résultats
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

// Génération de données pour les graphiques comparatifs pâtes et papiers
export const genererDonneesGraphiquesPatesPapiers = (
  resultats,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux
) => {
  const {
    capacite: capaciteActuelle,
    nombreEmployes: nombreEmployesActuel,
    tauxRejets: tauxRejetsManuel,
    frequenceAccident: frequenceAccidentActuel
  } = parametresSystemeActuel;

  const {
    capaciteTraitement,
    tauxRejets: tauxRejetsFils,
    reductionAccidents,
    nbEmployesRemplaces
  } = parametresSystemeAutomatise;

  const { margeBrute } = parametresGeneraux;

  const {
    reductionMainOeuvre,
    economiesQualite,
    economiesSecurite,
    economiesTempsArret,
    differenceProduction
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
    { name: 'Sécurité', value: (economiesSecurite + economiesTempsArret) > 0 ? economiesSecurite + economiesTempsArret : 0 },
    { name: 'Production', value: differenceProduction * (margeBrute / parametresGeneraux.tonnageAnnuel) > 0 
      ? differenceProduction * (margeBrute / parametresGeneraux.tonnageAnnuel) : 0 }
  ];

  // Données pour le graphique de ROI cumulatif
  const dataCumulatif = resultats.fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    cumulatif: item.cumulFluxTresorerie,
    seuil: parametresSystemeAutomatise.coutSysteme + 
           parametresSystemeAutomatise.coutInstallation + 
           parametresSystemeAutomatise.coutIngenierie + 
           parametresSystemeAutomatise.coutFormation - 
           parametresSystemeAutomatise.subventions
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