import React from 'react';

/**
 * Composant de navigation par onglets
 * @param {Object} props - Propriétés du composant
 * @param {string} props.ongletActif - Onglet actuellement actif
 * @param {Function} props.changerOnglet - Fonction pour changer d'onglet
 * @returns {JSX.Element} Barre de navigation par onglets
 */
const Navigation = ({ ongletActif, changerOnglet }) => {
  return (
    <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
      <button
        onClick={() => changerOnglet('general')}
        className={`px-4 py-3 font-medium transition-all ${
          ongletActif === 'general'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Vue générale
      </button>
      <button
        onClick={() => changerOnglet('comparatif')}
        className={`px-4 py-3 font-medium transition-all ${
          ongletActif === 'comparatif'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Analyse comparative
      </button>
      <button
        onClick={() => changerOnglet('financier')}
        className={`px-4 py-3 font-medium transition-all ${
          ongletActif === 'financier'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Détails financiers
      </button>
      <button
        onClick={() => changerOnglet('securite')}
        className={`px-4 py-3 font-medium transition-all ${
          ongletActif === 'securite'
            ? 'text-green-700 border-b-2 border-green-500'
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        Sécurité & Environnement
      </button>
    </div>
  );
};

export default Navigation;