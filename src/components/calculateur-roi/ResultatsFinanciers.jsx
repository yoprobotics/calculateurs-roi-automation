import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant pour afficher les résultats financiers
 */
const ResultatsFinanciers = ({ resultats, parametresSystemeAutomatise }) => {
  const { 
    roi, delaiRecuperation, van, tri, economieAnnuelle, fluxTresorerie, economiesCO2
  } = resultats;
  
  const { 
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, subventions, dureeVie
  } = parametresSystemeAutomatise;
  
  const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
  
  // Données pour le graphique de ROI cumulatif
  const dataCumulatif = fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    fluxCumulatif: item.cumulFluxTresorerie,
    seuil: investissementInitial
  }));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Résultats financiers
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
          <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
          <p className="text-xs text-gray-600">Sur {dureeVie} ans</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
          <p className="text-2xl font-bold text-blue-800">{delaiRecuperation.toFixed(2)} ans</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-yellow-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
          </p>
        </div>
        
        <div className="bg-red-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Investissement initial net</h3>
          <p className="text-2xl font-bold text-red-700">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(investissementInitial)}
          </p>
        </div>
        
        {/* Ajout de l'indicateur d'économies de CO2 */}
        <div className="bg-green-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Réduction CO2 totale</h3>
          <p className="text-2xl font-bold text-green-700">
            {economiesCO2 ? economiesCO2.toFixed(1) : '0'} tonnes
          </p>
          <p className="text-xs text-gray-600">Sur la durée de vie du système</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Évolution du retour sur investissement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataCumulatif}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Montant']} />
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
      
      <div className="p-4 bg-white rounded-lg border border-green-200 mb-4">
        <h3 className="font-medium text-gray-800 mb-2">Avantages du système automatisé</h3>
        <div className="space-y-2">
          {parametresSystemeAutomatise.capaciteTraitement > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Traitement de <strong>{parametresSystemeAutomatise.capaciteTraitement} unités/heure</strong></span>
            </div>
          )}
          
          {parametresSystemeAutomatise.nbEmployesRemplaces > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction de la main d'œuvre de <strong>{parametresSystemeAutomatise.nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
            </div>
          )}
          
          {parametresSystemeAutomatise.reductionAccidents > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction des accidents de <strong>{parametresSystemeAutomatise.reductionAccidents}%</strong></span>
            </div>
          )}
          
          {parametresSystemeAutomatise.augmentationProduction > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Gain de flexibilité de production de <strong>{parametresSystemeAutomatise.augmentationProduction}%</strong></span>
            </div>
          )}
          
          {/* Ajout de l'avantage de réduction des émissions de CO2 */}
          {parametresSystemeAutomatise.reductionEmissionsCO2 > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction de l'empreinte carbone de <strong>{parametresSystemeAutomatise.reductionEmissionsCO2}%</strong></span>
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
            <p className="text-sm">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutFormationContinue)}/an</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">Mises à jour logicielles</p>
            <p className="text-sm">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutMisesAJour)}/an</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-medium">Consommables spécifiques</p>
            <p className="text-sm">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutConsommables)}/an</p>
          </div>
        </div>
      </div>
      
      {/* Ajout d'une section pour l'impact environnemental */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Impact environnemental
        </h3>
        <div className="flex items-start">
          <div className="mr-4">
            <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
              <p className="font-medium text-green-800">Réduction d'émissions CO2</p>
              <p className="text-2xl font-bold text-green-700">{economiesCO2 ? (economiesCO2 / dureeVie).toFixed(1) : '0'} tonnes/an</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">
              L'automatisation de votre processus contribue à réduire votre empreinte carbone grâce à:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                <p className="text-sm">Une meilleure efficacité énergétique</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                <p className="text-sm">Réduction des déchets et rebuts</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                <p className="text-sm">Optimisation des ressources utilisées</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                <p className="text-sm">Diminution des transports et déplacements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
        {van > 0 && delaiRecuperation < dureeVie ? (
          <div className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-green-700">Projet recommandé</p>
              <p className="text-sm">Cet investissement en automatisation est financièrement viable avec un ROI positif et un délai de récupération raisonnable.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold text-amber-700">À réévaluer</p>
              <p className="text-sm">Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultatsFinanciers;