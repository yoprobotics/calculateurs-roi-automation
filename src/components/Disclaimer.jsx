import React, { useState } from 'react';

// Composant pour afficher un avertissement sur l'utilisation des calculateurs
const Disclaimer = ({ variant = 'info' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    alert: 'bg-red-50 border-red-200'
  };

  const textColors = {
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    alert: 'text-red-800'
  };

  return (
    <div className={`${bgColors[variant]} border p-4 rounded-lg mb-6 relative`}>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <h3 className={`font-bold ${textColors[variant]} mb-2 flex items-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Avis important
      </h3>
      <p className="text-gray-700">
        Les résultats fournis par ce calculateur sont <strong>uniquement à titre indicatif</strong> et ne constituent pas une garantie de performance réelle. 
        Une analyse approfondie par des professionnels qualifiés est nécessaire avant toute prise de décision d'investissement.
      </p>
    </div>
  );
};

export default Disclaimer;