import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculerTRI, calculerDelaiRecuperation } from '../utils/calculationHelpers';

// Valeurs par défaut pour le contexte
const defaultContextValues = {
  // Paramètres de base
  coutSysteme: 150000,
  coutInstallation: 25000,
  coutIngenierie: 20000,
  coutFormation: 10000,
  
  // Système actuel
  systemeActuel: {
    type: 'manuel', // 'manuel', 'semi-auto', 'auto-ancien'
    capacite: 45, // unités/heure
    nombreEmployes: 2.5, // ETP
    coutMaintenance: 12000, // $/an
    coutEnergie: 8000, // $/an
    tauxRejets: 8, // %
    perteProduction: 12, // %
    frequenceAccident: 5.2, // accidents/an
    coutMoyenAccident: 12500, // $ par accident
    tempsArretAccident: 24, // heures d'arrêt par accident
    tempsCycle: 80, // secondes/unité
  },
  
  // Système automatisé
  systemeAutomatise: {
    capacite: 120, // unités/heure
    nombreEmployes: 0.5, // ETP
    coutMaintenance: 20000, // $/an
    coutEnergie: 15000, // $/an
    tauxRejets: 3, // %
    perteProduction: 5, // %
    frequenceAccident: 1.2, // accidents/an
    tauxReductionAccidents: 75, // % de réduction
    tempsCycle: 30, // secondes/unité
    reductionDechet: 14, // %
    coutDechet: 230, // $ par tonne
    augmentationProduction: 10, // %
    reductionEnergie: 12, // %
    ameliorationQualite: 5, // %
    reductionEmpreinteCO2: 7, // %
  },
  
  // Paramètres financiers
  parametresFinanciers: {
    dureeVie: 10,
    tauxAmortissement: 20,
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 2,
    coutErrorHumaine: 15000,
    margeUnitaire: 0.2,
    tauxInflation: 2,
    tauxActualisation: 5,
    subventions: 0,
    production: 100000, // unités par an
    margeBrute: 110, // $ par unité
    tonnageAnnuel: 20000, // tonnes par an
    heuresOperationParJour: 16,
    joursOperationParAn: 300,
    coutFormationContinue: 5000, // $ par an
    coutMiseAJourLogiciel: 3000, // $ par an
  },
  
  // Coûts cachés
  coutsCaches: {
    formationContinue: 5000, // $ par an
    miseAJourLogiciel: 3000, // $ par an
    consultationTechnique: 4000, // $ par an
    perteTempsMigration: 8000, // $ (coût ponctuel)
    adaptationProcessus: 6000, // $ (coût ponctuel)
  },
  
  // Résultats
  resultats: {
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
  },
  
  // Interface utilisateur
  ui: {
    afficherDetails: false,
    ongletActif: 'general',
    viewMode: 'basique', // 'basique', 'avance'
    analyseMode: 'standard', // 'standard', 'comparaison', 'sensibilite'
    parametreSensibilite: 'coutSysteme',
  },
  
  // Gestion des scénarios
  scenarios: [],
  scenarioActif: 'actuel',
  nomScenario: 'Scénario de base',
  resultatsSensibilite: [],
};

// Types d'actions
const actionTypes = {
  UPDATE_SYSTEM_COST: 'UPDATE_SYSTEM_COST',
  UPDATE_INSTALLATION_COST: 'UPDATE_INSTALLATION_COST',
  UPDATE_ENGINEERING_COST: 'UPDATE_ENGINEERING_COST',
  UPDATE_TRAINING_COST: 'UPDATE_TRAINING_COST',
  UPDATE_CURRENT_SYSTEM: 'UPDATE_CURRENT_SYSTEM',
  UPDATE_AUTOMATED_SYSTEM: 'UPDATE_AUTOMATED_SYSTEM',
  UPDATE_FINANCIAL_PARAMS: 'UPDATE_FINANCIAL_PARAMS',
  UPDATE_HIDDEN_COSTS: 'UPDATE_HIDDEN_COSTS',
  SET_RESULTS: 'SET_RESULTS',
  UPDATE_UI: 'UPDATE_UI',
  ADD_SCENARIO: 'ADD_SCENARIO',
  REMOVE_SCENARIO: 'REMOVE_SCENARIO',
  LOAD_SCENARIO: 'LOAD_SCENARIO',
  SET_ACTIVE_SCENARIO: 'SET_ACTIVE_SCENARIO',
  SET_SCENARIO_NAME: 'SET_SCENARIO_NAME',
  SET_SENSITIVITY_RESULTS: 'SET_SENSITIVITY_RESULTS',
  RESET_TO_DEFAULT: 'RESET_TO_DEFAULT',
  SET_CURRENT_SYSTEM_TYPE: 'SET_CURRENT_SYSTEM_TYPE',
};