import React from 'react';

/**
 * Composant pour les paramètres avancés
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Function} props.setParametresSystemeAutomatise - Fonction pour mettre à jour les paramètres
 * @returns {JSX.Element} Formulaire des paramètres avancés
 */
const ParametresAvances = ({ parametresSystemeAutomatise, setParametresSystemeAutomatise }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Paramètres avancés</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Système automatisé</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Capacité de traitement (ballots/h)</label>
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
            <div>
              <label className="block text-sm font-medium mb-1">Taux de rejet fils système (%)</label>
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
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Maintenance système/an ($)</label>
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
              <label className="block text-sm font-medium mb-1">Coût énergie/an ($)</label>
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
          <h3 className="font-medium text-gray-700 mb-2">Avantages du système</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Réduction des déchets (%)</label>
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
              <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
              <input
                type="number"
                step="0.1"
                value={parametresSystemeAutomatise.ameliorationQualite}
                onChange={(e) => setParametresSystemeAutomatise({
                  ...parametresSystemeAutomatise,
                  ameliorationQualite: Number(e.target.value)
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresAvances;