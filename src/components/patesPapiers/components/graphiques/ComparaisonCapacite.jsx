import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Graphique de comparaison des capacités
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.data - Données pour le graphique
 * @returns {JSX.Element} Graphique de comparaison
 */
const ComparaisonCapacite = ({ data }) => {
  return (
    <div className="h-80">
      <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de traitement (ballots/heure)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip formatter={(value) => [`${value} ballots/h`, 'Capacité']} />
          <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparaisonCapacite;