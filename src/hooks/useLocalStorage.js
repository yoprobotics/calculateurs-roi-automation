import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le stockage local avec état React
 * @param {string} key - Clé pour le stockage local
 * @param {any} initialValue - Valeur initiale si rien n'est trouvé en stockage
 * @returns {Array} - [storedValue, setValue] - Valeur stockée et fonction pour la mettre à jour
 */
const useLocalStorage = (key, initialValue) => {
  // Fonction d'état qui lit la valeur depuis localStorage ou utilise initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Récupérer la valeur depuis localStorage
      const item = window.localStorage.getItem(key);
      // Analyser la chaîne JSON stockée ou renvoyer initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de "${key}" depuis localStorage:`, error);
      return initialValue;
    }
  });
  
  // Fonction pour mettre à jour la valeur dans localStorage et l'état React
  const setValue = (value) => {
    try {
      // Permet de passer une fonction comme pour setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mettre à jour l'état React
      setStoredValue(valueToStore);
      
      // Mettre à jour localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de l'écriture de "${key}" dans localStorage:`, error);
    }
  };
  
  // Écouter les changements de localStorage dans d'autres onglets/fenêtres
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Erreur lors de l'analyse de "${key}" depuis localStorage:`, error);
        }
      }
    };
    
    // Ajouter l'écouteur d'événement
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    // Nettoyer l'écouteur d'événement
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [key]);
  
  return [storedValue, setValue];
};

export default useLocalStorage;
