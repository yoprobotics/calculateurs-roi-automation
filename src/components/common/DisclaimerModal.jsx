import React, { useState } from 'react';
import { useDisclaimer } from '../../context/DisclaimerContext';

/**
 * Composant de modal d'avertissement
 * @returns {JSX.Element} - Modal d'avertissement
 */
const DisclaimerModal = () => {
  const { showModal, acceptDisclaimer } = useDisclaimer();
  const [acceptCheck, setAcceptCheck] = useState(false);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Conditions d'utilisation des calculateurs
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <svg 
                className="h-6 w-6 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              
              <div>
                <h3 className="font-bold">Avertissement important</h3>
                <p>
                  Les résultats fournis par ces calculateurs sont uniquement à titre indicatif et ne 
                  constituent pas une garantie de performance réelle.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg 
                className="h-6 w-6 text-blue-500 mt-0.5 mr-2 flex-shrink-0" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              
              <div>
                <h3 className="font-bold">Responsabilité</h3>
                <p>
                  L'utilisateur est seul responsable des décisions prises sur la base des informations 
                  fournies par ces calculateurs. YoProbotics décline toute responsabilité quant aux conséquences 
                  directes ou indirectes résultant de l'utilisation de ces outils.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg 
                className="h-6 w-6 text-green-500 mt-0.5 mr-2 flex-shrink-0" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" 
                  clipRule="evenodd" 
                />
              </svg>
              
              <div>
                <h3 className="font-bold">Recommandations</h3>
                <p>
                  Nous recommandons vivement de consulter un professionnel qualifié en automatisation 
                  industrielle et en analyse financière avant toute prise de décision d'investissement.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg 
                className="h-6 w-6 text-red-500 mt-0.5 mr-2 flex-shrink-0" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              
              <div>
                <h3 className="font-bold">Limitations</h3>
                <p>
                  Les calculateurs utilisent des modèles simplifiés et des hypothèses standardisées 
                  qui peuvent ne pas correspondre exactement à votre situation spécifique. Les résultats
                  doivent être considérés comme des approximations et non comme des prévisions précises.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center mb-4">
            <input
              id="accept-terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
              checked={acceptCheck}
              onChange={(e) => setAcceptCheck(e.target.checked)}
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
              J'ai lu et j'accepte les conditions d'utilisation des calculateurs
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={acceptDisclaimer}
              disabled={!acceptCheck}
              className={`px-4 py-2 rounded-md font-medium text-white ${
                acceptCheck
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
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
