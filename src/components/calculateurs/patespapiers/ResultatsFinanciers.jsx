import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculateurPapier } from '../../../context/CalculateurPapierContext';

const ResultatsFinanciers = () => {
  const { 
    parametresSystemeAutomatise,
    resultats
  } = useCalculateurPapier();
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    coutSysteme, 
    coutInstallation, 
    coutIngenierie, 
    coutFormation, 
    dureeVie,
    subventions
  } = parametresSystemeAutomatise;
  
  // Extraction des résultats
  const { 
    roi, 
    delaiRecuperation, 
    van, 
    tri, 
    fluxTresorerie 
  } = resultats;
  
  // Données pour le graphique de flux de trésorerie cumulatif
  const dataCumulatif = useMemo(() => {
    return fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
    }));
  }, [fluxTresorerie, coutSysteme, coutInstallation, coutIngenierie, coutFormation, subventions]);
  
  // Calcul de l'investissement initial
  const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
  
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
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Durée de vie du projet</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {dureeVie} ans
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Interprétation</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>ROI de {roi.toFixed(2)}%</strong> - Excellente rentabilité sur la durée de vie du projet.</li>
                <li><strong>Délai de récupération de {delaiRecuperation.toFixed(2)} ans</strong> - {delaiRecuperation <= 2 ? 'Retour sur investissement très rapide.' : 'Période de récupération acceptable.'}</li>
                <li><strong>VAN positive</strong> - Le projet crée de la valeur pour l'entreprise.</li>
                <li><strong>TRI de {tri.toFixed(2)}%</strong> - Taux de rendement interne très attractif.</li>
              </ul>
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
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Détail des flux de trésorerie annuels</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                  <th className="py-2 px-3 text-center">Année</th>
                  <th className="py-2 px-3 text-right">Écon. Main d'œuvre</th>
                  <th className="py-2 px-3 text-right">Écon. Qualité</th>
                  <th className="py-2 px-3 text-right">Écon. Sécurité</th>
                  <th className="py-2 px-3 text-right">Gain Production</th>
                  <th className="py-2 px-3 text-right">Écon. Maintenance</th>
                  <th className="py-2 px-3 text-right">Écon. Énergie</th>
                  <th className="py-2 px-3 text-center font-bold">Flux Annuel</th>
                  <th className="py-2 px-3 text-center">Flux Actualisé</th>
                  <th className="py-2 px-3 text-center">Cumulatif</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-xs">
                {fluxTresorerie.map((item) => (
                  <tr key={item.annee} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3 text-center font-medium">Année {item.annee}</td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.economiePersonnel)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.beneficeQualite + item.economieRejets)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.economieSecuriteAjustee + item.economieTempsArretAjustee)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.beneficeSupplementaire)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.economieMaintenance)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.economieEnergie + item.economieEnergieProcessus + item.economieEau)}
                    </td>
                    <td className="py-2 px-3 text-center font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.fluxAnnuel)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.fluxActualise)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.cumulFluxTresorerie)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultatsFinanciers;