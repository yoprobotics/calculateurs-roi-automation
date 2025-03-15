import { useState, useEffect } from 'react';
import {
  SYSTEME_MANUEL,
  SYSTEME_SEMI_AUTO,
  SYSTEME_AUTO_ANCIEN,
  SYSTEME_AUTOMATISE_DEFAUT,
  PARAMETRES_GENERAUX_DEFAUT,
  UI_DEFAUT
} from '../constants';

/**
 * Hook personnalisé pour gérer les paramètres du calculateur
 * @returns {Object} États et fonctions pour gérer les paramètres
 */
const useParametres = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États regroupés par catégorie pour réduire le nombre de useState
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    ...SYSTEME_MANUEL
  });
  
  // États pour les données d'entrée - Paramètres spécifiques
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    ...SYSTEME_AUTOMATISE_DEFAUT
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    ...PARAMETRES_GENERAUX_DEFAUT
  });
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    ...UI_DEFAUT
  });
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        ...SYSTEME_MANUEL
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        ...SYSTEME_SEMI_AUTO
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        ...SYSTEME_AUTO_ANCIEN
      });
    }
  }, [typeSystemeActuel]);
  
  return {
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    ui,
    setTypeSystemeActuel,
    setParametresSystemeActuel,
    setParametresSystemeAutomatise,
    setParametresGeneraux,
    setUi
  };
};

export default useParametres;