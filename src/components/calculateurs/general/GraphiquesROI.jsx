import React, { useMemo } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import GraphCard from '../../common/GraphCard';
import { formaterDevise, formaterPourcentage } from '../../../utils/formatters';

/**
 * Composant d'affichage des graphiques du calculateur ROI
 * @returns {JSX.Element} - Affichage des graphiques
 */
const GraphiquesROI = () => {
  const { 
    systemeActuel,
    systemeAutomatise,
    resultats
  } = useCalculateurGeneral();
  
  // Données mémorisées pour les graphiques
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { 
        name: 'Système Actuel', 
        value: systemeActuel.capacite, 
        fill: '#ef4444' 
      },
      { 
        name: 'Solution Automatisée', 
        value: systemeAutomatise.capaciteTraitement, 
        fill: '#22c55e' 
      }
    ];
    
    // Comparaison du nombre d'employés
    const dataComparaisonEmployes = [
      { 
        name: 'Système Actuel', 
        value: systemeActuel.nombreEmployes, 
        fill: '#ef4444' 
      },
      { 
        name: 'Solution Automatisée', 
        value: systemeActuel.nombreEmployes - systemeAutomatise.nbEmployesRemplaces, 
        fill: '#22c55e' 
      }
    ];
    
    // Comparaison des taux de rejets
    const dataComparaisonRejets = [
      { 
        name: 'Système Actuel', 
        value: systemeActuel.tauxRejets, 
        fill: '#ef4444' 
      },
      { 
        name: 'Solution Automatisée', 
        value: systemeAutomatise.tauxRejets, 
        fill: '#22c55e' 
      }
    ];
    
    // Comparaison des temps de cycle
    const dataComparaisonTempsCycle = [
      { 
        name: 'Système Actuel', 
        value: systemeActuel.tempsCycle, 
        fill: '#ef4444' 
      },
      { 
        name: 'Solution Automatisée', 
        value: systemeAutomatise.tempsCycle, 
        fill: '#22c55e' 
      }
    ];
    
    // Comparaison de la maintenance
    const dataComparaisonMaintenance = [
      { 
        name: 'Système Actuel', 
        value: systemeActuel.maintenance, 
        fill: '#ef4444' 
      },
      { 
        name: 'Solution Automatisée', 
        value: systemeAutomatise.coutMaintenance, 
        fill: '#22c55e' 
      }
    ];
    
    // Calcul de la distribution des économies/gains
    const fluxMoyens = resultats.fluxTresorerie?.length > 0 ? 
      resultats.fluxTresorerie.reduce((sum, item) => ({
        economiePersonnel: sum.economiePersonnel + (item.economiePersonnel || 0),
        economieDechet: sum.economieDechet + (item.economieDechet || 0) + (item.economieRejets || 0),
        economieMaintenance: sum.economieMaintenance + (item.economieMaintenance || 0),
        economieEnergie: sum.economieEnergie + (item.economieEnergie || 0) + (item.economieEnergieProcessus || 0),
        economieEau: sum.economieEau + (item.economieEau || 0),
        beneficeSupplementaire: sum.beneficeSupplementaire + (item.beneficeSupplementaire || 0),
        beneficeQualite: sum.beneficeQualite + (item.beneficeQualite || 0),
        economieSecuriteAjustee: sum.economieSecuriteAjustee + (item.economieSecuriteAjustee || 0) + (item.economieTempsArretAjustee || 0)
      }), {
        economiePersonnel: 0,
        economieDechet: 0,
        economieMaintenance: 0,
        economieEnergie: 0,
        economieEau: 0,
        beneficeSupplementaire: 0,
        beneficeQualite: 0,
        economieSecuriteAjustee: 0
      }) : null;
    
    // Données pour le graphique des économies
    const dataEconomies = fluxMoyens ? [
      { name: 'Main d\'œuvre', value: fluxMoyens.economiePersonnel / resultats.fluxTresorerie.length },
      { name: 'Qualité', value: fluxMoyens.beneficeQualite / resultats.fluxTresorerie.length },
      { name: 'Déchets', value: fluxMoyens.economieDechet / resultats.fluxTresorerie.length },
      { name: 'Sécurité', value: fluxMoyens.economieSecuriteAjustee / resultats.fluxTresorerie.length },
      { name: 'Production', value: fluxMoyens.beneficeSupplementaire / resultats.fluxTresorerie.length },
      { name: 'Énergie', value: fluxMoyens.economieEnergie / resultats.fluxTresorerie.length },
      { name: 'Eau', value: fluxMoyens.economieEau / resultats.fluxTresorerie.length },
      { name: 'Maintenance', value: fluxMoyens.economieMaintenance / resultats.fluxTresorerie.length }
    ].filter(item => item.value > 0).sort((a, b) => b.value - a.value) : [];
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = resultats.fluxTresorerie?.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: resultats.investissementInitial
    })) || [];
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonTempsCycle,
      dataComparaisonMaintenance,
      dataEconomies,
      dataCumulatif
    };
  }, [systemeActuel, systemeAutomatise, resultats]);
  
  // Formateurs personnalisés pour les graphiques
  const formateurDevise = (value) => formaterDevise(value, 'USD', 0);
  const formateurPourcentage = (value) => `${value.toFixed(1)}%`;
  
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse comparative détaillée</h2>
        
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
            <GraphCard
              title="Capacité de traitement (unités/heure)"
              height={280}
            >
              <BarChart data={dataGraphiques.dataComparaisonCapacite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </GraphCard>
            
            <GraphCard
              title="Temps de cycle (secondes/unité)"
              height={280}
            >
              <BarChart data={dataGraphiques.dataComparaisonTempsCycle} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} secondes`, 'Temps de cycle']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </GraphCard>
            
            <GraphCard
              title="Main d'œuvre requise (ETP)"
              height={280}
            >
              <BarChart data={dataGraphiques.dataComparaisonEmployes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} employés`, 'Main d\'œuvre']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </GraphCard>
            
            <GraphCard
              title="Taux de rejets (%)"
              height={280}
            >
              <BarChart data={dataGraphiques.dataComparaisonRejets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejets']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </GraphCard>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
          <GraphCard
            title="Distribution des économies et bénéfices annuels"
            height={350}
            note="* Valeurs moyennes sur la durée de vie du projet"
          >
            <BarChart data={dataGraphiques.dataEconomies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formateurDevise} />
              <Tooltip formatter={(value) => [formateurDevise(value), 'Économie annuelle moyenne']} />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </GraphCard>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium text-gray-700 mb-4">Évolution du retour sur investissement</h3>
          <GraphCard
            title="Flux cumulatif et seuil d'investissement"
            height={350}
            note="* Le point d'intersection représente le délai de récupération"
            legend={[
              { label: 'Flux cumulatif', color: '#22c55e' },
              { label: 'Seuil d\'investissement', color: '#ef4444' }
            ]}
          >
            <LineChart data={dataGraphiques.dataCumulatif}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis tickFormatter={formateurDevise} />
              <Tooltip formatter={(value) => [formateurDevise(value), 'Montant']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cumulatif" 
                name="Flux cumulatif" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="seuil" 
                name="Seuil d'investissement" 
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5" 
              />
            </LineChart>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default GraphiquesROI;
