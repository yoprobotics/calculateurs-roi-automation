import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Graphique des économies par catégorie
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.data - Données pour le graphique
 * @returns {JSX.Element} Graphique des économies
 */
const EconomiesGraphique = ({ data }) => {
  return (
    <div className="h-80">
      <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Économie']} />
          <Bar dataKey="value" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EconomiesGraphique;