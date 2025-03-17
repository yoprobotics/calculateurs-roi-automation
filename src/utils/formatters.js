/**
 * Utilitaires de formatage pour l'affichage uniforme des nombres, devises et pourcentages
 */

/**
 * Formate un nombre avec séparateur de milliers et décimales
 * @param {number} value - Nombre à formater
 * @param {number} decimalPlaces - Nombre de décimales (défaut: 2)
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} - Nombre formaté
 */
export const formatNumber = (value, decimalPlaces = 2, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
};

/**
 * Formate un montant en devise
 * @param {number} value - Montant à formater
 * @param {string} currency - Code de la devise (défaut: 'USD')
 * @param {number} decimalPlaces - Nombre de décimales (défaut: 0)
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} - Montant formaté
 */
export const formatCurrency = (value, currency = 'USD', decimalPlaces = 0, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
};

/**
 * Formate un pourcentage
 * @param {number} value - Pourcentage à formater (ex: 15.5 pour 15.5%)
 * @param {number} decimalPlaces - Nombre de décimales (défaut: 2)
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} - Pourcentage formaté
 */
export const formatPercent = (value, decimalPlaces = 2, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value / 100);
};

/**
 * Formate un nombre en format compact (ex: 1.2k, 1.5M)
 * @param {number} value - Nombre à formater
 * @param {number} decimalPlaces - Nombre de décimales (défaut: 1)
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} - Nombre formaté en notation compacte
 */
export const formatCompact = (value, decimalPlaces = 1, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
};

/**
 * Formate une différence (utile pour les comparaisons avant/après)
 * @param {number} value - Valeur de la différence
 * @param {boolean} showPositive - Afficher le signe + pour les valeurs positives (défaut: true)
 * @param {number} decimalPlaces - Nombre de décimales (défaut: 1)
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} - Différence formatée
 */
export const formatDifference = (value, showPositive = true, decimalPlaces = 1, locale = 'fr-FR') => {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    signDisplay: showPositive ? 'always' : 'auto'
  });
  
  return formatter.format(value);
};
