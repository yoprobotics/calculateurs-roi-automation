import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Graphique des flux de trésorerie
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.data - Données pour le graphique
 * @returns {JSX.Element} Graphique des flux de trésorerie
 */
const FluxTresorerieGraphique = ({ data }) => {
  return (
    <div className="h-80">
      <h3 className="font-medium text-gray-700 mb-3">Projection des flux de trésorerie</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="annee" />
          <YAxis />
          <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Montant']} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cumulatif" 
            name="Flux cumulatif" 
            stroke="#22c55e" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="seuil" 
            name="Seuil d'investissement" 
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5" 
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2 italic">
        * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
      </p>
    </div>
  );
};

export default FluxTresorerieGraphique;