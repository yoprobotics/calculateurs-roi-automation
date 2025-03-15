/**
 * Validators.js - Fonctions de validation des données saisies par l'utilisateur
 */

/**
 * Vérifie si une valeur est un nombre positif
 * @param {any} valeur - Valeur à vérifier
 * @param {boolean} includeZero - Inclure zéro comme valeur valide (par défaut: true)
 * @returns {boolean} - True si la valeur est valide, sinon false
 */
export const estNombrePositif = (valeur, includeZero = true) => {
  const nombre = Number(valeur);
  return !isNaN(nombre) && (includeZero ? nombre >= 0 : nombre > 0);
};

/**
 * Vérifie si une valeur est un pourcentage valide (entre 0 et 100)
 * @param {any} valeur - Valeur à vérifier
 * @returns {boolean} - True si la valeur est un pourcentage valide, sinon false
 */
export const estPourcentageValide = (valeur) => {
  const nombre = Number(valeur);
  return !isNaN(nombre) && nombre >= 0 && nombre <= 100;
};

/**
 * Vérifie si une valeur est un taux d'intérêt valide (généralement entre 0 et 50%)
 * @param {any} valeur - Valeur à vérifier
 * @returns {boolean} - True si la valeur est un taux valide, sinon false
 */
export const estTauxValide = (valeur) => {
  const nombre = Number(valeur);
  return !isNaN(nombre) && nombre >= 0 && nombre <= 50;
};

/**
 * Vérifie si une valeur est un entier positif
 * @param {any} valeur - Valeur à vérifier
 * @param {boolean} includeZero - Inclure zéro comme valeur valide (par défaut: true)
 * @returns {boolean} - True si la valeur est un entier valide, sinon false
 */
export const estEntierPositif = (valeur, includeZero = true) => {
  const nombre = Number(valeur);
  return !isNaN(nombre) && Number.isInteger(nombre) && (includeZero ? nombre >= 0 : nombre > 0);
};

/**
 * Vérifie si une valeur est dans une plage donnée
 * @param {any} valeur - Valeur à vérifier
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {boolean} - True si la valeur est dans la plage, sinon false
 */
export const estDansPlage = (valeur, min, max) => {
  const nombre = Number(valeur);
  return !isNaN(nombre) && nombre >= min && nombre <= max;
};

/**
 * Vérifie si une chaîne est non vide
 * @param {string} valeur - Chaîne à vérifier
 * @returns {boolean} - True si la chaîne n'est pas vide, sinon false
 */
export const estChaineNonVide = (valeur) => {
  return typeof valeur === 'string' && valeur.trim() !== '';
};

/**
 * Classe d'erreurs de validation
 */
export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Valide un objet contenant des paramètres selon des règles spécifiées
 * @param {Object} parametres - Objet contenant les paramètres à valider
 * @param {Object} regles - Objet décrivant les règles de validation pour chaque paramètre
 * @returns {Object} - Objet contenant les erreurs éventuelles par nom de champ
 */
export const validerParametres = (parametres, regles) => {
  const erreurs = {};
  
  Object.keys(regles).forEach(nomChamp => {
    const valeur = parametres[nomChamp];
    const regle = regles[nomChamp];
    
    // Vérifier si le champ est requis et manquant
    if (regle.required && (valeur === undefined || valeur === null || valeur === '')) {
      erreurs[nomChamp] = regle.messageRequired || 'Ce champ est requis';
      return;
    }
    
    // Ignorer les validations si la valeur est vide et non requise
    if (valeur === undefined || valeur === null || valeur === '') {
      return;
    }
    
    // Exécuter la fonction de validation
    if (regle.validator && !regle.validator(valeur)) {
      erreurs[nomChamp] = regle.message || 'Valeur invalide';
    }
  });
  
  return erreurs;
};
