import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle avec comparaison avant/après
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États pour les paramètres du système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 35, // unités/heure
    tempsCycle: 102.86, // secondes/unité (3600/capacité)
    nombreEmployes: 2, // ETP
    coutSysteme: 10000, // Coût du système actuel
    maintenance: 5000, // $/an
    energie: 3000, // $/an
    perteProduction: 10, // % perte due aux arrêts et retards
    tauxRejets: 6, // % de rejets/défauts
    frequenceAccident: 3.5, // accidents par an
    coutMoyenAccident: 8000, // coût moyen par accident
    tempsArretAccident: 16, // heures d'arrêt par accident
    formationAnnuelle: 1500, // coût de formation annuel
    consommablesAnnuels: 12000 // coût des consommables par an
  });

  // États pour les paramètres du système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 15000, // Formation initiale
    formationContinue: 5000, // Formation continue annuelle
    coutMaintenance: 8000,
    coutEnergie: 6000,
    dureeVie: 10,
    tauxAmortissement: 20,
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 1.5,
    capaciteTraitement: 80, // unités/heure
    tempsCycle: 45, // secondes/unité
    reductionDechet: 12,
    coutDechet: 150,
    augmentationProduction: 15,
    reductionEnergie: 8,
    coutEnergieTonne: 30,
    reductionEau: 6,
    coutEauTonne: 3.5,
    ameliorationQualite: 4,
    reductionEmpreinteCO2: 5,
    tauxRejets: 2.5,
    reductionAccidents: 75,
    supportTechnique: 3500, // Support technique annuel
    miseANiveauLogicielle: 2500, // Mises à niveau logicielles annuelles
    consommablesAnnuels: 8000, // Coût des consommables par an
    subventions: 0
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    margeBrute: 25, // $/unité
    tauxInflation: 2,
    tauxActualisation: 5,
    productionAnnuelle: 100000, // unités par an
    heuresOperationParJour: 16,
    joursOperationParAn: 250,
    coutQualite: 20000, // Coût annuel lié aux problèmes de qualité
    coutRebut: 15 // Coût par unité rejetée
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    economiesCO2: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0
  });
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    afficherDetails: false,
    ongletActif: 'general',
    viewMode: 'basique', // 'basique', 'avance'
    analyseMode: 'standard' // 'standard', 'comparaison', 'sensibilite'
  });
  
  // États pour la comparaison de scénarios
  const [scenarios, setScenarios] = useState([]);
  const [scenarioActif, setScenarioActif] = useState('actuel');
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 35,
        tempsCycle: 102.86,
        nombreEmployes: 2,
        coutSysteme: 10000, 
        maintenance: 3000,
        energie: 2000,
        tauxRejets: 6,
        perteProduction: 12,
        frequenceAccident: 3.5,
        formationAnnuelle: 1500,
        consommablesAnnuels: 12000
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 60,
        tempsCycle: 60,
        nombreEmployes: 1.5,
        coutSysteme: 65000,
        maintenance: 8000,
        energie: 5000,
        tauxRejets: 4,
        perteProduction: 8,
        frequenceAccident: 2.2,
        formationAnnuelle: 3000,
        consommablesAnnuels: 10000
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 70,
        tempsCycle: 51.43,
        nombreEmployes: 1,
        coutSysteme: 120000,
        maintenance: 12000,
        energie: 7000,
        tauxRejets: 3.5,
        perteProduction: 6,
        frequenceAccident: 1.2,
        formationAnnuelle: 4500,
        consommablesAnnuels: 9000
      });
    }
  }, [typeSystemeActuel]);
  
  // Synchroniser le temps de cycle et la capacité pour le système actuel
  useEffect(() => {
    const tempsCycleCalcule = 3600 / parametresSystemeActuel.capacite;
    if (Math.abs(tempsCycleCalcule - parametresSystemeActuel.tempsCycle) > 0.1) {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsCycle: parseFloat(tempsCycleCalcule.toFixed(2))
      });
    }
  }, [parametresSystemeActuel.capacite]);
  
  // Synchroniser le temps de cycle et la capacité pour le système automatisé
  useEffect(() => {
    const tempsCycleCalcule = 3600 / parametresSystemeAutomatise.capaciteTraitement;
    if (Math.abs(tempsCycleCalcule - parametresSystemeAutomatise.tempsCycle) > 0.1) {
      setParametresSystemeAutomatise({
        ...parametresSystemeAutomatise,
        tempsCycle: parseFloat(tempsCycleCalcule.toFixed(2))
      });
    }
  }, [parametresSystemeAutomatise.capaciteTraitement]);
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, formationContinue,
      coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, 
      nbEmployesRemplaces, reductionDechet, coutDechet, augmentationProduction, 
      reductionEnergie, coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
      reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
      supportTechnique, miseANiveauLogicielle, consommablesAnnuels, subventions
    } = parametresSystemeAutomatise;

    const {
      capacite, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsActuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident, formationAnnuelle,
      consommablesAnnuels: consommablesActuels
    } = parametresSystemeActuel;

    const {
      margeBrute, tauxInflation, tauxActualisation, productionAnnuelle,
      heuresOperationParJour, joursOperationParAn, coutQualite, coutRebut
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (productionAnnuelle * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;
    
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
      const formationContinueAnnuelle = formationContinue * facteurInflation;
      const formationActuelleAjustee = formationAnnuelle * facteurInflation;
      const supportTechniqueAnnuel = supportTechnique * facteurInflation;
      const miseANiveauAnnuelle = miseANiveauLogicielle * facteurInflation;
      const consommablesNouveaux = consommablesAnnuels * facteurInflation;
      const consommablesActuelsAjustes = consommablesActuels * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      const economieFormation = formationActuelleAjustee - formationContinueAnnuelle;
      const economieConsommables = consommablesActuelsAjustes - consommablesNouveaux;
      
      // Économies liées à la réduction des déchets
      const unitesDechetsReduites = (productionAnnuelle * reductionDechet) / 100;
      const economieDechet = unitesDechetsReduites * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets
      const economieRejets = productionAnnuelle * (tauxRejetsActuel - tauxRejets) / 100 * coutRebut * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie dans le processus
      const economieEnergieProcessus = (productionAnnuelle * reductionEnergie / 100) * coutEnergieTonne * facteurInflation;
      
      // Économies liées à la réduction de consommation d'eau
      const economieEau = (productionAnnuelle * reductionEau / 100) * coutEauTonne * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const productionSupplementaire = productionAnnuelle * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeBrute * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (productionAnnuelle * ameliorationQualite / 100) * (margeBrute * 0.2) * facteurInflation;
      
      // Stockage de la dernière valeur pour l'affichage
      if (annee === dureeVie) {
        dernierBeneficeQualite = beneficeQualite;
      }
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (estimation)
      const tonnesCO2Economisees = (productionAnnuelle * reductionEmpreinteCO2 / 100);
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul des coûts cachés
      const coutsCachesAnnuels = supportTechniqueAnnuel + miseANiveauAnnuelle;
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets + economieFormation +
                       economieConsommables + beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle - coutsCachesAnnuels + amortissement;
      
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
        economieFormation,
        economieConsommables,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        coutsCachesAnnuels,
        amortissement,
        tonnesCO2Economisees
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = calculerTRI(investissementInitial, fluxTresorerie.map(item => item.fluxAnnuel));
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  };
