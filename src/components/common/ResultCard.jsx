import React from 'react';

/**
 * Variantes de couleurs pour les cartes de résultats
 */
const VARIANTS = {
  success: 'bg-green-50 text-green-800',
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  purple: 'bg-purple-50 text-purple-800',
  indigo: 'bg-indigo-50 text-indigo-800',
  default: 'bg-gray-50 text-gray-800'
};

/**
 * Composant de carte pour afficher un résultat avec titre et valeur
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la carte
 * @param {string|number|JSX.Element} props.value - Valeur à afficher
 * @param {string} [props.variant='default'] - Variante de couleur (success, info, warning, danger, etc.)
 * @param {string} [props.description=''] - Description optionnelle sous la valeur
 * @returns {JSX.Element} - Carte de résultat
 */
export const ResultCard = ({ 
  title, 
  value, 
  variant = 'default',
  description = '' 
}) => {
  // Obtenir la classe CSS pour la variante
  const variantClass = VARIANTS[variant] || VARIANTS.default;

  return (
    <div className={`p-3 rounded ${variantClass}`}>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {description && (
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
};

export default ResultCard;