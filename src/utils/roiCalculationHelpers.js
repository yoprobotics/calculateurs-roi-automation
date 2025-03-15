/**
 * Utilitaires pour les calculs de ROI d'automatisation
 * Ce fichier contient les fonctions refactorisées à partir de la fonction calculerROI
 */

/**
 * Calcule l'investissement initial requis pour le projet
 * @param {Object} params - Paramètres du système automatisé
 * @returns {number} - Montant de l'investissement initial
 */
export const calculerInvestissementInitial = (params) => {
  const { coutSysteme, coutInstallation, coutIngenierie, coutFormation, subventions } = params;
  return coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
};

/**
 * Calcule les capacités théoriques et les efficacités des systèmes
 * @param {Object} parametresActuel - Paramètres du système actuel
 * @param {Object} parametresAuto - Paramètres du système automatisé
 * @returns {Object} - Capacités théoriques et efficacités
 */
export const calculerCapacitesTheoriques = (parametresActuel, parametresAuto) => {
  // Calcul des capacités théoriques (unités/heure) basées sur le temps de cycle
  const capaciteTheoriqueActuelle = Math.round((3600 / parametresActuel.tempsCycle) * 10) / 10;
  const capaciteTheoriqueAutomatisee = Math.round((3600 / parametresAuto.tempsCycle) * 10) / 10;
  
  // Calcul des taux d'efficacité (capacité réelle vs théorique)
  const efficaciteActuelle = Math.min(100, (parametresActuel.capacite / capaciteTheoriqueActuelle) * 100);
  const efficaciteAutomatisee = Math.min(100, (parametresAuto.capacite / capaciteTheoriqueAutomatisee) * 100);
  
  return {
    capaciteTheoriqueActuelle,
    capaciteTheoriqueAutomatisee,
    efficaciteActuelle,
    efficaciteAutomatisee
  };
};

/**
 * Calcule les impacts liés au temps de cycle et à la production
 * @param {Object} parametresActuel - Paramètres du système actuel
 * @param {Object} parametresAuto - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} - Impacts liés au temps de cycle et à la production
 */
export const calculerImpactsProduction = (parametresActuel, parametresAuto, parametresGeneraux) => {
  const { heuresOperationParJour, joursOperationParAn, margeUnitaire } = parametresGeneraux;
  
  // Heures d'opération annuelles
  const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
  
  // Amélioration du temps de cycle
  const ameliorationTempsCycle = ((parametresActuel.tempsCycle - parametresAuto.tempsCycle) / parametresActuel.tempsCycle) * 100;
  
  // Calcul de la production annuelle (actuelle vs automatisée)
  const productionActuelle = parametresActuel.capacite * heuresOperationAnnuelles * (1 - parametresActuel.perteProduction / 100);
  const productionAutomatisee = parametresAuto.capacite * heuresOperationAnnuelles * 
    (1 - (parametresActuel.perteProduction * (1 - parametresAuto.reductionTempsArret/100)) / 100);
  
  // Différence de production
  const differenceProduction = productionAutomatisee - productionActuelle;
  
  // Production supplémentaire potentielle basée sur l'amélioration du temps de cycle
  const potentielProductionParTempsCycle = (parametresAuto.capacite - parametresActuel.capacite) * 
    heuresOperationAnnuelles * (1 - parametresActuel.perteProduction / 100);
  
  // Impact financier du temps de cycle
  const impactTempsCycle = potentielProductionParTempsCycle * margeUnitaire;
  
  // Gain de flexibilité
  const gainFlexibiliteProduction = parametresAuto.capacite / parametresActuel.capacite;
  
  // Revenus supplémentaires potentiels
  const revenuSupplementairePotentiel = potentielProductionParTempsCycle * margeUnitaire;
  
  return {
    heuresOperationAnnuelles,
    ameliorationTempsCycle,
    differenceProduction,
    impactTempsCycle,
    gainFlexibiliteProduction,
    revenuSupplementairePotentiel
  };
};

/**
 * Calcule les économies liées à la sécurité et aux temps d'arrêt
 * @param {Object} parametresActuel - Paramètres du système actuel
 * @param {Object} parametresAuto - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @param {number} heuresOperationAnnuelles - Heures d'opération annuelles
 * @returns {Object} - Économies liées à la sécurité et aux temps d'arrêt
 */
