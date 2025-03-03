import React, { useState, useEffect } from 'react';

// Composant modal d'avertissement qui s'affiche lors de la première visite
const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Vérification si l'utilisateur a déjà accepté les conditions
  useEffect(() => {
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  // Fonction pour accepter les conditions
  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Conditions d'utilisation des calculateurs</h2>
          
          <div className="prose prose-sm">
            <p className="mb-4">
              En utilisant nos calculateurs de ROI pour l'automatisation industrielle, vous reconnaissez et acceptez les points suivants :
            </p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <strong>Résultats indicatifs</strong> : Les résultats fournis sont uniquement à titre indicatif et ne constituent 
                pas une garantie de performance réelle ou future.
              </li>
              <li>
                <strong>Données saisies</strong> : La précision des résultats dépend entièrement de l'exactitude des données 
                que vous saisissez et des hypothèses intégrées dans le calculateur.
              </li>
              <li>
                <strong>Analyse professionnelle requise</strong> : Une analyse approfondie par des professionnels qualifiés 
                est nécessaire avant toute prise de décision d'investissement importante.
              </li>
              <li>
                <strong>Absence de garantie</strong> : YoProbotics ne garantit pas l'exactitude, l'exhaustivité ou 
                la pertinence des résultats pour votre situation spécifique.
              </li>
              <li>
                <strong>Non-responsabilité</strong> : YoProbotics décline toute responsabilité quant aux décisions prises 
                sur la base des résultats fournis par ces calculateurs.
              </li>
            </ul>
            
            <p>
              Nous vous recommandons de consulter des experts en automatisation industrielle et en analyse financière 
              pour valider les résultats obtenus et évaluer précisément la viabilité de votre projet.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={acceptDisclaimer}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            J'accepte ces conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;