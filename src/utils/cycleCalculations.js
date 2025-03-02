/**
 * Convertit un temps de cycle (secondes par unité) en capacité horaire (unités/heure)
 * Formule : Capacité horaire = 3600 / temps de cycle
 * 
 * @param {number} tempsEnSecondes - Temps de cycle en secondes par unité
 * @returns {number} Capacité horaire en unités par heure
 */
export const tempsVersCacacite = (tempsEnSecondes) => {
  return 3600 / tempsEnSecondes;
};

/**
 * Convertit une capacité horaire (unités/heure) en temps de cycle (secondes par unité)
 * Formule : Temps de cycle = 3600 / capacité horaire
 * 
 * @param {number} capaciteParHeure - Capacité horaire en unités par heure
 * @returns {number} Temps de cycle en secondes par unité
 */
export const capaciteVersTemps = (capaciteParHeure) => {
  return 3600 / capaciteParHeure;
};