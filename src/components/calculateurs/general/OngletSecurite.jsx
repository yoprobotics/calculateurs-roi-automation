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

  // Extraction des valeurs pertinentes pour la sécurité
  const frequenceAccidentActuel = systemeActuel.frequenceAccident;
  const coutMoyenAccident = systemeActuel.coutMoyenAccident;
  const tempsArretAccident = systemeActuel.tempsArretAccident;
  const reductionAccidents = systemeAutomatise.reductionAccidents;
  
  // Extraction des valeurs environnementales
  const emissionCO2Actuel = systemeActuel.emissionCO2;
  const emissionCO2Automatise = systemeAutomatise.emissionCO2;
  const reductionEmpreinteCO2 = systemeAutomatise.reductionEmpreinteCO2;
  
  // Eau
  const consommationEauActuel = systemeActuel.consommationEau;
  const coutEauActuel = systemeActuel.coutEau;
  const consommationEauAutomatise = systemeAutomatise.consommationEau;
  const reductionConsommationEau = systemeAutomatise.reductionConsommationEau;
  
  // Air comprimé
  const consommationAirActuel = systemeActuel.consommationAirComprime;
  const coutAirComprime = systemeActuel.coutAirComprime;
  const consommationAirAutomatise = systemeAutomatise.consommationAirComprime;
  const reductionConsommationAir = systemeAutomatise.reductionConsommationAirComprime;
  
  // Hydraulique
  const consommationHydrauliqueActuel = systemeActuel.consommationHydraulique;
  const coutHydraulique = systemeActuel.coutHydraulique;
  const consommationHydrauliqueAutomatise = systemeAutomatise.consommationHydraulique;
  const reductionConsommationHydraulique = systemeAutomatise.reductionConsommationHydraulique;
  
  // Autres paramètres
  const reductionEnergie = systemeAutomatise.reductionEnergie;
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
  // Calcul des réductions de CO2 et coûts associés
  const reductionCO2Tonnes = emissionCO2Actuel - emissionCO2Automatise;
  
  // Calcul des économies d'eau
  const reductionEauM3 = consommationEauActuel * (reductionConsommationEau / 100);
  const economieEau = reductionEauM3 * coutEauActuel;
  
  // Calcul des économies d'air comprimé
  const reductionAirM3 = consommationAirActuel * (reductionConsommationAir / 100);
  const economieAirComprime = reductionAirM3 * coutAirComprime;
  
  // Calcul des économies de fluide hydraulique
  const reductionHydrauliqueL = consommationHydrauliqueActuel * (reductionConsommationHydraulique / 100);
  const economieHydraulique = reductionHydrauliqueL * coutHydraulique;
  
  // Calcul des économies d'énergie (déjà dans le composant d'origine)
  const energieEconomisee = tonnageAnnuel * (reductionEnergie / 100) * systemeAutomatise.coutEnergieTonne;
  
  // Total des économies
  const totalEconomiesSecurite = economieAnnuelleAccidents + economieArretAccidents;
  const totalEconomiesEnvironnement = economieEau + economieAirComprime + economieHydraulique + energieEconomisee;

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
    { name: 'Eau', value: economieEau, fill: '#14b8a6' },
    { name: 'Air comprimé', value: economieAirComprime, fill: '#4f46e5' },
    { name: 'Fluide hydraulique', value: economieHydraulique, fill: '#7c3aed' }
  ];

  // Données pour la comparaison des ressources
  const dataComparaisonEau = [
    { name: 'Système Actuel', value: consommationEauActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: consommationEauAutomatise, fill: '#22c55e' }
  ];
  
  const dataComparaisonAir = [
    { name: 'Système Actuel', value: consommationAirActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: consommationAirAutomatise, fill: '#22c55e' }
  ];
  
  const dataComparaisonHydraulique = [
    { name: 'Système Actuel', value: consommationHydrauliqueActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: consommationHydrauliqueAutomatise, fill: '#22c55e' }
  ];

  // Données pour le graphique d'empreinte carbone
  const COLORS = ['#ef4444', '#22c55e'];
  const dataCO2 = [
    { name: 'Système Actuel', value: emissionCO2Actuel },
    { name: 'Solution Automatisée', value: emissionCO2Automatise }
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
            <h4 className="text-sm font-medium text-gray-600 mb-2">Émissions de CO₂ (tonnes/an)</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCO2} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} tonnes CO₂/an`, 'Émissions']} />
                  <Bar dataKey="value" fill={(index) => COLORS[index % COLORS.length]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-500">Réduction des émissions de CO₂</p>
                <p className="flex justify-between">
                  <span className="text-xl font-bold text-green-600">{reductionEmpreinteCO2}%</span>
                  <span className="text-sm font-medium text-green-700">{reductionCO2Tonnes.toFixed(0)} tonnes/an</span>
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-500">Consommation d'eau</p>
                <p className="flex justify-between">
                  <span className="text-xl font-bold text-green-600">-{reductionConsommationEau}%</span>
                  <span className="text-sm font-medium text-green-700">{reductionEauM3.toFixed(0)} m³/an</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-1">Impact économique environnemental</h4>
            <p className="text-sm">Économie d'énergie: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(energieEconomisee)}</span> ({reductionEnergie}%)</p>
            <p className="text-sm">Économie d'eau: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieEau)}</span> ({reductionConsommationEau}%)</p>
            <p className="text-sm">Économie air comprimé: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAirComprime)}</span> ({reductionConsommationAir}%)</p>
            <p className="text-sm">Économie fluide hydraulique: <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieHydraulique)}</span> ({reductionConsommationHydraulique}%)</p>
            <p className="text-sm font-bold mt-2">Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEconomiesEnvironnement)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-medium text-gray-700 mb-3">Économies de ressources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Consommation d'eau (m³/an)</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonEau}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(0)} m³/an`, 'Consommation']} />
                  <Bar dataKey="value" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Air comprimé (m³/an)</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonAir}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(0)} m³/an`, 'Consommation']} />
                  <Bar dataKey="value" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">Fluide hydraulique (L/an)</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataComparaisonHydraulique}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(0)} L/an`, 'Consommation']} />
                  <Bar dataKey="value" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
            <span className="font-bold">Réduction totale des émissions CO2 :</span> {(reductionCO2Tonnes * 5).toFixed(0)} tonnes
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Économie d'eau sur 5 ans :</span> {(reductionEauM3 * 5).toFixed(0)} m³
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Économie d'air comprimé sur 5 ans :</span> {(reductionAirM3 * 5).toFixed(0)} m³
          </p>
          <p className="text-sm mb-1">
            <span className="font-bold">Économie de fluide hydraulique sur 5 ans :</span> {(reductionHydrauliqueL * 5).toFixed(0)} L
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