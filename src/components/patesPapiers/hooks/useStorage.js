import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le stockage local des données du calculateur
 * @param {string} key - Clé pour le stockage local
 * @param {any} initialValue - Valeur initiale à utiliser si rien n'est stocké
 * @returns {Array} [value, setValue, resetValue] - Valeur stockée, fonction pour la modifier, fonction pour la réinitialiser
 */
const useStorage = (key, initialValue) => {
  // État pour stocker la valeur actuelle
  const [value, setValue] = useState(() => {
    try {
      // Récupération des données du stockage local
      const item = window.localStorage.getItem(key);
      // Analyse du JSON si l'élément existe, sinon utilisation de la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} depuis le stockage local:`, error);
      return initialValue;
    }
  });
  
  // Mise à jour du stockage local lorsque la valeur change
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key} dans le stockage local:`, error);
    }
  }, [key, value]);
  
  // Fonction pour réinitialiser la valeur à sa valeur initiale
  const resetValue = () => {
    setValue(initialValue);
  };
  
  return [value, setValue, resetValue];
};

/**
 * Efface toutes les données stockées localement pour le calculateur
 */
export const clearCalculatorStorage = () => {
  try {
    localStorage.removeItem('patesPapiers_typeSystemeActuel');
    localStorage.removeItem('patesPapiers_parametresSystemeActuel');
    localStorage.removeItem('patesPapiers_parametresSystemeAutomatise');
    localStorage.removeItem('patesPapiers_parametresGeneraux');
    localStorage.removeItem('patesPapiers_ui');
  } catch (error) {
    console.error('Erreur lors de la suppression des données du stockage local:', error);
  }
};

export default useStorage;
