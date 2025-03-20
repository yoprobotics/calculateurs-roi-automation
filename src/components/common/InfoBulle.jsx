import React, { useState, useRef, useEffect } from 'react';

/**
 * Composant d'info-bulle réutilisable pour afficher des explications détaillées
 * @param {Object} props - Propriétés du composant
 * @param {string} props.texte - Contenu de l'info-bulle
 * @param {string} props.titre - Titre optionnel de l'info-bulle
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.position - Position de l'info-bulle (top, right, bottom, left)
 * @param {string} props.taille - Taille de l'info-bulle (small, medium, large)
 * @returns {JSX.Element} Composant d'info-bulle
 */
const InfoBulle = ({ 
  texte, 
  titre, 
  className = '',
  position = 'top',
  taille = 'medium'
}) => {
  const [estOuverte, setEstOuverte] = useState(false);
  const infoBulleRef = useRef(null);
  
  // Définir les classes CSS en fonction de la position
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };
  
  // Définir les classes CSS en fonction de la taille
  const tailleClasses = {
    small: 'w-48',
    medium: 'w-64',
    large: 'w-80'
  };
  
  // Définir les classes de flèche en fonction de la position
  const flecheClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-800',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-800',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-800'
  };
  
  // Fermer l'info-bulle lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoBulleRef.current && !infoBulleRef.current.contains(event.target)) {
        setEstOuverte(false);
      }
    };
    
    if (estOuverte) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [estOuverte]);
  
  return (
    <div className={`relative inline-block ${className}`} ref={infoBulleRef}>
      {/* Icône d'information */}
      <button
        type="button"
        onClick={() => setEstOuverte(!estOuverte)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Plus d'informations"
      >
        i
      </button>
      
      {/* Contenu de l'info-bulle */}
      {estOuverte && (
        <div
          className={`absolute z-10 ${positionClasses[position]} ${tailleClasses[taille]} max-w-xs p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg`}
        >
          {/* Flèche de l'info-bulle */}
          <div className={`absolute w-0 h-0 ${flecheClasses[position]}`}></div>
          
          {/* Titre optionnel */}
          {titre && (
            <div className="font-bold mb-1 border-b border-gray-700 pb-1">{titre}</div>
          )}
          
          {/* Contenu */}
          <div className="text-gray-200">{texte}</div>
        </div>
      )}
    </div>
  );
};

export default InfoBulle;