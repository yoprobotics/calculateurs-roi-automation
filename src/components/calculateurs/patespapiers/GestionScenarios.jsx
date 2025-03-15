import React from 'react';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { FormInput } from '../../common/FormInput';

/**
 * Composant de gestion des scénarios
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
  } = useCalculateurPatesPapiers();

  // Formatage de montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (scenarios.length === 0 && scenarioActif === 'actuel') {
    return (
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="w-full md:w-1/3">
            <FormInput
              label="Nom du scénario actuel"
              value={nomScenario}
              onChange={setNomScenario}
              placeholder="Ex: Modernisation - Version standard"
            />
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-6">
            <button
              onClick={sauvegarderScenario}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
            >
              Sauvegarder ce scénario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Gestion des Scénarios</h2>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center mb-4">
        <div className="w-full md:w-1/3">
          <FormInput
            label="Nom du scénario actuel"
            value={nomScenario}
            onChange={setNomScenario}
            placeholder="Ex: Modernisation - Version standard"
          />
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-6">
          <button
            onClick={sauvegarderScenario}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
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
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-gray-50 border-gray-200'
                } flex justify-between items-center`}
              >
                <div>
                  <p className="font-medium">{scenario.nom}</p>
                  <p className="text-sm text-gray-600">
                    ROI: {scenario.resultats.roi.toFixed(2)}% | 
                    Délai: {scenario.resultats.delaiRecuperation.toFixed(2)} ans | 
                    VAN: {formatCurrency(scenario.resultats.van)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => chargerScenario(scenario.id)}
                    className={`px-3 py-1 ${
                      scenarioActif === scenario.id
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    } text-sm rounded transition-all`}
                    disabled={scenarioActif === scenario.id}
                  >
                    {scenarioActif === scenario.id ? 'Actif' : 'Charger'}
                  </button>
                  <button
                    onClick={() => supprimerScenario(scenario.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-all"
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

export default GestionScenarios;
