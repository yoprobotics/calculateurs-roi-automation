/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valide qu'une valeur est un nombre
 * @param {*} value - Valeur à valider
 * @returns {boolean} - true si la valeur est un nombre
 */
export const isNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return !isNaN(Number(value));
};

/**
 * Valide qu'une valeur est un nombre positif
 * @param {*} value - Valeur à valider
 * @param {boolean} allowZero - Autoriser zéro (défaut: true)
 * @returns {boolean} - true si la valeur est un nombre positif
 */
export const isPositiveNumber = (value, allowZero = true) => {
  if (!isNumber(value)) {
    return false;
  }
  const num = Number(value);
  return allowZero ? num >= 0 : num > 0;
};

/**
 * Valide qu'une valeur est un pourcentage valide (entre 0 et 100)
 * @param {*} value - Valeur à valider
 * @returns {boolean} - true si la valeur est un pourcentage valide
 */
export const isValidPercentage = (value) => {
  if (!isNumber(value)) {
    return false;
  }
  const num = Number(value);
  return num >= 0 && num <= 100;
};

/**
 * Valide qu'une valeur est un entier
 * @param {*} value - Valeur à valider
 * @returns {boolean} - true si la valeur est un entier
 */
export const isInteger = (value) => {
  if (!isNumber(value)) {
    return false;
  }
  const num = Number(value);
  return Number.isInteger(num);
};

/**
 * Valide qu'une valeur est dans une plage donnée
 * @param {*} value - Valeur à valider
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {boolean} - true si la valeur est dans la plage
 */
export const isInRange = (value, min, max) => {
  if (!isNumber(value)) {
    return false;
  }
  const num = Number(value);
  return num >= min && num <= max;
};

/**
 * Génère un message d'erreur pour une validation numérique
 * @param {string} fieldName - Nom du champ
 * @param {object} constraints - Contraintes (min, max, allowZero, etc.)
 * @returns {string} - Message d'erreur
 */
export const getNumberErrorMessage = (fieldName, constraints = {}) => {
  const { min, max, allowZero = true, isPercentage = false } = constraints;
  
  let message = `Le champ ${fieldName} doit être un nombre`;
  
  if (min !== undefined && max !== undefined) {
    message += ` entre ${min} et ${max}`;
  } else if (min !== undefined) {
    if (allowZero && min === 0) {
      message += ` positif`;
    } else {
      message += ` supérieur à ${min}`;
    }
  } else if (max !== undefined) {
    message += ` inférieur à ${max}`;
  } else if (!allowZero) {
    message += ` strictement positif`;
  }
  
  if (isPercentage) {
    message += ` (pourcentage entre 0 et 100)`;
  }
  
  return message;
};

/**
 * Validation complète pour les champs numériques du calculateur
 * @param {*} value - Valeur à valider
 * @param {object} options - Options de validation
 * @returns {object} - { isValid, errorMessage }
 */
export const validateNumericField = (value, options = {}) => {
  const {
    required = true,
    allowZero = true,
    min,
    max,
    isPercentage = false,
    fieldName = 'Ce champ',
    integerOnly = false
  } = options;
  
  // Vérification si vide et requis
  if ((value === null || value === undefined || value === '') && required) {
    return {
      isValid: false,
      errorMessage: `${fieldName} est requis`
    };
  }
  
  // Si vide mais pas requis, c'est valide
  if (value === null || value === undefined || value === '') {
    return {
      isValid: true,
      errorMessage: ''
    };
  }
  
  // Vérification que c'est un nombre
  if (!isNumber(value)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être un nombre valide`
    };
  }
  
  const num = Number(value);
  
  // Vérification entier si nécessaire
  if (integerOnly && !Number.isInteger(num)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être un nombre entier`
    };
  }
  
  // Vérification positif si nécessaire
  if (!allowZero && num <= 0) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être strictement positif`
    };
  } else if (allowZero && num < 0) {
    return {
      isValid: false,
      errorMessage: `${fieldName} ne peut pas être négatif`
    };
  }
  
  // Vérification des bornes
  if (min !== undefined && num < min) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être supérieur ou égal à ${min}`
    };
  }
  
  if (max !== undefined && num > max) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être inférieur ou égal à ${max}`
    };
  }
  
  // Vérification pourcentage
  if (isPercentage && (num < 0 || num > 100)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être un pourcentage entre 0 et 100`
    };
  }
  
  return {
    isValid: true,
    errorMessage: ''
  };
};
