import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalculateurPapierContext } from './CalculateurPatesPapiers';

const ImpactEnvironnemental = () => {
  // Accès au contexte partagé
  const { 
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats
  } = useContext(CalculateurPapierContext);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    economiesCO2, economiesSecurite, economiesTempsArret 
  } = resultats;
  
  // Extraction des valeurs des paramètres généraux
  const { tonnageAnnuel } = parametresGeneraux;
  
  // Extraction des valeurs des paramètres du système actuel
  const {
    frequenceAccident, coutMoyenAccident
  } = parametresSystemeActuel;
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    reductionAccidents, reductionEmpreinteCO2, reductionEnergie,
    reductionEau, dureeVie
  } = parametresSystemeAutomatise;
  
  // Calcul des réductions annuelles
  const reductionAccidentsAnnuels = frequenceAccident * reductionAccidents / 100;
  const reductionCO2Annuelle = (tonnageAnnuel * reductionEmpreinteCO2 / 100);
  const reductionEauAnnuelle = (tonnageAnnuel * reductionEau / 100);
  
  // Données pour le graphique d'économies de sécurité
  const dataSecurite = useMemo(() => [
    { name: 'Avant automatisation', accidents: frequenceAccident, fill: '#ef4444' },
    { name: 'Après automatisation', accidents: frequenceAccident * (1 - reductionAccidents / 100), fill: '#22c55e' }
  ], [frequenceAccident, reductionAccidents]);
  
  // Données pour le graphique d'impact environnemental cumulé
  const dataEnvironnement = useMemo(() => {
    const impactAnnees = [];
    for (let annee = 1; annee <= dureeVie; annee++) {
      impactAnnees.push({
        annee: `Année ${annee}`,
        co2: reductionCO2Annuelle * annee,
        eau: reductionEauAnnuelle * annee
      });
    }
    return impactAnnees;
  }, [dureeVie, reductionCO2Annuelle, reductionEauAnnuelle]);
  
  // Données pour le graphique en camembert des économies
  const dataCamembert = useMemo(() => [
    { name: 'Économies d\'énergie', value: reductionEnergie, fill: '#22c55e' },
    { name: 'Économies d\'eau', value: reductionEau, fill: '#3b82f6' },
    { name: 'Réduction CO2', value: reductionEmpreinteCO2, fill: '#8b5cf6' }
  ], [reductionEnergie, reductionEau, reductionEmpreinteCO2]);
  
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
                  <p className="text-xl font-bold text-red-600">{frequenceAccident.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span></p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-500">Coût moyen par accident</p>
                  <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coutMoyenAccident)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-1">Impact financier</h4>
                <p className="text-sm">Réduction des accidents : <span className="font-bold">{reductionAccidents}%</span></p>
                <p className="text-sm">Économie annuelle estimée : <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economiesSecurite + economiesTempsArret)}</span></p>
              </div>
            </div>
            
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Fréquence des accidents par an</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataSecurite}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents/an`, 'Fréquence']} />
                  <Legend />
                  <Bar dataKey="accidents" fill={(entry) => entry.fill} />
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
                    <span className="text-sm font-medium text-green-700">{economiesCO2.toFixed(0)} tonnes sur {dureeVie} ans</span>
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-500">Économies d'eau</p>
                  <p className="flex justify-between">
                    <span className="text-xl font-bold text-blue-600">{reductionEau}%</span>
                    <span className="text-sm font-medium text-blue-700">{(reductionEauAnnuelle * dureeVie).toFixed(0)} tonnes sur {dureeVie} ans</span>
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-xs text-gray-500">Économies d'énergie</p>
                  <p className="text-xl font-bold text-purple-600">{reductionEnergie}%</p>
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Répartition des économies environnementales</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataCamembert}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dataCamembert.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Réduction']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-3">Impact environnemental cumulé</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataEnvironnement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="co2" name="Réduction CO2 (tonnes)" fill="#8b5cf6" />
                <Bar dataKey="eau" name="Économies d'eau (tonnes)" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-2 italic">
            * Les valeurs représentent les économies cumulatives au fil des années.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactEnvironnemental;