import React, { useState } from 'react';

/**
 * Composant d'infobulle réutilisable
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Infobulle
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  width = 'max-w-xs', 
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Fonction pour afficher l'infobulle après un délai
  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  // Fonction pour masquer l'infobulle et annuler le délai
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
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
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-20 ${positions[position]} ${width}`}>
          <div className="bg-gray-800 text-white text-sm rounded-md py-2 px-3 shadow-lg">
            {content}
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

export default Tooltip;
