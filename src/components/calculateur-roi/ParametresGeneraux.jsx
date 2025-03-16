import React from 'react';

/**
 * Composant pour les paramètres généraux
 */
const ParametresGeneraux = ({ parametresGeneraux, setParametresGeneraux }) => {
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    setParametresGeneraux({
      ...parametresGeneraux,
      [param]: Number(value)
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Paramètres généraux
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Production annuelle (unités)</label>
            <input
              type="number"
              value={parametresGeneraux.production}
              onChange={(e) => updateParametre('production', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marge par unité ($)</label>
            <input
              type="number"
              step="0.01"
              value={parametresGeneraux.margeUnitaire}
              onChange={(e) => updateParametre('margeUnitaire', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Heures par jour</label>
            <input
              type="number"
              value={parametresGeneraux.heuresOperationParJour}
              onChange={(e) => updateParametre('heuresOperationParJour', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jours par an</label>
            <input
              type="number"
              value={parametresGeneraux.joursOperationParAn}
              onChange={(e) => updateParametre('joursOperationParAn', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxInflation}
              onChange={(e) => updateParametre('tauxInflation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxActualisation}
              onChange={(e) => updateParametre('tauxActualisation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Ajout du taux d'imposition pour le calcul correct de l'amortissement */}
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'imposition (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxImposition || 25}
              onChange={(e) => updateParametre('tauxImposition', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Taux d'impôt sur les bénéfices applicable à votre entreprise</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-1">À propos de l'amortissement et du taux d'imposition</h3>
        <p className="text-sm text-gray-700">
          Le taux d'imposition est utilisé pour calculer les avantages fiscaux liés à l'amortissement. 
          L'amortissement lui-même n'est pas un flux de trésorerie, mais l'économie d'impôt qu'il génère en est un.
        </p>
      </div>
    </div>
  );
};

export default ParametresGeneraux;