import React, { useState } from 'react';
import PopupFormules from './common/PopupFormules';

/**
 * Bouton pour afficher les formules utilisées dans le calculateur
 * @returns {JSX.Element} Bouton et popup de formules
 */
const BoutonFormules = () => {
  const [afficherFormules, setAfficherFormules] = useState(false);

  const ouvrirPopupFormules = () => {
    setAfficherFormules(true);
  };

  const fermerPopupFormules = () => {
    setAfficherFormules(false);
  };

  return (
    <>
      <button
        onClick={ouvrirPopupFormules}
        className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors print:hidden"
        aria-label="Afficher les formules utilisées"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 11a1 1 0 112 0v.5a1 1 0 01-2 0V13zm1-8.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V5a.5.5 0 01.5-.5z" clipRule="evenodd" />
        </svg>
        Voir les formules utilisées
      </button>
      
      <PopupFormules visible={afficherFormules} onClose={fermerPopupFormules} />
    </>
  );
};

export default BoutonFormules;