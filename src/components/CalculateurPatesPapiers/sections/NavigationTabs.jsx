import React from 'react';

/**
 * Navigation par onglets pour le calculateur pâtes et papiers
 * @param {string} activeTab - Onglet actif
 * @param {Function} onTabChange - Fonction de changement d'onglet
 */
const NavigationTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
      <button
        onClick={() => onTabChange('general')}
        className={`px-4 py-3 font-medium transition-all ${
          activeTab === 'general'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Vue générale
      </button>
      <button
        onClick={() => onTabChange('comparatif')}
        className={`px-4 py-3 font-medium transition-all ${
          activeTab === 'comparatif'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Analyse comparative
      </button>
      <button
        onClick={() => onTabChange('financier')}
        className={`px-4 py-3 font-medium transition-all ${
          activeTab === 'financier'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Détails financiers
      </button>
      <button
        onClick={() => onTabChange('securite')}
        className={`px-4 py-3 font-medium transition-all ${
          activeTab === 'securite'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Sécurité & Environnement
      </button>
    </div>
  );
};

export default NavigationTabs;
