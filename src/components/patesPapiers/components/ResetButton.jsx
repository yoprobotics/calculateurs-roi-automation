import React, { useState } from 'react';
import { clearCalculatorStorage } from '../hooks/useStorage';

/**
 * Composant pour réinitialiser le calculateur
 * @returns {JSX.Element} Bouton de réinitialisation
 */
const ResetButton = () => {
  // État pour gérer l'affichage de la confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  /**
   * Affiche la demande de confirmation
   */
  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };
  
  /**
   * Réinitialise le calculateur
   */
  const handleReset = () => {
    // Effacement des données du stockage local
    clearCalculatorStorage();
    
    // Rechargement de la page pour réinitialiser l'application
    window.location.reload();
    
    // Fermeture de la confirmation
    setShowConfirmation(false);
  };
  
  /**
   * Annule la réinitialisation
   */
  const handleCancel = () => {
    setShowConfirmation(false);
  };
  
  return (
    <div className="mt-4 print:hidden">
      {showConfirmation ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Réinitialiser tous les paramètres ?</span>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Oui
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
          >
            Non
          </button>
        </div>
      ) : (
        <button
          onClick={handleShowConfirmation}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Réinitialiser le calculateur
        </button>
      )}
    </div>
  );
};

export default ResetButton;