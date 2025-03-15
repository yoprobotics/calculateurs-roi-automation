import React from 'react';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Composant de gestion des scénarios
 */
const ScenarioManager = () => {
  const { 
    ui, 
    setUi, 
    sauvegarderScenario,
    chargerScenario,
    supprimerScenario
  } = useCalculateurGeneral();
  
  // Handler pour changement de nom de scénario
  const handleNomScenarioChange = (e) => {
    setUi(prev => ({ ...prev, nomScenario: e.target.value }));
  };
  
  // Handler pour sauvegarder le scénario
  const handleSaveScenario = () => {
    sauvegarderScenario();
  };
  
  // Handler pour charger un scénario
  const handleLoadScenario = (id) => {
    chargerScenario(id);
  };
  
  // Handler pour supprimer un scénario
  const handleDeleteScenario = (id) => {
    supprimerScenario(id);
  };
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Gestion des Scénarios</h2>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">Nom du scénario actuel</label>
          <input
            type="text"
            value={ui.nomScenario}
            onChange={handleNomScenarioChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: Projet A - Version économique"
          />
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-6">
          <button
            onClick={handleSaveScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Sauvegarder ce scénario
          </button>
        </div>
      </div>
      
      {ui.scenarios.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Scénarios sauvegardés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ui.scenarios.map(scenario => (
              <div key={scenario.id} className="border rounded p-3 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-medium">{scenario.nom}</p>
                  <p className="text-sm text-gray-600">ROI: {scenario.resultats.roi.toFixed(2)}% | Délai: {scenario.resultats.delaiRecuperation.toFixed(2)} ans</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoadScenario(scenario.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Charger
                  </button>
                  <button
                    onClick={() => handleDeleteScenario(scenario.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;
