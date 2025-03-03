import React, { useState } from 'react';
import CalculateurROI from './CalculateurROI';
import CalculateurPatesPapiers from './CalculateurPatesPapiers';
import Disclaimer from './Disclaimer';
import DisclaimerModal from './DisclaimerModal';
import Footer from './Footer';

// Composant principal qui intègre les deux calculateurs
const AppCalculateursROI = () => {
  const [calculateurActif, setCalculateurActif] = useState('general');
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Calculateurs de ROI pour l'Automatisation Industrielle</h1>
            <p className="text-xl text-gray-600 mb-6">Évaluez la rentabilité de vos projets d'automatisation industrielle</p>
            
            {/* Disclaimer banner */}
            <Disclaimer />
            
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
      
      {/* Footer avec liens vers le disclaimer */}
      <Footer />
      
      {/* Modal de disclaimer qui s'affiche automatiquement lors de la première visite */}
      <DisclaimerModal />
    </div>
  );
};

export default AppCalculateursROI;