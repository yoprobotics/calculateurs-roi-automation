import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section des détails financiers pour le calculateur pâtes et papiers
 * @param {Object} chartData - Données formatées pour les graphiques
 */
const DetailsFinanciersSection = ({ chartData }) => {
  const { 
    parametresSystemeAutomatise, 
    resultats 
  } = useCalculateurPatesPapiers();
  
  // Extraction des données pour plus de lisibilité
  const { 
    coutSysteme, coutInstallation, coutIngenierie, coutFormation,
    coutFormationContinue, coutLogiciel, subventions, dureeVie
  } = parametresSystemeAutomatise;
  
  const { 
    roi, delaiRecuperation, van, tri, fluxTresorerie = [] 
  } = resultats;
  
  // Calcul de l'investissement initial
  const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + 
                               coutFormation + (coutLogiciel || 0) - (subventions || 0);
  
  // Génération des données pour le graphique de flux cumulatif
  const dataCumulatif = fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    cumulatif: item.cumulFluxTresorerie,
    seuil: investissementInitial
  }));
  
  // Formatage monétaire
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
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
                      {formatMoney(coutSysteme)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'installation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatMoney(coutInstallation)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût d'ingénierie</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatMoney(coutIngenierie)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coût de formation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatMoney(coutFormation)}
                    </td>
                  </tr>
                  {coutLogiciel > 0 && (
                    <tr className="border-t">
                      <td className="px-4 py-2 text-left">Coût des logiciels</td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatMoney(coutLogiciel)}
                      </td>
                    </tr>
                  )}
                  {coutFormationContinue > 0 && (
                    <tr className="border-t">
                      <td className="px-4 py-2 text-left">Formation continue (1ère année)</td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatMoney(coutFormationContinue)}
                      </td>
                    </tr>
                  )}
                  {subventions > 0 && (
                    <tr className="border-t">
                      <td className="px-4 py-2 text-left">Subventions</td>
                      <td className="px-4 py-2 text-right font-medium text-green-600">
                        -{formatMoney(subventions)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-400">
                    <td className="px-4 py-2 text-left font-bold">Total de l'investissement</td>
                    <td className="px-4 py-2 text-right font-bold">
                      {formatMoney(investissementInitial)}
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
                      {formatMoney(van)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Taux de Rendement Interne (TRI)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {tri.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Durée de vie du système</td>
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataCumulatif}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip formatter={(value) => [formatMoney(value), 'Montant']} />
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
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Détail des flux annuels</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Année</th>
                  <th className="px-4 py-2 text-right">Flux annuel</th>
                  <th className="px-4 py-2 text-right">Flux actualisé</th>
                  <th className="px-4 py-2 text-right">Flux cumulatif</th>
                </tr>
              </thead>
              <tbody>
                {fluxTresorerie.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-left">Année {item.annee}</td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(item.fluxAnnuel)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(item.fluxActualise)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(item.cumulFluxTresorerie)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-2">Guide d'interprétation des indicateurs financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">ROI (Retour sur Investissement)</h4>
            <p className="text-sm mb-2">Mesure la rentabilité globale de l'investissement dans le système de désempilement automatisé.</p>
            <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
              <li><span className="font-medium">ROI > 100%</span> : L'investissement génère plus de valeur qu'il n'en coûte.</li>
              <li><span className="font-medium">ROI entre 50% et 100%</span> : Bonne rentabilité.</li>
              <li><span className="font-medium">ROI < 50%</span> : Rentabilité modeste mais peut être justifiée par d'autres avantages.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Délai de récupération</h4>
            <p className="text-sm mb-2">Temps nécessaire pour récupérer l'investissement initial dans le système automatisé.</p>
            <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
              <li><span className="font-medium">< 2 ans</span> : Excellent - Récupération très rapide.</li>
              <li><span className="font-medium">2-4 ans</span> : Bon - Conforme aux attentes pour l'automatisation.</li>
              <li><span className="font-medium">> 4 ans</span> : Acceptable pour des projets stratégiques à long terme.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">VAN (Valeur Actuelle Nette)</h4>
            <p className="text-sm mb-2">Valeur créée par l'investissement en tenant compte du temps.</p>
            <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
              <li><span className="font-medium">VAN > 0</span> : L'investissement crée de la valeur.</li>
              <li><span className="font-medium">VAN < 0</span> : L'investissement détruit de la valeur (au taux d'actualisation choisi).</li>
              <li>Plus la VAN est élevée, plus l'investissement est intéressant financièrement.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">TRI (Taux de Rendement Interne)</h4>
            <p className="text-sm mb-2">Taux de rentabilité annualisé de l'investissement dans le système automatisé.</p>
            <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
              <li><span className="font-medium">TRI > taux d'actualisation</span> : L'investissement est rentable.</li>
              <li><span className="font-medium">TRI > 20%</span> : Excellent rendement pour un équipement industriel.</li>
              <li><span className="font-medium">TRI entre 10% et 20%</span> : Bon rendement pour ce secteur.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFinanciersSection;
