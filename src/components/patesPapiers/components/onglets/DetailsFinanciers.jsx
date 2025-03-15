import React from 'react';
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
  
  // Extraction des valeurs de résultats
  const { roi, delaiRecuperation, van, tri } = resultats;
  
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
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions)}
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
          <FluxTresorerieGraphique data={dataGraphiques.dataCumulatif} />
        </div>
      </div>
    </div>
  );
};

export default DetailsFinanciers;