import React, { useState } from 'react';
import DisclaimerModal from './DisclaimerModal';

/**
 * Composant de pied de page avec rappel du disclaimer
 * @returns {JSX.Element} - Pied de page
 */
const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowDisclaimer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <footer className="bg-gray-100 mt-12 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-xl font-semibold text-gray-700">YoProbotics - Calculateurs ROI</h4>
            <p className="text-gray-600 mt-2 mb-4">
              Les calculateurs de retour sur investissement pour l'automatisation industrielle.
            </p>
            <div className="mt-6">
              <button 
                onClick={handleShowDisclaimer}
                className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none underline"
              >
                Revoir les conditions d'utilisation
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap mb-6">
              <div className="w-full">
                <h5 className="text-lg mt-4 lg:mt-0 font-semibold text-gray-700">Avertissement</h5>
                <p className="text-sm text-gray-600 mt-2">
                  Les résultats fournis sont à titre indicatif seulement. Une analyse approfondie par des professionnels 
                  qualifiés est toujours nécessaire avant toute décision d'investissement.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-300" />
        
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} YoProbotics. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
      
      {showModal && <DisclaimerModal onClose={handleCloseModal} forceShow={true} />}
    </footer>
  );
};

export default Footer;