export const calculerEconomiesSecurite = (parametresActuel, parametresAuto, parametresGeneraux, heuresOperationAnnuelles) => {
  const { frequenceAccident, coutMoyenAccident, tempsArretAccident, tempsArretNonPlanifie } = parametresActuel;
  const { reductionAccidents, reductionTempsArret } = parametresAuto;
  const { production, margeUnitaire } = parametresGeneraux;
  
  // Valeur horaire de la production
  const valeurProductionHoraire = (production * margeUnitaire) / heuresOperationAnnuelles;
  
  // Économies liées aux accidents
  const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
  
  // Économies liées au temps d'arrêt dû aux accidents
  const economiesTempsArretAccidents = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
  
  // Économies liées au temps d'arrêt non planifié
  const economiesTempsArretNonPlanifie = tempsArretNonPlanifie * 12 * valeurProductionHoraire * reductionTempsArret / 100;
  
  return {
    economiesAccidents,
    economiesTempsArretAccidents,
    economiesTempsArretNonPlanifie,
    economiesTempsArretTotal: economiesTempsArretAccidents + economiesTempsArretNonPlanifie
  };
};

/**
 * Calcule les économies liées à la main d'œuvre et aux rejets
 * @param {Object} parametresActuel - Paramètres du système actuel
 * @param {Object} parametresAuto - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} - Économies liées à la main d'œuvre et aux rejets
 */
export const calculerEconomiesOperationnelles = (parametresActuel, parametresAuto, parametresGeneraux) => {
  const { tauxRejets: tauxRejetsActuel } = parametresActuel;
  const { coutMainOeuvre, nbEmployesRemplaces, tauxRejets: tauxRejetsAuto, coutDechet } = parametresAuto;
  const { production, tauxProblemeQualite, coutQualite } = parametresGeneraux;
  
  // Économie de main d'œuvre
  const reductionMainOeuvre = coutMainOeuvre * nbEmployesRemplaces;
  
  // Économies liées à la réduction des rejets
  const economiesRejets = production * (tauxRejetsActuel - tauxRejetsAuto) / 100 * coutDechet;
  
  // Économie liée à la qualité
  const economieQualite = production * (tauxProblemeQualite / 100) * (coutQualite / production);
  
  return {
    reductionMainOeuvre,
    economiesRejets,
    economieQualite
  };
};

/**
 * Calcule un flux de trésorerie annuel
 * @param {Object} parametres - Tous les paramètres nécessaires
 * @param {number} annee - Année du flux
 * @param {number} facteurInflation - Facteur d'inflation pour l'année
 * @returns {Object} - Flux de trésorerie pour l'année
 */
