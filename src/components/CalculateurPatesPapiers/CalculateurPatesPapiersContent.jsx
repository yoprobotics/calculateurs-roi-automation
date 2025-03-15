import React from 'react';
import { useCalculateurPatesPapiers } from '../../contexts/CalculateurPatesPapiersContext';
import useChartData from '../../hooks/useChartData';
import EnTeteSection from './sections/EnTeteSection';
import NavigationTabs from './sections/NavigationTabs';
import SystemeActuelSection from './sections/SystemeActuelSection';
import ParametresGenerauxSection from './sections/ParametresGenerauxSection';
import ResultatsSection from './sections/ResultatsSection';
import SystemeAutomatiseSection from './sections/SystemeAutomatiseSection';
import AnalyseComparativeSection from './sections/AnalyseComparativeSection';
import DetailsFinanciersSection from './sections/DetailsFinanciersSection';
import SecuriteEnvironnementSection from './sections/SecuriteEnvironnementSection';

/**
 * Contenu du calculateur spécifique pâtes et papiers
 */
const CalculateurPatesPapiersContent = () => {
  const {
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats,
    ui,
    changerOnglet,
    toggleDetails
  } = useCalculateurPatesPapiers();
  
  // Préparation des données pour les graphiques
  const chartData = useChartData(
    {
      systemeActuel: parametresSystemeActuel,
      parametresSystemeAutomatise,
      fluxTresorerie: resultats.fluxTresorerie
    }
  );
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* En-tête */}
      <EnTeteSection />
      
      {/* Navigation par onglets */}
      <NavigationTabs activeTab={ui.ongletActif} onTabChange={changerOnglet} />
      
      {/* Contenu de l'onglet actif */}
      {ui.ongletActif === 'general' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Paramètres de base */}
            <div className="flex flex-col gap-6">
              <SystemeActuelSection />
              <ParametresGenerauxSection />
            </div>
            
            {/* Résultats */}
            <div className="flex flex-col gap-6">
              <SystemeAutomatiseSection toggleDetails={toggleDetails} showDetails={ui.afficherDetails} />
              <ResultatsSection />
            </div>
          </div>
        </>
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

export default CalculateurPatesPapiersContent;
