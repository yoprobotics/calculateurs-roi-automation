import React from 'react';

/**
 * Composant de navigation par onglets
 * @param {string} activeTab - Onglet actif
 * @param {Function} onTabChange - Fonction de changement d'onglet
 */
const NavigationTabs = ({ activeTab, onTabChange }) => {
  // Liste des onglets disponibles
  const tabs = [
    { id: 'general', label: 'Vue générale' },
    { id: 'comparatif', label: 'Analyse comparative' },
    { id: 'financier', label: 'Détails financiers' },
    { id: 'securite', label: 'Sécurité & Environnement' }
  ];
  
  return (
    <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === tab.id
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;
