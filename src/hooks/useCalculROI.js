import { useMemo } from 'react';

/**
 * Hook personnalisé pour calculer le ROI et les autres indicateurs financiers
 * @param {Object} systemeActuel - Paramètres du système actuel
 * @param {Object} systemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux pour les calculs
 * @returns {Object} - Résultats des calculs (ROI, VAN, délai de récupération, etc.)
 */
const useCalculROI = (systemeActuel, systemeAutomatise, parametresGeneraux) => {
  return useMemo(() => {
    // Décomposition des paramètres principaux
    const {
      capacite: capaciteActuelle,
      nombreEmployes: nombreEmployesActuel,
      coutSysteme: coutSystemeActuel,
      maintenance: maintenanceActuelle,
      energie: energieActuelle,
      tauxRejets: tauxRejetsActuel,
      perteProduction: perteProductionActuelle,
      frequenceAccident: frequenceAccidentActuelle,
      coutMoyenAccident: coutMoyenAccidentActuel,
      tempsArretAccident: tempsArretAccidentActuel,
      tempsCycle: tempsCycleActuel
    } = systemeActuel;
    
    const {
      coutSysteme,
      coutInstallation,
      coutIngenierie,
      coutFormation,
      coutFormationContinue,
      coutMaintenance,
      coutEnergie,
      dureeVie,
      tauxAmortissement,
      coutMainOeuvre,
      nbEmployesRemplaces,
      reductionDechet,
      coutDechet,
      augmentationProduction,
      reductionEnergie,
      coutEnergieTonne,
      reductionEau,
      coutEauTonne,
      ameliorationQualite,
      reductionEmpreinteCO2,
      capaciteTraitement,
      tauxRejets: tauxRejetsAutomatise,
      reductionAccidents,
      subventions,
      tempsCycle: tempsCycleAutomatise
    } = systemeAutomatise;
    
    const {
      margeBrute,
      tauxInflation,
      tauxActualisation,
      tonnageAnnuel,
      heuresOperationParJour,
      joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables de résultats
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capaciteActuelle * heuresOperationAnnuelles * (1 - perteProductionActuelle / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProduction = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccidentActuelle * coutMoyenAccidentActuel * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (tonnageAnnuel * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArret = frequenceAccidentActuelle * tempsArretAccidentActuel * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvre = (nombreEmployesActuel - (nombreEmployesActuel - nbEmployesRemplaces)) * coutMainOeuvre;
    
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
      const formationContinueAnnuelle = coutFormationContinue * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvre * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (tonnageAnnuel * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets
      const economieRejets = tonnageAnnuel * (tauxRejetsActuel - tauxRejetsAutomatise) / 100 * coutDechet * facteurInflation;
      
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
      const economieTempsArretAjustee = economiesTempsArret * facteurInflation;
      
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
                         maintenanceAnnuelle - energieOperationAnnuelle - formationContinueAnnuelle + amortissement;
      
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
        formationContinueAnnuelle,
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
    const economieAnnuelle = totalBenefices / dureeVie;
    
    // Calcul du gain en efficacité entre les deux systèmes
    const ameliorationEfficacite = {
      capacite: ((capaciteTraitement - capaciteActuelle) / capaciteActuelle) * 100,
      tempsCycle: ((tempsCycleActuel - tempsCycleAutomatise) / tempsCycleActuel) * 100,
      mainOeuvre: ((nombreEmployesActuel - (nombreEmployesActuel - nbEmployesRemplaces)) / nombreEmployesActuel) * 100,
      tauxRejets: ((tauxRejetsActuel - tauxRejetsAutomatise) / tauxRejetsActuel) * 100,
      accidents: reductionAccidents,
      maintenance: ((maintenanceActuelle - coutMaintenance) / maintenanceActuelle) * 100
    };
    
    // Retour des résultats calculés
    return {
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction,
      economieAnnuelle,
      reductionMainOeuvre,
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret,
      ameliorationEfficacite,
      investissementInitial
    };
  }, [systemeActuel, systemeAutomatise, parametresGeneraux]);
};

export default useCalculROI;
