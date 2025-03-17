import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CalculateurPapierContext } from './CalculateurPatesPapiers';

const ComparatifSystemes = () => {
  // Accès au contexte partagé
  const { 
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats
  } = useContext(CalculateurPapierContext);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, 
    differenceProduction, economieAnnuelle, 
    reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret, fluxTresorerie 
  } = resultats;
  
  // Extraction des valeurs des paramètres généraux
  const { 
    margeBrute, tonnageAnnuel 
  } = parametresGeneraux;
  
  // Extraction des valeurs des paramètres du système actuel
  const {
    capacite: capaciteActuelle, nombreEmployes: nombreEmployesActuel,
    maintenance: maintenanceActuelle, energie: energieActuelle,
    tauxRejets: tauxRejetsManuel, frequenceAccident: frequenceAccidentActuel
  } = parametresSystemeActuel;
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    capaciteTraitement, tauxRejets: tauxRejetsFils, reductionAccidents, 
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance,
    coutEnergie, dureeVie, nbEmployesRemplaces, subventions
  } = parametresSystemeAutomatise;
  
  // Données pour les graphiques mémorisées pour éviter les recalculs inutiles
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: capaciteActuelle, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: capaciteTraitement, fill: '#22c55e' }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { name: 'Système Actuel', value: nombreEmployesActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: nombreEmployesActuel - nbEmployesRemplaces, fill: '#22c55e' }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { name: 'Système Actuel', value: tauxRejetsManuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: tauxRejetsFils, fill: '#22c55e' }
    ];
    
    // Comparaison des fréquences d'accidents
    const dataComparaisonAccidents = [
      { name: 'Système Actuel', value: frequenceAccidentActuel, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: frequenceAccidentActuel * (1 - reductionAccidents/100), fill: '#22c55e' }
    ];
    
    // Données pour le graphique des économies
    const dataEconomies = [
      { name: 'Main d\'œuvre', value: reductionMainOeuvre > 0 ? reductionMainOeuvre : 0 },
      { name: 'Qualité', value: economiesQualite > 0 ? economiesQualite : 0 },
      { name: 'Sécurité', value: economiesSecurite + economiesTempsArret > 0 ? economiesSecurite + economiesTempsArret : 0 },
      { name: 'Production', value: differenceProduction * (margeBrute / tonnageAnnuel) > 0 ? differenceProduction * (margeBrute / tonnageAnnuel) : 0 },
      { name: 'Maintenance', value: maintenanceActuelle - coutMaintenance > 0 ? maintenanceActuelle - coutMaintenance : 0 },
      { name: 'Énergie', value: energieActuelle - coutEnergie > 0 ? energieActuelle - coutEnergie : 0 }
    ];
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions
    }));
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataEconomies,
      dataCumulatif
    };
  }, [
    capaciteActuelle, capaciteTraitement, nombreEmployesActuel, nbEmployesRemplaces,
    tauxRejetsManuel, tauxRejetsFils, frequenceAccidentActuel, reductionAccidents,
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, margeBrute, tonnageAnnuel, maintenanceActuelle, coutMaintenance,
    energieActuelle, coutEnergie, fluxTresorerie, coutSysteme, coutInstallation,
    coutIngenierie, coutFormation, subventions
  ]);
  
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
                <span className="text-sm text-gray-600">Système Actuel</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Solution Automatisée</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de traitement (ballots/heure)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonCapacite} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} ballots/h`, 'Capacité']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Main d'œuvre requise (ETP)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonEmployes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} employés`, 'Main d\'œuvre']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Taux de rejets (%)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraphiques.dataComparaisonRejets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Taux de rejets']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Fréquence d'accidents (par an)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraphiques.dataComparaisonAccidents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)} accidents/an`, 'Fréquence']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-8 h-80">
          <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataGraphiques.dataEconomies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value), 'Économie']} />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparatifSystemes;