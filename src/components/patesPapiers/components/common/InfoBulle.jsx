import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant d'info-bulle pour afficher des explications sur les paramètres
 * @param {Object} props - Propriétés du composant
 * @param {String} props.texte - Texte explicatif à afficher dans l'info-bulle
 * @param {String} props.position - Position de l'info-bulle (top, right, bottom, left)
 * @returns {JSX.Element} Info-bulle avec texte explicatif
 */
const InfoBulle = ({ texte, position = 'top' }) => {
  const [afficher, setAfficher] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Fonction pour afficher l'infobulle après un délai
  const showTooltip = () => {
    const id = setTimeout(() => {
      setAfficher(true);
    }, 300);
    setTimeoutId(id);
  };

  // Fonction pour masquer l'infobulle et annuler le délai
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setAfficher(false);
  };

  // Positions possibles de l'infobulle
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  // Position des flèches
  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div 
      className="inline-block relative" 
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <button
        type="button"
        aria-label="Plus d'informations"
        className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs hover:bg-blue-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {afficher && (
        <div className={`absolute z-20 ${positions[position]} max-w-xs`}>
          <div className="bg-gray-800 text-white text-sm rounded-md py-2 px-3 shadow-lg">
            {texte}
            <div 
              className={`absolute border-4 border-gray-800 ${arrows[position]}`}
              style={{ width: '0', height: '0' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

InfoBulle.propTypes = {
  texte: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
};

export default InfoBulle;