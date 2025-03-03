import React, { useState } from 'react';

/**
 * Composant d'avertissement pour notifier les utilisateurs des limites des calculateurs
 */
const Disclaimer = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div className="flex">
          <svg className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Avis important</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p className="mb-1">
                Les résultats de nos calculateurs sont fournis à titre indicatif uniquement et ne constituent 
                pas une garantie de performance réelle de vos projets d'automatisation.
              </p>
              <p>
                Une analyse détaillée par des professionnels qualifiés est toujours recommandée avant de prendre 
                des décisions d'investissement.
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-yellow-500 hover:text-yellow-700"
          aria-label="Fermer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;