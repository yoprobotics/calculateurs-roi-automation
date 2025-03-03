import React, { useState } from 'react';
import DisclaimerModal from './DisclaimerModal';

/**
 * Composant de pied de page pour l'application avec lien vers le disclaimer
 */
const Footer = () => {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  
  const handleShowDisclaimer = () => {
    setShowFullDisclaimer(true);
  };
  
  const handleCloseDisclaimer = () => {
    setShowFullDisclaimer(false);
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-16 pt-8 pb-4 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} YoProbotics. Tous droits réservés.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleShowDisclaimer}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Avis de non-responsabilité
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            Les résultats fournis par ces calculateurs sont à titre indicatif uniquement et ne constituent pas une garantie de performance.
            Consultez toujours un professionnel avant de prendre des décisions d'investissement.
          </p>
        </div>
      </div>
      
      {/* Modal de disclaimer complet */}
      {showFullDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-800">Avis de non-responsabilité</h2>
                </div>
                <button
                  onClick={handleCloseDisclaimer}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Fermer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
              
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDisclaimer}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;