import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour calculer le ROI et les résultats financiers
 * @param {string} typeSystemeActuel - Type de système actuel
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} Résultats des calculs et fonction de calcul
 */
const useCalculROI = (
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux
) => {
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    roiActualise: 0,
    delaiRecuperation: 0,
    delaiRecuperationActualise: 0,
    van: 0,
    tri: 0,
    indiceRentabilite: 0,
    economiesCO2: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0,
    parametresOperationnels: {
      tempsCycleActuel: 0,
      tempsCycleAutomatise: 0,
      gainProductivite: 0,
      heuresOperationAnnuelles: 0,
      coutParBallotActuel: 0,
      coutParBallotAutomatise: 0,
      economieParBallot: 0,
      tco: 0 // Total Cost of Ownership
    },
    erreurs: {} // Ajout d'un champ pour stocker les erreurs de validation
  });
  
  /**
   * Calcule le TRI en utilisant la méthode de Newton-Raphson
   * @param {Array} fluxTresorerie - Tableau des flux de trésorerie par année
   * @param {Number} investissementInitial - Montant de l'investissement initial
   * @returns {Number|null} TRI calculé ou null si non calculable
   */
  const calculerTRI = (fluxTresorerie, investissementInitial) => {
    // Fonction pour calculer la VAN à un taux donné
    const calculerVAN = (taux) => {
      let van = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        van += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + taux, t + 1);
      }
      return van;
    };
    
    // Fonction pour la dérivée de la VAN
    const calculerDeriveeVAN = (taux) => {
      let derivee = 0;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        derivee -= (t + 1) * fluxTresorerie[t].fluxAnnuel / Math.pow(1 + taux, t + 2);
      }
      return derivee;
    };
    
    // Vérifier si une solution existe
    // Le TRI n'existe généralement que s'il y a au moins un changement de signe dans les flux
    let fluxPositifs = false;
    let fluxNegatifs = false;

    // Vérifier l'investissement initial d'abord
    if (investissementInitial > 0) {
      fluxNegatifs = true;
    } else if (investissementInitial < 0) {
      fluxPositifs = true;
    }

    // Puis vérifier tous les flux annuels
    for (let flux of fluxTresorerie) {
      if (flux.fluxAnnuel > 0) fluxPositifs = true;
      if (flux.fluxAnnuel < 0) fluxNegatifs = true;
      
      // Si on a trouvé les deux signes, on peut sortir de la boucle
      if (fluxPositifs && fluxNegatifs) break;
    }
    
    // S'il n'y a pas de changement de signe, pas de TRI
    if (!fluxPositifs || !fluxNegatifs) {
      return null;
    }
    
    // Méthode de Newton-Raphson
    let taux = 0.1; // Estimation initiale
    const MAX_ITERATIONS = 100;
    const PRECISION = 0.0001;
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const van = calculerVAN(taux);
      if (Math.abs(van) < PRECISION) {
        return taux * 100; // Convertir en pourcentage
      }
      
      const derivee = calculerDeriveeVAN(taux);
      if (Math.abs(derivee) < PRECISION) {
        break; // Éviter division par zéro
      }
      
      const nouveauTaux = taux - van / derivee;
      
      // Protection contre les valeurs négatives et trop grandes
      if (nouveauTaux < -1 || nouveauTaux > 1000) {
        break;
      }
      
      if (Math.abs(nouveauTaux - taux) < PRECISION) {
        return nouveauTaux * 100; // Convertir en pourcentage
      }
      
      taux = nouveauTaux;
    }
    
    // Si la méthode de Newton-Raphson échoue, utiliser la recherche binaire
    let tauxMin = -0.99; // Taux minimum théorique
    let tauxMax = 10;    // 1000% comme limite supérieure
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      let tauxMilieu = (tauxMin + tauxMax) / 2;
      let vanMilieu = calculerVAN(tauxMilieu);
      
      if (Math.abs(vanMilieu) < PRECISION) {
        return tauxMilieu * 100; // Convertir en pourcentage
      }
      
      if (vanMilieu > 0) {
        tauxMin = tauxMilieu;
      } else {
        tauxMax = tauxMilieu;
      }
      
      if (Math.abs(tauxMax - tauxMin) < PRECISION) {
        return tauxMilieu * 100; // Convertir en pourcentage
      }
    }
    
    return null; // Pas de solution trouvée
  };

  /**
   * Valide les entrées utilisateur pour s'assurer de la cohérence des calculs
   * @returns {Object} Erreurs trouvées
   */
  const validerEntrees = () => {
    let erreurs = {};

    // Vérification des capacités (pour éviter division par zéro)
    if (!parametresSystemeActuel.capacite || parametresSystemeActuel.capacite <= 0) {
      erreurs.capaciteActuelle = "La capacité du système actuel doit être supérieure à 0";
    }
    
    if (!parametresSystemeAutomatise.capaciteTraitement || parametresSystemeAutomatise.capaciteTraitement <= 0) {
      erreurs.capaciteAutomatisee = "La capacité du système automatisé doit être supérieure à 0";
    }

    // Validation des heures d'opération
    if (parametresGeneraux.heuresOperationParJour <= 0 || parametresGeneraux.heuresOperationParJour > 24) {
      erreurs.heuresOperation = "Les heures d'opération par jour doivent être entre 1 et 24";
    }

    if (parametresGeneraux.joursOperationParAn <= 0 || parametresGeneraux.joursOperationParAn > 365) {
      erreurs.joursOperation = "Les jours d'opération par an doivent être entre 1 et 365";
    }

    // Validation financière
    if (parametresGeneraux.tauxActualisation < 0) {
      erreurs.tauxActualisation = "Le taux d'actualisation ne peut pas être négatif";
    }

    if (parametresSystemeAutomatise.dureeVie <= 0) {
      erreurs.dureeVie = "La durée de vie doit être supérieure à 0";
    }

    return erreurs;
  };
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    // Validation des entrées
    const erreurs = validerEntrees();
    const erreursTrouvees = Object.keys(erreurs).length > 0;

    // Si des erreurs sont trouvées, mettre à jour l'état et sortir
    if (erreursTrouvees) {
      setResultats(prev => ({
        ...prev,
        erreurs
      }));
      return;
    }

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
    let cumulFluxActualises = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let periodeRecuperationActualisee = dureeVie;
    let recuperationAtteinte = false;
    let recuperationActualiseeAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    let totalBeneficesActualises = 0;
    let totalCoutsOperationnels = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des temps de cycle
    const tempsCycleActuel = 3600 / capacite; // secondes par ballot
    const tempsCycleAutomatise = 3600 / capaciteTraitement; // secondes par ballot
    const gainProductivite = ((capaciteTraitement - capacite) / capacite) * 100;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (tonnageAnnuel * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;
    
    // Variable pour stocker le bénéfice de qualité de la dernière année (pour l'affichage)
    let dernierBeneficeQualite = 0;
    
    // Calcul des coûts par ballot
    const ballotsAnnuelsActuels = productionActuelle;
    const ballotsAnnuelsAutomatises = productionAutomatisee;
    
    // Coûts opérationnels annuels du système actuel
    const coutOperationnelActuel = maintenanceActuelle + energieActuelle + (nombreEmployes * coutMainOeuvre) + 
                                 (frequenceAccident * coutMoyenAccident);
    
    // Coûts opérationnels annuels du système automatisé
    const coutOperationnelAutomatise = coutMaintenance + coutEnergie + ((nombreEmployes - nbEmployesRemplaces) * coutMainOeuvre) + 
                                     (frequenceAccident * coutMoyenAccident * (1 - reductionAccidents/100));
    
    const coutParBallotActuel = ballotsAnnuelsActuels > 0 ? coutOperationnelActuel / ballotsAnnuelsActuels : 0;
    const coutParBallotAutomatise = ballotsAnnuelsAutomatises > 0 ? coutOperationnelAutomatise / ballotsAnnuelsAutomatises : 0;
    const economieParBallot = coutParBallotActuel - coutParBallotAutomatise;
    
    // Total Cost of Ownership sur la durée de vie
    let tco = investissementInitial;
    
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
      totalBeneficesActualises += fluxActualise;
      
      // Calcul du délai de récupération simple
      cumulFluxTresorerie += fluxAnnuel;
      if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
        const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
        const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
        periodeRecuperation = annee - 1 + fractionAnnee;
        recuperationAtteinte = true;
      }
      
      // Calcul du délai de récupération actualisé
      cumulFluxActualises += fluxActualise;
      if (cumulFluxActualises >= investissementInitial && !recuperationActualiseeAtteinte) {
        const cumulActualisePrecedent = cumulFluxActualises - fluxActualise;
        const fractionAnneeActualisee = (investissementInitial - cumulActualisePrecedent) / fluxActualise;
        periodeRecuperationActualisee = annee - 1 + fractionAnneeActualisee;
        recuperationActualiseeAtteinte = true;
      }
      
      // Mise à jour du TCO
      const coutOperationnelAnnuel = maintenanceAnnuelle + energieOperationAnnuelle + 
                                  ((nombreEmployes - nbEmployesRemplaces) * coutMainOeuvre * facteurInflation);
      tco += coutOperationnelAnnuel / facteurActualisation; // Actualisation des coûts opérationnels
      totalCoutsOperationnels += coutOperationnelAnnuel / facteurActualisation;
      
      // Ajout des résultats annuels
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie,
        cumulFluxActualises,
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
    
    // Calcul du ROI simple
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du ROI actualisé
    const roiActualise = (totalBeneficesActualises / investissementInitial) * 100;
    
    // Calcul du TRI avec la méthode améliorée
    const triCalcule = calculerTRI(fluxTresorerie, investissementInitial);
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Calcul de l'indice de rentabilité (IR) = VAN / Investissement initial
    const indiceRentabilite = valeurActuelleNette / investissementInitial;
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      roiActualise: roiActualise,
      delaiRecuperation: periodeRecuperation,
      delaiRecuperationActualise: periodeRecuperationActualisee,
      van: valeurActuelleNette,
      tri: triCalcule !== null ? triCalcule : 0,
      indiceRentabilite: indiceRentabilite,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc,
      parametresOperationnels: {
        tempsCycleActuel: tempsCycleActuel,
        tempsCycleAutomatise: tempsCycleAutomatise,
        gainProductivite: gainProductivite,
        heuresOperationAnnuelles: heuresOperationAnnuelles,
        coutParBallotActuel: coutParBallotActuel,
        coutParBallotAutomatise: coutParBallotAutomatise,
        economieParBallot: economieParBallot,
        tco: tco
      },
      erreurs: {} // Réinitialiser les erreurs
    });
  };
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  return { resultats, calculerROI };
};

export default useCalculROI;