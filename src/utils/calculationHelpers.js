/**
 * Calcule le flux de trésorerie actualisé
 * @param {number} flux - Flux de trésorerie
 * @param {number} tauxActualisation - Taux d'actualisation (en pourcentage)
 * @param {number} annee - Année du flux
 * @returns {number} - Flux actualisé
 */
export const calculerFluxActualise = (flux, tauxActualisation, annee) => {
  const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
  return flux / facteurActualisation;
};

/**
 * Calcule le délai de récupération précis avec interpolation
 * @param {number} investissementInitial - Montant de l'investissement initial
 * @param {Array} fluxTresorerie - Tableau des flux de trésorerie annuels
 * @param {number} dureeMax - Durée maximale à considérer
 * @returns {number} - Délai de récupération en années
 */
export const calculerDelaiRecuperation = (investissementInitial, fluxTresorerie, dureeMax) => {
  let cumulFluxTresorerie = 0;
  let periodeRecuperation = dureeMax;
  let recuperationAtteinte = false;
  
  for (let annee = 0; annee < fluxTresorerie.length; annee++) {
    cumulFluxTresorerie += fluxTresorerie[annee];
    
    if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
      const cumulPrecedent = cumulFluxTresorerie - fluxTresorerie[annee];
      const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxTresorerie[annee];
      periodeRecuperation = annee + fractionAnnee;
      recuperationAtteinte = true;
      break;
    }
  }
  
  return periodeRecuperation;
};

/**
 * Calcule le TRI (Taux de Rendement Interne) par approximation
 * @param {number} investissementInitial - Montant de l'investissement initial
 * @param {Array} fluxTresorerie - Tableau des flux de trésorerie annuels
 * @returns {number} - TRI en pourcentage
 */
export const calculerTRI = (investissementInitial, fluxTresorerie) => {
  let triApprox = 0;
  
  for (let r = 1; r <= 100; r++) {
    let npv = -investissementInitial;
    
    for (let t = 0; t < fluxTresorerie.length; t++) {
      npv += fluxTresorerie[t] / Math.pow(1 + r / 100, t + 1);
    }
    
    if (npv <= 0) {
      triApprox = r - 1;
      break;
    }
  }
  
  return triApprox;
};

/**
 * Applique l'inflation à une valeur
 * @param {number} valeur - Valeur initiale
 * @param {number} tauxInflation - Taux d'inflation annuel (en pourcentage)
 * @param {number} annees - Nombre d'années
 * @returns {number} - Valeur ajustée avec l'inflation
 */
export const appliquerInflation = (valeur, tauxInflation, annees) => {
  const facteurInflation = Math.pow(1 + tauxInflation / 100, annees);
  return valeur * facteurInflation;
};