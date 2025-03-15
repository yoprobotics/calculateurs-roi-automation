import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour stocker et récupérer des valeurs dans le localStorage
 * @param {string} key - Clé pour le stockage
 * @param {any} initialValue - Valeur initiale si la clé n'existe pas
 * @returns {[any, Function]} - Valeur actuelle et fonction pour la mettre à jour
 */
const useLocalStorage = (key, initialValue) => {
  // Fonction pour récupérer la valeur du localStorage
  const getStoredValue = () => {
    try {
      // Obtenir la valeur du localStorage
      const item = window.localStorage.getItem(key);
      // Parser la valeur JSON ou retourner la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key} dans localStorage:`, error);
      return initialValue;
    }
  };

  // Initialiser l'état avec la valeur du localStorage
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Fonction pour mettre à jour la valeur dans le state et le localStorage
  const setValue = value => {
    try {
      // Vérifier si la valeur est une fonction pour supporter la mise à jour basée sur la valeur précédente
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Mettre à jour le state
      setStoredValue(valueToStore);
      // Mettre à jour le localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur lors de l'écriture dans localStorage:`, error);
    }
  };

  // Surveiller les changements de clé et mettre à jour l'état
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
