import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { GraphCard } from '../../common/GraphCard';

/**
 * Composant d'affichage des graphiques comparatifs
 * @returns {JSX.Element} - Graphiques comparatifs
 */
const GraphiquesROI = () => {
  const { 
    systemeActuel, 
    systemeAutomatise, 
    typeSystemeActuel,
    resultats,
    parametresGeneraux
  } = useCalculateurPatesPapiers();

  const { 
    capacite: capaciteActuelle, 
    nombreEmployes: nombreEmployesActuel,
    tauxRejets: tauxRejetsManuel, 
    frequenceAccident: frequenceAccidentActuel,
    maintenance: maintenanceActuelle,
    energie: energieActuelle,
  } = systemeActuel;

  const {
    capaciteTraitement,
    nbEmployesRemplaces,
    tauxRejets: tauxRejetsFils,
    reductionAccidents,
    coutMaintenance,
    coutEnergie,
  } = systemeAutomatise;

  const {
    margeBrute,
    tonnageAnnuel
  } = parametresGeneraux;

  const {
    reductionMainOeuvre,
    economiesQualite,
    economiesSecurite,
    economiesTempsArret,
    differenceProduction
  } = resultats;

  // Formatage de montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

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
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataEconomies
    };
  }, [
    capaciteActuelle, capaciteTraitement, nombreEmployesActuel, nbEmployesRemplaces,
    tauxRejetsManuel, tauxRejetsFils, frequenceAccidentActuel, reductionAccidents,
    reductionMainOeuvre, economiesQualite, economiesSecurite, economiesTempsArret,
    differenceProduction, margeBrute, tonnageAnnuel, maintenanceActuelle, coutMaintenance,
    energieActuelle, coutEnergie
  ]);

  // Conversion du type de système en texte lisible
  const getTypeSystemeText = () => {
    switch(typeSystemeActuel) {
      case 'manuel': return 'Manuel';
      case 'semi-auto': return 'Semi-auto';
      case 'auto-ancien': return 'Auto ancien';
      default: return typeSystemeActuel;
    }
  };

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
                <span className="text-sm text-gray-600">Système Actuel ({getTypeSystemeText()})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Solution Automatisée</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GraphCard 
              title="Capacité de traitement (ballots/heure)"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonCapacite} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} ballots/h`, 'Capacité']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </GraphCard>
            
            <GraphCard 
              title="Main d'œuvre requise (ETP)"
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataComparaisonEmployes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} employés`, 'Main d\'œuvre']} />
                  <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            </GraphCard>
          </div>
        </div>
        
        <div className="mt-8">
          <GraphCard 
            title="Économies annuelles par catégorie"
            height={300}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraphiques.dataEconomies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Économie']} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default GraphiquesROI;
