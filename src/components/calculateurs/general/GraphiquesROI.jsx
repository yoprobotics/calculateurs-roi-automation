import React, { useMemo } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant pour afficher les graphiques comparatifs
 */
const GraphiquesROI = () => {
  const { 
    systemeActuel, 
    systemeAutomatise, 
    resultats,
    parametresGeneraux
  } = useCalculateurGeneral();
  
  // Formater les montants
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(montant);
  };
  
  // Préparation des données pour les graphiques
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: systemeActuel.capacite, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: systemeAutomatise.capaciteTraitement, fill: '#22c55e' }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { name: 'Système Actuel', value: systemeActuel.nombreEmployes, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: systemeActuel.nombreEmployes - systemeAutomatise.nbEmployesRemplaces, fill: '#22c55e' }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { name: 'Système Actuel', value: systemeActuel.tauxRejets, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: systemeAutomatise.tauxRejets, fill: '#22c55e' }
    ];
    
    // Comparaison des fréquences d'accidents
    const dataComparaisonAccidents = [
      { name: 'Système Actuel', value: systemeActuel.frequenceAccident, fill: '#ef4444' },
      { 
        name: 'Solution Automatisée', 
        value: systemeActuel.frequenceAccident * (1 - systemeAutomatise.reductionAccidents/100), 
        fill: '#22c55e' 
      }
    ];
    
    // Comparaison des temps de cycle
    const dataComparaisonTempsCycle = [
      { name: 'Système Actuel', value: systemeActuel.tempsCycle, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: systemeAutomatise.tempsCycle, fill: '#22c55e' }
    ];
    
    // Calcul des économies annuelles par catégorie
    const economiesCategories = [];
    
    // Économie de main d'œuvre
    const economieMainOeuvre = systemeAutomatise.nbEmployesRemplaces * systemeAutomatise.coutMainOeuvre;
    if (economieMainOeuvre > 0) {
      economiesCategories.push({ 
        name: 'Main d\'œuvre', 
        value: economieMainOeuvre
      });
    }
    
    // Économie liée à la réduction des rejets
    const economieRejets = parametresGeneraux.production * 
                           (systemeActuel.tauxRejets - systemeAutomatise.tauxRejets) / 100 * 
                           systemeAutomatise.coutDechet;
    if (economieRejets > 0) {
      economiesCategories.push({ 
        name: 'Rejets', 
        value: economieRejets
      });
    }
    
    // Économie liée à la sécurité (réduction des accidents)
    const economieSecurite = systemeActuel.frequenceAccident * 
                           systemeActuel.coutMoyenAccident * 
                           systemeAutomatise.reductionAccidents / 100;
    if (economieSecurite > 0) {
      economiesCategories.push({ 
        name: 'Sécurité', 
        value: economieSecurite
      });
    }
    
    // Impact sur la production (temps d'arrêt)
    const impactTempsArret = systemeActuel.frequenceAccident * 
                           systemeActuel.tempsArretAccident * 
                           (systemeAutomatise.reductionAccidents / 100) * 
                           parametresGeneraux.margeUnitaire * 
                           systemeActuel.capacite;
    if (impactTempsArret > 0) {
      economiesCategories.push({ 
        name: 'Temps d\'arrêt', 
        value: impactTempsArret
      });
    }
    
    // Économie liée à l'augmentation de production
    const economieProduction = parametresGeneraux.production * 
                             (systemeAutomatise.augmentationProduction / 100) * 
                             parametresGeneraux.margeUnitaire;
    if (economieProduction > 0) {
      economiesCategories.push({ 
        name: 'Production', 
        value: economieProduction
      });
    }
    
    // Économie de maintenance
    const economieMaintenance = systemeActuel.maintenance - systemeAutomatise.coutMaintenance;
    if (economieMaintenance > 0) {
      economiesCategories.push({ 
        name: 'Maintenance', 
        value: economieMaintenance
      });
    }
    
    // Économie d'énergie
    const economieEnergie = systemeActuel.energie - systemeAutomatise.coutEnergie;
    if (economieEnergie > 0) {
      economiesCategories.push({ 
        name: 'Énergie', 
        value: economieEnergie
      });
    }
    
    // Économie liée à la qualité
    const economieQualite = parametresGeneraux.production * 
                          (systemeAutomatise.ameliorationQualite / 100) * 
                          (parametresGeneraux.margeUnitaire * 0.2);
    if (economieQualite > 0) {
      economiesCategories.push({ 
        name: 'Qualité', 
        value: economieQualite
      });
    }
    
    // Tri des économies par valeur décroissante
    economiesCategories.sort((a, b) => b.value - a.value);
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataComparaisonTempsCycle,
      dataEconomies: economiesCategories
    };
  }, [
    systemeActuel, 
    systemeAutomatise,
    parametresGeneraux
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
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
              <Tooltip formatter={(value) => [formatMontant(value), 'Économie']} />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          Ce graphique montre la contribution de chaque facteur au flux de trésorerie annuel, permettant d'identifier les principaux moteurs de rentabilité.
        </p>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Conseils d'analyse</span>
        </div>
        <p>Recherchez les catégories qui génèrent les économies les plus importantes pour évaluer les principaux avantages de l'automatisation pour votre contexte.</p>
      </div>
    </div>
  );
};

export default GraphiquesROI;