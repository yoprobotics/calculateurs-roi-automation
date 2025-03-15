import React from 'react';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Section de paramétrage du système actuel
 */
const SystemeActuelSection = () => {
  const { systemeActuel, setSystemeActuel } = useCalculateurGeneral();
  
  // Handlers pour mettre à jour les valeurs
  const handleTypeChange = (type) => {
    setSystemeActuel(prev => ({ ...prev, type }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSystemeActuel(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Système Actuel
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleTypeChange('manuel')}
            className={`py-2 text-sm rounded-md transition-all ${
              systemeActuel.type === 'manuel'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manuel
          </button>
          <button
            onClick={() => handleTypeChange('semi-auto')}
            className={`py-2 text-sm rounded-md transition-all ${
              systemeActuel.type === 'semi-auto'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semi-automatisé
          </button>
          <button
            onClick={() => handleTypeChange('auto-ancien')}
            className={`py-2 text-sm rounded-md transition-all ${
              systemeActuel.type === 'auto-ancien'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto. (ancien)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
          <input
            type="number"
            name="capacite"
            value={systemeActuel.capacite}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Unités produites par heure</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temps de cycle (sec/unité)</label>
          <input
            type="number"
            name="tempsCycle"
            value={systemeActuel.tempsCycle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Temps moyen par unité</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
          <input
            type="number"
            name="nombreEmployes"
            value={systemeActuel.nombreEmployes}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Équivalent temps plein</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
          <input
            type="number"
            name="tauxRejets"
            value={systemeActuel.tauxRejets}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">% d'unités défectueuses</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Maintenance annuelle ($)</label>
          <input
            type="number"
            name="coutMaintenance"
            value={systemeActuel.coutMaintenance}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Coût énergie annuel ($)</label>
          <input
            type="number"
            name="coutEnergie"
            value={systemeActuel.coutEnergie}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fréquence d'accidents (par an)</label>
          <input
            type="number"
            name="frequenceAccident"
            value={systemeActuel.frequenceAccident}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Coût moyen par accident ($)</label>
          <input
            type="number"
            name="coutMoyenAccident"
            value={systemeActuel.coutMoyenAccident}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemeActuelSection;
