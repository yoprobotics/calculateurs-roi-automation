import React from 'react';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Section des paramètres généraux du calculateur
 */
const ParametresGenerauxSection = () => {
  const { parametresGeneraux, setParametresGeneraux } = useCalculateurGeneral();
  
  // Handler pour mettre à jour les valeurs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParametresGeneraux(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Paramètres Généraux
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heures par jour</label>
            <input
              type="number"
              name="heuresOperationParJour"
              value={parametresGeneraux.heuresOperationParJour}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jours par an</label>
            <input
              type="number"
              name="joursOperationParAn"
              value={parametresGeneraux.joursOperationParAn}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Production annuelle (unités)</label>
            <input
              type="number"
              name="production"
              value={parametresGeneraux.production}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marge par unité ($)</label>
            <input
              type="number"
              name="margeUnitaire"
              value={parametresGeneraux.margeUnitaire}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
            <input
              type="number"
              name="tauxInflation"
              value={parametresGeneraux.tauxInflation}
              onChange={handleChange}
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
            <input
              type="number"
              name="tauxActualisation"
              value={parametresGeneraux.tauxActualisation}
              onChange={handleChange}
              step="0.1"
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Taux utilisé pour calculer la valeur actuelle des flux futurs</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de problèmes de qualité (%)</label>
            <input
              type="number"
              name="tauxProblemeQualite"
              value={parametresGeneraux.tauxProblemeQualite}
              onChange={handleChange}
              step="0.1"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'un problème de qualité ($)</label>
            <input
              type="number"
              name="coutQualite"
              value={parametresGeneraux.coutQualite}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresGenerauxSection;
