import React from 'react';
import { useCalculateurPapier } from '../../../context/CalculateurPapierContext';

const ParametresSysteme = () => {
  const { 
    typeSystemeActuel, 
    setTypeSystemeActuel,
    parametresSystemeActuel, 
    setParametresSystemeActuel,
    parametresGeneraux, 
    setParametresGeneraux,
    resultats,
    ui,
    toggleDetails
  } = useCalculateurPapier();
  
  const { afficherDetails } = ui;
  const { delaiRecuperation, roi, van, tri, economieAnnuelle } = resultats;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Paramètres de base */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Paramètres de base
          </h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Configuration du système actuel</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Capacité actuelle (ballots/heure)</label>
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
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <button 
              onClick={toggleDetails}
              className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
            >
              {afficherDetails ? 'Masquer' : 'Afficher'} les paramètres avancés
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${afficherDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Résultats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
              Résultats
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
                <p className={`text-2xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
                  {delaiRecuperation.toFixed(2)} ans
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">VAN</h3>
                <p className="text-2xl font-bold text-purple-800">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 bg-yellow-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
                <p className="text-2xl font-bold text-yellow-700">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Avantages du système automatisé</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Traitement de <strong>{parametresSystemeActuel.capacite} ballots/heure</strong> contre 120 avec le nouveau système</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Réduction de la main d'œuvre de <strong>2 ETP</strong></span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Diminution des rejets de fils métalliques de <strong>{(parametresSystemeActuel.tauxRejets - 3.5).toFixed(1)}%</strong></span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Réduction des accidents de <strong>85%</strong></span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions de sécurité */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sécurité: un investissement rentable
            </h3>
            <p className="text-sm mb-2">
              Notre système intègre des dispositifs de sécurité avancés: barrières immatérielles, arrêts d'urgence, zones de sécurité et interface opérateur ergonomique.
            </p>
            <div className="mt-2 p-2 bg-white rounded border border-blue-100">
              <p className="text-sm font-medium text-blue-800">Impact financier de la sécurité améliorée:</p>
              <p className="text-sm">
                Économie annuelle estimée: <span className="font-bold">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(resultats.economiesSecurite + resultats.economiesTempsArret)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Paramètres avancés - affichage conditionnel */}
      {afficherDetails && (
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
                    value={parametresSystemeActuel.capaciteTraitement}
                    onChange={(e) => setParametresSystemeActuel({
                      ...parametresSystemeActuel,
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
                    value={parametresSystemeActuel.tauxRejets}
                    onChange={(e) => setParametresSystemeActuel({
                      ...parametresSystemeActuel,
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
                  <label className="block text-sm font-medium mb-1">Maintenance actuelle/an ($)</label>
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
                  <label className="block text-sm font-medium mb-1">Maintenance système/an ($)</label>
                  <input
                    type="number"
                    value={parametresSystemeActuel.coutMaintenance}
                    onChange={(e) => setParametresSystemeActuel({
                      ...parametresSystemeActuel,
                      coutMaintenance: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParametresSysteme;