import React from 'react';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section des paramètres généraux pour le calculateur pâtes et papiers
 */
const ParametresGenerauxSection = () => {
  const { parametresGeneraux, setParametresGeneraux } = useCalculateurPatesPapiers();
  
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
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
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
            <label className="block text-sm font-medium mb-1">Tonnage annuel (tonnes)</label>
            <input
              type="number"
              name="tonnageAnnuel"
              value={parametresGeneraux.tonnageAnnuel}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marge brute par tonne ($)</label>
            <input
              type="number"
              step="0.01"
              name="margeBrute"
              value={parametresGeneraux.margeBrute}
              onChange={handleChange}
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
              step="0.1"
              name="tauxInflation"
              value={parametresGeneraux.tauxInflation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Influence l'évolution des coûts dans le temps</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
            <input
              type="number"
              step="0.1"
              name="tauxActualisation"
              value={parametresGeneraux.tauxActualisation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Pour le calcul de la valeur actuelle nette</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresGenerauxSection;
