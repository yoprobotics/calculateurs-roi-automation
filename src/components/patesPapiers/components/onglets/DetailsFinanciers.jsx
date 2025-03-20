import React, { useState } from 'react';
import FluxTresorerieGraphique from '../graphiques/FluxTresorerieGraphique';
import useGraphiques from '../../hooks/useGraphiques';

/**
 * Composant pour l'onglet Détails financiers
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Contenu de l'onglet Détails financiers
 */
const DetailsFinanciers = ({
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats
}) => {
  // État pour le type de flux à afficher
  const [typeFlux, setTypeFlux] = useState('cumul'); // 'cumul' ou 'annuel'
  
  // Utilisation du hook personnalisé pour générer les données des graphiques
  const dataGraphiques = useGraphiques(
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    resultats,
    parametresGeneraux
  );
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    coutSysteme,
    coutInstallation,
    coutIngenierie,
    coutFormation,
    coutMaintenance,
    coutEnergie,
    dureeVie,
    subventions
  } = parametresSystemeAutomatise;
  
  // Extraction des paramètres généraux
  const { tauxActualisation } = parametresGeneraux;
  
  // Extraction des valeurs de résultats
  const { 
    roi, roiActualise, delaiRecuperation, delaiRecuperationActualise, 
    van, tri, indiceRentabilite, parametresOperationnels 
  } = resultats;
  
  // Extraction des paramètres opérationnels
  const { tco } = parametresOperationnels;
  
  // Investissement initial total
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
            
            <h3 className="font-medium text-gray-700 mb-3 mt-6">Coût total de possession (TCO)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Investissement initial</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(investissementInitial)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Coûts opérationnels actualisés ({dureeVie} ans)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(tco - investissementInitial)}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-400">
                    <td className="px-4 py-2 text-left font-bold">TCO sur {dureeVie} ans</td>
                    <td className="px-4 py-2 text-right font-bold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(tco)}
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
                    <td className="px-4 py-2 text-left">ROI actualisé</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {roiActualise.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Délai de récupération</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {delaiRecuperation.toFixed(2)} ans
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Délai de récupération actualisé</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {delaiRecuperationActualise.toFixed(2)} ans
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
                      {tri ? tri.toFixed(2) : "N/A"}%
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Indice de rentabilité (IR)</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {indiceRentabilite.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-left">Taux d'actualisation</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {tauxActualisation}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Comment interpréter ces indicateurs?</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li><strong>ROI</strong>: Rendement total de l'investissement sur toute la durée de vie.</li>
                <li><strong>ROI actualisé</strong>: Tient compte de la valeur temporelle de l'argent.</li>
                <li><strong>Délai de récupération</strong>: Temps nécessaire pour récupérer l'investissement initial.</li>
                <li><strong>VAN</strong>: Valeur créée par l'investissement en tenant compte du taux d'actualisation.</li>
                <li><strong>TRI</strong>: Taux de rendement annualisé du projet.</li>
                <li><strong>IR</strong>: Rapport entre la VAN et l'investissement initial (>1 est favorable).</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-700">Flux de trésorerie</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded ${typeFlux === 'cumul' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setTypeFlux('cumul')}
              >
                Cumulatif
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded ${typeFlux === 'annuel' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setTypeFlux('annuel')}
              >
                Annuel
              </button>
            </div>
          </div>
          {typeFlux === 'cumul' ? (
            <FluxTresorerieGraphique data={dataGraphiques.dataCumulatif} />
          ) : (
            <FluxTresorerieGraphique data={dataGraphiques.dataAnnuel} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFinanciers;