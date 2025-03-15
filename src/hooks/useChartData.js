import { useMemo } from 'react';

/**
 * Hook personnalisé pour la préparation des données des graphiques
 * @param {Object} resultats - Résultats des calculs
 * @param {Object} parametres - Paramètres du calculateur
 * @returns {Object} - Données formatées pour les graphiques
 */
const useChartData = (resultats, parametres) => {
  // Extraction des paramètres nécessaires
  const { 
    systemeActuel = {}, 
    parametresSystemeAutomatise = {},
    fluxTresorerie = [],
  } = resultats || {};
  
  /**
   * Données pour le graphique des flux de trésorerie
   */
  const dataFluxTresorerie = useMemo(() => {
    if (!Array.isArray(fluxTresorerie) || fluxTresorerie.length === 0) {
      return [];
    }
    
    return fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      fluxTresorerie: item.fluxAnnuel,
      fluxActualise: item.fluxActualise
    }));
  }, [fluxTresorerie]);
  
  /**
   * Données pour le graphique cumulatif
   */
  const dataCumulatif = useMemo(() => {
    if (!Array.isArray(fluxTresorerie) || fluxTresorerie.length === 0) {
      return [];
    }
    
    // Calcul de l'investissement initial
    const investissementInitial = 
      (parametresSystemeAutomatise.coutSysteme || 0) +
      (parametresSystemeAutomatise.coutInstallation || 0) +
      (parametresSystemeAutomatise.coutIngenierie || 0) +
      (parametresSystemeAutomatise.coutFormation || 0) +
      (parametresSystemeAutomatise.coutLogiciel || 0) -
      (parametresSystemeAutomatise.subventions || 0);
    
    return fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: investissementInitial
    }));
  }, [fluxTresorerie, parametresSystemeAutomatise]);
  
  /**
   * Données pour la comparaison des capacités
   */
  const dataComparaisonCapacite = useMemo(() => {
    return [
      {
        name: 'Système Actuel',
        value: systemeActuel.capacite || 0,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: parametresSystemeAutomatise.capaciteTraitement || 0,
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  /**
   * Données pour la comparaison du nombre d'employés
   */
  const dataComparaisonEmployes = useMemo(() => {
    const nombreEmployesActuel = systemeActuel.nombreEmployes || 0;
    const nbEmployesRemplaces = parametresSystemeAutomatise.nbEmployesRemplaces || 0;
    
    return [
      {
        name: 'Système Actuel',
        value: nombreEmployesActuel,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: Math.max(0, nombreEmployesActuel - nbEmployesRemplaces),
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  /**
   * Données pour la comparaison des taux de rejets
   */
  const dataComparaisonRejets = useMemo(() => {
    return [
      {
        name: 'Système Actuel',
        value: systemeActuel.tauxRejets || 0,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: parametresSystemeAutomatise.tauxRejets || 0,
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  /**
   * Données pour la comparaison des fréquences d'accidents
   */
  const dataComparaisonAccidents = useMemo(() => {
    const frequenceAccidentActuel = systemeActuel.frequenceAccident || 0;
    const reductionAccidents = parametresSystemeAutomatise.reductionAccidents || 0;
    
    return [
      {
        name: 'Système Actuel',
        value: frequenceAccidentActuel,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: frequenceAccidentActuel * (1 - reductionAccidents / 100),
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  /**
   * Données pour l'analyse de sensibilité
   */
  const dataSensibilite = useMemo(() => {
    // Définition de quelques variations standard pour l'analyse
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    
    // Objet pour stocker les résultats de sensibilité pour différents paramètres
    return {
      coutSysteme: variations.map(variation => ({
        variation: `${variation > 0 ? '+' : ''}${variation}%`,
        roi: 0, // À calculer dynamiquement selon le paramètre
        delaiRecuperation: 0,
        van: 0
      })),
      capaciteTraitement: variations.map(variation => ({
        variation: `${variation > 0 ? '+' : ''}${variation}%`,
        roi: 0,
        delaiRecuperation: 0,
        van: 0
      })),
      // Autres paramètres de sensibilité...
    };
  }, []);
  
  /**
   * Données pour les économies par catégorie
   */
  const dataEconomiesCategories = useMemo(() => {
    if (!Array.isArray(fluxTresorerie) || fluxTresorerie.length === 0) {
      return [];
    }
    
    // Agréger les économies par catégorie
    let economiesMainOeuvre = 0;
    let economiesQualite = 0;
    let economiesSecurite = 0;
    let economiesProduction = 0;
    let economiesMaintenance = 0;
    let economiesEnergie = 0;
    
    fluxTresorerie.forEach(item => {
      economiesMainOeuvre += item.economiePersonnel || 0;
      economiesQualite += item.beneficeQualite || 0;
      economiesSecurite += (item.economieSecuriteAjustee || 0) + (item.economieTempsArretAjustee || 0);
      economiesProduction += item.beneficeSupplementaire || 0;
      economiesMaintenance += item.economieMaintenance || 0;
      economiesEnergie += item.economieEnergie || 0;
    });
    
    return [
      { name: 'Main d\'œuvre', value: economiesMainOeuvre > 0 ? economiesMainOeuvre : 0 },
      { name: 'Qualité', value: economiesQualite > 0 ? economiesQualite : 0 },
      { name: 'Sécurité', value: economiesSecurite > 0 ? economiesSecurite : 0 },
      { name: 'Production', value: economiesProduction > 0 ? economiesProduction : 0 },
      { name: 'Maintenance', value: economiesMaintenance > 0 ? economiesMaintenance : 0 },
      { name: 'Énergie', value: economiesEnergie > 0 ? economiesEnergie : 0 }
    ];
  }, [fluxTresorerie]);
  
  /**
   * Données pour les temps de cycle
   */
  const dataTempsDesCycles = useMemo(() => {
    return [
      {
        name: 'Système Actuel',
        value: systemeActuel.tempsCycle || 0,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: parametresSystemeAutomatise.tempsCycle || 0,
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  /**
   * Données pour les coûts de maintenance
   */
  const dataCoutsMaintenance = useMemo(() => {
    return [
      {
        name: 'Système Actuel',
        value: systemeActuel.maintenance || systemeActuel.coutMaintenance || 0,
        fill: '#ef4444'
      },
      {
        name: 'Solution Automatisée',
        value: parametresSystemeAutomatise.coutMaintenance || 0,
        fill: '#22c55e'
      }
    ];
  }, [systemeActuel, parametresSystemeAutomatise]);
  
  return {
    dataFluxTresorerie,
    dataCumulatif,
    dataComparaisonCapacite,
    dataComparaisonEmployes,
    dataComparaisonRejets,
    dataComparaisonAccidents,
    dataSensibilite,
    dataEconomiesCategories,
    dataTempsDesCycles,
    dataCoutsMaintenance
  };
};

export default useChartData;
