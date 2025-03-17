import React, { useContext, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalculateurPapierContext } from './CalculateurPatesPapiers';

const ResultatsFinanciers = () => {
  // Accès au contexte partagé
  const { 
    parametresSystemeAutomatise,
    resultats
  } = useContext(CalculateurPapierContext);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri,
    fluxTresorerie
  } = resultats;
  
  // Extraction des paramètres du système automatisé
  const {
    coutSysteme, coutInstallation, coutIngenierie, coutFormation,
    dureeVie, subventions
  } = parametresSystemeAutomatise;

  // Calcul de l'investissement initial
  const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
  
  // Données pour le graphique de flux de trésorerie
  const dataFluxTresorerie = useMemo(() => {
    return fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      fluxTresorerie: item.fluxAnnuel,
      fluxActualise: item.fluxActualise
    }));
  }, [fluxTresorerie]);
  
  // Données pour le graphique de rentabilité cumulative
  const dataCumulatif = useMemo(() => {
    return fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: investissementInitial
    }));
  }, [fluxTresorerie, investissementInitial]);
  
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse financière détaillée</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Investissement initial</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût du système</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(coutSysteme)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'installation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(coutInstallation)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'ingénierie</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(coutIngenierie)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût de formation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(coutFormation)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Subventions</td>
                    <td className="px-4 py-2 text-right font-medium text-green-600">
                      -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(subventions)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-400">
                    <td className="px-4 py-2 text-left font-bold">Total de l'investissement</td>
                    <td className="px-4 py-2 text-right font-bold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(investissementInitial)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Indicateurs de rentabilité</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Retour sur Investissement (ROI)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {roi.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Délai de récupération</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {delaiRecuperation.toFixed(2)} ans
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Valeur Actuelle Nette (VAN)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(van)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Taux de Rendement Interne (TRI)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {tri.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-3">Flux de trésorerie annuels</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataFluxTresorerie}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Montant']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="fluxTresorerie" 
                  name="Flux annuel" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="fluxActualise" 
                  name="Flux actualisé" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-2 italic">
            * Les flux actualisés prennent en compte la valeur temporelle de l'argent avec le taux d'actualisation spécifié.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-3">Projection des flux de trésorerie cumulés</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataCumulatif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Montant']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulatif" 
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
          <p className="text-sm text-gray-600 mt-2 italic">
            * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultatsFinanciers;