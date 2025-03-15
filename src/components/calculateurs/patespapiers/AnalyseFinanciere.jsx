import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { GraphCard } from '../../common/GraphCard';

/**
 * Composant d'analyse financière détaillée
 * @returns {JSX.Element} - Interface d'analyse financière
 */
const AnalyseFinanciere = () => {
  const {
    systemeAutomatise,
    resultats
  } = useCalculateurPatesPapiers();

  const { 
    coutSysteme, 
    coutInstallation, 
    coutIngenierie, 
    coutFormation, 
    dureeVie,
    subventions
  } = systemeAutomatise;

  const { 
    roi, 
    delaiRecuperation, 
    van, 
    tri,
    fluxTresorerie
  } = resultats;

  // Formatage de montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Calcul de l'investissement initial
  const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;

  // Données pour le graphique de ROI cumulatif
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
                      {formatCurrency(coutSysteme)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'installation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(coutInstallation)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'ingénierie</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(coutIngenierie)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût de formation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(coutFormation)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Subventions</td>
                    <td className="px-4 py-2 text-right font-medium text-green-600">
                      -{formatCurrency(subventions)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-400">
                    <td className="px-4 py-2 text-left font-bold">Total de l'investissement</td>
                    <td className="px-4 py-2 text-right font-bold">
                      {formatCurrency(investissementInitial)}
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
                      {formatCurrency(van)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Taux de Rendement Interne (TRI)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {tri.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Durée de vie estimée</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {dureeVie} ans
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-3">Projection des flux de trésorerie</h3>
          <GraphCard title="" height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataCumulatif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Montant']} />
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
          </GraphCard>
          <p className="text-sm text-gray-600 mt-2 italic">
            * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Analyse de risque simplifiée</h3>
          <p className="text-sm mb-3">
            Voici une évaluation des indicateurs financiers clés pour ce projet:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded border ${delaiRecuperation <= 2 ? 'bg-green-50 border-green-200' : delaiRecuperation <= 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm font-medium">Délai de récupération</p>
              <p className={`text-sm ${delaiRecuperation <= 2 ? 'text-green-700' : delaiRecuperation <= 4 ? 'text-yellow-700' : 'text-red-700'}`}>
                {delaiRecuperation <= 2 
                  ? '✓ Excellent (< 2 ans)' 
                  : delaiRecuperation <= 4 
                    ? '⚠ Acceptable (2-4 ans)' 
                    : '✗ Long (> 4 ans)'}
              </p>
            </div>
            <div className={`p-3 rounded border ${van > investissementInitial ? 'bg-green-50 border-green-200' : van > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm font-medium">VAN</p>
              <p className={`text-sm ${van > investissementInitial ? 'text-green-700' : van > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                {van > investissementInitial 
                  ? '✓ Très rentable' 
                  : van > 0 
                    ? '⚠ Rentable' 
                    : '✗ Non rentable'}
              </p>
            </div>
            <div className={`p-3 rounded border ${tri > 25 ? 'bg-green-50 border-green-200' : tri > 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm font-medium">TRI</p>
              <p className={`text-sm ${tri > 25 ? 'text-green-700' : tri > 10 ? 'text-yellow-700' : 'text-red-700'}`}>
                {tri > 25 
                  ? '✓ Excellent (> 25%)' 
                  : tri > 10 
                    ? '⚠ Acceptable (10-25%)' 
                    : '✗ Faible (< 10%)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyseFinanciere;
