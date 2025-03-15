import React from 'react';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section du système automatisé pour le calculateur pâtes et papiers
 * @param {Function} toggleDetails - Fonction pour afficher/masquer les détails 
 * @param {boolean} showDetails - État d'affichage des détails
 */
const SystemeAutomatiseSection = ({ toggleDetails, showDetails }) => {
  const { parametresSystemeAutomatise, setParametresSystemeAutomatise } = useCalculateurPatesPapiers();
  
  // Handler pour mettre à jour les valeurs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParametresSystemeAutomatise(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Système Automatisé
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts initiaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
            <input
              type="number"
              name="coutSysteme"
              value={parametresSystemeAutomatise.coutSysteme}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
            <input
              type="number"
              name="coutInstallation"
              value={parametresSystemeAutomatise.coutInstallation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
            <input
              type="number"
              name="coutIngenierie"
              value={parametresSystemeAutomatise.coutIngenierie}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
            <input
              type="number"
              name="coutFormation"
              value={parametresSystemeAutomatise.coutFormation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Performance du système</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (ballots/heure)</label>
            <input
              type="number"
              name="capaciteTraitement"
              value={parametresSystemeAutomatise.capaciteTraitement}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              step="0.1"
              name="tauxRejets"
              value={parametresSystemeAutomatise.tauxRejets}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance annuelle ($)</label>
            <input
              type="number"
              name="coutMaintenance"
              value={parametresSystemeAutomatise.coutMaintenance}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût énergie annuel ($)</label>
            <input
              type="number"
              name="coutEnergie"
              value={parametresSystemeAutomatise.coutEnergie}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût annuel par employé ($)</label>
            <input
              type="number"
              name="coutMainOeuvre"
              value={parametresSystemeAutomatise.coutMainOeuvre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre d'employés remplacés</label>
            <input
              type="number"
              step="0.1"
              name="nbEmployesRemplaces"
              value={parametresSystemeAutomatise.nbEmployesRemplaces}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <button 
          onClick={toggleDetails}
          className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          {showDetails ? 'Masquer' : 'Afficher'} les paramètres avancés
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Paramètres avancés</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction des déchets (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="reductionDechet"
                    value={parametresSystemeAutomatise.reductionDechet}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût par tonne de déchet ($)</label>
                  <input
                    type="number"
                    name="coutDechet"
                    value={parametresSystemeAutomatise.coutDechet}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Paramètres environnementaux</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction d'énergie (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="reductionEnergie"
                    value={parametresSystemeAutomatise.reductionEnergie}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction d'empreinte CO2 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="reductionEmpreinteCO2"
                    value={parametresSystemeAutomatise.reductionEmpreinteCO2}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Paramètres de qualité</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="ameliorationQualite"
                    value={parametresSystemeAutomatise.ameliorationQualite}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction des accidents (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="reductionAccidents"
                    value={parametresSystemeAutomatise.reductionAccidents}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Subventions ($)</label>
                  <input
                    type="number"
                    name="subventions"
                    value={parametresSystemeAutomatise.subventions}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée de vie (années)</label>
                  <input
                    type="number"
                    name="dureeVie"
                    value={parametresSystemeAutomatise.dureeVie}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemeAutomatiseSection;
