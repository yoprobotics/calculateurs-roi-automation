import React from 'react';

/**
 * Calculateur spécifique pour l'industrie des pâtes et papiers
 * (Version temporaire - sera remplacée par une version complète)
 * 
 * @returns {JSX.Element} - Calculateur des pâtes et papiers
 */
const CalculateurPatesPapiers = () => {
  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Calculateur ROI pour Désempilement et Débrochage de Ballots</h2>
      
      <div className="p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        
        <h3 className="text-xl font-semibold text-green-700 mb-4">Version en cours de migration</h3>
        <p className="text-lg text-gray-700 mb-6">
          Le calculateur spécifique pour l'industrie des pâtes et papiers est en cours de migration 
          vers la nouvelle architecture.
        </p>
        <p className="text-gray-600">
          Ce calculateur sera bientôt disponible avec une interface améliorée et de nouvelles fonctionnalités.
          Merci de votre compréhension.
        </p>
      </div>
    </div>
  );
};

export default CalculateurPatesPapiers;
