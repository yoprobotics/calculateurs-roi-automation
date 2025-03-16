import React from 'react';
import { CalculateurGeneralProvider, useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import SystemeActuel from './SystemeActuel';
import SystemeAutomatise from './SystemeAutomatise';
import ResultatsROI from './ResultatsROI';
import GraphiquesROI from './GraphiquesROI';
import AnalyseSensibilite from './AnalyseSensibilite';
import GestionScenarios from './GestionScenarios';
import OngletProduction from './OngletProduction';
import OngletSecurite from './OngletSecurite';
import { MODES_AFFICHAGE, MODES_ANALYSE } from '../../../utils/constants';

/**
 * Conteneur interne du calculateur général
 * @returns {JSX.Element} - Contenu du calculateur
 */
const CalculateurGeneralContent = () => {
  const { 
    ui, 
    changerOnglet, 
    changerModeAffichage, 
    changerModeAnalyse
  } = useCalculateurGeneral();

  const { ongletActif, modeAffichage, modeAnalyse } = ui;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
        <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
            <p>Augmentation du volume de production et réduction des temps d'arrêt.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Qualité Constante</h4>
            <p>Élimination des erreurs humaines et amélioration de la répétabilité des processus.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Réduction des Coûts</h4>
            <p>Diminution des coûts de main d'œuvre et optimisation de la consommation d'énergie et de matières.</p>
          </div>
        </div>
      </div>
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => changerModeAffichage(MODES_AFFICHAGE.BASIQUE)}
            className={`px-4 py-2 rounded-lg transition-all ${
              modeAffichage === MODES_AFFICHAGE.BASIQUE
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Basique
          </button>
          <button
            onClick={() => changerModeAffichage(MODES_AFFICHAGE.AVANCE)}
            className={`px-4 py-2 rounded-lg transition-all ${
              modeAffichage === MODES_AFFICHAGE.AVANCE
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Avancé
          </button>
        </div>
        
        {modeAffichage === MODES_AFFICHAGE.AVANCE && (
          <div className="flex space-x-4">
            <button
              onClick={() => changerModeAnalyse(MODES_ANALYSE.STANDARD)}
              className={`px-4 py-2 rounded-lg transition-all ${
                modeAnalyse === MODES_ANALYSE.STANDARD
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Standard
            </button>
            <button
              onClick={() => changerModeAnalyse(MODES_ANALYSE.COMPARAISON)}
              className={`px-4 py-2 rounded-lg transition-all ${
                modeAnalyse === MODES_ANALYSE.COMPARAISON
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Comparer Scénarios
            </button>
            <button
              onClick={() => changerModeAnalyse(MODES_ANALYSE.SENSIBILITE)}
              className={`px-4 py-2 rounded-lg transition-all ${
                modeAnalyse === MODES_ANALYSE.SENSIBILITE
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Sensibilité
            </button>
          </div>
        )}
      </div>
      
      {/* Gestion des scénarios - Mode Avancé */}
      {modeAffichage === MODES_AFFICHAGE.AVANCE && (
        <GestionScenarios />
      )}
      
      {/* Analyse de sensibilité - Mode Avancé */}
      {modeAffichage === MODES_AFFICHAGE.AVANCE && modeAnalyse === MODES_ANALYSE.SENSIBILITE && (
        <AnalyseSensibilite />
      )}
      
      {/* Navigation par onglets */}
      <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
        <button
          onClick={() => changerOnglet('general')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'general'
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Vue générale
        </button>
        <button
          onClick={() => changerOnglet('production')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'production'
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Production
        </button>
        <button
          onClick={() => changerOnglet('comparatif')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'comparatif'
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Analyse comparative
        </button>
        <button
          onClick={() => changerOnglet('financier')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'financier'
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Détails financiers
        </button>
        <button
          onClick={() => changerOnglet('securite')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'securite'
              ? 'text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Sécurité & Environnement
        </button>
      </div>
      
      {/* Vue générale - Premier onglet */}
      {ongletActif === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-8">
            <SystemeActuel />
            <SystemeAutomatise />
          </div>
          <div className="flex flex-col space-y-8">
            <ResultatsROI />
          </div>
        </div>
      )}
      
      {/* Onglet Production */}
      {ongletActif === 'production' && (
        <OngletProduction />
      )}
      
      {/* Analyse comparative - Deuxième onglet */}
      {ongletActif === 'comparatif' && (
        <GraphiquesROI />
      )}
      
      {/* Onglet Sécurité & Environnement */}
      {ongletActif === 'securite' && (
        <OngletSecurite />
      )}
      
      {/* Note: L'onglet financier sera implémenté ultérieurement */}
      {ongletActif === 'financier' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Détails financiers</h2>
          <p className="text-gray-600">Cet onglet présentera une analyse financière détaillée du projet d'automatisation.</p>
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="flex items-center text-yellow-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Cette fonctionnalité sera disponible dans une prochaine mise à jour.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Conteneur principal du calculateur général avec son provider de contexte
 * @returns {JSX.Element} - Calculateur général complet
 */
const CalculateurGeneral = () => {
  return (
    <CalculateurGeneralProvider>
      <CalculateurGeneralContent />
    </CalculateurGeneralProvider>
  );
};

export default CalculateurGeneral;