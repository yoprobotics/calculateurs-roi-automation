import React from 'react';

/**
 * Composant de carte pour contenir des graphiques avec un titre
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre du graphique
 * @param {React.ReactNode} props.children - Contenu du graphique (généralement un composant Recharts)
 * @param {number} [props.height=300] - Hauteur du conteneur
 * @param {string} [props.className=''] - Classes CSS supplémentaires
 * @returns {JSX.Element} - Graphique encadré
 */
const GraphCard = ({ title, children, height = 300, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">{title}</h3>
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
};

export default GraphCard;