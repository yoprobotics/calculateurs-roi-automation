import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GraphCard from '../../common/GraphCard';
import { formaterDevise, formaterPourcentage } from '../../../utils/formatters';

/**
 * Composant d'analyse de sensibilité pour le calculateur ROI
 * @returns {JSX.Element} - Interface d'analyse de sensibilité
 */
const AnalyseSensibilite = () => {
  const { 
    parametreSensibilite, 
    setParametreSensibilite, 
    resultatsSensibilite,
    calculerSensibilite
  } = useCalculateurGeneral();
  
  // Données transformées pour les graphiques
  const dataSensibiliteROI = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    roi: item.roi
  }));
  
  const dataSensibiliteVAN = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    van: item.van
  }));
  
  const dataSensibilitePayback = resultatsSensibilite.map(item => ({
    variation: `${item.variation > 0 ? '+' : ''}${item.variation}%`,
    delaiRecuperation: item.delaiRecuperation
  }));
  
  // Options disponibles pour l'analyse de sensibilité
  const optionsSensibilite = [
    { value: 'coutSysteme', label: 'Coût du système' },
    { value: 'coutInstallation', label: 'Coût d\'installation' },
    { value: 'coutIngenierie', label: 'Coût d\'ingénierie' },
    { value: 'coutFormation', label: 'Coût de formation' },
    { value: 'nbEmployesRemplaces', label: 'Nombre d\'employés remplacés' },
    { value: 'augmentationProduction', label: 'Augmentation de production' },
    { value: 'coutMainOeuvre', label: 'Coût de main d\'œuvre' },
    { value: 'capaciteTraitement', label: 'Capacité de traitement' }
  ];
  
  // Couleurs pour les graphiques
  const colors = {
    roi: '#4F46E5', // Indigo
    van: '#10B981', // Vert
    delaiRecuperation: '#F59E0B' // Jaune
  };
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse de Sensibilité</h2>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paramètre à analyser</label>
          <select
            value={parametreSensibilite}
            onChange={(e) => setParametreSensibilite(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {optionsSensibilite.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Voir l'impact de la variation de ce paramètre sur les résultats</p>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={calculerSensibilite}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Recalculer l'analyse
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GraphCard title="Impact sur le ROI" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSensibiliteROI}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="variation" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'ROI']} />
              <Bar dataKey="roi" fill={colors.roi} />
            </BarChart>
          </ResponsiveContainer>
        </GraphCard>
        
        <GraphCard title="Impact sur la VAN" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSensibiliteVAN}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="variation" />
              <YAxis tickFormatter={(value) => formaterDevise(value, 'USD', 0)} />
              <Tooltip formatter={(value) => [formaterDevise(value, 'USD', 0), 'VAN']} />
              <Bar dataKey="van" fill={colors.van} />
            </BarChart>
          </ResponsiveContainer>
        </GraphCard>
        
        <GraphCard title="Impact sur le délai de récupération" height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSensibilitePayback}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="variation" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(2)} ans`, 'Délai']} />
              <Bar dataKey="delaiRecuperation" fill={colors.delaiRecuperation} />
            </BarChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Interprétation de l'analyse de sensibilité</h3>
        <p className="text-sm text-gray-700">
          L'analyse de sensibilité vous permet d'évaluer l'impact de variations dans les paramètres clés sur les résultats financiers.
          Cela vous aide à identifier les facteurs qui influencent le plus la rentabilité de votre projet et à évaluer
          les risques liés aux incertitudes dans vos estimations.
        </p>
      </div>
    </div>
  );
};

export default AnalyseSensibilite;
