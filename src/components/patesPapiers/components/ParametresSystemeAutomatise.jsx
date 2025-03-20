import React, { useMemo } from 'react';

/**
 * Composant pour les paramètres du système automatisé
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Formulaire des paramètres du système automatisé
 */
const ParametresSystemeAutomatise = ({
  parametresSystemeAutomatise,
  parametresGeneraux,
  setParametresSystemeAutomatise
}) => {
  // Calcul des paramètres opérationnels dérivés
  const parametresOperationnels = useMemo(() => {
    // Temps de cycle en secondes par ballot
    const tempsCycle = 3600 / parametresSystemeAutomatise.capaciteTraitement;
    
    // Heures d'opération annuelles
    const heuresOperationAnnuelles = parametresGeneraux.heuresOperationParJour * parametresGeneraux.joursOperationParAn;
    
    // Ballots par jour
    const ballotsParJour = parametresSystemeAutomatise.capaciteTraitement * parametresGeneraux.heuresOperationParJour;
    
    // Capacité annuelle
    const ballotsAnnuels = ballotsParJour * parametresGeneraux.joursOperationParAn;
    
    // Investissement initial
    const investissementInitial = (
      parametresSystemeAutomatise.coutSysteme + 
      parametresSystemeAutomatise.coutInstallation + 
      parametresSystemeAutomatise.coutIngenierie + 
      parametresSystemeAutomatise.coutFormation - 
      parametresSystemeAutomatise.subventions
    );
    
    // Coût opérationnel annuel
    const coutOperationnelAnnuel = (
      parametresSystemeAutomatise.coutMaintenance + 
      parametresSystemeAutomatise.coutEnergie
    );
    
    // Coût par ballot
    const coutParBallot = coutOperationnelAnnuel / ballotsAnnuels;
    
    return {
      tempsCycle,
      heuresOperationAnnuelles,
      ballotsParJour,
      ballotsAnnuels,
      investissementInitial,
      coutOperationnelAnnuel,
      coutParBallot
    };
  }, [parametresSystemeAutomatise, parametresGeneraux]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
        Paramètres du système automatisé
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Capacité de production</h3>
        
        {/* Paramètres de capacité avec temps de cycle correspondant */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (ballots/heure)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.capaciteTraitement}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                capaciteTraitement: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Temps de cycle</label>
            <div className="flex items-center h-10 px-3 bg-blue-50 rounded text-blue-800 font-medium">
              {parametresOperationnels.tempsCycle.toFixed(1)} secondes / ballot
            </div>
          </div>
        </div>
        
        {/* Paramètres opérationnels clés */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Indicateurs opérationnels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-blue-600 mb-1">Ballots par jour</label>
              <div className="text-sm font-medium">{parametresOperationnels.ballotsParJour.toFixed(0)}</div>
            </div>
            <div>
              <label className="block text-xs text-blue-600 mb-1">Coût par ballot</label>
              <div className="text-sm font-medium">${parametresOperationnels.coutParBallot.toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        {/* Taux de rejet */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Taux de rejet (%)</label>
          <input
            type="number"
            step="0.1"
            value={parametresSystemeAutomatise.tauxRejets}
            onChange={(e) => setParametresSystemeAutomatise({
              ...parametresSystemeAutomatise,
              tauxRejets: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutSysteme}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutSysteme: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutInstallation}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutInstallation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutIngenierie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutIngenierie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutFormation}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutFormation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Subventions ($)</label>
          <input
            type="number"
            value={parametresSystemeAutomatise.subventions}
            onChange={(e) => setParametresSystemeAutomatise({
              ...parametresSystemeAutomatise,
              subventions: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mt-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-blue-800">Total investissement</div>
            <div className="text-lg font-bold text-blue-800">
              ${parametresOperationnels.investissementInitial.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance annuelle ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutMaintenance}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutMaintenance: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie annuelle ($)</label>
            <input
              type="number"
              value={parametresSystemeAutomatise.coutEnergie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutEnergie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Impacts environnementaux</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réduction déchets (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionDechet}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionDechet: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction empreinte CO2 (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionEmpreinteCO2}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionEmpreinteCO2: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresSystemeAutomatise;