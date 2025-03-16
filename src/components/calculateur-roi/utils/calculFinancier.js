/**
 * Fonctions de calcul financier pour le calculateur ROI
 */

/**
 * Calcule le ROI et les autres indicateurs financiers
 * @param {Object} parametresSystemeActuel - Les paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Les paramètres du système automatisé
 * @param {Object} parametresGeneraux - Les paramètres généraux
 * @returns {Object} - Les résultats (ROI, VAN, TRI, délai de récupération, etc.)
 */
export const calculerROI = (parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux) => {
  // Extraction des paramètres nécessaires
  const {
    capacite, nombreEmployes, maintenance: maintenanceActuelle, 
    energie: energieActuelle, tauxRejets: tauxRejetsActuel,
    frequenceAccident, coutMoyenAccident, tempsArretAccident,
    perteProduction: perteProductionActuelle, arretNonPlanifie: arretNonPlanifieActuel
  } = parametresSystemeActuel;

  const {
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, 
    coutMaintenance, coutEnergie, dureeVie, tauxAmortissement,
    coutMainOeuvre, nbEmployesRemplaces, reductionDechet,
    coutDechet, augmentationProduction, ameliorationQualite,
    capaciteTraitement, tauxRejets: tauxRejetsAutomatise, 
    reductionAccidents, subventions, reductionTempsArret, tempsCycle,
    coutFormationContinue, coutMisesAJour, coutConsommables
  } = parametresSystemeAutomatise;

  const {
    production, margeUnitaire, tauxInflation, tauxActualisation,
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
  
  // Calcul du nombre d'heures d'opération par an
  const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
  
  // Calcul de la production annuelle (actuelle vs automatisée)
  const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProductionActuelle / 100);
  const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
  const differenceProductionCalc = productionAutomatisee - productionActuelle;
  
  // Calcul des économies d'accidents
  const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
  
  // Calcul des économies liées au temps d'arrêt dû aux accidents
  const valeurProductionHoraire = (production * margeUnitaire) / heuresOperationAnnuelles;
  const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
  
  // Calcul de la réduction de main d'œuvre
  const reductionMainOeuvreCalc = nbEmployesRemplaces * coutMainOeuvre;
  
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
    
    // Coûts cachés ajustés avec l'inflation
    const formationContinueAnnuelle = coutFormationContinue * facteurInflation;
    const misesAJourAnnuelles = coutMisesAJour * facteurInflation;
    const consommablesAnnuels = coutConsommables * facteurInflation;
    const coutsCachesAnnuels = formationContinueAnnuelle + misesAJourAnnuelles + consommablesAnnuels;
    
    // Calcul des économies
    const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
    const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
    const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
    
    // Économies liées à la réduction des déchets
    const economieRejets = production * (tauxRejetsActuel - tauxRejetsAutomatise) / 100 * coutDechet * facteurInflation;
    
    // Économies liées à la réduction des temps d'arrêt non planifiés
    const economieArretNonPlanifie = arretNonPlanifieActuel * (reductionTempsArret / 100) * valeurProductionHoraire * facteurInflation;
    
    // Bénéfices liés à l'augmentation de la production
    const beneficeSupplementaire = production * (augmentationProduction / 100) * margeUnitaire * facteurInflation;
    
    // Bénéfices liés à l'amélioration de la qualité
    const beneficeQualite = (production * ameliorationQualite / 100) * (margeUnitaire * 0.2) * facteurInflation;
    
    // Stockage de la dernière valeur pour l'affichage
    if (annee === dureeVie) {
      dernierBeneficeQualite = beneficeQualite;
    }
    
    // Économies liées à la sécurité (ajustées pour l'inflation)
    const economieSecuriteAjustee = economiesAccidents * facteurInflation;
    const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
    
    // Amortissement
    const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
    
    // Calcul du flux de trésorerie annuel
    const fluxAnnuel = economiePersonnel + economieRejets + economieMaintenance + economieEnergie +
                      beneficeSupplementaire + beneficeQualite + economieArretNonPlanifie +
                      economieSecuriteAjustee + economieTempsArretAjustee - 
                      coutsCachesAnnuels - maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
    
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
      economieRejets,
      economieMaintenance,
      economieEnergie,
      beneficeSupplementaire,
      beneficeQualite,
      economieSecuriteAjustee,
      economieTempsArretAjustee,
      economieArretNonPlanifie,
      maintenanceAnnuelle,
      energieOperationAnnuelle,
      coutsCachesAnnuels,
      amortissement
    });
  }
  
  // Calcul du ROI
  const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
  
  // Limitation du ROI à une valeur raisonnable (1000% max)
  const roiCalcule = Math.min((totalBenefices / investissementInitial) * 100, 1000);
  
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
  
  // Différence de temps de cycle en pourcentage
  const tempsCycleActuel = parametresSystemeActuel.tempsCycle;
  const reductionTempsCyclePourcentage = tempsCycleActuel > 0 ? 
    ((tempsCycleActuel - tempsCycle) / tempsCycleActuel) * 100 : 0;
  
  // Calcul du gain de flexibilité
  const gainFlexibilite = (capaciteTraitement / capacite - 1) * 100;
  
  // Retourne les résultats
  return {
    fluxTresorerie,
    roi: roiCalcule,
    delaiRecuperation: periodeRecuperation,
    van: valeurActuelleNette,
    tri: triApprox,
    differenceProduction: differenceProductionCalc,
    economieAnnuelle: economieAnnuelleCalc,
    reductionMainOeuvre: reductionMainOeuvreCalc,
    economiesSecurite: economiesAccidents,
    economiesQualite: dernierBeneficeQualite,
    economiesTempsArret: economiesTempsArretCalc,
    reductionTempsCycle: reductionTempsCyclePourcentage,
    gainFlexibilite: gainFlexibilite
  };
};