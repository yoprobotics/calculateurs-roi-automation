import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant pour afficher les résultats financiers du ROI
 */
const ResultatsROI = () => {
  const { 
    resultats, 
    systemeAutomatise,
    systemeActuel,
    parametresGeneraux
  } = useCalculateurGeneral();
  
  // Extraction des valeurs pertinentes
  const {
    roi,
    delaiRecuperation,
    van,
    tri,
    economieAnnuelle,
    fluxTresorerie,
    ameliorationEfficacite,
    investissementInitial
  } = resultats;
  
  const { dureeVie, coutFormationContinue, coutMisesAJour, coutConsommables } = systemeAutomatise;
  
  // Données pour le graphique d'évolution du retour sur investissement
  const dataFluxCumulatif = fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    fluxCumulatif: item.cumulFluxTresorerie,
    seuil: investissementInitial
  }));
  
  // Calculer le total des coûts cachés
  const totalCoutsCache = (coutFormationContinue || 0) + (coutMisesAJour || 0) + (coutConsommables || 0);
  
  // Formater les nombres avec séparateurs de milliers et devise
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(montant);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Résultats financiers
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
          <p className="text-2xl font-bold text-green-800">{Math.min(roi, 1000).toFixed(2)}%</p>
          <p className="text-xs text-gray-600">Sur {dureeVie} ans</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
          <p className={`text-2xl font-bold ${delaiRecuperation < 3 ? 'text-green-600' : 'text-blue-800'}`}>
            {delaiRecuperation.toFixed(2)} ans
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">VAN</h3>
          <p className="text-2xl font-bold text-purple-800">
            {formatMontant(van)}
          </p>
        </div>
        
        <div className="bg-indigo-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">TRI</h3>
          <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-yellow-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {formatMontant(economieAnnuelle)}
          </p>
        </div>
        
        <div className="bg-red-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Investissement initial net</h3>
          <p className="text-2xl font-bold text-red-700">
            {formatMontant(investissementInitial)}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Évolution du retour sur investissement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataFluxCumulatif}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip formatter={(value) => [formatMontant(value), 'Montant']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="fluxCumulatif" 
                name="Flux cumulatif" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="seuil" 
                name="Seuil d'investissement" 
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
        </p>
      </div>
      
      <div className="p-4 bg-white rounded-lg border border-green-200 mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Avantages du système automatisé</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ameliorationEfficacite && ameliorationEfficacite.capacite > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Traitement de <strong>{systemeAutomatise.capaciteTraitement} unités/heure</strong> contre {systemeActuel.capacite} actuellement</span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.mainOeuvre > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction de la main d'œuvre de <strong>{systemeAutomatise.nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.tauxRejets > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Diminution des rejets de <strong>{ameliorationEfficacite.tauxRejets.toFixed(1)}%</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.tempsCycle > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction du temps de cycle de <strong>{ameliorationEfficacite.tempsCycle.toFixed(1)}%</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.accidents > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction des accidents de <strong>{ameliorationEfficacite.accidents}%</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2">Attention aux coûts cachés</h3>
        <p className="text-sm mb-2">L'automatisation implique des coûts supplémentaires souvent négligés dans l'analyse initiale:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">Formation continue</p>
            <p className="text-sm">{formatMontant(coutFormationContinue || 0)}/an</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">Mises à jour logicielles</p>
            <p className="text-sm">{formatMontant(coutMisesAJour || 0)}/an</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">Consommables spécifiques</p>
            <p className="text-sm">{formatMontant(coutConsommables || 0)}/an</p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm">
            <span className="font-semibold">Impact total annuel:</span> {formatMontant(totalCoutsCache)} 
            {totalCoutsCache > 0 && economieAnnuelle > 0 && (
              <span className="ml-2">({Math.round((totalCoutsCache / economieAnnuelle) * 100)}% de l'économie annuelle)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultatsROI;