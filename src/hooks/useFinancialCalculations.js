import { useState } from 'react';
import { calculerFluxActualise, calculerDelaiRecuperation, calculerTRI, appliquerInflation } from '../utils/calculationHelpers';

/**
 * Hook personnalisé pour les calculs financiers liés aux calculateurs ROI
 */
export const useFinancialCalculations = () => {
  const [results, setResults] = useState({
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    fluxTresorerie: [],
    economiesDetailees: {}
  });

  /**
   * Calcule le retour sur investissement (ROI)
   * @param {number} investissementInitial - Montant de l'investissement initial
   * @param {number} totalBenefices - Total des bénéfices générés
   * @returns {number} - ROI en pourcentage
   */
  const calculerROI = (investissementInitial, totalBenefices) => {
    return (totalBenefices / investissementInitial) * 100;
  };

  /**
   * Calcule la valeur actuelle nette (VAN)
   * @param {number} investissementInitial - Montant de l'investissement initial
   * @param {Array} fluxAnnuels - Tableau des flux de trésorerie annuels
   * @param {number} tauxActualisation - Taux d'actualisation (en pourcentage)
   * @returns {number} - Valeur actuelle nette
   */
  const calculerVAN = (investissementInitial, fluxAnnuels, tauxActualisation) => {
    let van = -investissementInitial;
    
    for (let annee = 0; annee < fluxAnnuels.length; annee++) {
      van += calculerFluxActualise(fluxAnnuels[annee], tauxActualisation, annee + 1);
    }
    
    return van;
  };

  /**
   * Calcule les économies annuelles liées à la main d'œuvre
   * @param {number} coutAnnuelEmploye - Coût annuel par employé
   * @param {number} nombreEmployesRemplaces - Nombre d'employés remplacés
   * @param {number} tauxInflation - Taux d'inflation
   * @param {number} annee - Année du calcul
   * @returns {number} - Économies réalisées
   */
  const calculerEconomiesMainOeuvre = (coutAnnuelEmploye, nombreEmployesRemplaces, tauxInflation, annee) => {
    const coutAjuste = appliquerInflation(coutAnnuelEmploye, tauxInflation, annee - 1);
    return coutAjuste * nombreEmployesRemplaces;
  };

  /**
   * Calcule les économies liées à la réduction des erreurs et problèmes de qualité
   * @param {number} production - Volume de production
   * @param {number} tauxProblemeQualite - Taux de problèmes de qualité (%)
   * @param {number} coutProblemeQualite - Coût moyen d'un problème de qualité
   * @param {number} ameliorationQualite - Pourcentage d'amélioration attendu (%)
   * @param {number} tauxInflation - Taux d'inflation
   * @param {number} annee - Année du calcul
   * @returns {number} - Économies liées à la qualité
   */
  const calculerEconomiesQualite = (production, tauxProblemeQualite, coutProblemeQualite, ameliorationQualite, tauxInflation, annee) => {
    const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
    const coutQualiteBase = production * (tauxProblemeQualite / 100) * coutProblemeQualite;
    return coutQualiteBase * (ameliorationQualite / 100) * facteurInflation;
  };

  /**
   * Calcule les bénéfices liés à l'augmentation de la production
   * @param {number} productionActuelle - Volume de production actuel
   * @param {number} augmentationProduction - Pourcentage d'augmentation (%)
   * @param {number} margeUnitaire - Marge par unité produite
   * @param {number} tauxInflation - Taux d'inflation
   * @param {number} annee - Année du calcul
   * @returns {number} - Bénéfice supplémentaire
   */
  const calculerBeneficeProduction = (productionActuelle, augmentationProduction, margeUnitaire, tauxInflation, annee) => {
    const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
    const productionSupplementaire = productionActuelle * (augmentationProduction / 100);
    return productionSupplementaire * margeUnitaire * facteurInflation;
  };

  /**
   * Calcule les économies liées à la réduction des accidents
   * @param {number} frequenceAccident - Fréquence des accidents (par an)
   * @param {number} coutMoyenAccident - Coût moyen par accident
   * @param {number} reductionAccidents - Pourcentage de réduction des accidents (%)
   * @param {number} tempsArretAccident - Temps d'arrêt moyen par accident (heures)
   * @param {number} valeurProductionHoraire - Valeur de la production par heure
   * @param {number} tauxInflation - Taux d'inflation
   * @param {number} annee - Année du calcul
   * @returns {Object} - Économies directes et indirectes liées aux accidents
   */
  const calculerEconomiesSecurite = (frequenceAccident, coutMoyenAccident, reductionAccidents, tempsArretAccident, valeurProductionHoraire, tauxInflation, annee) => {
    const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
    
    // Économies directes (coût des accidents)
    const economiesDirectes = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100) * facteurInflation;
    
    // Économies indirectes (temps d'arrêt)
    const economiesIndirectes = (frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100) * facteurInflation;
    
    return {
      directes: economiesDirectes,
      indirectes: economiesIndirectes,
      total: economiesDirectes + economiesIndirectes
    };
  };

  /**
   * Exécute le calcul complet du ROI et met à jour les résultats
   * @param {Object} params - Paramètres de calcul
   */
  const executeCalculation = (params) => {
    const {
      investissementInitial,
      dureeVie,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    } = params;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let totalBenefices = 0;
    
    // Calcul des flux de trésorerie annuels
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Ici, on peut appeler les fonctions spécifiques pour chaque type d'économie
      // et calculer le flux de trésorerie total pour l'année
      
      // Exemple simplifié pour illustration
      const economiesMainOeuvre = calculerEconomiesMainOeuvre(
        parametresSystemeAutomatise.coutMainOeuvre,
        parametresSystemeAutomatise.nbEmployesRemplaces,
        parametresGeneraux.tauxInflation,
        annee
      );
      
      const economiesQualite = calculerEconomiesQualite(
        parametresGeneraux.production,
        parametresGeneraux.tauxProblemeQualite,
        parametresGeneraux.coutQualite,
        parametresSystemeAutomatise.ameliorationQualite || 0,
        parametresGeneraux.tauxInflation,
        annee
      );
      
      // Flux de trésorerie simplifié pour l'exemple
      const fluxAnnuel = economiesMainOeuvre + economiesQualite;
      
      // Flux actualisé
      const fluxActualise = calculerFluxActualise(
        fluxAnnuel,
        parametresGeneraux.tauxActualisation,
        annee
      );
      
      // Ajout au flux de trésorerie cumulé
      cumulFluxTresorerie += fluxAnnuel;
      totalBenefices += fluxAnnuel;
      
      // Stockage du flux pour l'année
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie
      });
    }
    
    // Calcul des indicateurs financiers
    const roi = calculerROI(investissementInitial, totalBenefices);
    const van = calculerVAN(
      investissementInitial,
      fluxTresorerie.map(f => f.fluxAnnuel),
      parametresGeneraux.tauxActualisation
    );
    const tri = calculerTRI(
      investissementInitial,
      fluxTresorerie.map(f => f.fluxAnnuel)
    );
    const delaiRecuperation = calculerDelaiRecuperation(
      investissementInitial,
      fluxTresorerie.map(f => f.fluxAnnuel),
      dureeVie
    );
    
    // Mise à jour des résultats
    setResults({
      roi,
      delaiRecuperation,
      van,
      tri,
      fluxTresorerie,
      economiesDetailees: {
        mainOeuvre: fluxTresorerie.reduce((sum, item) => sum + (item.economiesMainOeuvre || 0), 0),
        qualite: fluxTresorerie.reduce((sum, item) => sum + (item.economiesQualite || 0), 0),
        securite: fluxTresorerie.reduce((sum, item) => sum + (item.economiesSecurite?.total || 0), 0),
      }
    });
    
    return {
      roi,
      delaiRecuperation,
      van,
      tri,
      fluxTresorerie
    };
  };

  return {
    results,
    calculerROI,
    calculerVAN,
    calculerEconomiesMainOeuvre,
    calculerEconomiesQualite,
    calculerBeneficeProduction,
    calculerEconomiesSecurite,
    executeCalculation
  };
};

export default useFinancialCalculations;
