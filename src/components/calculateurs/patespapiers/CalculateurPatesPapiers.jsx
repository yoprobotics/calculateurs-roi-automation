import React from 'react';
import { CalculateurPatesPapiersProvider, useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import SystemeActuel from './SystemeActuel';
import SystemeAutomatise from './SystemeAutomatise';
import ResultatsROI from './ResultatsROI';
import GraphiquesROI from './GraphiquesROI';
import GestionScenarios from './GestionScenarios';
import EnvironnementSecurite from './EnvironnementSecurite';
import AnalyseFinanciere from './AnalyseFinanciere';
import { ONGLETS_CALCULATEUR } from '../../../utils/constants';

/**
 * Conteneur interne du calculateur pâtes et papiers
 * @returns {JSX.Element} - Contenu du calculateur
 */
const CalculateurPatesPapiersContent = () => {
  const { 
    ui, 
    changerOnglet,
    toggleDetails
  } = useCalculateurPatesPapiers();

  const { ongletActif, afficherDetails } = ui;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Solution Automatisée de Désempilement et Débrochage de Ballots</h2>
        <p className="mb-4 text-gray-700">Notre système automatisé haute performance transforme votre chaîne de production avec un ROI en moins de 2 ans.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">ROI Rapide</h3>
            <p className="text-gray-600 text-sm mb-2">ROI inférieur à 2 ans avec des économies sur la main d'œuvre et l'amélioration de la qualité.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-blue-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Sécurité Améliorée</h3>
            <p className="text-gray-600 text-sm mb-2">Réduction des risques d'accidents grâce à l'automatisation des tâches dangereuses.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-purple-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Productivité Maximale</h3>
            <p className="text-gray-600 text-sm mb-2">Augmentation de la capacité et réduction des temps d'arrêt grâce à une alimentation continue.</p>
          </div>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
        <button
          onClick={() => changerOnglet(ONGLETS_CALCULATEUR.GENERAL)}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === ONGLETS_CALCULATEUR.GENERAL
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Vue générale
        </button>
        <button
          onClick={() => changerOnglet(ONGLETS_CALCULATEUR.COMPARATIF)}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === ONGLETS_CALCULATEUR.COMPARATIF
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Analyse comparative
        </button>
        <button
          onClick={() => changerOnglet(ONGLETS_CALCULATEUR.FINANCIER)}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === ONGLETS_CALCULATEUR.FINANCIER
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Détails financiers
        </button>
        <button
          onClick={() => changerOnglet(ONGLETS_CALCULATEUR.SECURITE)}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === ONGLETS_CALCULATEUR.SECURITE
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Sécurité & Environnement
        </button>
      </div>
      
      {/* Gestion des scénarios */}
      <GestionScenarios />
      
      {/* Vue générale - Premier onglet */}
      {ongletActif === ONGLETS_CALCULATEUR.GENERAL && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-8">
            <SystemeActuel toggleDetails={toggleDetails} afficherDetails={afficherDetails} />
            {afficherDetails && <SystemeAutomatise />}
          </div>
          <div className="flex flex-col space-y-8">
            <ResultatsROI />
          </div>
        </div>
      )}
      
      {/* Analyse comparative - Deuxième onglet */}
      {ongletActif === ONGLETS_CALCULATEUR.COMPARATIF && (
        <GraphiquesROI />
      )}
      
      {/* Détails financiers - Troisième onglet */}
      {ongletActif === ONGLETS_CALCULATEUR.FINANCIER && (
        <AnalyseFinanciere />
      )}
      
      {/* Sécurité & Environnement - Quatrième onglet */}
      {ongletActif === ONGLETS_CALCULATEUR.SECURITE && (
        <EnvironnementSecurite />
      )}
    </div>
  );
};

/**
 * Conteneur principal du calculateur pâtes et papiers avec son provider de contexte
 * @returns {JSX.Element} - Calculateur des pâtes et papiers complet
 */
const CalculateurPatesPapiers = () => {
  return (
    <CalculateurPatesPapiersProvider>
      <CalculateurPatesPapiersContent />
    </CalculateurPatesPapiersProvider>
  );
};

export default CalculateurPatesPapiers;
