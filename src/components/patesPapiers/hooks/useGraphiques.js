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
    subventions,
    reductionDechet,
    reductionEmpreinteCO2
  } = parametresSystemeAutomatise;
  
  // Extraction des valeurs des paramètres généraux
  const { margeBrute, tonnageAnnuel, tauxActualisation } = parametresGeneraux;
  
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

    // Comparaison des impacts environnementaux
    const dataComparaisonEnvironnement = [
      { 
        name: 'Réduction déchets',
        actuel: 100,
        automatise: 100 - reductionDechet
      },
      { 
        name: 'Réduction CO₂',
        actuel: 100,
        automatise: 100 - reductionEmpreinteCO2 
      }
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
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      cumulatifActualise: item.cumulFluxActualises,
      seuil: investissementInitial
    }));
    
    // Données pour le graphique de ROI annuel
    const dataAnnuel = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      flux: item.fluxAnnuel,
      fluxActualise: item.fluxActualise,
      economiePersonnel: item.economiePersonnel,
      economieDechet: item.economieDechet,
      economieMaintenance: item.economieMaintenance,
      economieEnergie: item.economieEnergie + item.economieEnergieProcessus + item.economieEau,
      beneficeQualite: item.beneficeQualite,
      economieSecurite: item.economieSecuriteAjustee + item.economieTempsArretAjustee,
      beneficeProduction: item.beneficeSupplementaire
    }));
    
    // Données pour la comparaison des flux actualisés vs non actualisés
    const dataComparaisonFlux = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      nonActualise: item.fluxAnnuel,
      actualise: item.fluxActualise
    }));
    
    // Données pour l'analyse de sensibilité sur le taux d'actualisation
    const dataSensibiliteTaux = [];
    for (let taux = 0; taux <= 15; taux += 2.5) {
      let van = -investissementInitial;
      for (let i = 0; i < fluxTresorerie.length; i++) {
        van += fluxTresorerie[i].fluxAnnuel / Math.pow(1 + taux / 100, i + 1);
      }
      dataSensibiliteTaux.push({
        taux: taux.toFixed(1),
        van: van
      });
    }
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataComparaisonEnvironnement,
      dataEconomies,
      dataCumulatif,
      dataAnnuel,
      dataComparaisonFlux,
      dataSensibiliteTaux
    };
  }, [
    capaciteActuelle, capaciteTraitement, nombreEmployesActuel, nbEmployesRemplaces,
    tauxRejetsManuel, tauxRejetsFils, frequenceAccidentActuel, reductionAccidents,
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, margeBrute, tonnageAnnuel, maintenanceActuelle, coutMaintenance,
    energieActuelle, coutEnergie, fluxTresorerie, coutSysteme, coutInstallation,
    coutIngenierie, coutFormation, subventions, reductionDechet, reductionEmpreinteCO2,
    tauxActualisation
  ]);
  
  return dataGraphiques;
};

export default useGraphiques;