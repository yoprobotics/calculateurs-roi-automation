import React from 'react';
import { useCalculateurGeneral } from '../../contexts/CalculateurGeneralContext';
import useChartData from '../../hooks/useChartData';
import IntroductionSection from './sections/IntroductionSection';
import NavigationTabs from './sections/NavigationTabs';
import SystemeActuelSection from './sections/SystemeActuelSection';
import SystemeAutomatiseSection from './sections/SystemeAutomatiseSection';
import ParametresGenerauxSection from './sections/ParametresGenerauxSection';
import ResultatsSection from './sections/ResultatsSection';
import AnalyseComparativeSection from './sections/AnalyseComparativeSection';
import DetailsFinanciersSection from './sections/DetailsFinanciersSection';
import SecuriteEnvironnementSection from './sections/SecuriteEnvironnementSection';
import ScenarioManager from './sections/ScenarioManager';

/**
 * Contenu principal du calculateur général
 */
const CalculateurGeneralContent = () => {
  const { 
    systemeActuel, 
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats,
    ui,
    setUi
  } = useCalculateurGeneral();
  
  // Préparer les données des graphiques
  const chartData = useChartData(
    { 
      systemeActuel, 
      parametresSystemeAutomatise, 
      fluxTresorerie: resultats.resultatAnnuel 
    }
  );
  
  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setUi(prev => ({ ...prev, ongletActif: tab }));
  };
  
  // Gérer le changement de mode d'affichage
  const handleViewModeChange = (mode) => {
    setUi(prev => ({ ...prev, viewMode: mode }));
  };
  
  // Gérer le changement de mode d'analyse
  const handleAnalyseModeChange = (mode) => {
    setUi(prev => ({ ...prev, analyseMode: mode }));
  };
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        Calculateur de Retour sur Investissement pour l'Automatisation Industrielle
      </h1>
      
      {/* Introduction */}
      <IntroductionSection />
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => handleViewModeChange('basique')}
            className={`px-4 py-2 rounded-lg transition-all ${
              ui.viewMode === 'basique'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Basique
          </button>
          <button
            onClick={() => handleViewModeChange('avance')}
            className={`px-4 py-2 rounded-lg transition-all ${
              ui.viewMode === 'avance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Avancé
          </button>
        </div>
        
        {ui.viewMode === 'avance' && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnalyseModeChange('standard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                ui.analyseMode === 'standard'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Standard
            </button>
            <button
              onClick={() => handleAnalyseModeChange('comparaison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                ui.analyseMode === 'comparaison'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Comparer Scénarios
            </button>
            <button
              onClick={() => handleAnalyseModeChange('sensibilite')}
              className={`px-4 py-2 rounded-lg transition-all ${
                ui.analyseMode === 'sensibilite'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Analyse Sensibilité
            </button>
          </div>
        )}
      </div>
      
      {/* Gestionnaire de scénarios en mode avancé */}
      {ui.viewMode === 'avance' && <ScenarioManager />}
      
      {/* Navigation par onglets */}
      <NavigationTabs activeTab={ui.ongletActif} onTabChange={handleTabChange} />
      
      {/* Contenu de l'onglet actif */}
      {ui.ongletActif === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <SystemeActuelSection />
            <ParametresGenerauxSection />
          </div>
          <div className="flex flex-col gap-6">
            <SystemeAutomatiseSection />
            <ResultatsSection />
          </div>
        </div>
      )}
      
      {ui.ongletActif === 'comparatif' && (
        <AnalyseComparativeSection chartData={chartData} />
      )}
      
      {ui.ongletActif === 'financier' && (
        <DetailsFinanciersSection chartData={chartData} />
      )}
      
      {ui.ongletActif === 'securite' && (
        <SecuriteEnvironnementSection chartData={chartData} />
      )}
    </div>
  );
};

export default CalculateurGeneralContent;
