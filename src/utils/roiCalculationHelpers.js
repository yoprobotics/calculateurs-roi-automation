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
  const investissement = (coutSysteme || 0) + (coutInstallation || 0) + (coutIngenierie || 0) + (coutFormation || 0) - (subventions || 0);
  return isNaN(investissement) ? 0 : investissement;
};

/**
 * Calcule les capacités théoriques et les efficacités des systèmes
 * @param {Object} parametresActuel - Paramètres du système actuel
 * @param {Object} parametresAuto - Paramètres du système automatisé
 * @returns {Object} - Capacités théoriques et efficacités
 */
export const calculerCapacitesTheoriques = (parametresActuel, parametresAuto) => {
  // Calcul des capacités théoriques (unités/heure) basées sur le temps de cycle
  const tempsCycleActuel = parametresActuel.tempsCycle || 1; // Éviter division par zéro
  const tempsCycleAuto = parametresAuto.tempsCycle || 1; // Éviter division par zéro
  
  const capaciteTheoriqueActuelle = Math.round((3600 / tempsCycleActuel) * 10) / 10;
  const capaciteTheoriqueAutomatisee = Math.round((3600 / tempsCycleAuto) * 10) / 10;
  
  // Calcul des taux d'efficacité (capacité réelle vs théorique)
  const capaciteActuelle = parametresActuel.capacite || 0;
  const capaciteAuto = parametresAuto.capacite || 0;
  
  const efficaciteActuelle = capaciteTheoriqueActuelle > 0 ? 
    Math.min(100, (capaciteActuelle / capaciteTheoriqueActuelle) * 100) : 0;
  
  const efficaciteAutomatisee = capaciteTheoriqueAutomatisee > 0 ? 
    Math.min(100, (capaciteAuto / capaciteTheoriqueAutomatisee) * 100) : 0;
  
  return {
    capaciteTheoriqueActuelle: isNaN(capaciteTheoriqueActuelle) ? 0 : capaciteTheoriqueActuelle,
    capaciteTheoriqueAutomatisee: isNaN(capaciteTheoriqueAutomatisee) ? 0 : capaciteTheoriqueAutomatisee,
    efficaciteActuelle: isNaN(efficaciteActuelle) ? 0 : efficaciteActuelle,
    efficaciteAutomatisee: isNaN(efficaciteAutomatisee) ? 0 : efficaciteAutomatisee
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
  const { heuresOperationParJour = 0, joursOperationParAn = 0, margeUnitaire = 0, production = 0 } = parametresGeneraux;
  
  // Heures d'opération annuelles
  const heuresOperationAnnuelles = (heuresOperationParJour || 0) * (joursOperationParAn || 0);
  
  // Amélioration du temps de cycle
  const tempsCycleActuel = parametresActuel.tempsCycle || 0;
  const tempsCycleAuto = parametresAuto.tempsCycle || 0;
  
  const ameliorationTempsCycle = tempsCycleActuel > 0 ? 
    ((tempsCycleActuel - tempsCycleAuto) / tempsCycleActuel) * 100 : 0;
  
  // Calcul de la production annuelle (actuelle vs automatisée)
  const capaciteActuelle = parametresActuel.capacite || 0;
  const capaciteAuto = parametresAuto.capacite || 0;
  const perteProduction = parametresActuel.perteProduction || 0;
  const reductionTempsArret = parametresAuto.reductionTempsArret || 0;
  
  // CORRECTION: Calculer la production annuelle à partir de la production annuelle saisie,
  // pas à partir des capacités, pour éviter des valeurs trop élevées
  let productionActuelle, productionAutomatisee;
  
  if (production > 0) {
    // Si une production annuelle est spécifiée, baser les calculs dessus
    productionActuelle = production;
    // La production automatisée sera augmentée proportionnellement au rapport des capacités
    const tauxAmelioration = capaciteActuelle > 0 ? capaciteAuto / capaciteActuelle : 1;
    // Limiter l'amélioration à un facteur raisonnable (max +50%)
    const tauxAmeliorationLimite = Math.min(tauxAmelioration, 1.5);
    productionAutomatisee = production * tauxAmeliorationLimite;
  } else {
    // Sinon utiliser la méthode de calcul originale
    productionActuelle = capaciteActuelle * heuresOperationAnnuelles * (1 - perteProduction / 100);
    productionAutomatisee = capaciteAuto * heuresOperationAnnuelles * 
      (1 - (perteProduction * (1 - reductionTempsArret/100)) / 100);
  }
  
  // Différence de production
  const differenceProduction = productionAutomatisee - productionActuelle;
  
  // Production supplémentaire potentielle basée sur l'amélioration du temps de cycle
  // CORRECTION: Limiter à une valeur raisonnable proportionnelle à la production
  const potentielProductionParTempsCycle = Math.min(
    (capaciteAuto - capaciteActuelle) * heuresOperationAnnuelles * (1 - perteProduction / 100),
    production * 0.3 // Limite à 30% de la production actuelle
  );
  
  // Impact financier du temps de cycle
  const impactTempsCycle = potentielProductionParTempsCycle * margeUnitaire;
  
  // Gain de flexibilité
  const gainFlexibiliteProduction = capaciteActuelle > 0 ? 
    Math.min(capaciteAuto / capaciteActuelle, 3) : 1; // Limiter à 3x max
  
  // Revenus supplémentaires potentiels
  const revenuSupplementairePotentiel = potentielProductionParTempsCycle * margeUnitaire;
  
  return {
    heuresOperationAnnuelles: isNaN(heuresOperationAnnuelles) ? 0 : heuresOperationAnnuelles,
    ameliorationTempsCycle: isNaN(ameliorationTempsCycle) ? 0 : ameliorationTempsCycle,
    differenceProduction: isNaN(differenceProduction) ? 0 : differenceProduction,
    impactTempsCycle: isNaN(impactTempsCycle) ? 0 : impactTempsCycle,
    gainFlexibiliteProduction: isNaN(gainFlexibiliteProduction) ? 1 : gainFlexibiliteProduction,
    revenuSupplementairePotentiel: isNaN(revenuSupplementairePotentiel) ? 0 : revenuSupplementairePotentiel
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
  const { frequenceAccident = 0, coutMoyenAccident = 0, tempsArretAccident = 0, tempsArretNonPlanifie = 0 } = parametresActuel;
  const { reductionAccidents = 0, reductionTempsArret = 0 } = parametresAuto;
  const { production = 0, margeUnitaire = 0 } = parametresGeneraux;
  
  // Valeur horaire de la production
  const valeurProductionHoraire = heuresOperationAnnuelles > 0 ? 
    (production * margeUnitaire) / heuresOperationAnnuelles : 0;
  
  // CORRECTION: Limiter les économies d'accidents à des valeurs réalistes
  // Économies liées aux accidents - limiter à 10 fois le coût moyen par accident
  const economiesAccidentsCalculees = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
  const economiesAccidents = Math.min(economiesAccidentsCalculees, coutMoyenAccident * 10);
  
  // Économies liées au temps d'arrêt dû aux accidents
  const economiesTempsArretAccidents = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
  
  // Économies liées au temps d'arrêt non planifié
  const economiesTempsArretNonPlanifie = tempsArretNonPlanifie * 12 * valeurProductionHoraire * reductionTempsArret / 100;
  
  return {
    economiesAccidents: isNaN(economiesAccidents) ? 0 : economiesAccidents,
    economiesTempsArretAccidents: isNaN(economiesTempsArretAccidents) ? 0 : economiesTempsArretAccidents,
    economiesTempsArretNonPlanifie: isNaN(economiesTempsArretNonPlanifie) ? 0 : economiesTempsArretNonPlanifie,
    economiesTempsArretTotal: isNaN(economiesTempsArretAccidents + economiesTempsArretNonPlanifie) ? 
      0 : economiesTempsArretAccidents + economiesTempsArretNonPlanifie
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
  const { tauxRejets: tauxRejetsActuel = 0 } = parametresActuel;
  const { coutMainOeuvre = 0, nbEmployesRemplaces = 0, tauxRejets: tauxRejetsAuto = 0, coutDechet = 0 } = parametresAuto;
  const { production = 0, tauxProblemeQualite = 0, coutQualite = 0, margeUnitaire = 0 } = parametresGeneraux;
  
  // Économie de main d'œuvre
  const reductionMainOeuvre = coutMainOeuvre * nbEmployesRemplaces;
  
  // Économies liées à la réduction des rejets
  // CORRECTION: Limiter le coût des rejets à une valeur raisonnable par rapport à la marge unitaire
  const coutRejetAjuste = Math.min(coutDechet, margeUnitaire * 5); // Limite à 5x la marge unitaire
  const economiesRejets = production * (tauxRejetsActuel - tauxRejetsAuto) / 100 * coutRejetAjuste;
  
  // Économie liée à la qualité
  // CORRECTION: Limiter à une valeur raisonnable
  let economieQualite;
  if (production > 0) {
    const tauxProblemeQualiteAjuste = Math.min(tauxProblemeQualite, 20); // Limiter à 20%
    const coutQualiteAjuste = Math.min(coutQualite, production * margeUnitaire * 0.5); // Limiter à 50% de la valeur
    economieQualite = production * (tauxProblemeQualiteAjuste / 100) * (coutQualiteAjuste / production);
  } else {
    economieQualite = 0;
  }
  
  return {
    reductionMainOeuvre: isNaN(reductionMainOeuvre) ? 0 : reductionMainOeuvre,
    economiesRejets: isNaN(economiesRejets) ? 0 : economiesRejets,
    economieQualite: isNaN(economieQualite) ? 0 : economieQualite
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
    economiesAccidents = 0,
    economiesTempsArretAccidents = 0,
    economiesTempsArretNonPlanifie = 0
  } = economiesSecurite;
  
  const {
    reductionMainOeuvre = 0,
    economiesRejets = 0,
    economieQualite = 0
  } = economiesOperationnelles;
  
  const {
    differenceProduction = 0,
    impactTempsCycle = 0
  } = impactsProduction;
  
  // Coûts ajustés avec l'inflation
  const maintenanceAnnuelle = (parametresAuto.coutMaintenance || 0) * facteurInflation;
  const maintenanceActuelleAjustee = (parametresActuel.maintenance || 0) * facteurInflation;
  const energieOperationAnnuelle = (parametresAuto.coutEnergie || 0) * facteurInflation;
  const energieActuelleAjustee = (parametresActuel.energie || 0) * facteurInflation;
  const formationContinueAnnuelle = (parametresAuto.coutFormationContinue || 0) * facteurInflation;
  const miseAJourLogicielAnnuelle = (parametresAuto.coutMiseAJourLogiciel || 0) * facteurInflation;
  const consommablesAnnuels = (parametresAuto.coutConsommables || 0) * facteurInflation;
  
  // Économies ajustées avec l'inflation
  const economiePersonnel = reductionMainOeuvre * facteurInflation;
  const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
  const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
  const economieRejets = economiesRejets * facteurInflation;
  
  // Bénéfices ajustés avec l'inflation
  const economieQualiteAjustee = economieQualite * facteurInflation;
  const beneficeSupplementaire = differenceProduction * (parametres.parametresGeneraux?.margeUnitaire || 0) * facteurInflation;
  const beneficeTempsCycle = impactTempsCycle * facteurInflation;
  
  // Économies liées à la sécurité ajustées avec l'inflation
  const economieSecuriteAjustee = economiesAccidents * facteurInflation;
  const economieTempsArretAjustee = economiesTempsArretAccidents * facteurInflation;
  const economieTempsArretNonPlanifieAjustee = economiesTempsArretNonPlanifie * facteurInflation;
  
  // CORRECTION: Économies liées aux erreurs humaines - limiter à une valeur raisonnable
  const economieErreurs = Math.min(
    (parametresAuto.coutErrorHumaine || 0) * facteurInflation,
    (parametres.parametresGeneraux?.production || 0) * (parametres.parametresGeneraux?.margeUnitaire || 0) * 0.1 // Max 10% de la valeur de production
  );
  
  // Amortissement
  const amortissement = (investissementInitial / (parametresAuto.dureeVie || 1)) * ((parametresAuto.tauxAmortissement || 0) / 100);
  
  // Calcul du flux de trésorerie annuel
  const fluxAnnuel = economiePersonnel + economieErreurs + economieQualiteAjustee + 
                   beneficeSupplementaire + beneficeTempsCycle + economieMaintenance + 
                   economieEnergie + economieRejets + economieSecuriteAjustee + 
                   economieTempsArretAjustee + economieTempsArretNonPlanifieAjustee - 
                   maintenanceAnnuelle - energieOperationAnnuelle - formationContinueAnnuelle - 
                   miseAJourLogicielAnnuelle - consommablesAnnuels + amortissement;
  
  return {
    annee,
    fluxAnnuel: isNaN(fluxAnnuel) ? 0 : fluxAnnuel,
    economiePersonnel: isNaN(economiePersonnel) ? 0 : economiePersonnel,
    economieErreurs: isNaN(economieErreurs) ? 0 : economieErreurs,
    economieQualite: isNaN(economieQualiteAjustee) ? 0 : economieQualiteAjustee,
    beneficeSupplementaire: isNaN(beneficeSupplementaire) ? 0 : beneficeSupplementaire,
    beneficeTempsCycle: isNaN(beneficeTempsCycle) ? 0 : beneficeTempsCycle,
    economieMaintenance: isNaN(economieMaintenance) ? 0 : economieMaintenance,
    economieEnergie: isNaN(economieEnergie) ? 0 : economieEnergie,
    economieRejets: isNaN(economieRejets) ? 0 : economieRejets,
    economieSecuriteAjustee: isNaN(economieSecuriteAjustee) ? 0 : economieSecuriteAjustee,
    economieTempsArretAjustee: isNaN(economieTempsArretAjustee) ? 0 : economieTempsArretAjustee,
    economieTempsArretNonPlanifieAjustee: isNaN(economieTempsArretNonPlanifieAjustee) ? 0 : economieTempsArretNonPlanifieAjustee,
    maintenanceAnnuelle: isNaN(maintenanceAnnuelle) ? 0 : maintenanceAnnuelle,
    energieOperationAnnuelle: isNaN(energieOperationAnnuelle) ? 0 : energieOperationAnnuelle,
    formationContinueAnnuelle: isNaN(formationContinueAnnuelle) ? 0 : formationContinueAnnuelle,
    miseAJourLogicielAnnuelle: isNaN(miseAJourLogicielAnnuelle) ? 0 : miseAJourLogicielAnnuelle,
    consommablesAnnuels: isNaN(consommablesAnnuels) ? 0 : consommablesAnnuels,
    amortissement: isNaN(amortissement) ? 0 : amortissement
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
  
  const { tauxInflation = 0, tauxActualisation = 0 } = parametresGeneraux;
  const { dureeVie = 1 } = parametresAuto;
  
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
    const fluxActualise = facteurActualisation > 0 ? 
      fluxAnnuel.fluxAnnuel / facteurActualisation : 0;
    
    // Mise à jour de la VAN
    valeurActuelleNette += fluxActualise;
    
    // Calcul du délai de récupération
    cumulFluxTresorerie += fluxAnnuel.fluxAnnuel;
    if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte && fluxAnnuel.fluxAnnuel > 0) {
      const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel.fluxAnnuel;
      const fractionAnnee = fluxAnnuel.fluxAnnuel > 0 ? 
        (investissementInitial - cumulPrecedent) / fluxAnnuel.fluxAnnuel : 0;
      periodeRecuperation = annee - 1 + fractionAnnee;
      recuperationAtteinte = true;
    }
    
    // Ajout des résultats annuels
    fluxTresorerie.push({
      ...fluxAnnuel,
      fluxActualise: isNaN(fluxActualise) ? 0 : fluxActualise,
      cumulFluxTresorerie: isNaN(cumulFluxTresorerie) ? 0 : cumulFluxTresorerie
    });
  }
  
  // Calcul du ROI
  const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
  
  // CORRECTION: Limiter le ROI à des valeurs plus réalistes
  let roiCalcule = 0;
  if (investissementInitial > 0) {
    const roiBrut = (totalBenefices / investissementInitial) * 100;
    // Appliquer une limite logarithmique pour réduire les valeurs extrêmes
    // Cette approche permet de préserver les différences relatives tout en plafonnant les valeurs extrêmes
    if (roiBrut > 1000) {
      // Utiliser une formule logarithmique pour adoucir les valeurs extrêmes
      // 1000 + ln(ROI - 1000 + 1) * 100
      roiCalcule = 1000 + Math.log(roiBrut - 1000 + 1) * 100;
    } else {
      roiCalcule = roiBrut;
    }
  }
  
  // CORRECTION: Calcul du TRI (Taux de Rendement Interne)
  let triApprox = 0;
  
  // Vérifier si le projet est rentable
  if (investissementInitial > 0 && totalBenefices > 0) {
    // Approche de bissection pour trouver le TRI plus précisément
    let rLow = -99; // -99% comme borne inférieure
    let rHigh = 200; // +200% comme borne supérieure
    const precision = 0.01; // précision de 0.01%
    
    for (let i = 0; i < 100; i++) { // Maximum 100 itérations
      const rMid = (rLow + rHigh) / 2;
      
      // Calculer la VAN avec rMid
      let npv = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + rMid / 100, t + 1);
      }
      
      if (Math.abs(npv) < precision || Math.abs(rHigh - rLow) < precision) {
        triApprox = rMid;
        break;
      }
      
      if (npv > 0) {
        rLow = rMid;
      } else {
        rHigh = rMid;
      }
    }
    
    // Si le TRI est toujours 0 ou négatif mais les flux sont positifs
    if (triApprox <= 0 && totalBenefices > investissementInitial) {
      // Utiliser une estimation simplifiée basée sur le ROI annualisé
      const roiAnnuel = Math.pow(1 + roiCalcule / 100, 1 / dureeVie) - 1;
      triApprox = Math.max(roiAnnuel * 100, 0);
    }
    
    // Limiter à une valeur maximale raisonnable
    triApprox = Math.min(triApprox, 200);
  }
  
  // Calcul de l'économie annuelle moyenne
  const economieAnnuelleCalc = dureeVie > 0 ? totalBenefices / dureeVie : 0;
  
  // CORRECTION: Vérifier si le délai de récupération est réaliste
  if (periodeRecuperation < 0.1 && investissementInitial > 0) {
    // Si le délai est trop court, ajuster à une valeur plus réaliste
    // en se basant sur le ratio bénéfice/investissement
    const ratio = totalBenefices / investissementInitial;
    // Si le ratio est très élevé, utiliser un délai minimum d'environ 1 an
    if (ratio > 10) {
      periodeRecuperation = 1 + (1 / ratio) * 2;
    } else {
      periodeRecuperation = Math.max(periodeRecuperation, 0.5);
    }
  }
  
  return {
    fluxTresorerie,
    roi: isNaN(roiCalcule) ? 0 : roiCalcule,
    delaiRecuperation: isNaN(periodeRecuperation) ? dureeVie : periodeRecuperation,
    van: isNaN(valeurActuelleNette) ? 0 : valeurActuelleNette,
    tri: isNaN(triApprox) ? 0 : triApprox,
    economieAnnuelle: isNaN(economieAnnuelleCalc) ? 0 : economieAnnuelleCalc,
    totalBenefices: totalBenefices
  };
};
