import React, { useMemo } from 'react';

/**
 * Composant pour les paramètres de base du calculateur
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Formulaire des paramètres de base
 */
const ParametresBase = ({
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresGeneraux,
  setTypeSystemeActuel,
  setParametresSystemeActuel,
  setParametresGeneraux,
  toggleDetails
}) => {
  // Calcul des paramètres opérationnels dérivés
  const parametresOperationnels = useMemo(() => {
    // Temps de cycle en secondes par ballot
    const tempsCycle = 3600 / parametresSystemeActuel.capacite;
    
    // Heures d'opération annuelles
    const heuresOperationAnnuelles = parametresGeneraux.heuresOperationParJour * parametresGeneraux.joursOperationParAn;
    
    // Ballots par jour
    const ballotsParJour = parametresSystemeActuel.capacite * parametresGeneraux.heuresOperationParJour;
    
    // Capacité annuelle
    const ballotsAnnuels = ballotsParJour * parametresGeneraux.joursOperationParAn;
    
    // Perte de production
    const perteProduction = parametresSystemeActuel.perteProduction || 0;
    
    // Production effective (tenant compte des pertes)
    const productionEffective = ballotsAnnuels * (1 - perteProduction / 100);
    
    // Coût opérationnel annuel
    const coutOperationnelAnnuel = (
      parametresSystemeActuel.maintenance + 
      parametresSystemeActuel.energie + 
      (parametresSystemeActuel.nombreEmployes * (parametresSystemeActuel.coutMainOeuvre || 55000))
    );
    
    // Coût par ballot
    const coutParBallot = coutOperationnelAnnuel / productionEffective;
    
    return {
      tempsCycle,
      heuresOperationAnnuelles,
      ballotsParJour,
      ballotsAnnuels,
      productionEffective,
      coutOperationnelAnnuel,
      coutParBallot
    };
  }, [parametresSystemeActuel, parametresGeneraux]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Paramètres du système actuel
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Configuration du système</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type de système actuel</label>
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
        
        {/* Paramètres de capacité avec temps de cycle correspondant */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (ballots/heure)</label>
            <input
              type="number"
              value={parametresSystemeActuel.capacite}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                capacite: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Temps de cycle</label>
            <div className="flex items-center h-10 px-3 bg-gray-100 rounded text-gray-800 font-medium">
              {parametresOperationnels.tempsCycle.toFixed(1)} secondes / ballot
            </div>
          </div>
        </div>
        
        {/* Perte de production et taux de rejet */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejet (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.tauxRejets}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                tauxRejets: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Perte de production (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.perteProduction}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                perteProduction: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        {/* Paramètres opérationnels clés */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Indicateurs opérationnels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ballots par jour</label>
              <div className="text-sm font-medium">{parametresOperationnels.ballotsParJour.toFixed(0)}</div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Coût par ballot</label>
              <div className="text-sm font-medium">${parametresOperationnels.coutParBallot.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Personnel</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.nombreEmployes}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                nombreEmployes: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût annuel par employé ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.coutMainOeuvre || 55000}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                coutMainOeuvre: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité et accidents</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Fréquence accidents/an</label>
            <input
              type="number"
              step="0.1"
              value={parametresSystemeActuel.frequenceAccident}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                frequenceAccident: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût moyen par accident ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.coutMoyenAccident}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                coutMoyenAccident: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temps d'arrêt par accident (heures)</label>
          <input
            type="number"
            value={parametresSystemeActuel.tempsArretAccident}
            onChange={(e) => setParametresSystemeActuel({
              ...parametresSystemeActuel,
              tempsArretAccident: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heures par jour</label>
            <input
              type="number"
              value={parametresGeneraux.heuresOperationParJour}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                heuresOperationParJour: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jours par an</label>
            <input
              type="number"
              value={parametresGeneraux.joursOperationParAn}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                joursOperationParAn: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tonnage annuel (tonnes)</label>
            <input
              type="number"
              value={parametresGeneraux.tonnageAnnuel}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                tonnageAnnuel: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marge brute par tonne ($)</label>
            <input
              type="number"
              step="0.01"
              value={parametresGeneraux.margeBrute}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                margeBrute: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
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
              value={parametresSystemeActuel.maintenance}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                maintenance: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie annuelle ($)</label>
            <input
              type="number"
              value={parametresSystemeActuel.energie}
              onChange={(e) => setParametresSystemeActuel({
                ...parametresSystemeActuel,
                energie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxInflation}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                tauxInflation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxActualisation}
              onChange={(e) => setParametresGeneraux({
                ...parametresGeneraux,
                tauxActualisation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={toggleDetails}
          className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          Afficher les paramètres avancés
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ParametresBase;