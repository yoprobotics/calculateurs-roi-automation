import React from 'react';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Section de paramétrage du système automatisé
 */
const SystemeAutomatiseSection = () => {
  const { parametresSystemeAutomatise, setParametresSystemeAutomatise, ui } = useCalculateurGeneral();
  
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
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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
            <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
            <input
              type="number"
              name="capaciteTraitement"
              value={parametresSystemeAutomatise.capaciteTraitement}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec/unité)</label>
            <input
              type="number"
              name="tempsCycle"
              value={parametresSystemeAutomatise.tempsCycle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              name="tauxRejets"
              value={parametresSystemeAutomatise.tauxRejets}
              onChange={handleChange}
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction des accidents (%)</label>
            <input
              type="number"
              name="reductionAccidents"
              value={parametresSystemeAutomatise.reductionAccidents}
              onChange={handleChange}
              step="1"
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
      
      {ui.viewMode === 'avance' && (
        <>
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts cachés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Formation continue annuelle ($)</label>
                <input
                  type="number"
                  name="coutFormationContinue"
                  value={parametresSystemeAutomatise.coutFormationContinue}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût des logiciels ($)</label>
                <input
                  type="number"
                  name="coutLogiciel"
                  value={parametresSystemeAutomatise.coutLogiciel}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mises à jour ($)</label>
                <input
                  type="number"
                  name="coutMiseAJour"
                  value={parametresSystemeAutomatise.coutMiseAJour}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Coût périodique des mises à jour</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subventions ($)</label>
                <input
                  type="number"
                  name="subventions"
                  value={parametresSystemeAutomatise.subventions}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Crédits d'impôt, subventions gouvernementales, etc.</p>
              </div>
            </div>
          </div>
        </>
      )}
      
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
              name="nbEmployesRemplaces"
              value={parametresSystemeAutomatise.nbEmployesRemplaces}
              onChange={handleChange}
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      {ui.viewMode === 'avance' && (
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-1">Taux d'amortissement (%)</label>
              <input
                type="number"
                name="tauxAmortissement"
                value={parametresSystemeAutomatise.tauxAmortissement}
                onChange={handleChange}
                step="0.1"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemeAutomatiseSection;
