import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

/**
 * Composant pour l'onglet Sécurité & Environnement du calculateur général
 * @returns {JSX.Element} - Contenu de l'onglet Sécurité
 */
const OngletSecurite = () => {
  const { 
    systemeActuel, 
    systemeAutomatise, 
    parametresGeneraux,
    resultats
  } = useCalculateurGeneral();

  // Extraction des valeurs pertinentes
  const frequenceAccidentActuel = systemeActuel.frequenceAccident;
  const coutMoyenAccident = systemeActuel.coutMoyenAccident;
  const tempsArretAccident = systemeActuel.tempsArretAccident;
  const reductionAccidents = systemeAutomatise.reductionAccidents;
  const reductionEmpreinteCO2 = systemeAutomatise.reductionEmpreinteCO2;
  const reductionEnergie = systemeAutomatise.reductionEnergie;
  const reductionEau = systemeAutomatise.reductionEau;
  const tonnageAnnuel = parametresGeneraux.tonnageAnnuel;
  const heuresOperationParJour = parametresGeneraux.heuresOperationParJour;
  const joursOperationParAn = parametresGeneraux.joursOperationParAn;

  // Calculs sécurité
  const frequenceAccidentAutomatise = frequenceAccidentActuel * (1 - reductionAccidents / 100);
  const reductionFrequenceAccident = frequenceAccidentActuel - frequenceAccidentAutomatise;
  
  const coutAnnuelAccidents = frequenceAccidentActuel * coutMoyenAccident;
  const coutAnnuelAccidentsAutomatise = frequenceAccidentAutomatise * coutMoyenAccident;
  const economieAnnuelleAccidents = coutAnnuelAccidents - coutAnnuelAccidentsAutomatise;
  
  // Calcul des heures d'arrêt évitées
  const heuresArretAnnuelles = frequenceAccidentActuel * tempsArretAccident;
  const heuresArretAnnuellesAutomatise = frequenceAccidentAutomatise * tempsArretAccident;
  const heuresArretEvitees = heuresArretAnnuelles - heuresArretAnnuellesAutomatise;
  
  // Calcul de l'impact des heures d'arrêt sur la production
  const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
  const valeurProductionHoraire = (tonnageAnnuel * parametresGeneraux.margeBrute) / heuresOperationAnnuelles;
  const coutArretAccidents = heuresArretAnnuelles * valeurProductionHoraire;
  const coutArretAccidentsAutomatise = heuresArretAnnuellesAutomatise * valeurProductionHoraire;
  const economieArretAccidents = coutArretAccidents - coutArretAccidentsAutomatise;

  // Calculs environnement
  const tonnesCO2Economisees = tonnageAnnuel * (reductionEmpreinteCO2 / 100);
  const energieEconomisee = tonnageAnnuel * (reductionEnergie / 100) * systemeAutomatise.coutEnergieTonne;
  const eauEconomisee = tonnageAnnuel * (reductionEau / 100) * systemeAutomatise.coutEauTonne;
  
  // Total des économies
  const totalEconomiesSecurite = economieAnnuelleAccidents + economieArretAccidents;
  const totalEconomiesEnvironnement = energieEconomisee + eauEconomisee;

  // Données pour les graphiques
  const dataComparaisonAccidents = [
    { name: 'Système Actuel', value: frequenceAccidentActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: frequenceAccidentAutomatise, fill: '#22c55e' }
  ];

  const dataEconomiesSecurite = [
    { name: 'Coûts directs', value: economieAnnuelleAccidents, fill: '#8b5cf6' },
    { name: 'Temps d\'arrêt', value: economieArretAccidents, fill: '#ec4899' }
  ];

  const dataEconomiesEnvironnement = [
    { name: 'Énergie', value: energieEconomisee, fill: '#0ea5e9' },
    { name: 'Eau', value: eauEconomisee, fill: '#14b8a6' }
  ];

  // Données pour le graphique d'empreinte carbone
  const COLORS = ['#ef4444', '#22c55e'];
  const dataCO2 = [
    { name: 'Émissions actuelles', value: tonnageAnnuel * 1 }, // 1 est une valeur de référence (100%)
    { name: 'Réduction prévue', value: tonnesCO2Economisees }
  ];
  
  // Projection des accidents sur 5 ans
  const dataProjectionAccidents = [];
  for (let annee = 1; annee <= 5; annee++) {
    dataProjectionAccidents.push({
      annee: `Année ${annee}`,
      actuel: frequenceAccidentActuel,
      automatise: frequenceAccidentAutomatise
    });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse de l'impact sur la sécurité et l'environnement</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Amélioration de la sécurité
          </h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Fréquence d'accidents (par an)</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonAccidents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents/an`, 'Fréquence']} />
                  <Bar dataKey="value" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-red-50 rounded">
                <p className="text-xs text-gray-500">Coût moyen par accident</p>
                <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coutMoyenAccident)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <p className="text-xs text-gray-500">Temps d'arrêt par accident</p>
                <p className="text-xl font-bold text-red-600">{tempsArretAccident}<span className="text-xs font-normal ml-1">heures</span></p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-1">Impact financier</h4>
            <p className="text-sm">Réduction des accidents: <span className="font-bold">{reductionAccidents}%</span></p>
            <p className="text-sm">Économie directe annuelle: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelleAccidents)}</span></p>
            <p className="text-sm">Économie due aux temps d'arrêt évités: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieArretAccidents)}</span></p>
            <p className="text-sm font-bold mt-2">Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEconomiesSecurite)}</p>
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
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataCO2}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dataCO2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toFixed(0), 'Tonnes CO2']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-500">Réduction des émissions de CO2</p>
                <p className="flex justify-between">
                  <span className="text-xl font-bold text-green-600">{reductionEmpreinteCO2}%</span>
                  <span className="text-sm font-medium text-green-700">{tonnesCO2Economisees.toFixed(0)} tonnes/an</span>
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-500">Réduction d'énergie et d'eau</p>
                <p className="flex justify-between">
                  <span className="text-xl font-bold text-green-600">{Math.round((reductionEnergie + reductionEau)/2)}%</span>
                  <span className="text-sm font-medium text-green-700">Moyenne</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-1">Impact économique environnemental</h4>
            <p className="text-sm">Économie d'énergie: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(energieEconomisee)}</span> ({reductionEnergie}%)</p>
            <p className="text-sm">Économie d'eau: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(eauEconomisee)}</span> ({reductionEau}%)</p>
            <p className="text-sm font-bold mt-2">Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEconomiesEnvironnement)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Projection des accidents sur 5 ans</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataProjectionAccidents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents`, '']} />
              <Legend />
              <Line type="monotone" dataKey="actuel" name="Système Actuel" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="automatise" name="Solution Automatisée" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-3">Résumé des bénéfices sécurité et environnement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition des économies de sécurité</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataEconomiesSecurite}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dataEconomiesSecurite.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition des économies environnementales</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataEconomiesEnvironnement}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dataEconomiesEnvironnement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Impact total sur 5 ans</h4>
          <p className="text-sm mb-1">
            <span className="font-bold">Économies de sécurité :</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEconomiesSecurite * 5)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Économies environnementales :</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEconomiesEnvironnement * 5)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Réduction totale des émissions CO2 :</span> {(tonnesCO2Economisees * 5).toFixed(0)} tonnes
          </p>
          <p className="text-sm font-bold text-green-700 mt-2">
            Impact financier total : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((totalEconomiesSecurite + totalEconomiesEnvironnement) * 5)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OngletSecurite;