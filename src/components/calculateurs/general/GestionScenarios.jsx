import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { formaterDevise } from '../../../utils/formatters';

/**
 * Composant de gestion des scénarios sauvegardés
 * @returns {JSX.Element} - Interface de gestion des scénarios
 */
const GestionScenarios = () => {
  const { 
    scenarios, 
    scenarioActif, 
    nomScenario, 
    setNomScenario, 
    sauvegarderScenario, 
    chargerScenario, 
    supprimerScenario,
    resultats
  } = useCalculateurGeneral();
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Gestion des Scénarios</h2>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">Nom du scénario actuel</label>
          <input
            type="text"
            value={nomScenario}
            onChange={(e) => setNomScenario(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Projet A - Version économique"
          />
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-6">
          <button
            onClick={sauvegarderScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Sauvegarder ce scénario
          </button>
        </div>
      </div>
      
      {scenarios.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Scénarios sauvegardés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id} 
                className={`border rounded p-3 ${
                  scenarioActif === scenario.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                } flex justify-between items-center`}
              >
                <div>
                  <p className="font-medium">{scenario.nom}</p>
                  <p className="text-sm text-gray-600">
                    ROI: {scenario.resultats.roi.toFixed(2)}% | 
                    Délai: {scenario.resultats.delaiRecuperation.toFixed(2)} ans
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => chargerScenario(scenario.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Charger
                  </button>
                  <button
                    onClick={() => supprimerScenario(scenario.id)}
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
      
      {scenarios.length > 1 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Comparaison des scénarios</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Scénario</th>
                  <th className="px-4 py-2 text-right">Investissement</th>
                  <th className="px-4 py-2 text-right">ROI</th>
                  <th className="px-4 py-2 text-right">Délai</th>
                  <th className="px-4 py-2 text-right">VAN</th>
                  <th className="px-4 py-2 text-right">TRI</th>
                </tr>
              </thead>
              <tbody>
                {/* Scénario actuel */}
                <tr className="border-t bg-blue-50">
                  <td className="px-4 py-2 font-medium">{nomScenario} (actuel)</td>
                  <td className="px-4 py-2 text-right">
                    {formaterDevise(resultats.investissementInitial, 'USD', 0)}
                  </td>
                  <td className="px-4 py-2 text-right">{resultats.roi.toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right">{resultats.delaiRecuperation.toFixed(2)} ans</td>
                  <td className="px-4 py-2 text-right">
                    {formaterDevise(resultats.van, 'USD', 0)}
                  </td>
                  <td className="px-4 py-2 text-right">{resultats.tri.toFixed(2)}%</td>
                </tr>
                
                {/* Autres scénarios (uniquement ceux qui ne sont pas actifs) */}
                {scenarios
                  .filter(s => s.id !== scenarioActif)
                  .map(scenario => (
                    <tr key={scenario.id} className="border-t">
                      <td className="px-4 py-2 font-medium">{scenario.nom}</td>
                      <td className="px-4 py-2 text-right">
                        {formaterDevise(
                          scenario.systemeAutomatise.coutSysteme + 
                          scenario.systemeAutomatise.coutInstallation + 
                          scenario.systemeAutomatise.coutIngenierie + 
                          scenario.systemeAutomatise.coutFormation - 
                          scenario.systemeAutomatise.subventions, 
                          'USD', 
                          0
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">{scenario.resultats.roi.toFixed(2)}%</td>
                      <td className="px-4 py-2 text-right">{scenario.resultats.delaiRecuperation.toFixed(2)} ans</td>
                      <td className="px-4 py-2 text-right">
                        {formaterDevise(scenario.resultats.van, 'USD', 0)}
                      </td>
                      <td className="px-4 py-2 text-right">{scenario.resultats.tri.toFixed(2)}%</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionScenarios;
