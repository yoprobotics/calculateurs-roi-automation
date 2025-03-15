import React from 'react';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section de configuration du système actuel pour le calculateur pâtes et papiers
 */
const SystemeActuelSection = () => {
  const { 
    typeSystemeActuel, 
    setTypeSystemeActuel, 
    parametresSystemeActuel, 
    setParametresSystemeActuel 
  } = useCalculateurPatesPapiers();
  
  // Handler pour mettre à jour les valeurs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParametresSystemeActuel(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Système Actuel
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTypeSystemeActuel('manuel')}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === 'manuel'
                ? 'bg-green-100 text-green-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manuel
          </button>
          <button
            onClick={() => setTypeSystemeActuel('semi-auto')}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === 'semi-auto'
                ? 'bg-green-100 text-green-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semi-automatisé
          </button>
          <button
            onClick={() => setTypeSystemeActuel('auto-ancien')}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === 'auto-ancien'
                ? 'bg-green-100 text-green-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto. (ancien)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Capacité (ballots/heure)</label>
          <input
            type="number"
            name="capacite"
            value={parametresSystemeActuel.capacite}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
          <input
            type="number"
            name="nombreEmployes"
            value={parametresSystemeActuel.nombreEmployes}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Maintenance annuelle ($)</label>
          <input
            type="number"
            name="maintenance"
            value={parametresSystemeActuel.maintenance}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Coût énergie annuel ($)</label>
          <input
            type="number"
            name="energie"
            value={parametresSystemeActuel.energie}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
          <input
            type="number"
            name="tauxRejets"
            value={parametresSystemeActuel.tauxRejets}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Pourcentage de fils rejetés</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Perte de production (%)</label>
          <input
            type="number"
            name="perteProduction"
            value={parametresSystemeActuel.perteProduction}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Due aux arrêts et retards</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fréquence d'accidents (par an)</label>
          <input
            type="number"
            name="frequenceAccident"
            value={parametresSystemeActuel.frequenceAccident}
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
            value={parametresSystemeActuel.coutMoyenAccident}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemeActuelSection;
