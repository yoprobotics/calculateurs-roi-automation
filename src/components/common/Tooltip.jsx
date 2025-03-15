import React, { useState } from 'react';

/**
 * Composant d'infobulle pour afficher de l'aide ou des informations supplémentaires
 * @param {Object} props - Propriétés du composant
 * @param {string|JSX.Element} props.content - Contenu de l'infobulle
 * @param {string} [props.position='top'] - Position de l'infobulle (top, bottom, left, right)
 * @returns {JSX.Element} - Composant d'infobulle
 */
const Tooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Déterminer la classe de position
  const getPositionClass = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-1';
      case 'left':
        return 'right-full mr-1';
      case 'right':
        return 'left-full ml-1';
      case 'top':
      default:
        return 'bottom-full mb-1';
    }
  };

  return (
    <div className="relative inline-block ml-1">
      {/* Icône d'information */}
      <span
        className="text-gray-400 hover:text-gray-600 cursor-help transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
      
      {/* Contenu de l'infobulle */}
      {isVisible && (
        <div 
          className={`absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 ${getPositionClass()}`}
          style={{ whiteSpace: 'normal' }}
        >
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;