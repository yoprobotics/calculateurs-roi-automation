import React from 'react';

/**
 * Composant pour afficher un résultat dans une carte
 * @param {object} props - Props du composant
 * @returns {JSX.Element} - Composant React
 */
const ResultCard = ({
  title,
  value,
  unit,
  description,
  color = 'blue',
  size = 'medium',
  icon,
  className = '',
  titleClassName = '',
  valueClassName = '',
  descriptionClassName = '',
  children
}) => {
  // Gestion des couleurs prédéfinies
  const colorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50',
    indigo: 'bg-indigo-50',
    gray: 'bg-gray-50'
  };
  
  const textColorClasses = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    red: 'text-red-800',
    yellow: 'text-yellow-800',
    purple: 'text-purple-800',
    indigo: 'text-indigo-800',
    gray: 'text-gray-800'
  };
  
  // Gestion des tailles prédéfinies
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };
  
  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };
  
  const bgColorClass = colorClasses[color] || 'bg-gray-50';
  const textColorClass = textColorClasses[color] || 'text-gray-800';
  const paddingClass = sizeClasses[size] || 'p-3';
  const textSizeClass = textSizeClasses[size] || 'text-2xl';
  
  return (
    <div className={`${bgColorClass} ${paddingClass} rounded ${className}`}>
      {title && (
        <h3 className={`text-sm font-medium text-gray-700 mb-1 ${titleClassName}`}>
          {title}
        </h3>
      )}
      
      <div className="flex items-center">
        {icon && (
          <div className="mr-2">
            {icon}
          </div>
        )}
        
        <p className={`${textSizeClass} font-bold ${textColorClass} ${valueClassName}`}>
          {value}
          {unit && <span className="ml-1 text-sm font-normal">{unit}</span>}
        </p>
      </div>
      
      {description && (
        <p className={`text-xs text-gray-600 mt-1 ${descriptionClassName}`}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

export default ResultCard;
