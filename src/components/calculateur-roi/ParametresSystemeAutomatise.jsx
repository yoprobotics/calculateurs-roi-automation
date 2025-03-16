import React from 'react';

/**
 * Composant pour les paramètres du système automatisé
 */
const ParametresSystemeAutomatise = ({ parametresSystemeAutomatise, setParametresSystemeAutomatise }) => {
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    setParametresSystemeAutomatise({
      ...parametresSystemeAutomatise,
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
    updateParametre('capaciteTraitement', capacite);
    updateParametre('tempsCycle', calculerTempsCycle(capacite));
  };
  
  const updateTempsCycle = (value) => {
    const tempsCycle = Number(value);
    updateParametre('tempsCycle', tempsCycle);
    updateParametre('capaciteTraitement', calculerCapacite(tempsCycle));
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
        <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.capaciteTraitement}
              onChange={(e) => updateCapacite(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.tempsCycle}
              onChange={(e) => updateTempsCycle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
            <p>La capacité réelle correspond à 100% de la capacité théorique maximum.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutSysteme}
              onChange={(e) => updateParametre('coutSysteme', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutInstallation}
              onChange={(e) => updateParametre('coutInstallation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutIngenierie}
              onChange={(e) => updateParametre('coutIngenierie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutFormation}
              onChange={(e) => updateParametre('coutFormation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Subventions ($)</label>
          <input
            type="number"
            value={parametresSystemeAutomatise.subventions}
            onChange={(e) => updateParametre('subventions', e.target.value)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Subventions, crédits d'impôt ou autres aides financières</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Impacts sur les ressources humaines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût annuel employé ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutMainOeuvre}
              onChange={(e) => updateParametre('coutMainOeuvre', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employés remplacés (ETP)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.nbEmployesRemplaces}
              onChange={(e) => updateParametre('nbEmployesRemplaces', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Améliorations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.tauxRejets}
              onChange={(e) => updateParametre('tauxRejets', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût par rejet ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutDechet}
              onChange={(e) => updateParametre('coutDechet', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Augmentation production (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.augmentationProduction}
              onChange={(e) => updateParametre('augmentationProduction', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.ameliorationQualite}
              onChange={(e) => updateParametre('ameliorationQualite', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité et temps d'arrêt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réduction accidents (%)</label>
            <input
              type="number"
              step="1"
              value={parametresSystemeAutomatise.reductionAccidents}
              onChange={(e) => updateParametre('reductionAccidents', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction temps d'arrêt (%)</label>
            <input
              type="number"
              step="1"
              value={parametresSystemeAutomatise.reductionTempsArret}
              onChange={(e) => updateParametre('reductionTempsArret', e.target.value)}
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
              value={parametresSystemeAutomatise.coutMaintenance}
              onChange={(e) => updateParametre('coutMaintenance', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutEnergie}
              onChange={(e) => updateParametre('coutEnergie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts cachés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Formation continue/an</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutFormationContinue}
              onChange={(e) => updateParametre('coutFormationContinue', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mises à jour logicielles</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutMisesAJour}
              onChange={(e) => updateParametre('coutMisesAJour', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Consommables spécifiques</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutConsommables}
              onChange={(e) => updateParametre('coutConsommables', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      {/* Nouveau champ pour la réduction des émissions CO2 */}
      <div className="mb-6">
        <h3 className="font-medium text-green-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-14a2 2 0 10-4 0v1a2 2 0 104 0V2zm3 0a2 2 0 10-4 0v1a2 2 0 104 0V2zm5 0a2 2 0 10-4 0v10a2 2 0 104 0V2z" clipRule="evenodd" />
          </svg>
          Impact environnemental
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réduction émissions CO2 (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionEmissionsCO2 || 0}
              onChange={(e) => updateParametre('reductionEmissionsCO2', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Réduction totale de l'empreinte carbone par rapport au système actuel</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2 mt-1.5"></div>
            <p>La réduction d'émissions de CO2 tient compte de la consommation d'énergie, des économies de matériaux et de la réduction des déchets de votre système automatisé.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Durée de vie (années)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.dureeVie}
              onChange={(e) => updateParametre('dureeVie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'amortissement (%)</label>
            <input
              type="number"
              step="1"
              value={parametresSystemeAutomatise.tauxAmortissement}
              onChange={(e) => updateParametre('tauxAmortissement', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresSystemeAutomatise;