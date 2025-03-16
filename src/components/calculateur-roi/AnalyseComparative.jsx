import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant pour l'analyse comparative avec des graphiques
 */
const AnalyseComparative = ({ parametresSystemeActuel, parametresSystemeAutomatise, resultats, parametresGeneraux }) => {
  
  // Préparation des données pour les graphiques
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: parametresSystemeActuel.capacite, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.capaciteTraitement, fill: '#22c55e' }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { name: 'Système Actuel', value: parametresSystemeActuel.nombreEmployes, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeActuel.nombreEmployes - parametresSystemeAutomatise.nbEmployesRemplaces, fill: '#22c55e' }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { name: 'Système Actuel', value: parametresSystemeActuel.tauxRejets, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.tauxRejets, fill: '#22c55e' }
    ];
    
    // Comparaison des fréquences d'accidents
    const dataComparaisonAccidents = [
      { name: 'Système Actuel', value: parametresSystemeActuel.frequenceAccident, fill: '#ef4444' },
      { 
        name: 'Solution Automatisée', 
        value: parametresSystemeActuel.frequenceAccident * (1 - parametresSystemeAutomatise.reductionAccidents/100), 
        fill: '#22c55e' 
      }
    ];
    
    // Calcul des économies annuelles par catégorie
    // Économie de main d'œuvre
    const economieMainOeuvre = parametresSystemeAutomatise.nbEmployesRemplaces * parametresSystemeAutomatise.coutMainOeuvre;
    
    // Économie liée à la réduction des rejets
    const economieRejets = parametresGeneraux.production * 
                         (parametresSystemeActuel.tauxRejets - parametresSystemeAutomatise.tauxRejets) / 100 * 
                         parametresSystemeAutomatise.coutDechet;
    
    // Économie liée à la sécurité (réduction des accidents)
    const economieSecurite = parametresSystemeActuel.frequenceAccident * 
                           parametresSystemeActuel.coutMoyenAccident * 
                           parametresSystemeAutomatise.reductionAccidents / 100;
    
    // Impact sur la production (temps d'arrêt)
    const impactTempsArret = parametresSystemeActuel.frequenceAccident * 
                           parametresSystemeActuel.tempsArretAccident * 
                           (parametresSystemeAutomatise.reductionAccidents / 100) * 
                           parametresGeneraux.margeUnitaire * 
                           parametresSystemeActuel.capacite;
    
    // Économie liée à l'augmentation de production
    const economieProduction = parametresGeneraux.production * 
                             (parametresSystemeAutomatise.augmentationProduction / 100) * 
                             parametresGeneraux.margeUnitaire;
    
    // Économie de maintenance
    const economieMaintenance = parametresSystemeActuel.maintenance - parametresSystemeAutomatise.coutMaintenance;
    
    // Économie d'énergie
    const economieEnergie = parametresSystemeActuel.energie - parametresSystemeAutomatise.coutEnergie;
    
    // Économie liée à la qualité
    const economieQualite = parametresGeneraux.production * 
                          (parametresSystemeAutomatise.ameliorationQualite / 100) * 
                          (parametresGeneraux.margeUnitaire * 0.2);
    
    // Données pour le graphique des économies
    const dataEconomies = [
      { name: 'Main d\'œuvre', value: economieMainOeuvre > 0 ? economieMainOeuvre : 0 },
      { name: 'Qualité', value: economieQualite > 0 ? economieQualite : 0 },
      { name: 'Sécurité', value: economieSecurite > 0 ? economieSecurite : 0 },
      { name: 'Production', value: economieProduction > 0 ? economieProduction : 0 },
      { name: 'Impact Temps Cycle', value: impactTempsArret > 0 ? impactTempsArret : 0 },
      { name: 'Rejets', value: economieRejets > 0 ? economieRejets : 0 },
      { name: 'Maintenance', value: economieMaintenance > 0 ? economieMaintenance : 0 },
      { name: 'Énergie', value: economieEnergie > 0 ? economieEnergie : 0 }
    ];
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataEconomies
    };
  }, [
    parametresSystemeActuel, 
    parametresSystemeAutomatise, 
    parametresGeneraux
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse comparative</h2>
      
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
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de production (unités/heure)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraphiques.dataComparaisonCapacite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
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
                <Tooltip formatter={(value) => [`${value} ETP`, 'Main d\'œuvre']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Taux de rejets (%)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataGraphiques.dataComparaisonRejets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejets']} />
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
              <Tooltip formatter={(value) => [`${value.toFixed(2)} accidents/an`, 'Fréquence']} />
              <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
        <div className="h-80">
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
        <p className="text-xs text-gray-500 mt-2 italic">
          Ce graphique montre la contribution de chaque facteur au flux de trésorerie annuel, permettant d'identifier les principaux moteurs de rentabilité.
        </p>
      </div>
    </div>
  );
};

export default AnalyseComparative;