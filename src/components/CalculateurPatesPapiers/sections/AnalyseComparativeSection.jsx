import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section d'analyse comparative pour le calculateur pâtes et papiers
 * @param {Object} chartData - Données formatées pour les graphiques
 */
const AnalyseComparativeSection = ({ chartData }) => {
  const {
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux
  } = useCalculateurPatesPapiers();
  
  // Extraction des données des graphiques
  const {
    dataComparaisonCapacite,
    dataComparaisonEmployes,
    dataComparaisonRejets,
    dataComparaisonAccidents,
    dataEconomiesCategories
  } = chartData || {};
  
  // Conversion du type de système en libellé
  const getSystemeLibelle = (type) => {
    switch (type) {
      case 'manuel': return 'Manuel';
      case 'semi-auto': return 'Semi-automatisé';
      case 'auto-ancien': return 'Automatisé ancien';
      default: return 'Inconnu';
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse comparative détaillée</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Comparaison des systèmes</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm text-gray-600">
                  Système Actuel ({getSystemeLibelle(typeSystemeActuel)})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Solution Automatisée</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Comparaison de capacité */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Capacité de traitement (ballots/heure)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonCapacite} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} ballots/h`, 'Capacité']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Comparaison de nombre d'employés */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Main d'œuvre requise (ETP)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonEmployes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} ETP`, 'Main d\'œuvre']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Comparaison des taux de rejets */}
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
              Taux de rejets de fils (%)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonRejets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejets']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Comparaison d'accidents */}
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
              Fréquence d'accidents (par an)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonAccidents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} par an`, 'Accidents']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-8 h-80">
          <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataEconomiesCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [
                new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 
                'Économie'
              ]} />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Comparaison des systèmes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 border rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Équipement actuel</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Type de système</td>
                  <td className="py-2 text-right">{getSystemeLibelle(typeSystemeActuel)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Capacité de production</td>
                  <td className="py-2 text-right">{parametresSystemeActuel.capacite} ballots/h</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Main d'œuvre requise</td>
                  <td className="py-2 text-right">{parametresSystemeActuel.nombreEmployes} ETP</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Taux de rejets</td>
                  <td className="py-2 text-right">{parametresSystemeActuel.tauxRejets}%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Maintenance annuelle</td>
                  <td className="py-2 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametresSystemeActuel.maintenance)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Fréquence d'accidents</td>
                  <td className="py-2 text-right">{parametresSystemeActuel.frequenceAccident} par an</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-3">Solution automatisée</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-green-200">
                  <td className="py-2 font-medium">Type de système</td>
                  <td className="py-2 text-right">Automatisé nouvelle génération</td>
                </tr>
                <tr className="border-b border-green-200">
                  <td className="py-2 font-medium">Capacité de production</td>
                  <td className="py-2 text-right">{parametresSystemeAutomatise.capaciteTraitement} ballots/h</td>
                </tr>
                <tr className="border-b border-green-200">
                  <td className="py-2 font-medium">Main d'œuvre requise</td>
                  <td className="py-2 text-right">
                    {(parametresSystemeActuel.nombreEmployes - parametresSystemeAutomatise.nbEmployesRemplaces).toFixed(1)} ETP
                  </td>
                </tr>
                <tr className="border-b border-green-200">
                  <td className="py-2 font-medium">Taux de rejets</td>
                  <td className="py-2 text-right">{parametresSystemeAutomatise.tauxRejets}%</td>
                </tr>
                <tr className="border-b border-green-200">
                  <td className="py-2 font-medium">Maintenance annuelle</td>
                  <td className="py-2 text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametresSystemeAutomatise.coutMaintenance)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Fréquence d'accidents</td>
                  <td className="py-2 text-right">
                    {(parametresSystemeActuel.frequenceAccident * (1 - parametresSystemeAutomatise.reductionAccidents / 100)).toFixed(2)} par an
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Conditions d'opération</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Heures d'opération:</span> {parametresGeneraux.heuresOperationParJour} heures/jour
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Jours d'opération:</span> {parametresGeneraux.joursOperationParAn} jours/an
              </p>
              <p className="text-sm">
                <span className="font-medium">Total annuel:</span> {parametresGeneraux.heuresOperationParJour * parametresGeneraux.joursOperationParAn} heures
              </p>
            </div>
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Tonnage annuel:</span> {parametresGeneraux.tonnageAnnuel.toLocaleString()} tonnes
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Marge brute par tonne:</span> {parametresGeneraux.margeBrute} $/tonne
              </p>
              <p className="text-sm">
                <span className="font-medium">Marge brute annuelle:</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametresGeneraux.tonnageAnnuel * parametresGeneraux.margeBrute)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyseComparativeSection;
