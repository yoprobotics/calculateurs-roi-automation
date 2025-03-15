import { useMemo } from 'react';

/**
 * Hook personnalisé pour générer les données des graphiques
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} resultats - Résultats des calculs
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {Object} Données pour les différents graphiques
 */
const useGraphiques = (
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  resultats,
  parametresGeneraux
) => {
  // Extraction des valeurs des paramètres du système actuel
  const {
    capacite: capaciteActuelle,
    nombreEmployes: nombreEmployesActuel,
    maintenance: maintenanceActuelle,
    energie: energieActuelle,
    tauxRejets: tauxRejetsManuel,
    frequenceAccident: frequenceAccidentActuel
  } = parametresSystemeActuel;
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    capaciteTraitement,
    tauxRejets: tauxRejetsFils,
    reductionAccidents,
    coutSysteme,
    coutInstallation,
    coutIngenierie,
    coutFormation,
    coutMaintenance,
    coutEnergie,
    nbEmployesRemplaces,
    subventions
  } = parametresSystemeAutomatise;
  
  // Extraction des valeurs des paramètres généraux
  const { margeBrute, tonnageAnnuel } = parametresGeneraux;
  
  // Extraction des valeurs de résultats
  const {
    reductionMainOeuvre,
    economiesQualite,
    economiesSecurite,
    economiesTempsArret,
    differenceProduction,
    fluxTresorerie
  } = resultats;
  
  // Données pour les graphiques mémorisées pour éviter les recalculs inutiles
  const dataGraphiques = useMemo(() => {
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
      { name: 'Main d\'\u0153uvre', value: reductionMainOeuvre > 0 ? reductionMainOeuvre : 0 },
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
  }, [
    capaciteActuelle, capaciteTraitement, nombreEmployesActuel, nbEmployesRemplaces,
    tauxRejetsManuel, tauxRejetsFils, frequenceAccidentActuel, reductionAccidents,
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, margeBrute, tonnageAnnuel, maintenanceActuelle, coutMaintenance,
    energieActuelle, coutEnergie, fluxTresorerie, coutSysteme, coutInstallation,
    coutIngenierie, coutFormation, subventions
  ]);
  
  return dataGraphiques;
};

export default useGraphiques;