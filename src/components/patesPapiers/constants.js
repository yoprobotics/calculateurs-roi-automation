// Valeurs par défaut pour les différents systèmes
export const SYSTEME_MANUEL = {
  capacite: 45,
  nombreEmployes: 2.5,
  coutSysteme: 15000, 
  maintenance: 6000,
  energie: 4000,
  tauxRejets: 8,
  perteProduction: 12,
  frequenceAccident: 5.2,
  coutMoyenAccident: 12500,
  tempsArretAccident: 24
};

export const SYSTEME_SEMI_AUTO = {
  capacite: 80,
  nombreEmployes: 1.5,
  coutSysteme: 120000,
  maintenance: 18000,
  energie: 8000,
  tauxRejets: 5.5,
  perteProduction: 8,
  frequenceAccident: 3.8,
  coutMoyenAccident: 12500,
  tempsArretAccident: 24
};

export const SYSTEME_AUTO_ANCIEN = {
  capacite: 100,
  nombreEmployes: 1,
  coutSysteme: 250000,
  maintenance: 25000,
  energie: 10000,
  tauxRejets: 4.2,
  perteProduction: 5,
  frequenceAccident: 1.5,
  coutMoyenAccident: 12500,
  tempsArretAccident: 24
};

// Valeurs par défaut pour le système automatisé
export const SYSTEME_AUTOMATISE_DEFAUT = {
  coutSysteme: 380000,
  coutInstallation: 45000,
  coutIngenierie: 25000,
  coutFormation: 15000,
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
  subventions: 40000
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

// État de l'interface utilisateur par défaut
export const UI_DEFAUT = {
  afficherDetails: false,
  ongletActif: 'general'
};
