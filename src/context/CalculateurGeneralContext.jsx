import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useCalculROI from '../hooks/useCalculROI';
import { 
  PARAMETRES_DEFAUT_SYSTEME_ACTUEL, 
  PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE,
  PARAMETRES_GENERAUX_DEFAUT,
  TYPES_SYSTEME
} from '../utils/constants';

// Création du context
const CalculateurGeneralContext = createContext();

/**
 * Provider pour le context du calculateur général
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Provider du context
 */
export const CalculateurGeneralProvider = ({ children }) => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState(TYPES_SYSTEME.MANUEL);

  // État pour les paramètres du système actuel
  const [systemeActuel, setSystemeActuel] = useState(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[TYPES_SYSTEME.MANUEL]);

  // État pour les paramètres du système automatisé
  const [systemeAutomatise, setSystemeAutomatise] = useState(PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE);

  // État pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState(PARAMETRES_GENERAUX_DEFAUT);

  // État pour l'interface utilisateur - simplifié pour une vue unique
  const [ui, setUi] = useState({
    afficherDetails: false
  });

  // Calcul des résultats avec le hook personnalisé
  const resultats = useCalculROI(systemeActuel, systemeAutomatise, parametresGeneraux);

  // Mise à jour des paramètres du système actuel lorsque le type change
  useEffect(() => {
    setSystemeActuel(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[typeSystemeActuel]);
  }, [typeSystemeActuel]);

  // Fonction pour basculer l'affichage des détails
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };

  // Valeur fournie par le context
  const value = {
    typeSystemeActuel,
    setTypeSystemeActuel,
    systemeActuel,
    setSystemeActuel,
    systemeAutomatise,
    setSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    ui,
    setUi,
    toggleDetails,
    resultats
  };

  return (
    <CalculateurGeneralContext.Provider value={value}>
      {children}
    </CalculateurGeneralContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le context du calculateur général
 * @returns {Object} - Valeurs et fonctions du context
 */
export const useCalculateurGeneral = () => {
  const context = useContext(CalculateurGeneralContext);
  
  if (context === undefined) {
    throw new Error('useCalculateurGeneral doit être utilisé à l\'intérieur d\'un CalculateurGeneralProvider');
  }
  
  return context;
};

export default CalculateurGeneralContext;