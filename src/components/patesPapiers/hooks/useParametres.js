import { useEffect } from 'react';
import {
  SYSTEME_MANUEL,
  SYSTEME_SEMI_AUTO,
  SYSTEME_AUTO_ANCIEN,
  SYSTEME_AUTOMATISE_DEFAUT,
  PARAMETRES_GENERAUX_DEFAUT,
  UI_DEFAUT
} from '../constants';
import useStorage from './useStorage';

/**
 * Hook personnalisé pour gérer les paramètres du calculateur avec stockage local
 * @returns {Object} États et fonctions pour gérer les paramètres
 */
const useParametres = () => {
  // État pour le type de système actuel avec stockage local
  const [typeSystemeActuel, setTypeSystemeActuel] = useStorage(
    'patesPapiers_typeSystemeActuel',
    'manuel'
  );
  
  // États regroupés par catégorie pour réduire le nombre de useState
  const [parametresSystemeActuel, setParametresSystemeActuel] = useStorage(
    'patesPapiers_parametresSystemeActuel',
    { ...SYSTEME_MANUEL }
  );
  
  // États pour les données d'entrée - Paramètres spécifiques
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useStorage(
    'patesPapiers_parametresSystemeAutomatise',
    { ...SYSTEME_AUTOMATISE_DEFAUT }
  );
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useStorage(
    'patesPapiers_parametresGeneraux',
    { ...PARAMETRES_GENERAUX_DEFAUT }
  );
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useStorage(
    'patesPapiers_ui',
    { ...UI_DEFAUT }
  );
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel(prev => ({
        ...prev,
        ...SYSTEME_MANUEL
      }));
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel(prev => ({
        ...prev,
        ...SYSTEME_SEMI_AUTO
      }));
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel(prev => ({
        ...prev,
        ...SYSTEME_AUTO_ANCIEN
      }));
    }
  }, [typeSystemeActuel, setParametresSystemeActuel]);
  
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