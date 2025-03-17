/**
 * Fonctions utilitaires pour le calculateur de l'industrie des pâtes et papiers
 */

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

/**
 * Calcule l'économie liée à la réduction des émissions de CO2
 * @param {number} tonnageAnnuel - Tonnage annuel de production
 * @param {number} pourcentageReduction - Pourcentage de réduction des émissions
 * @param {number} dureeVie - Durée de vie du système en années
 * @returns {number} - Tonnes de CO2 économisées sur la durée de vie
 */
export const calculerEconomiesCO2 = (tonnageAnnuel, pourcentageReduction, dureeVie) => {
  const reductionAnnuelle = tonnageAnnuel * (pourcentageReduction / 100);
  return reductionAnnuelle * dureeVie;
};

/**
 * Calcule l'économie liée à la réduction des déchets
 * @param {number} tonnageAnnuel - Tonnage annuel de production
 * @param {number} pourcentageReduction - Pourcentage de réduction des déchets
 * @param {number} coutDechet - Coût par tonne de déchets
 * @param {number} tauxInflation - Taux d'inflation
 * @param {number} annee - Année du calcul
 * @returns {number} - Économie en dollars pour l'année spécifiée
 */
export const calculerEconomieDechet = (
  tonnageAnnuel,
  pourcentageReduction,
  coutDechet,
  tauxInflation,
  annee
) => {
  const tonnageDechetReduit = (tonnageAnnuel * pourcentageReduction) / 100;
  return tonnageDechetReduit * coutDechet * appliquerInflation(1, tauxInflation, annee - 1);
};

/**
 * Calcule l'économie liée à la réduction des rejets de fils métalliques
 * @param {number} tonnageAnnuel - Tonnage annuel de production
 * @param {number} tauxRejetActuel - Taux de rejet actuel (en pourcentage)
 * @param {number} tauxRejetAutomatise - Taux de rejet du système automatisé (en pourcentage)
 * @param {number} coutDechet - Coût par tonne de déchets
 * @param {number} tauxInflation - Taux d'inflation
 * @param {number} annee - Année du calcul
 * @returns {number} - Économie en dollars pour l'année spécifiée
 */
export const calculerEconomieRejets = (
  tonnageAnnuel,
  tauxRejetActuel,
  tauxRejetAutomatise,
  coutDechet,
  tauxInflation,
  annee
) => {
  return (
    tonnageAnnuel *
    (tauxRejetActuel - tauxRejetAutomatise) / 100 *
    coutDechet *
    appliquerInflation(1, tauxInflation, annee - 1)
  );
};

/**
 * Sauvegarde les paramètres du calculateur dans le localStorage
 * @param {Object} parametres - Tous les paramètres à sauvegarder
 * @param {string} typeSystemeActuel - Type de système actuel (manuel, semi-auto, auto-ancien)
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @returns {boolean} - Succès ou échec de la sauvegarde
 */
export const sauvegarderParametres = (
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux
) => {
  try {
    const parametres = {
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux,
      dateEnregistrement: new Date().toISOString(),
    };
    
    localStorage.setItem('patesPapiers_parametres', JSON.stringify(parametres));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
    return false;
  }
};

/**
 * Charge les paramètres du calculateur depuis le localStorage
 * @returns {Object|null} - Paramètres chargés ou null en cas d'erreur
 */
export const chargerParametres = () => {
  try {
    const parametresJSON = localStorage.getItem('patesPapiers_parametres');
    if (!parametresJSON) return null;
    
    return JSON.parse(parametresJSON);
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    return null;
  }
};

/**
 * Valide les paramètres du système
 * @param {Object} parametres - Paramètres à valider
 * @returns {Object} - Résultat de la validation {valide: boolean, erreurs: []}
 */
export const validerParametres = (parametres) => {
  const erreurs = [];
  
  // Vérification des valeurs négatives
  Object.entries(parametres).forEach(([cle, valeur]) => {
    if (typeof valeur === 'number' && valeur < 0) {
      erreurs.push(`Le paramètre ${cle} ne peut pas être négatif`);
    }
  });
  
  // Validation spécifique pour les pourcentages
  const champsPourcentage = [
    'perteProduction', 
    'tauxRejets', 
    'reductionDechet', 
    'augmentationProduction',
    'reductionEnergie',
    'reductionEau',
    'ameliorationQualite',
    'reductionEmpreinteCO2',
    'reductionAccidents'
  ];
  
  champsPourcentage.forEach(champ => {
    if (parametres[champ] !== undefined && parametres[champ] > 100) {
      erreurs.push(`Le pourcentage ${champ} ne peut pas dépasser 100%`);
    }
  });
  
  // Validation cohérence employés remplacés
  if (
    parametres.nbEmployesRemplaces !== undefined && 
    parametres.nombreEmployes !== undefined && 
    parametres.nbEmployesRemplaces > parametres.nombreEmployes
  ) {
    erreurs.push(`Le nombre d'employés remplacés ne peut pas être supérieur au nombre total d'employés`);
  }
  
  return {
    valide: erreurs.length === 0,
    erreurs
  };
};

/**
 * Formate un montant en devise
 * @param {number} montant - Montant à formater
 * @param {string} devise - Code de la devise (par défaut: USD)
 * @param {number} decimales - Nombre de décimales (par défaut: 0)
 * @returns {string} - Montant formaté
 */
export const formaterMontant = (montant, devise = 'USD', decimales = 0) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: devise, 
    maximumFractionDigits: decimales 
  }).format(montant);
};

/**
 * Formate un pourcentage
 * @param {number} valeur - Valeur à formater
 * @param {number} decimales - Nombre de décimales (par défaut: 2)
 * @returns {string} - Pourcentage formaté
 */
export const formaterPourcentage = (valeur, decimales = 2) => {
  return `${valeur.toFixed(decimales)}%`;
};

/**
 * Formate une valeur numérique
 * @param {number} valeur - Valeur à formater
 * @param {number} decimales - Nombre de décimales (par défaut: 2)
 * @returns {string} - Valeur formatée
 */
export const formaterNombre = (valeur, decimales = 2) => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: decimales 
  }).format(valeur);
};
