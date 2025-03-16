/**
 * Constants.js - Fichier centralisant les constantes globales de l'application
 */

// Types de systèmes
export const TYPES_SYSTEME = {
  MANUEL: 'manuel',
  SEMI_AUTO: 'semi-auto',
  AUTO_ANCIEN: 'auto-ancien',
  AUTO_MODERNE: 'auto-moderne'
};

// Modes d'affichage
export const MODES_AFFICHAGE = {
  BASIQUE: 'basique',
  AVANCE: 'avance'
};

// Modes d'analyse
export const MODES_ANALYSE = {
  STANDARD: 'standard',
  COMPARAISON: 'comparaison',
  SENSIBILITE: 'sensibilite'
};

// Onglets des calculateurs
export const ONGLETS_CALCULATEUR = {
  GENERAL: 'general',
  PRODUCTION: 'production',
  COMPARATIF: 'comparatif',
  FINANCIER: 'financier',
  SECURITE: 'securite'
};

// Paramètres par défaut du système actuel
export const PARAMETRES_DEFAUT_SYSTEME_ACTUEL = {
  manuel: {
    capacite: 45,
    nombreEmployes: 2.5,
    coutSysteme: 15000,
    maintenance: 6000,
    energie: 4000,
    tauxRejets: 8,
    perteProduction: 12,
    frequenceAccident: 5.2,
    coutMoyenAccident: 12500,
    tempsArretAccident: 24,
    tempsCycle: 80, // secondes par unité
    // Nouveaux paramètres environnementaux
    consommationEau: 15000, // m³/an
    coutEau: 4.5, // coût par m³
    consommationAirComprime: 12000, // m³/an
    coutAirComprime: 0.25, // coût par m³
    emissionCO2: 180, // tonnes/an
    consommationHydraulique: 2500, // litres/an
    coutHydraulique: 8, // coût par litre
    arretNonPlanifie: 24 // heures par mois
  },
  'semi-auto': {
    capacite: 80,
    nombreEmployes: 1.5,
    coutSysteme: 120000,
    maintenance: 18000,
    energie: 8000,
    tauxRejets: 5.5,
    perteProduction: 8,
    frequenceAccident: 3.8,
    coutMoyenAccident: 12500,
    tempsArretAccident: 24,
    tempsCycle: 45, // secondes par unité
    // Nouveaux paramètres environnementaux
    consommationEau: 13000, // m³/an
    coutEau: 4.5, // coût par m³
    consommationAirComprime: 14000, // m³/an
    coutAirComprime: 0.25, // coût par m³
    emissionCO2: 150, // tonnes/an
    consommationHydraulique: 3200, // litres/an
    coutHydraulique: 8, // coût par litre
    arretNonPlanifie: 18 // heures par mois
  },
  'auto-ancien': {
    capacite: 100,
    nombreEmployes: 1,
    coutSysteme: 250000,
    maintenance: 25000,
    energie: 10000,
    tauxRejets: 4.2,
    perteProduction: 5,
    frequenceAccident: 1.5,
    coutMoyenAccident: 12500,
    tempsArretAccident: 16,
    tempsCycle: 36, // secondes par unité
    // Nouveaux paramètres environnementaux
    consommationEau: 12000, // m³/an
    coutEau: 4.5, // coût par m³
    consommationAirComprime: 16000, // m³/an
    coutAirComprime: 0.25, // coût par m³
    emissionCO2: 130, // tonnes/an
    consommationHydraulique: 3800, // litres/an
    coutHydraulique: 8, // coût par litre
    arretNonPlanifie: 12 // heures par mois
  }
};

// Paramètres par défaut du système automatisé
export const PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE = {
  coutSysteme: 380000,
  coutInstallation: 45000,
  coutIngenierie: 25000,
  coutFormation: 15000, 
  coutFormationContinue: 8000, // coût annuel de formation continue
  coutMaintenance: 12000,
  coutEnergie: 6500,
  dureeVie: 15,
  tauxAmortissement: 15,
  coutMainOeuvre: 55000,
  nbEmployesRemplaces: 2,
  reductionDechet: 14,
  coutDechet: 230,
  augmentationProduction: 10,
  // Paramètres énergétiques
  reductionEnergie: 12, // % d'économie d'énergie dans le processus de production
  coutEnergieTonne: 40, // coût d'énergie par tonne produite
  // Paramètres d'eau
  reductionEau: 8, // % d'économie d'eau dans le processus
  coutEauTonne: 4.5, // coût d'eau par tonne produite
  ameliorationQualite: 5,
  reductionEmpreinteCO2: 7,
  capaciteTraitement: 120,
  tauxRejets: 3.5,
  reductionAccidents: 85,
  subventions: 40000,
  tempsCycle: 30, // secondes par unité
  
  // Nouveaux paramètres environnementaux
  consommationEau: 10000, // m³/an
  coutEau: 4.5, // coût par m³
  reductionConsommationEau: 15, // en %
  consommationAirComprime: 13000, // m³/an - Cette valeur sera ajustée par le calcul
  coutAirComprime: 0.25, // coût par m³
  reductionConsommationAirComprime: 10, // en %
  emissionCO2: 110, // tonnes/an
  consommationHydraulique: 2800, // litres/an - Cette valeur sera ajustée par le calcul
  coutHydraulique: 8, // coût par litre
  reductionConsommationHydraulique: 18, // en %
  arretNonPlanifie: 8, // heures par mois
  reductionTempsArret: 30 // en %
};

// Paramètres généraux par défaut
export const PARAMETRES_GENERAUX_DEFAUT = {
  margeBrute: 110,
  tauxInflation: 2,
  tauxActualisation: 5,
  tonnageAnnuel: 20000,
  heuresOperationParJour: 16,
  joursOperationParAn: 300
};