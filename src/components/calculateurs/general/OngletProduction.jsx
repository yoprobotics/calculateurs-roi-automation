import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant pour l'onglet Production du calculateur général
 * @returns {JSX.Element} - Contenu de l'onglet Production
 */
const OngletProduction = () => {
  const { 
    systemeActuel, 
    systemeAutomatise, 
    parametresGeneraux,
    resultats
  } = useCalculateurGeneral();

  // Extraction des valeurs pertinentes
  const capaciteActuelle = systemeActuel.capacite;
  const tempsCycleActuel = systemeActuel.tempsCycle;
  const capaciteAutomatisee = systemeAutomatise.capaciteTraitement;
  const tempsCycleAutomatise = systemeAutomatise.tempsCycle;
  const heuresOperationParJour = parametresGeneraux.heuresOperationParJour;
  const joursOperationParAn = parametresGeneraux.joursOperationParAn;
  const perteProduction = systemeActuel.perteProduction;
  const tauxRejetsActuel = systemeActuel.tauxRejets;
  const tauxRejetsAutomatise = systemeAutomatise.tauxRejets;
  const augmentationProduction = systemeAutomatise.augmentationProduction;

  // Calculs des données de production annuelle
  const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
  const productionActuelle = capaciteActuelle * heuresOperationAnnuelles * (1 - perteProduction / 100);
  const productionAutomatisee = capaciteAutomatisee * heuresOperationAnnuelles;
  const differenceProduction = productionAutomatisee - productionActuelle;
  const pourcentageAugmentation = ((productionAutomatisee / productionActuelle) - 1) * 100;

  // Calcul des unités rejetées (défectueuses)
  const unitesRejetActuelles = productionActuelle * (tauxRejetsActuel / 100);
  const unitesRejetAutomatisees = productionAutomatisee * (tauxRejetsAutomatise / 100);
  const differenceRejets = unitesRejetActuelles - unitesRejetAutomatisees;
  const pourcentageReductionRejets = differenceRejets > 0 
    ? (differenceRejets / unitesRejetActuelles) * 100 
    : 0;

  // Données pour les graphiques
  const dataComparaisonCapacite = [
    { name: 'Système Actuel', value: capaciteActuelle, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: capaciteAutomatisee, fill: '#22c55e' }
  ];

  const dataComparaisonTempsCycle = [
    { name: 'Système Actuel', value: tempsCycleActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: tempsCycleAutomatise, fill: '#22c55e' }
  ];

  const dataComparaisonProduction = [
    { name: 'Système Actuel', value: productionActuelle, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: productionAutomatisee, fill: '#22c55e' }
  ];

  const dataComparaisonRejets = [
    { name: 'Système Actuel', value: tauxRejetsActuel, fill: '#ef4444' },
    { name: 'Solution Automatisée', value: tauxRejetsAutomatise, fill: '#22c55e' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Analyse détaillée de la production</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">Comparaison des performances</h3>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Capacité de traitement (unités/heure)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonCapacite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} unités/h`, 'Capacité']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Temps de cycle (secondes/unité)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonTempsCycle} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} sec/unité`, 'Temps de cycle']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Production annuelle (unités)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonProduction} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${Math.round(value).toLocaleString()} unités`, 'Production']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Taux de rejets (%)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataComparaisonRejets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejets']} />
                <Bar dataKey="value" nameKey="name" fill={(entry) => entry.fill} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-4">Résumé de l'impact sur la production</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-medium text-gray-700">Augmentation de capacité</h4>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round((capaciteAutomatisee - capaciteActuelle) / capaciteActuelle * 100)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {capaciteActuelle} → {capaciteAutomatisee} unités/heure
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-medium text-gray-700">Réduction du temps de cycle</h4>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round((tempsCycleActuel - tempsCycleAutomatise) / tempsCycleActuel * 100)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {tempsCycleActuel} → {tempsCycleAutomatise} secondes/unité
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-medium text-gray-700">Production annuelle</h4>
            <p className="text-2xl font-bold text-blue-600">
              +{Math.round(pourcentageAugmentation)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(differenceProduction).toLocaleString()} unités supplémentaires
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-medium text-gray-700">Réduction des rejets</h4>
            <p className="text-2xl font-bold text-blue-600">
              {pourcentageReductionRejets > 0 ? Math.round(pourcentageReductionRejets) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {tauxRejetsActuel}% → {tauxRejetsAutomatise}% taux de rejet
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Impact financier de l'amélioration de production</h4>
          <p className="text-sm mb-2">
            L'augmentation de la capacité de production et la réduction des rejets se traduisent par une augmentation de la production annuelle de <span className="font-bold">{Math.round(pourcentageAugmentation)}%</span>, soit environ <span className="font-bold">{Math.round(differenceProduction).toLocaleString()}</span> unités supplémentaires par an.
          </p>
          <p className="text-sm">
            <span className="font-bold">Impact économique estimé :</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(differenceProduction * (parametresGeneraux.margeBrute / parametresGeneraux.tonnageAnnuel))} par an
          </p>
        </div>
      </div>
    </div>
  );
};

export default OngletProduction;