export const calculerFluxAnnuel = (parametres, annee, facteurInflation) => {
  const {
    parametresActuel,
    parametresAuto,
    economiesSecurite,
    economiesOperationnelles,
    impactsProduction,
    investissementInitial
  } = parametres;
  
  const {
    economiesAccidents,
    economiesTempsArretAccidents,
    economiesTempsArretNonPlanifie
  } = economiesSecurite;
  
  const {
    reductionMainOeuvre,
    economiesRejets,
    economieQualite
  } = economiesOperationnelles;
  
  const {
    differenceProduction,
    impactTempsCycle
  } = impactsProduction;
  
  // Coûts ajustés avec l'inflation
  const maintenanceAnnuelle = parametresAuto.coutMaintenance * facteurInflation;
  const maintenanceActuelleAjustee = parametresActuel.maintenance * facteurInflation;
  const energieOperationAnnuelle = parametresAuto.coutEnergie * facteurInflation;
  const energieActuelleAjustee = parametresActuel.energie * facteurInflation;
  const formationContinueAnnuelle = parametresAuto.coutFormationContinue * facteurInflation;
  const miseAJourLogicielAnnuelle = parametresAuto.coutMiseAJourLogiciel * facteurInflation;
  const consommablesAnnuels = parametresAuto.coutConsommables * facteurInflation;
  
  // Économies ajustées avec l'inflation
  const economiePersonnel = reductionMainOeuvre * facteurInflation;
  const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
  const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
  const economieRejets = economiesRejets * facteurInflation;
  
  // Bénéfices ajustés avec l'inflation
  const economieQualiteAjustee = economieQualite * facteurInflation;
  const beneficeSupplementaire = differenceProduction * parametres.parametresGeneraux.margeUnitaire * facteurInflation;
  const beneficeTempsCycle = impactTempsCycle * facteurInflation;
  
  // Économies liées à la sécurité ajustées avec l'inflation
  const economieSecuriteAjustee = economiesAccidents * facteurInflation;
  const economieTempsArretAjustee = economiesTempsArretAccidents * facteurInflation;
  const economieTempsArretNonPlanifieAjustee = economiesTempsArretNonPlanifie * facteurInflation;
  
  // Économies liées aux erreurs humaines
  const economieErreurs = parametresAuto.coutErrorHumaine * facteurInflation;
  
  // Amortissement
  const amortissement = (investissementInitial / parametresAuto.dureeVie) * (parametresAuto.tauxAmortissement / 100);
  
  // Calcul du flux de trésorerie annuel
  const fluxAnnuel = economiePersonnel + economieErreurs + economieQualiteAjustee + 
                   beneficeSupplementaire + beneficeTempsCycle + economieMaintenance + 
                   economieEnergie + economieRejets + economieSecuriteAjustee + 
                   economieTempsArretAjustee + economieTempsArretNonPlanifieAjustee - 
                   maintenanceAnnuelle - energieOperationAnnuelle - formationContinueAnnuelle - 
                   miseAJourLogicielAnnuelle - consommablesAnnuels + amortissement;
  
  return {
    annee,
    fluxAnnuel,
    economiePersonnel,
    economieErreurs,
    economieQualite: economieQualiteAjustee,
    beneficeSupplementaire,
    beneficeTempsCycle,
    economieMaintenance,
    economieEnergie,
    economieRejets,
    economieSecuriteAjustee,
    economieTempsArretAjustee,
    economieTempsArretNonPlanifieAjustee,
    maintenanceAnnuelle,
    energieOperationAnnuelle,
    formationContinueAnnuelle,
    miseAJourLogicielAnnuelle,
    consommablesAnnuels,
    amortissement
  };
};

/**
 * Calcule tous les flux de trésorerie sur la durée de vie du projet
 * @param {Object} parametres - Tous les paramètres nécessaires
 * @returns {Object} - Flux de trésorerie et indicateurs financiers
 */
export const calculerTousFluxTresorerie = (parametres) => {
  const {
    parametresAuto,
    parametresGeneraux,
    investissementInitial
  } = parametres;
  
  const { tauxInflation, tauxActualisation } = parametresGeneraux;
  const { dureeVie } = parametresAuto;
  
  let fluxTresorerie = [];
  let cumulFluxTresorerie = 0;
  let valeurActuelleNette = -investissementInitial;
  let periodeRecuperation = dureeVie;
  let recuperationAtteinte = false;
  
  // Calcul des flux de trésorerie pour chaque année
  for (let annee = 1; annee <= dureeVie; annee++) {
    // Calcul du facteur d'inflation
    const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
    
    // Calcul du flux de trésorerie pour cette année
    const fluxAnnuel = calculerFluxAnnuel(parametres, annee, facteurInflation);
    
    // Calcul du flux actualisé
    const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
    const fluxActualise = fluxAnnuel.fluxAnnuel / facteurActualisation;
    
    // Mise à jour de la VAN
    valeurActuelleNette += fluxActualise;
    
    // Calcul du délai de récupération
    cumulFluxTresorerie += fluxAnnuel.fluxAnnuel;
    if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
      const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel.fluxAnnuel;
      const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel.fluxAnnuel;
      periodeRecuperation = annee - 1 + fractionAnnee;
      recuperationAtteinte = true;
    }
    
    // Ajout des résultats annuels
    fluxTresorerie.push({
      ...fluxAnnuel,
      fluxActualise,
      cumulFluxTresorerie
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
  
  return {
    fluxTresorerie,
    roi: roiCalcule,
    delaiRecuperation: periodeRecuperation,
    van: valeurActuelleNette,
    tri: triApprox,
    economieAnnuelle: economieAnnuelleCalc
  };
};
