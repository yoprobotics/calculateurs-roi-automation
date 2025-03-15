import React from 'react';
import { ResponsiveContainer } from 'recharts';
import Tooltip from './Tooltip';

/**
 * Composant de carte de graphique réutilisable
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Carte de graphique
 */
const GraphCard = ({
  title,
  tooltip,
  legend,
  children, // Composant Recharts (BarChart, LineChart, etc.) à afficher
  height = 300,
  color = 'white',
  className = '',
  actionButton = null,
  note = null
}) => {
  // Couleurs de fond disponibles
  const colors = {
    white: 'bg-white',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    gray: 'bg-gray-50'
  };

  return (
    <div className={`rounded-lg shadow ${colors[color]} ${className}`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{title}</h3>
            
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
          
          {actionButton}
        </div>
      </div>
      
      <div className="p-4">
        {/* Légende du graphique */}
        {legend && (
          <div className="flex flex-wrap justify-end mb-2 space-x-4">
            {legend.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Conteneur du graphique */}
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
        
        {/* Note en bas du graphique */}
        {note && (
          <p className="text-xs text-gray-500 mt-2 italic">{note}</p>
        )}
      </div>
    </div>
  );
};

export default GraphCard;
