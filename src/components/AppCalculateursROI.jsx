import React, { useState } from 'react';
import CalculateurROI from './CalculateurROI';
import CalculateurPatesPapiers from './calculateurs/patespapiers';
import DisclaimerModal from './communs/DisclaimerModal';
import Footer from './communs/Footer';

// Composant principal qui intègre les deux calculateurs
const AppCalculateursROI = () => {
  // État pour le calculateur actif
  const [calculateurActif, setCalculateurActif] = useState('general');
  // État pour le modal de disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Disclaimer modal qui s'affiche au démarrage */}
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
      
      <main className="flex-grow">
        <div className="container mx-auto p-4 pb-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Calculateurs de ROI pour l'Automatisation Industrielle</h1>
            <p className="text-xl text-gray-600 mb-6">Évaluez la rentabilité de vos projets d'automatisation industrielle</p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setCalculateurActif('general')}
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-all ${
                  calculateurActif === 'general'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Automatisation Générale
              </button>
              <button
                onClick={() => setCalculateurActif('patespapiers')}
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-all ${
                  calculateurActif === 'patespapiers'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Désempilement & Débrochage de Ballots
              </button>
            </div>
          </div>
          
          {calculateurActif === 'general' ? (
            <CalculateurROI />
          ) : (
            <CalculateurPatesPapiers />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppCalculateursROI;