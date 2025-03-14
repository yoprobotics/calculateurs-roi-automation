import React, { useState, useEffect } from 'react';

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté le disclaimer
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);
  
  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setIsOpen(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Avertissement important
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Les calculateurs de ROI pour l'automatisation industrielle sont des outils d'aide à la décision qui fournissent des estimations basées sur les données que vous saisissez.
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Veuillez noter que :</strong>
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-500 mb-2 space-y-1">
                    <li>Les résultats sont fournis uniquement à titre indicatif</li>
                    <li>Les calculs sont basés sur les données saisies et les hypothèses intégrées</li>
                    <li>Une analyse approfondie par des professionnels qualifiés est toujours nécessaire</li>
                    <li>Ces résultats ne constituent pas une garantie de performance réelle</li>
                    <li>Les conditions spécifiques de votre entreprise peuvent influencer significativement les résultats</li>
                  </ul>
                  <p className="text-sm text-gray-500">
                    YoProbotics décline toute responsabilité quant aux décisions prises sur la base de ces résultats ou pour toute perte financière, directe ou indirecte, liée à l'utilisation de ces calculateurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={acceptDisclaimer}
            >
              J'ai compris et j'accepte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;