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

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };

  const positionFleche = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800'
  };

  return (
    <div 
      className="inline-block relative" 
      onMouseEnter={() => setAfficher(true)}
      onMouseLeave={() => setAfficher(false)}
    >
      <button
        type="button"
        aria-label="Plus d'informations"
        className="w-4 h-4 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs hover:bg-gray-300 focus:outline-none"
      >
        ?
      </button>
      
      {afficher && (
        <div className={`absolute z-10 ${positionClasses[position]} w-64 bg-gray-800 text-white text-xs rounded py-2 px-3 shadow-lg`}>
          <div className={`absolute w-0 h-0 border-4 border-transparent ${positionFleche[position]}`}></div>
          {texte}
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