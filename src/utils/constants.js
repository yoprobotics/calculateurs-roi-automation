/**
 * Types de systèmes actuels
 */
export const TYPES_SYSTEME = {
  MANUEL: 'manuel',
  SEMI_AUTO: 'semi-auto',
  AUTO_ANCIEN: 'auto-ancien'
};

/**
 * Onglets du calculateur
 */
export const ONGLETS_CALCULATEUR = {
  GENERAL: 'general',
  COMPARATIF: 'comparatif',
  FINANCIER: 'financier',
  SECURITE: 'securite'
};

/**
 * Paramètres par défaut pour les différents types de systèmes actuels
 */
export const PARAMETRES_DEFAUT_SYSTEME_ACTUEL = {
  // Système manuel
  [TYPES_SYSTEME.MANUEL]: {
    capacite: 45, // unités/heure
    nombreEmployes: 2.5, // ETP
    coutSysteme: 15000, 
    maintenance: 6000,
    energie: 4000,
    tauxRejets: 8,
    perteProduction: 12,
    frequenceAccident: 5.2,
    coutMoyenAccident: 12500,
    tempsArretAccident: 24, // heures d'arrêt par accident
    tempsCycle: 80 // secondes par unité
  },
  
  // Système semi-automatisé
  [TYPES_SYSTEME.SEMI_AUTO]: {
    capacite: 80,
    nombreEmployes: 1.5,
    coutSysteme: 120000,
    maintenance: 18000,
    energie: 8000,
    tauxRejets: 5.5,
    perteProduction: 8,
    frequenceAccident: 3.8,
    coutMoyenAccident: 12500,
    tempsArretAccident: 18,
    tempsCycle: 45
  },
  
  // Système automatisé ancien
  [TYPES_SYSTEME.AUTO_ANCIEN]: {
    capacite: 100,
    nombreEmployes: 1,
    coutSysteme: 250000,
    maintenance: 25000,
    energie: 10000,
    tauxRejets: 4.2,
    perteProduction: 5,
    frequenceAccident: 1.5,
    coutMoyenAccident: 12500,
    tempsArretAccident: 12,
    tempsCycle: 36
  }
};

/**
 * Modes d'affichage pour le calculateur général
 */
export const MODES_AFFICHAGE = {
  BASIQUE: 'basique',
  AVANCE: 'avance'
};

/**
 * Modes d'analyse pour le calculateur général
 */
export const MODES_ANALYSE = {
  STANDARD: 'standard',
  COMPARAISON: 'comparaison',
  SENSIBILITE: 'sensibilite'
};

/**
 * Paramètres par défaut pour le système actuel général
 */
export const PARAMETRES_DEFAUT_SYSTEME_ACTUEL_GENERAL = {
  capacite: 45, // unités/heure
  nombreEmployes: 2.5, // ETP
  coutSysteme: 15000,
  maintenance: 6000,
  energie: 4000,
  tauxRejets: 8,
  perteProduction: 12,
  frequenceAccident: 5.2,
  coutMoyenAccident: 12500,
  tempsArretAccident: 24, // heures d'arrêt par accident
  tempsCycle: 80 // secondes par unité
};

/**
 * Paramètres par défaut pour le système automatisé général
 */
export const PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE_GENERAL = {
  coutSysteme: 150000,
  coutInstallation: 25000,
  coutIngenierie: 20000,
  coutFormation: 10000,
  coutFormationContinue: 5000, // coût annuel de formation continue
  coutMaintenance: 5000,
  coutEnergie: 3000,
  dureeVie: 10,
  tauxAmortissement: 20,
  coutMainOeuvre: 45000,
  nbEmployesRemplaces: 1.5,
  coutErrorHumaine: 15000,
  augmentationProduction: 15,
  tauxProblemeQualite: 8,
  coutQualite: 20000,
  reductionDechet: 10,
  coutDechet: 200,
  ameliorationQualite: 5,
  reductionAccidents: 80,
  capaciteTraitement: 100,
  tauxRejets: 3,
  subventions: 0,
  tempsCycle: 36 // secondes par unité
};

/**
 * Paramètres généraux par défaut pour le calculateur général
 */
export const PARAMETRES_GENERAUX_GENERAL = {
  production: 100000, // unités/an
  margeBrute: 0.2, // marge par unité
  tauxInflation: 2,
  tauxActualisation: 5,
  heuresOperationParJour: 8,
  joursOperationParAn: 250
};