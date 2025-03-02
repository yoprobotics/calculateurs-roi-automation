import React, { useState, useEffect } from 'react';

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Vérifie si l'utilisateur a déjà accepté les termes
  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted === 'true') {
      setHasAccepted(true);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setHasAccepted(true);
    setIsOpen(false);
  };

  // Si le modal ne doit pas être affiché, on retourne null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Avis de non-responsabilité</h3>
          
          <div className="mt-4 px-4 py-3 bg-yellow-50 rounded-md border border-yellow-100 text-left">
            <h4 className="font-medium text-yellow-800 mb-2">Important: Utilisation des calculateurs de ROI</h4>
            <p className="text-sm text-gray-700 mb-2">
              Les résultats fournis par ces calculateurs sont <strong>exclusivement à titre indicatif</strong> et ne constituent en aucun cas une garantie de performance réelle ou future. Les calculs sont basés sur les données saisies par l'utilisateur et les hypothèses formulées dans l'application.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Une analyse approfondie réalisée par des professionnels qualifiés est <strong>toujours nécessaire</strong> avant toute décision d'investissement en matière d'automatisation industrielle. Les conditions spécifiques de chaque entreprise et de chaque projet peuvent varier considérablement.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Les résultats ne prennent pas en compte tous les facteurs pouvant influencer le retour sur investissement réel, tels que les fluctuations du marché, les changements réglementaires, les délais imprévus, ou d'autres variables contextuelles.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              YoProbotics décline toute responsabilité quant aux décisions prises sur la base des résultats fournis par ces calculateurs. En utilisant cette application, vous reconnaissez avoir compris ces limitations et acceptez d'utiliser ces outils à vos propres risques.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              J'accepte ces conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;