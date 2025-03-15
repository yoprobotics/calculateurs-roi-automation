import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Section d'analyse comparative des performances
 * @param {Object} chartData - Données formatées pour les graphiques
 */
const AnalyseComparativeSection = ({ chartData }) => {
  const {
    systemeActuel,
    parametresSystemeAutomatise
  } = useCalculateurGeneral();
  
  // Extraction des données des graphiques
  const {
    dataComparaisonCapacite,
    dataComparaisonEmployes,
    dataComparaisonRejets,
    dataComparaisonAccidents,
    dataEconomiesCategories,
    dataTempsDesCycles
  } = chartData || {};
  
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
                  Système Actuel ({
                    systemeActuel.type === 'manuel' 
                      ? 'Manuel' 
                      : systemeActuel.type === 'semi-auto' 
                        ? 'Semi-auto' 
                        : 'Auto ancien'
                  })
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
                Capacité de traitement (unités/heure)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonCapacite} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Comparaison de temps de cycle */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                Temps de cycle (secondes/unité)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTempsDesCycles} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} sec/unité`, 'Temps de cycle']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Comparaison d'employés */}
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
          
          {/* Comparaison de rejets */}
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
              Taux de rejets (%)
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          
          {/* Économies par catégorie */}
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
              Économies annuelles par catégorie ($)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataEconomiesCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [
                  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 
                  'Économie'
                ]} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Comparaison qualitative</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800 mb-3">Système Actuel</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Interventions manuelles fréquentes nécessaires</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Risques d'accidents plus élevés</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Variabilité dans la qualité du produit</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Temps d'arrêt non planifiés plus fréquents</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-3">Système Automatisé</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Opération continue sans interruption</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Sécurité améliorée pour les opérateurs</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Qualité constante et traçabilité améliorée</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Maintenance prédictive réduisant les arrêts non planifiés</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyseComparativeSection;
