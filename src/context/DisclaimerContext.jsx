import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Création du context
const DisclaimerContext = createContext();

/**
 * Provider pour le context de gestion des disclaimers
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Provider du context
 */
export const DisclaimerProvider = ({ children }) => {
  // État pour le modal de disclaimer
  const [showModal, setShowModal] = useState(false);
  
  // État pour le bandeau de disclaimer
  const [showBanner, setShowBanner] = useState(true);
  
  // Stockage local pour suivre si l'utilisateur a accepté le disclaimer
  const [disclaimerAccepted, setDisclaimerAccepted] = useLocalStorage('disclaimerAccepted', false);

  // Vérifier si le disclaimer a été accepté lors du chargement
  useEffect(() => {
    if (!disclaimerAccepted) {
      setShowModal(true);
    }
  }, [disclaimerAccepted]);

  // Fonction pour accepter le disclaimer
  const acceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setShowModal(false);
  };

  // Fonction pour afficher le modal de disclaimer
  const showDisclaimer = () => {
    setShowModal(true);
  };

  // Fonction pour fermer le bandeau de disclaimer
  const closeBanner = () => {
    setShowBanner(false);
  };

  // Valeur fournie par le context
  const value = {
    showModal,
    showBanner,
    disclaimerAccepted,
    acceptDisclaimer,
    showDisclaimer,
    closeBanner
  };

  return (
    <DisclaimerContext.Provider value={value}>
      {children}
    </DisclaimerContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le context de disclaimer
 * @returns {Object} - Valeurs et fonctions du context
 */
export const useDisclaimer = () => {
  const context = useContext(DisclaimerContext);
  
  if (context === undefined) {
    throw new Error('useDisclaimer doit être utilisé à l\'intérieur d\'un DisclaimerProvider');
  }
  
  return context;
};

export default DisclaimerContext;
