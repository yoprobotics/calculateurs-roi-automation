import React from 'react';
import Tooltip from './Tooltip';

/**
 * Composant de carte de résultat réutilisable
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Carte de résultat
 */
const ResultCard = ({ 
  title, 
  value, 
  unit = '', 
  description, 
  tooltip, 
  color = 'blue', 
  size = 'medium',
  icon,
  trend,
  className = '',
  onClick
}) => {
  // Couleurs disponibles
  const colors = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    gray: 'bg-gray-50 text-gray-800 border-gray-200'
  };

  // Tailles disponibles
  const sizes = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  // Tailles de texte pour le titre et la valeur
  const titleSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const valueSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  // Flèches pour les tendances
  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414 9.414 13H12z" clipRule="evenodd" />
      </svg>
    ),
    neutral: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div 
      className={`rounded-lg border ${colors[color]} ${sizes[size]} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <h3 className={`font-medium ${titleSizes[size]}`}>{title}</h3>
          {tooltip && (
            <Tooltip content={tooltip} position="top">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gray-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Tooltip>
          )}
        </div>
        {icon && (
          <div className="text-gray-500">{icon}</div>
        )}
      </div>
      
      <div className="flex items-center mt-1">
        <p className={`font-bold ${valueSizes[size]}`}>
          {value} {unit && <span className="text-sm font-normal">{unit}</span>}
        </p>
        {trend && (
          <span className="ml-2">{trendIcons[trend]}</span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
};

export default ResultCard;
