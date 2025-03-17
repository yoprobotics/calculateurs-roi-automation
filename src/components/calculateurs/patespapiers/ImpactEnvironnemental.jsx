import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCalculateurPapier } from '../../../context/CalculateurPapierContext';

const ImpactEnvironnemental = () => {
  const { 
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats
  } = useCalculateurPapier();
  
  // Extraction des valeurs des paramètres du système actuel
  const {
    frequenceAccident: frequenceAccidentActuel,
    coutMoyenAccident
  } = parametresSystemeActuel;
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    reductionEnergie,
    reductionEau,
    reductionEmpreinteCO2,
    reductionAccidents,
    dureeVie
  } = parametresSystemeAutomatise;
  
  // Extraction des valeurs des paramètres généraux
  const { tonnageAnnuel } = parametresGeneraux;
  
  // Extraction des résultats
  const { 
    economiesCO2,
    economiesSecurite,
    economiesTempsArret
  } = resultats;
  
  // Données pour le graphique de réduction des accidents
  const dataReductionAccidents = [
    { name: 'Système Actuel', value: frequenceAccidentActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: frequenceAccidentActuel * (1 - reductionAccidents/100), fill: '#22c55e' }
  ];
  
  // Données pour le graphique des économies environnementales
  const dataEnvironnement = [
    { name: 'Réduction CO2', value: reductionEmpreinteCO2 },
    { name: 'Économie d\'énergie', value: reductionEnergie },
    { name: 'Économie d\'eau', value: reductionEau }
  ];
  
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
                  <p className="text-xl font-bold text-red-600">{frequenceAccidentActuel.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span></p>
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
              
              <div className="h-60 mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Comparaison de la fréquence d'accidents</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataReductionAccidents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents/an`, 'Fréquence']} />
                    <Bar dataKey="value" fill={(entry) => entry.fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
              <h4 className="font-medium text-blue-800 mb-2">Dispositifs de sécurité intégrés</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Barrières immatérielles pour la détection de présence</li>
                <li>Système d'arrêt d'urgence avec redondance</li>
                <li>Capteurs de détection d'obstacles et de mouvement</li>
                <li>Interface opérateur ergonomique</li>
                <li>Formation complète à la sécurité incluse</li>
              </ul>
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
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction de la consommation d'énergie</p>
                  <p className="flex justify-between">
                    <span className="text-xl font-bold text-green-600">{reductionEnergie}%</span>
                    <span className="text-sm font-medium text-green-700">{(tonnageAnnuel * reductionEnergie / 100).toFixed(0)} kWh par an</span>
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction de la consommation d'eau</p>
                  <p className="flex justify-between">
                    <span className="text-xl font-bold text-green-600">{reductionEau}%</span>
                    <span className="text-sm font-medium text-green-700">{(tonnageAnnuel * reductionEau / 1000).toFixed(0)} m³ par an</span>
                  </p>
                </div>
              </div>
              
              <div className="h-60 mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Pourcentage de réduction par catégorie</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataEnvironnement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Réduction']} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
              <h4 className="font-medium text-green-800 mb-2">Engagement environnemental</h4>
              <p className="text-sm mb-3">
                Notre solution s'inscrit dans une démarche de développement durable en limitant considérablement :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Les émissions de gaz à effet de serre</li>
                <li>La consommation d'eau et d'énergie</li>
                <li>Les déchets liés aux rejets de production</li>
                <li>L'utilisation de ressources non renouvelables</li>
              </ul>
              <p className="text-sm mt-3 text-green-700 font-medium">
                Impact sur {dureeVie} ans : réduction de {economiesCO2.toFixed(0)} tonnes de CO2
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Conformité réglementaire et certification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Normes de sécurité</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>ISO 13849-1 (PLd) - Sécurité des machines</li>
                <li>IEC 62061 (SIL 2) - Sécurité fonctionnelle</li>
                <li>ISO 10218 - Exigences de sécurité pour les robots industriels</li>
                <li>CSA/ANSI RIA R15.06 - Normes nord-américaines</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Certification environnementale</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>ISO 14001 - Système de management environnemental</li>
                <li>BREEAM - Certification pour construction durable</li>
                <li>Certification Energy Star pour efficacité énergétique</li>
                <li>Empreinte carbone vérifiée selon ISO 14064</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactEnvironnemental;