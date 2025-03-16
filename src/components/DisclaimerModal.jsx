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

  // Fonction pour réafficher le disclaimer si l'utilisateur souhaite le revoir
  const showDisclaimer = () => {
    setIsOpen(true);
  };

  // Exposer cette fonction pour permettre à d'autres composants de l'appeler
  window.showDisclaimer = showDisclaimer;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Avis de non-responsabilité</h2>
            <button
              onClick={acceptDisclaimer}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="prose prose-sm text-gray-700 mb-6">
            <p className="font-bold mb-2">En utilisant ces calculateurs, vous reconnaissez et acceptez les conditions suivantes :</p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li><span className="font-medium">Résultats indicatifs uniquement :</span> Les résultats fournis par ces calculateurs sont uniquement à titre indicatif et ne constituent pas une garantie de performance réelle.</li>
              
              <li><span className="font-medium">Limites des calculs :</span> Les calculs sont basés sur les données saisies et les hypothèses intégrées dans les modèles. Ils ne prennent pas en compte tous les facteurs pouvant influencer les résultats d'un projet d'automatisation réel.</li>
              
              <li><span className="font-medium">Conseil professionnel nécessaire :</span> Une analyse approfondie par des professionnels qualifiés est essentielle avant toute décision d'investissement basée sur ces résultats.</li>
              
              <li><span className="font-medium">Absence de garantie :</span> YopRobotics ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des résultats fournis pour votre situation spécifique.</li>
              
              <li><span className="font-medium">Limitation de responsabilité :</span> YopRobotics décline toute responsabilité quant aux décisions prises sur la base des résultats fournis par ces calculateurs. En aucun cas, YopRobotics ne pourra être tenu responsable des pertes ou dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation de ces calculateurs.</li>
            </ol>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={acceptDisclaimer}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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