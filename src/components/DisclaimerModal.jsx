import React, { useState, useEffect } from 'react';

/**
 * Modal de disclaimer qui s'affiche automatiquement lors de la première visite
 * et demande l'acceptation explicite des conditions d'utilisation
 */
const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté le disclaimer
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
    if (!disclaimerAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('disclaimerAccepted', 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Avis de non-responsabilité</h2>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-600 mb-6">
            <p className="mb-3">
              <strong>Utilisation des calculateurs ROI de YoProbotics :</strong>
            </p>
            <p className="mb-3">
              Les calculateurs de retour sur investissement (ROI) fournis par YoProbotics sont des outils d'aide à la décision 
              qui produisent des estimations basées sur les paramètres fournis par l'utilisateur et des modèles de calcul génériques.
            </p>
            <p className="mb-3">
              <strong>Veuillez noter que :</strong>
            </p>
            <ul className="list-disc pl-5 mb-3">
              <li>Les résultats générés sont purement indicatifs et ne constituent en aucun cas une garantie de performance réelle.</li>
              <li>La précision des résultats dépend entièrement de l'exactitude des données saisies.</li>
              <li>Les calculs ne prennent pas en compte tous les facteurs spécifiques à votre environnement opérationnel.</li>
              <li>Les estimations de coûts, d'économies et de retour sur investissement peuvent varier significativement des résultats réels.</li>
              <li>Une analyse approfondie par des professionnels qualifiés est toujours nécessaire avant toute décision d'investissement.</li>
            </ul>
            <p className="mb-3">
              <strong>Limitation de responsabilité :</strong>
            </p>
            <p>
              YoProbotics décline expressément toute responsabilité quant aux décisions prises sur la base des résultats 
              fournis par ces calculateurs. En utilisant ces outils, vous reconnaissez comprendre leurs limites et acceptez 
              d'utiliser les résultats uniquement comme un élément parmi d'autres dans votre processus décisionnel.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                J'ai lu et j'accepte l'avis de non-responsabilité ci-dessus. Je comprends que les résultats sont uniquement à titre indicatif.
              </span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAccept}
              disabled={!isChecked}
              className={`px-4 py-2 rounded-md font-medium text-white ${
                isChecked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Accepter et continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;