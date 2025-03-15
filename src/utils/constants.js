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
    tempsCycle: 80 // secondes par unité
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
    tempsCycle: 45 // secondes par unité
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
    tempsCycle: 36 // secondes par unité
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
  reductionEnergie: 12,
  coutEnergieTonne: 40,
  reductionEau: 8,
  coutEauTonne: 4.5,
  ameliorationQualite: 5,
  reductionEmpreinteCO2: 7,
  capaciteTraitement: 120,
  tauxRejets: 3.5,
  reductionAccidents: 85,
  subventions: 40000,
  tempsCycle: 30 // secondes par unité
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
