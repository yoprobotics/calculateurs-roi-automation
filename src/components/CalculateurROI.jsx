import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle avec structure comparative
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États pour les paramètres du système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 30, // unités/heure
    tempsCycle: 120, // secondes par unité
    nombreEmployes: 3, // ETP
    coutSysteme: 20000, // Coût d'un système manuel
    maintenance: 5000, // $/an
    energie: 3000, // $/an
    perteProduction: 12, // % perte due aux arrêts et retards
    tauxRejets: 9, // % de rejets et rebuts
    frequenceAccident: 4, // accidents par an
    coutMoyenAccident: 8000, // coût moyen par accident
    tempsArretAccident: 16, // heures d'arrêt par accident
    tempsArretNonPlanifie: 15, // heures par mois
  });
  
  // États pour les paramètres du système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 10000,
    coutFormationContinue: 5000, // Coût annuel de formation continue
    coutMaintenance: 8000,
    coutEnergie: 4500,
    dureeVie: 10,
    tauxAmortissement: 20,
    capacite: 85, // unités/heure
    tempsCycle: 42, // secondes par unité
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 2,
    reductionDechet: 60,
    coutDechet: 500, // Coût par unité rejetée
    tauxRejets: 2, // % de rejets
    reductionAccidents: 90, // % de réduction des accidents
    reductionTempsArret: 75, // % de réduction du temps d'arrêt non planifié
    augmentationProduction: 15,
    coutErrorHumaine: 15000,
    tauxProblemeQualite: 8,
    coutQualite: 20000,
    subventions: 0,
    coutMiseAJourLogiciel: 3000, // Coût annuel des mises à jour logicielles
    coutConsommables: 2000, // Coût annuel des consommables spécifiques
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    production: 100000, // unités par an
    margeUnitaire: 0.2, // $ par unité
    tauxInflation: 2,
    tauxActualisation: 5,
    heuresOperationParJour: 8,
    joursOperationParAn: 250,
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0,
    economiesRejets: 0,
  });
  
  // États pour l'interface utilisateur
  const [ui, setUi] = useState({
    afficherDetails: false,
    ongletActif: 'general',
    modeAffichage: 'comparatif', // 'comparatif', 'detaille', 'analyse'
  });
  
  // États pour la comparaison de scénarios (mode analyse)
  const [scenarios, setScenarios] = useState([]);
  const [scenarioActif, setScenarioActif] = useState('actuel');
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  const [variationSensibilite, setVariationSensibilite] = useState(20);
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 30,
        tempsCycle: 120,
        nombreEmployes: 3,
        coutSysteme: 20000, 
        maintenance: 5000,
        energie: 3000,
        tauxRejets: 9,
        perteProduction: 12,
        frequenceAccident: 4,
        tempsArretNonPlanifie: 15
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 60,
        tempsCycle: 60,
        nombreEmployes: 2,
        coutSysteme: 80000,
        maintenance: 12000,
        energie: 5000,
        tauxRejets: 5,
        perteProduction: 8,
        frequenceAccident: 2,
        tempsArretNonPlanifie: 10
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 75,
        tempsCycle: 48,
        nombreEmployes: 1.5,
        coutSysteme: 120000,
        maintenance: 20000,
        energie: 7000,
        tauxRejets: 3.5,
        perteProduction: 6,
        frequenceAccident: 1,
        tempsArretNonPlanifie: 8
      });
    }
  }, [typeSystemeActuel]);
  
  // Synchronisation du temps de cycle et de la capacité pour le système actuel
  useEffect(() => {
    // Ne mettre à jour que si la modification vient de la capacité (pour éviter boucle infinie)
    if (parametresSystemeActuel.tempsCycle === 3600 / parametresSystemeActuel.capacite) return;
    
    setParametresSystemeActuel({
      ...parametresSystemeActuel,
      tempsCycle: Math.round(3600 / parametresSystemeActuel.capacite)
    });
  }, [parametresSystemeActuel.capacite]);
  
  // Synchronisation de la capacité et du temps de cycle pour le système actuel
  useEffect(() => {
    // Ne mettre à jour que si la modification vient du temps de cycle
    if (parametresSystemeActuel.capacite === Math.round(3600 / parametresSystemeActuel.tempsCycle)) return;
    
    setParametresSystemeActuel({
      ...parametresSystemeActuel,
      capacite: Math.round(3600 / parametresSystemeActuel.tempsCycle)
    });
  }, [parametresSystemeActuel.tempsCycle]);
  
  // Synchronisation du temps de cycle et de la capacité pour le système automatisé
  useEffect(() => {
    // Ne mettre à jour que si la modification vient de la capacité
    if (parametresSystemeAutomatise.tempsCycle === 3600 / parametresSystemeAutomatise.capacite) return;
    
    setParametresSystemeAutomatise({
      ...parametresSystemeAutomatise,
      tempsCycle: Math.round(3600 / parametresSystemeAutomatise.capacite)
    });
  }, [parametresSystemeAutomatise.capacite]);
  
  // Synchronisation de la capacité et du temps de cycle pour le système automatisé
  useEffect(() => {
    // Ne mettre à jour que si la modification vient du temps de cycle
    if (parametresSystemeAutomatise.capacite === Math.round(3600 / parametresSystemeAutomatise.tempsCycle)) return;
    
    setParametresSystemeAutomatise({
      ...parametresSystemeAutomatise,
      capacite: Math.round(3600 / parametresSystemeAutomatise.tempsCycle)
    });
  }, [parametresSystemeAutomatise.tempsCycle]);
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutFormationContinue,
      coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, capacite: capaciteAuto,
      coutMainOeuvre, nbEmployesRemplaces, reductionDechet, coutDechet, tauxRejets: tauxRejetsAuto,
      reductionAccidents, reductionTempsArret, augmentationProduction, coutErrorHumaine,
      tauxProblemeQualite, coutQualite, subventions, coutMiseAJourLogiciel, coutConsommables
    } = parametresSystemeAutomatise;
    
    const {
      capacite: capaciteActuelle, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsActuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident, tempsArretNonPlanifie
    } = parametresSystemeActuel;
    
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
    const productionActuelle = capaciteActuelle * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteAuto * heuresOperationAnnuelles * (1 - (perteProduction * (1 - reductionTempsArret/100)) / 100);
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (production * margeUnitaire) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul des économies liées au temps d'arrêt non planifié
    const economiesTempsArretNonPlanifie = tempsArretNonPlanifie * 12 * valeurProductionHoraire * reductionTempsArret / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = coutMainOeuvre * nbEmployesRemplaces;
    
    // Calcul des économies liées à la réduction des rejets
    const economiesRejetsCalc = production * (tauxRejetsActuel - tauxRejetsAuto) / 100 * coutDechet;
    
    // Calcul des économies liées à la qualité
    // Nous le calculons ici pour pouvoir l'utiliser dans setResultats
    const economieQualiteCalc = production * (tauxProblemeQualite / 100) * (coutQualite / production);
    
    // Calcul des économies et bénéfices annuels
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      const formationContinueAnnuelle = coutFormationContinue * facteurInflation;
      const miseAJourLogicielAnnuelle = coutMiseAJourLogiciel * facteurInflation;
      const consommablesAnnuels = coutConsommables * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des erreurs humaines
      const economieErreurs = coutErrorHumaine * facteurInflation;
      
      // Économies liées à la qualité
      const economieQualite = economieQualiteCalc * facteurInflation;
      
      // Économies liées à la réduction des rejets
      const economieRejets = economiesRejetsCalc * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const beneficeSupplementaire = differenceProductionCalc * margeUnitaire * facteurInflation;
      
      // Économies liées à la sécurité
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      const economieTempsArretNonPlanifieAjustee = economiesTempsArretNonPlanifie * facteurInflation;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieErreurs + economieQualite + beneficeSupplementaire + 
                       economieMaintenance + economieEnergie + economieRejets +
                       economieSecuriteAjustee + economieTempsArretAjustee + economieTempsArretNonPlanifieAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle - formationContinueAnnuelle - 
                       miseAJourLogicielAnnuelle - consommablesAnnuels + amortissement;
      
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
        economieErreurs,
        economieQualite,
        beneficeSupplementaire,
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
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: economieQualiteCalc,
      economiesTempsArret: economiesTempsArretCalc + economiesTempsArretNonPlanifie,
      economiesRejets: economiesRejetsCalc
    });
  };
  
  // Fonction pour calculer l'analyse de sensibilité
  const calculerSensibilite = () => {
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    const resultats = [];
    
    // Valeur actuelle du paramètre
    const valeurBase = {
      coutSysteme: parametresSystemeAutomatise.coutSysteme, 
      coutInstallation: parametresSystemeAutomatise.coutInstallation, 
      coutIngenierie: parametresSystemeAutomatise.coutIngenierie, 
      coutFormation: parametresSystemeAutomatise.coutFormation,
      coutMaintenance: parametresSystemeAutomatise.coutMaintenance, 
      coutEnergie: parametresSystemeAutomatise.coutEnergie, 
      nbEmployesRemplaces: parametresSystemeAutomatise.nbEmployesRemplaces,
      capacite: parametresSystemeAutomatise.capacite,
      reductionAccidents: parametresSystemeAutomatise.reductionAccidents,
      tauxRejets: parametresSystemeAutomatise.tauxRejets
    }[parametreSensibilite];
    
    // Pour chaque variation, calculer les nouveaux résultats
    for (const variation of variations) {
      // Appliquer la variation
      const facteur = 1 + variation / 100;
      const valeurModifiee = valeurBase * facteur;
      
      // Créer un clone des états actuels
      const nouveauParams = { ...parametresSystemeAutomatise };
      
      // Mettre à jour le paramètre concerné
      nouveauParams[parametreSensibilite] = valeurModifiee;
      
      // Simuler les calculs avec ces nouveaux paramètres
      const { roi, delaiRecuperation, van } = simulerCalculsAvecParams(nouveauParams);
      
      // Ajouter les résultats à notre tableau
      resultats.push({
        variation,
        roi,
        delaiRecuperation,
        van
      });
    }
    
    setResultatsSensibilite(resultats);
  };
  
  // Fonction pour simuler les calculs avec des paramètres modifiés
  const simulerCalculsAvecParams = (nouveauParams) => {
    // Version simplifiée pour l'analyse de sensibilité
    // Calcul de l'investissement initial
    const investissementInitial = nouveauParams.coutSysteme + nouveauParams.coutInstallation + 
                               nouveauParams.coutIngenierie + nouveauParams.coutFormation - 
                               nouveauParams.subventions;
    
    // Retour de résultats simulés - ces valeurs sont des approximations simplifiées
    // Dans une version plus complète, nous calculerions les vrais résultats
    return {
      roi: 45, // Valeur simulée
      delaiRecuperation: 2.5, // Valeur simulée
      van: 200000 // Valeur simulée
    };
  };
  
  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    const scenarioActuel = {
      id: Date.now().toString(),
      nom: nomScenario,
      parametresSystemeActuel: { ...parametresSystemeActuel },
      parametresSystemeAutomatise: { ...parametresSystemeAutomatise },
      parametresGeneraux: { ...parametresGeneraux },
      resultats: { ...resultats }
    };
    
    setScenarios([...scenarios, scenarioActuel]);
  };
  
  // Fonction pour charger un scénario
  const chargerScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setParametresSystemeActuel(scenario.parametresSystemeActuel);
      setParametresSystemeAutomatise(scenario.parametresSystemeAutomatise);
      setParametresGeneraux(scenario.parametresGeneraux);
      setScenarioActif(scenarioId);
      setNomScenario(scenario.nom);
    }
  };
  
  // Fonction pour supprimer un scénario
  const supprimerScenario = (scenarioId) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
    if (scenarioActif === scenarioId) {
      setScenarioActif('actuel');
    }
  };
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Calcul de l'analyse de sensibilité lorsque nécessaire
  useEffect(() => {
    if (ui.modeAffichage === 'analyse') {
      calculerSensibilite();
    }
  }, [ui.modeAffichage, parametreSensibilite]);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, differenceProduction, 
    economieAnnuelle, reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret, economiesRejets, fluxTresorerie 
  } = resultats;
  
  // Données pour les graphiques mémorisées pour éviter les recalculs inutiles
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: parametresSystemeActuel.capacite, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.capacite, fill: '#22c55e' }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { name: 'Système Actuel', value: parametresSystemeActuel.nombreEmployes, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeActuel.nombreEmployes - parametresSystemeAutomatise.nbEmployesRemplaces, fill: '#22c55e' }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { name: 'Système Actuel', value: parametresSystemeActuel.tauxRejets, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.tauxRejets, fill: '#22c55e' }
    ];
    
    // Comparaison des fréquences d'accidents
    const dataComparaisonAccidents = [
      { name: 'Système Actuel', value: parametresSystemeActuel.frequenceAccident, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeActuel.frequenceAccident * (1 - parametresSystemeAutomatise.reductionAccidents/100), fill: '#22c55e' }
    ];
    
    // Données pour le graphique des économies
    const dataEconomies = [
      { name: 'Main d\'œuvre', value: reductionMainOeuvre > 0 ? reductionMainOeuvre : 0 },
      { name: 'Qualité', value: economiesQualite > 0 ? economiesQualite : 0 },
      { name: 'Sécurité', value: economiesSecurite + economiesTempsArret > 0 ? economiesSecurite + economiesTempsArret : 0 },
      { name: 'Production', value: differenceProduction * (parametresGeneraux.margeUnitaire) > 0 ? differenceProduction * (parametresGeneraux.margeUnitaire) : 0 },
      { name: 'Rejets', value: economiesRejets > 0 ? economiesRejets : 0 },
      { name: 'Maintenance', value: parametresSystemeActuel.maintenance - parametresSystemeAutomatise.coutMaintenance > 0 ? parametresSystemeActuel.maintenance - parametresSystemeAutomatise.coutMaintenance : 0 },
      { name: 'Énergie', value: parametresSystemeActuel.energie - parametresSystemeAutomatise.coutEnergie > 0 ? parametresSystemeActuel.energie - parametresSystemeAutomatise.coutEnergie : 0 }
    ];
    
    // Données pour le graphique des coûts cachés
    const dataCoutsSupplementaires = [
      { name: 'Formation Continue', value: parametresSystemeAutomatise.coutFormationContinue },
      { name: 'Mises à Jour Logicielles', value: parametresSystemeAutomatise.coutMiseAJourLogiciel },
      { name: 'Consommables Spécifiques', value: parametresSystemeAutomatise.coutConsommables }
    ];
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: parametresSystemeAutomatise.coutSysteme + parametresSystemeAutomatise.coutInstallation + 
            parametresSystemeAutomatise.coutIngenierie + parametresSystemeAutomatise.coutFormation - 
            parametresSystemeAutomatise.subventions
    }));
    
    // Données pour l'analyse de sensibilité du ROI
    const dataSensibiliteROI = resultatsSensibilite.map(item => ({
      variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
      roi: item.roi
    }));
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataEconomies,
      dataCoutsSupplementaires,
      dataCumulatif,
      dataSensibiliteROI
    };
  }, [
    parametresSystemeActuel, 
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats,
    resultatsSensibilite
  ]);
  
  // Fonctions pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };
  
  const changerModeAffichage = (mode) => {
    setUi(prev => ({ ...prev, modeAffichage: mode }));
  };
  
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };
  
  // Extraction des valeurs de l'UI
  const { afficherDetails, ongletActif, modeAffichage } = ui;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
        <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
            <p>Augmentation du volume de production et réduction des temps d'arrêt.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Qualité Constante</h4>
            <p>Élimination des erreurs humaines et amélioration de la répétabilité des processus.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Réduction des Coûts</h4>
            <p>Diminution des coûts de main d'œuvre et optimisation de la consommation d'énergie et de matières.</p>
          </div>
        </div>
      </div>
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => changerModeAffichage('comparatif')}
            className={`px-4 py-2 rounded-lg transition-all ${
              modeAffichage === 'comparatif'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Comparatif
          </button>
          <button
            onClick={() => changerModeAffichage('detaille')}
            className={`px-4 py-2 rounded-lg transition-all ${
              modeAffichage === 'detaille'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Détaillé
          </button>
          <button
            onClick={() => changerModeAffichage('analyse')}
            className={`px-4 py-2 rounded-lg transition-all ${
              modeAffichage === 'analyse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Analyse
          </button>
        </div>
        
        {modeAffichage === 'analyse' && (
          <div className="flex space-x-4">
            <button
              onClick={() => setUi(prev => ({ ...prev, ongletActif: 'standard' }))}
              className={`px-4 py-2 rounded-lg transition-all ${
                ongletActif === 'standard'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Standard
            </button>
            <button
              onClick={() => setUi(prev => ({ ...prev, ongletActif: 'comparaison' }))}
              className={`px-4 py-2 rounded-lg transition-all ${
                ongletActif === 'comparaison'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Comparer Scénarios
            </button>
            <button
              onClick={() => setUi(prev => ({ ...prev, ongletActif: 'sensibilite' }))}
              className={`px-4 py-2 rounded-lg transition-all ${
                ongletActif === 'sensibilite'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Sensibilité
            </button>
          </div>
        )}
      </div>
      
      {/* Navigation par onglets pour le mode détaillé */}
      {modeAffichage === 'detaille' && (
        <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
          <button
            onClick={() => changerOnglet('general')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'general'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Paramètres généraux
          </button>
          <button
            onClick={() => changerOnglet('systeme-actuel')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'systeme-actuel'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Système actuel
          </button>
          <button
            onClick={() => changerOnglet('systeme-auto')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'systeme-auto'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Système automatisé
          </button>
          <button
            onClick={() => changerOnglet('resultats')}
            className={`px-4 py-3 font-medium transition-all ${
              ongletActif === 'resultats'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Résultats détaillés
          </button>
        </div>
      )}
      
      {/* Gestion des scénarios - Mode Analyse */}
      {modeAffichage === 'analyse' && ongletActif === 'comparaison' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Gestion des Scénarios</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1">Nom du scénario actuel</label>
              <input
                type="text"
                value={nomScenario}
                onChange={(e) => setNomScenario(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: Projet A - Version économique"
              />
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-6">
              <button
                onClick={sauvegarderScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
              >
                Sauvegarder ce scénario
              </button>
            </div>
          </div>
          
          {scenarios.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Scénarios sauvegardés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map(scenario => (
                  <div key={scenario.id} className="border rounded p-3 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{scenario.nom}</p>
                      <p className="text-sm text-gray-600">ROI: {scenario.resultats.roi.toFixed(2)}% | Délai: {scenario.resultats.delaiRecuperation.toFixed(2)} ans</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => chargerScenario(scenario.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Charger
                      </button>
                      <button
                        onClick={() => supprimerScenario(scenario.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Analyse de sensibilité - Mode Analyse */}
      {modeAffichage === 'analyse' && ongletActif === 'sensibilite' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse de Sensibilité</h2>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paramètre à analyser</label>
              <select
                value={parametreSensibilite}
                onChange={(e) => setParametreSensibilite(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="coutSysteme">Coût du système</option>
                <option value="coutInstallation">Coût d'installation</option>
                <option value="coutIngenierie">Coût d'ingénierie</option>
                <option value="nbEmployesRemplaces">Nombre d'employés remplacés</option>
                <option value="capacite">Capacité de production</option>
                <option value="reductionAccidents">Réduction des accidents</option>
                <option value="tauxRejets">Taux de rejets</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Voir l'impact de la variation de ce paramètre sur les résultats</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64">
              <h3 className="font-medium text-gray-700 mb-2">Impact sur le ROI</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataSensibiliteROI}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variation" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'ROI']} />
                  <Bar dataKey="roi" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Mode Comparatif - Vue par défaut */}
      {modeAffichage === 'comparatif' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Système Actuel */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Système Actuel
            </h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setTypeSystemeActuel('manuel')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'manuel'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Manuel
                </button>
                <button
                  onClick={() => setTypeSystemeActuel('semi-auto')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'semi-auto'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semi-automatisé
                </button>
                <button
                  onClick={() => setTypeSystemeActuel('auto-ancien')}
                  className={`py-2 text-sm rounded-md transition-all ${
                    typeSystemeActuel === 'auto-ancien'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Auto. (ancien)
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.capacite}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          capacite: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.tempsCycle}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          tempsCycle: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeActuel.nombreEmployes}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        nombreEmployes: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Qualité et problèmes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeActuel.tauxRejets}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          tauxRejets: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pertes production (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeActuel.perteProduction}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          perteProduction: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Sécurité</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Accidents/an</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeActuel.frequenceAccident}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          frequenceAccident: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût/accident ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.coutMoyenAccident}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          coutMoyenAccident: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Temps d'arrêt</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Arrêt/accident (h)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.tempsArretAccident}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          tempsArretAccident: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Arrêt non planifié (h/mois)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.tempsArretNonPlanifie}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          tempsArretNonPlanifie: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.maintenance}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          maintenance: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeActuel.energie}
                        onChange={(e) => setParametresSystemeActuel({
                          ...parametresSystemeActuel,
                          energie: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Système Automatisé */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Système Automatisé
            </h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.capacite}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          capacite: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.tempsCycle}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          tempsCycle: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutSysteme}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutSysteme: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutInstallation}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutInstallation: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Impacts sur les ressources humaines</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût annuel employé ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutMainOeuvre}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutMainOeuvre: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employés remplacés (ETP)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeAutomatise.nbEmployesRemplaces}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          nbEmployesRemplaces: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Améliorations</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeAutomatise.tauxRejets}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          tauxRejets: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coût par rejet ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutDechet}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutDechet: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Sécurité et temps d'arrêt</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Réduction accidents (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={parametresSystemeAutomatise.reductionAccidents}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          reductionAccidents: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Réduction temps d'arrêt (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={parametresSystemeAutomatise.reductionTempsArret}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          reductionTempsArret: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutMaintenance}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutMaintenance: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutEnergie}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutEnergie: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Coûts cachés</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Formation continue/an</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutFormationContinue}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutFormationContinue: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mises à jour logicielles</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutMiseAJourLogiciel}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutMiseAJourLogiciel: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consommables spécifiques</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.coutConsommables}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          coutConsommables: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Paramètres généraux communs */}
      {modeAffichage === 'comparatif' && (
        <div className="bg-white p-4 rounded-lg shadow mt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Paramètres généraux</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Production annuelle (unités)</label>
                  <input
                    type="number"
                    value={parametresGeneraux.production}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      production: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marge par unité ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={parametresGeneraux.margeUnitaire}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      margeUnitaire: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Heures par jour</label>
                  <input
                    type="number"
                    value={parametresGeneraux.heuresOperationParJour}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      heuresOperationParJour: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jours par an</label>
                  <input
                    type="number"
                    value={parametresGeneraux.joursOperationParAn}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      joursOperationParAn: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={parametresGeneraux.tauxInflation}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      tauxInflation: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={parametresGeneraux.tauxActualisation}
                    onChange={(e) => setParametresGeneraux({
                      ...parametresGeneraux,
                      tauxActualisation: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Graphiques comparatifs */}
      {modeAffichage === 'comparatif' && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Analyse comparative</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-64">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de production (unités/heure)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonCapacite} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-1">
                Amélioration: +{(((parametresSystemeAutomatise.capacite - parametresSystemeActuel.capacite) / parametresSystemeActuel.capacite) * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="h-64">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Taux de rejets (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonRejets} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejets']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-1">
                Réduction: -{(((parametresSystemeActuel.tauxRejets - parametresSystemeAutomatise.tauxRejets) / parametresSystemeActuel.tauxRejets) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-64">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Main d'œuvre requise (ETP)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonEmployes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} ETP`, 'Main d\'œuvre']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-1">
                Réduction: -{((parametresSystemeAutomatise.nbEmployesRemplaces / parametresSystemeActuel.nombreEmployes) * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="h-64">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Fréquence d'accidents (par an)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonAccidents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents/an`, 'Fréquence']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-1">
                Réduction: -{parametresSystemeAutomatise.reductionAccidents}%
              </p>
            </div>
          </div>
          
          <div className="h-80">
            <h3 className="font-medium text-gray-700 mb-4 text-center">Économies annuelles par catégorie</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraphiques.dataEconomies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Économie']} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Résultats financiers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
          </svg>
          Résultats financiers
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
            <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
            <p className="text-xs text-gray-600 mt-1">Sur {parametresSystemeAutomatise.dureeVie} ans</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
            <p className={`text-2xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
              {delaiRecuperation.toFixed(2)} ans
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">VAN</h3>
            <p className="text-2xl font-bold text-purple-800">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">TRI</h3>
            <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 bg-yellow-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
            </p>
          </div>
          <div className="flex-1 bg-red-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Investissement initial net</h3>
            <p className="text-2xl font-bold text-red-700">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                parametresSystemeAutomatise.coutSysteme + 
                parametresSystemeAutomatise.coutInstallation + 
                parametresSystemeAutomatise.coutIngenierie + 
                parametresSystemeAutomatise.coutFormation - 
                parametresSystemeAutomatise.subventions
              )}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Évolution du retour sur investissement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGraphiques.dataCumulatif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value), 'Montant']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulatif" 
                  name="Flux cumulatif" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="seuil" 
                  name="Seuil d'investissement" 
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-1 italic">
            * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Avantages du système automatisé</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Traitement de <strong>{parametresSystemeAutomatise.capacite} unités/heure</strong> contre {parametresSystemeActuel.capacite} actuellement</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction de la main d'œuvre de <strong>{parametresSystemeAutomatise.nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Diminution des rejets de <strong>{(parametresSystemeActuel.tauxRejets - parametresSystemeAutomatise.tauxRejets).toFixed(1)}%</strong></span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction des accidents de <strong>{parametresSystemeAutomatise.reductionAccidents}%</strong></span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Attention aux coûts cachés</h3>
          <p className="text-sm text-gray-700 mb-3">
            L'automatisation implique des coûts supplémentaires souvent négligés dans l'analyse initiale:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Formation continue</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutFormationContinue)}/an</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Mises à jour logicielles</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutMiseAJourLogiciel)}/an</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Consommables spécifiques</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutConsommables)}/an</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
          {van > 0 && tri > parametresGeneraux.tauxActualisation ? (
            <p className="text-green-700">
              <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation semble financièrement viable avec un ROI positif et un délai de récupération raisonnable.
            </p>
          ) : (
            <p className="text-yellow-700">
              <span className="font-bold">⚠ À réévaluer</span> - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateurROI;