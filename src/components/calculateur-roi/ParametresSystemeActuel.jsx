import React from 'react';

/**
 * Composant pour les paramètres du système actuel
 */
const ParametresSystemeActuel = ({ parametresSystemeActuel, setParametresSystemeActuel, typeSystemeActuel, setTypeSystemeActuel }) => {
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    setParametresSystemeActuel({
      ...parametresSystemeActuel,
      [param]: Number(value)
    });
  };
  
  // Calculer le temps de cycle basé sur la capacité
  const calculerTempsCycle = (capacite) => {
    if (!capacite || capacite <= 0) return 0;
    return Math.round((3600 / capacite) * 10) / 10; // Convertir capacité/heure en secondes/unité
  };
  
  // Calculer la capacité basée sur le temps de cycle
  const calculerCapacite = (tempsCycle) => {
    if (!tempsCycle || tempsCycle <= 0) return 0;
    return Math.round((3600 / tempsCycle) * 10) / 10; // Convertir secondes/unité en capacité/heure
  };
  
  // Synchroniser temps de cycle et capacité
  const updateCapacite = (value) => {
    const capacite = Number(value);
    updateParametre('capacite', capacite);
    updateParametre('tempsCycle', calculerTempsCycle(capacite));
  };
  
  const updateTempsCycle = (value) => {
    const tempsCycle = Number(value);
    updateParametre('tempsCycle', tempsCycle);
    updateParametre('capacite', calculerCapacite(tempsCycle));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
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
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manuel
          </button>
          <button
            onClick={() => setTypeSystemeActuel('semi-auto')}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === 'semi-auto'
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semi-automatisé
          </button>
          <button
            onClick={() => setTypeSystemeActuel('auto-ancien')}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === 'auto-ancien'
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto. (ancien)
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
            <input
              type="number"
              value={parametresSystemeActuel.capacite}
              onChange={(e) => updateCapacite(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
            <input
              type="number"
              value={parametresSystemeActuel.tempsCycle}
              onChange={(e) => updateTempsCycle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
            <p>La capacité réelle correspond à 100% de la capacité théorique maximum.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
          <input
            type="number"
            step="0.1"
            value={parametresSystemeActuel.nombreEmployes}
            onChange={(e) => updateParametre('nombreEmployes', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Équivalent temps plein</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Qualité et problèmes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.tauxRejets}
              onChange={(e) => updateParametre('tauxRejets', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pertes production (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.perteProduction}
              onChange={(e) => updateParametre('perteProduction', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Accidents/an</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.frequenceAccident}
              onChange={(e) => updateParametre('frequenceAccident', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût/accident ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.coutMoyenAccident}
              onChange={(e) => updateParametre('coutMoyenAccident', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Arrêt/accident (h)</label>
            <input
              type="number"
              step="0.5"
              value={parametresSystemeActuel.tempsArretAccident}
              onChange={(e) => updateParametre('tempsArretAccident', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Arrêt non planifié (h/mois)</label>
            <input
              type="number"
              step="0.5"
              value={parametresSystemeActuel.arretNonPlanifie}
              onChange={(e) => updateParametre('arretNonPlanifie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.maintenance}
              onChange={(e) => updateParametre('maintenance', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.energie}
              onChange={(e) => updateParametre('energie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresSystemeActuel;