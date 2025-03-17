import React from 'react';

// Fonction globale pour afficher le disclaimer, disponible pour d'autres composants
export let showDisclaimer = () => {};

const DisclaimerModal = ({ isOpen, onClose }) => {
  // Mise à jour de la référence globale
  showDisclaimer = () => onClose(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <div className="p-6 pt-10">
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-blue-800 border border-blue-200">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold">Avis important</h2>
            </div>
            <p>
              Cet outil de simulation est fourni uniquement à titre informatif pour vous aider à évaluer les économies potentielles liées à l'automatisation industrielle.
            </p>
          </div>
          
          <h3 className="text-lg font-bold mb-3">Veuillez noter que :</h3>
          
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>
              Les calculs sont basés sur les données que vous avez saisies et des estimations générales liées à l'automatisation industrielle.
            </li>
            <li>
              Les résultats présentés sont des <strong>estimations</strong> et les économies réelles peuvent varier en fonction de nombreux facteurs spécifiques à votre situation.
            </li>
            <li>
              Ce simulateur n'a pas vocation à remplacer une étude personnalisée réalisée par un expert.
            </li>
            <li>
              Les décisions d'investissement doivent être prises après consultation avec des professionnels financiers et techniques qualifiés.
            </li>
            <li>
              YopRobotics recommande d'obtenir une évaluation professionnelle complète avant d'engager des dépenses importantes d'automatisation.
            </li>
          </ul>
          
          <p className="mb-6">
            En continuant à utiliser cet outil, vous reconnaissez comprendre les limites des simulations présentées et accepter que YopRobotics ne puisse être tenu responsable des décisions prises sur la base de ces informations.
          </p>
          
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              J'ai compris et j'accepte ces conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;