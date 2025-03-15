/**
 * Formatters.js - Fonctions de formatage pour l'affichage des données
 */

/**
 * Formate un nombre en devise (€, $, etc.)
 * @param {number} valeur - Nombre à formater
 * @param {string} devise - Code de devise (par défaut: 'USD')
 * @param {number} decimales - Nombre de décimales (par défaut: 0)
 * @returns {string} - Chaîne formatée
 */
export const formaterDevise = (valeur, devise = 'USD', decimales = 0) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: devise, 
    maximumFractionDigits: decimales 
  }).format(valeur);
};

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param {number} valeur - Nombre à formater
 * @param {number} decimales - Nombre de décimales (par défaut: 0)
 * @returns {string} - Chaîne formatée
 */
export const formaterNombre = (valeur, decimales = 0) => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: decimales 
  }).format(valeur);
};

/**
 * Formate un pourcentage
 * @param {number} valeur - Pourcentage à formater
 * @param {number} decimales - Nombre de décimales (par défaut: 2)
 * @returns {string} - Chaîne formatée
 */
export const formaterPourcentage = (valeur, decimales = 2) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'percent',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales 
  }).format(valeur / 100);
};

/**
 * Formate une durée en années/mois
 * @param {number} annees - Nombre d'années
 * @returns {string} - Chaîne formatée
 */
export const formaterDuree = (annees) => {
  const anneesEntieres = Math.floor(annees);
  const mois = Math.round((annees - anneesEntieres) * 12);
  
  if (anneesEntieres === 0) {
    return `${mois} mois`;
  } else if (mois === 0) {
    return `${anneesEntieres} an${anneesEntieres > 1 ? 's' : ''}`;
  } else {
    return `${anneesEntieres} an${anneesEntieres > 1 ? 's' : ''} et ${mois} mois`;
  }
};

/**
 * Formate une valeur en gain ou perte avec signe + ou -
 * @param {number} valeur - Valeur à formater
 * @param {string} devise - Code de devise (par défaut: 'USD')
 * @returns {string} - Chaîne formatée
 */
export const formaterGainPerte = (valeur, devise = 'USD') => {
  const signe = valeur >= 0 ? '+' : '';
  return `${signe}${formaterDevise(valeur, devise)}`;
};

/**
 * Formate une variation en pourcentage avec signe + ou -
 * @param {number} valeur - Pourcentage à formater
 * @returns {string} - Chaîne formatée
 */
export const formaterVariation = (valeur) => {
  const signe = valeur >= 0 ? '+' : '';
  return `${signe}${valeur.toFixed(2)}%`;
};
