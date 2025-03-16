/**
 * Service de validation pour les données du calculateur
 */

/**
 * Valide les pourcentages pour s'assurer qu'ils sont entre 0 et 100
 * @param {number} value - Valeur à valider
 * @param {string} fieldName - Nom du champ (pour les messages d'erreur)
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validatePercentage = (value, fieldName) => {
  if (value < 0) {
    return `${fieldName} ne peut pas être négatif`;
  }
  if (value > 100) {
    return `${fieldName} ne peut pas dépasser 100%`;
  }
  return null;
};

/**
 * Valide que la valeur soit positive
 * @param {number} value - Valeur à valider
 * @param {string} fieldName - Nom du champ (pour les messages d'erreur)
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validatePositive = (value, fieldName) => {
  if (value < 0) {
    return `${fieldName} doit être une valeur positive`;
  }
  return null;
};

/**
 * Valide que la valeur est supérieure à zéro
 * @param {number} value - Valeur à valider
 * @param {string} fieldName - Nom du champ (pour les messages d'erreur)
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validateGreaterThanZero = (value, fieldName) => {
  if (value <= 0) {
    return `${fieldName} doit être supérieur à zéro`;
  }
  return null;
};

/**
 * Valide que le nombre d'employés remplacés ne dépasse pas le nombre d'employés actuel
 * @param {number} nbEmployesRemplaces - Nombre d'employés remplacés
 * @param {number} nombreEmployesActuel - Nombre total d'employés actuels
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validateEmployeeReplacement = (nbEmployesRemplaces, nombreEmployesActuel) => {
  if (nbEmployesRemplaces > nombreEmployesActuel) {
    return `Le nombre d'employés remplacés (${nbEmployesRemplaces}) ne peut pas être supérieur au nombre total d'employés (${nombreEmployesActuel})`;
  }
  return null;
};

/**
 * Valide plusieurs paramètres à la fois et retourne un objet d'erreurs
 * @param {Object} params - Paramètres à valider
 * @param {Object} currentState - État actuel du système (pour les validations croisées)
 * @returns {Object} - Objet contenant les erreurs de validation
 */
export const validateParams = (params, currentState = {}) => {
  const errors = {};
  
  // Validation des pourcentages
  const percentageFields = [
    { name: 'reductionDechet', label: 'Réduction des déchets' },
    { name: 'augmentationProduction', label: 'Augmentation de production' },
    { name: 'reductionEnergie', label: 'Réduction d\'énergie' },
    { name: 'reductionEau', label: 'Réduction de consommation d\'eau' },
    { name: 'ameliorationQualite', label: 'Amélioration de qualité' },
    { name: 'reductionEmpreinteCO2', label: 'Réduction des émissions CO2' },
    { name: 'reductionAccidents', label: 'Réduction des accidents' },
    { name: 'tauxRejets', label: 'Taux de rejets' },
    { name: 'tauxAmortissement', label: 'Taux d\'amortissement' },
    { name: 'perteProduction', label: 'Perte de production' },
    { name: 'reductionTempsArret', label: 'Réduction du temps d\'arrêt' },
    { name: 'reductionConsommationEau', label: 'Réduction de consommation d\'eau' },
    { name: 'reductionConsommationAirComprime', label: 'Réduction d\'air comprimé' },
    { name: 'reductionConsommationHydraulique', label: 'Réduction hydraulique' }
  ];
  
  // Vérification des pourcentages
  percentageFields.forEach(field => {
    if (params[field.name] !== undefined) {
      const error = validatePercentage(params[field.name], field.label);
      if (error) {
        errors[field.name] = error;
      }
    }
  });
  
  // Vérification des valeurs positives (coûts)
  const positiveFields = [
    { name: 'coutSysteme', label: 'Coût du système' },
    { name: 'coutInstallation', label: 'Coût d\'installation' },
    { name: 'coutIngenierie', label: 'Coût d\'ingénierie' },
    { name: 'coutFormation', label: 'Coût de formation' },
    { name: 'coutMaintenance', label: 'Coût de maintenance' },
    { name: 'coutEnergie', label: 'Coût d\'énergie' },
    { name: 'coutMainOeuvre', label: 'Coût de main d\'œuvre' },
    { name: 'coutDechet', label: 'Coût par déchet' },
    { name: 'coutEnergieTonne', label: 'Coût d\'énergie par tonne' },
    { name: 'coutEauTonne', label: 'Coût d\'eau par tonne' },
    { name: 'coutFormationContinue', label: 'Coût de formation continue' },
    { name: 'coutMisesAJour', label: 'Coût des mises à jour' },
    { name: 'coutConsommables', label: 'Coût des consommables' },
    { name: 'coutMoyenAccident', label: 'Coût moyen par accident' }
  ];
  
  positiveFields.forEach(field => {
    if (params[field.name] !== undefined) {
      const error = validatePositive(params[field.name], field.label);
      if (error) {
        errors[field.name] = error;
      }
    }
  });
  
  // Vérification des valeurs supérieures à zéro
  const greaterThanZeroFields = [
    { name: 'capacite', label: 'Capacité' },
    { name: 'capaciteTraitement', label: 'Capacité de traitement' },
    { name: 'dureeVie', label: 'Durée de vie' },
    { name: 'nombreEmployes', label: 'Nombre d\'employés' },
    { name: 'tempsCycle', label: 'Temps de cycle' }
  ];
  
  greaterThanZeroFields.forEach(field => {
    if (params[field.name] !== undefined) {
      const error = validateGreaterThanZero(params[field.name], field.label);
      if (error) {
        errors[field.name] = error;
      }
    }
  });
  
  // Validations croisées spécifiques
  if (params.nbEmployesRemplaces !== undefined && currentState.nombreEmployes !== undefined) {
    const error = validateEmployeeReplacement(params.nbEmployesRemplaces, currentState.nombreEmployes);
    if (error) {
      errors.nbEmployesRemplaces = error;
    }
  }
  
  return errors;
};

export default {
  validatePercentage,
  validatePositive,
  validateGreaterThanZero,
  validateEmployeeReplacement,
  validateParams
};
