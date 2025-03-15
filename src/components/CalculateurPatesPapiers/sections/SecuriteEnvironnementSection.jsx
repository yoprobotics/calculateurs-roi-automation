import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculateurPatesPapiers } from '../../../contexts/CalculateurPatesPapiersContext';

/**
 * Section de sécurité et environnement pour le calculateur pâtes et papiers
 * @param {Object} chartData - Données formatées pour les graphiques
 */
const SecuriteEnvironnementSection = ({ chartData }) => {
  const { 
    parametresSystemeActuel, 
    parametresSystemeAutomatise,
    resultats
  } = useCalculateurPatesPapiers();
  
  // Extraction des valeurs pour plus de lisibilité
  const { 
    frequenceAccident, coutMoyenAccident, tempsArretAccident 
  } = parametresSystemeActuel;
  
  const { 
    reductionAccidents, reductionEmpreinteCO2, reductionEnergie, reductionDechet, reductionEau 
  } = parametresSystemeAutomatise;
  
  const { 
    economiesSecurite, economiesTempsArret, economiesCO2 
  } = resultats;
  
  // Données pour le graphique de comparaison des accidents
  const dataAccidents = [
    { 
      name: 'Système Actuel', 
      value: frequenceAccident, 
      fill: '#ef4444' 
    },
    { 
      name: 'Solution Automatisée', 
      value: frequenceAccident * (1 - reductionAccidents / 100), 
      fill: '#22c55e' 
    }
  ];
  
  // Données pour le graphique de comparaison environnementale
  const dataEnvironnement = [
    { name: 'Émissions CO2', reduction: reductionEmpreinteCO2 },
    { name: 'Consommation d\'énergie', reduction: reductionEnergie },
    { name: 'Production de déchets', reduction: reductionDechet },
    { name: 'Consommation d\'eau', reduction: reductionEau }
  ];
  
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
        <h2 className="text-xl font-semibold mb-4 text-green-700">Sécurité des travailleurs et impact environnemental</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Amélioration de la sécurité
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Statistiques actuelles</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-500">Fréquence d'accidents</p>
                  <p className="text-xl font-bold text-red-600">
                    {frequenceAccident.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span>
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-500">Coût moyen par accident</p>
                  <p className="text-xl font-bold text-red-600">{formatMoney(coutMoyenAccident)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-1">Impact financier</h4>
                <p className="text-sm">Réduction des accidents : <span className="font-bold">{reductionAccidents}%</span></p>
                <p className="text-sm">Économie annuelle estimée : <span className="font-bold">{formatMoney(economiesSecurite + economiesTempsArret)}</span></p>
              </div>
            </div>
            
            <div className="h-60">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Fréquence d'accidents (par an)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataAccidents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)} par an`, 'Accidents']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
              Impact environnemental
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Réduction de l'empreinte écologique</h4>
              
              <div className="space-y-4 mb-4">
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction des émissions de CO2</p>
                  <p className="flex justify-between">
                    <span className="text-xl font-bold text-green-600">{reductionEmpreinteCO2}%</span>
                    <span className="text-sm font-medium text-green-700">{economiesCO2.toFixed(0)} tonnes sur la durée de vie</span>
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction de la consommation d'énergie</p>
                  <p className="text-xl font-bold text-green-600">{reductionEnergie}%</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction des déchets et rebuts</p>
                  <p className="text-xl font-bold text-green-600">{reductionDechet}%</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction de la consommation d'eau</p>
                  <p className="text-xl font-bold text-green-600">{reductionEau}%</p>
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Réduction d'impact environnemental (%)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataEnvironnement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Réduction']} />
                  <Bar dataKey="reduction" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-3">Dispositifs de sécurité du système automatisé</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies de sécurité</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Barrières immatérielles de sécurité classe 4</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Arrêts d'urgence redondants à plusieurs emplacements</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Systèmes de détection de présence humaine</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Protections mécaniques avec interverrouillage</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bénéfices pour les opérateurs</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Élimination des tâches répétitives et à risque de TMS</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Réduction des manipulations manuelles de charges lourdes</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Interface opérateur ergonomique et intuitive</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Formation complète à l'utilisation sécuritaire</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Certification et conformité</h4>
            <p className="text-sm mb-1">
              Le système est conçu selon les normes ISO 13849 (Sécurité des machines) et respecte toutes les exigences réglementaires en vigueur.
            </p>
            <p className="text-sm">
              Impact sur le temps d'arrêt : <span className="font-bold">réduction de {tempsArretReduit || 70}% du temps d'arrêt non planifié</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuriteEnvironnementSection;
