import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';
import { 
  calculerInvestissementInitial, 
  calculerCapacitesTheoriques,
  calculerImpactsProduction,
  calculerEconomiesSecurite,
  calculerEconomiesOperationnelles,
  calculerTousFluxTresorerie
} from '../utils/roiCalculationHelpers';

// Fonction de formatage personnalisée pour les tooltips
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(value);
};

// Calculateur général pour l'automatisation industrielle avec structure comparative
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États pour les paramètres du système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 30, // unités/heure
    tempsCycle: 120, // secondes par unité
    nombreEmployes: 3, // ETP
    coutSysteme: 20000, // Coût d'un système manuel
    maintenance: 5000, // $/an
    energie: 3000, // $/an
    perteProduction: 12, // % perte due aux arrêts et retards
    tauxRejets: 9, // % de rejets et rebuts
    frequenceAccident: 4, // accidents par an
    coutMoyenAccident: 8000, // coût moyen par accident
    tempsArretAccident: 16, // heures d'arrêt par accident
    tempsArretNonPlanifie: 15, // heures par mois
  });
  
  // États pour les paramètres du système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 10000,
    coutFormationContinue: 5000, // Coût annuel de formation continue
    coutMaintenance: 8000,
    coutEnergie: 4500,
    dureeVie: 10,
    tauxAmortissement: 20,
    capacite: 85, // unités/heure
    tempsCycle: 42, // secondes par unité
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 2,
    reductionDechet: 60,
    coutDechet: 50, // Coût par unité rejetée
    tauxRejets: 2, // % de rejets
    reductionAccidents: 90, // % de réduction des accidents
    reductionTempsArret: 75, // % de réduction du temps d'arrêt non planifié
    augmentationProduction: 15,
    coutErrorHumaine: 15000,
    tauxProblemeQualite: 8,
    coutQualite: 20000,
    subventions: 0,
    coutMiseAJourLogiciel: 3000, // Coût annuel des mises à jour logicielles
    coutConsommables: 2000, // Coût annuel des consommables spécifiques
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    production: 100000, // unités par an
    margeUnitaire: 10, // $ par unité
    tauxInflation: 2,
    tauxActualisation: 5,
    heuresOperationParJour: 8,
    joursOperationParAn: 250,
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0,
    economiesRejets: 0,
    ameliorationTempsCycle: 0,
    impactTempsCycle: 0,
    capaciteTheoriqueActuelle: 0,
    capaciteTheoriqueAutomatisee: 0,
    efficaciteActuelle: 0,
    efficaciteAutomatisee: 0,
    revenuSupplementairePotentiel: 0,
    gainFlexibiliteProduction: 0,
    totalBenefices: 0 // Nouveau champ pour stocker les bénéfices totaux
  });
  
  // États pour l'interface utilisateur
  const [ui, setUi] = useState({
    afficherDetails: false,
    ongletActif: 'general',
    modeSynchronisation: true, // Nouvelle option pour synchroniser automatiquement temps de cycle et capacité
  });
  
  // Fonction pour synchroniser le temps de cycle basé sur la capacité
  const syncTempsCycleFromCapacite = (capacite, setParams, params) => {
    if (ui.modeSynchronisation && capacite > 0) {
      const nouveauTempsCycle = Math.round((3600 / capacite) * 10) / 10; // Arrondi à 1 décimale
      setParams({
        ...params,
        capacite: capacite,
        tempsCycle: nouveauTempsCycle
      });
    } else {
      setParams({
        ...params,
        capacite: capacite
      });
    }
  };
  
  // Fonction pour synchroniser la capacité basée sur le temps de cycle
  const syncCapaciteFromTempsCycle = (tempsCycle, setParams, params) => {
    if (ui.modeSynchronisation && tempsCycle > 0) {
      const nouvelleCapacite = Math.round((3600 / tempsCycle) * 10) / 10; // Arrondi à 1 décimale
      setParams({
        ...params,
        tempsCycle: tempsCycle,
        capacite: nouvelleCapacite
      });
    } else {
      setParams({
        ...params,
        tempsCycle: tempsCycle
      });
    }
  };
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      // Manuel: temps de cycle = 120 sec, capacité = 30 unités/h
      const tempsCycle = 120;
      const capacite = 30;
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: capacite,
        tempsCycle: tempsCycle,
        nombreEmployes: 3,
        coutSysteme: 20000, 
        maintenance: 5000,
        energie: 3000,
        tauxRejets: 9,
        perteProduction: 12,
        frequenceAccident: 4,
        tempsArretNonPlanifie: 15
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      // Semi-auto: temps de cycle = 60 sec, capacité = 60 unités/h
      const tempsCycle = 60;
      const capacite = 60;
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: capacite,
        tempsCycle: tempsCycle,
        nombreEmployes: 2,
        coutSysteme: 80000,
        maintenance: 12000,
        energie: 5000,
        tauxRejets: 5,
        perteProduction: 8,
        frequenceAccident: 2,
        tempsArretNonPlanifie: 10
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      // Auto-ancien: temps de cycle = 48 sec, capacité = 75 unités/h
      const tempsCycle = 48;
      const capacite = 75;
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: capacite,
        tempsCycle: tempsCycle,
        nombreEmployes: 1.5,
        coutSysteme: 120000,
        maintenance: 20000,
        energie: 7000,
        tauxRejets: 3.5,
        perteProduction: 6,
        frequenceAccident: 1,
        tempsArretNonPlanifie: 8
      });
    }
  }, [typeSystemeActuel]);
  
  // Fonction de calcul des résultats (refactorisée)
  const calculerROI = () => {
    // 1. Calcul de l'investissement initial
    const investissementInitial = calculerInvestissementInitial(parametresSystemeAutomatise);
    
    // 2. Calcul des capacités théoriques et efficacités
    const {
      capaciteTheoriqueActuelle,
      capaciteTheoriqueAutomatisee,
      efficaciteActuelle,
      efficaciteAutomatisee
    } = calculerCapacitesTheoriques(parametresSystemeActuel, parametresSystemeAutomatise);
    
    // 3. Calcul des impacts liés à la production et au temps de cycle
    const {
      heuresOperationAnnuelles,
      ameliorationTempsCycle,
      differenceProduction,
      impactTempsCycle,
      gainFlexibiliteProduction,
      revenuSupplementairePotentiel
    } = calculerImpactsProduction(parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux);
    
    // 4. Calcul des économies liées à la sécurité et aux temps d'arrêt
    const {
      economiesAccidents,
      economiesTempsArretAccidents,
      economiesTempsArretNonPlanifie,
      economiesTempsArretTotal
    } = calculerEconomiesSecurite(
      parametresSystemeActuel, 
      parametresSystemeAutomatise, 
      parametresGeneraux, 
      heuresOperationAnnuelles
    );
    
    // 5. Calcul des économies opérationnelles (main d'œuvre, rejets, qualité)
    const {
      reductionMainOeuvre,
      economiesRejets,
      economieQualite
    } = calculerEconomiesOperationnelles(parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux);
    
    // 6. Calcul des flux de trésorerie et indicateurs financiers
    const parametresPourCalcul = {
      parametresActuel: parametresSystemeActuel,
      parametresAuto: parametresSystemeAutomatise,
      parametresGeneraux,
      economiesSecurite: {
        economiesAccidents,
        economiesTempsArretAccidents,
        economiesTempsArretNonPlanifie
      },
      economiesOperationnelles: {
        reductionMainOeuvre,
        economiesRejets,
        economieQualite
      },
      impactsProduction: {
        differenceProduction,
        impactTempsCycle
      },
      investissementInitial
    };
    
    const {
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economieAnnuelle: economieAnnuelleCalc,
      totalBenefices
    } = calculerTousFluxTresorerie(parametresPourCalcul);
    
    // 7. Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      differenceProduction,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre,
      economiesSecurite: economiesAccidents,
      economiesQualite: economieQualite,
      economiesTempsArret: economiesTempsArretTotal,
      economiesRejets,
      ameliorationTempsCycle,
      impactTempsCycle,
      capaciteTheoriqueActuelle,
      capaciteTheoriqueAutomatisee,
      efficaciteActuelle,
      efficaciteAutomatisee,
      revenuSupplementairePotentiel,
      gainFlexibiliteProduction,
      totalBenefices
    });
  };
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, differenceProduction, 
    economieAnnuelle, reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret, economiesRejets, fluxTresorerie,
    ameliorationTempsCycle, impactTempsCycle, capaciteTheoriqueActuelle,
    capaciteTheoriqueAutomatisee, efficaciteActuelle, efficaciteAutomatisee,
    revenuSupplementairePotentiel, gainFlexibiliteProduction, totalBenefices
  } = resultats;
  
  // Données pour les graphiques mémorisées pour éviter les recalculs inutiles
  const dataGraphiques = useMemo(() => {
    // Comparaison des capacités
    const dataComparaisonCapacite = [
      { name: 'Système Actuel', value: parametresSystemeActuel.capacite, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.capacite, fill: '#22c55e' }
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
      { name: 'Solution Automatisée', value: parametresSystemeActuel.frequenceAccident * (1 - parametresSystemeAutomatise.reductionAccidents/100), fill: '#22c55e' }
    ];
    
    // Comparaison des temps de cycle
    const dataComparaisonTempsCycle = [
      { name: 'Système Actuel', value: parametresSystemeActuel.tempsCycle, fill: '#ef4444' },
      { name: 'Solution Automatisée', value: parametresSystemeAutomatise.tempsCycle, fill: '#22c55e' }
    ];

    // Comparaison des capacités théoriques vs réelles
    const dataCapacitesTheoretiques = [
      { name: 'Capacité Théorique', actuel: capaciteTheoriqueActuelle, automatise: capaciteTheoriqueAutomatisee },
      { name: 'Capacité Réelle', actuel: parametresSystemeActuel.capacite, automatise: parametresSystemeAutomatise.capacite }
    ];
    
    // Données pour le graphique des économies (incluant l'impact du temps de cycle)
    const dataEconomies = [
      { name: "Main d'œuvre", value: reductionMainOeuvre > 0 ? reductionMainOeuvre : 0 },
      { name: 'Qualité', value: economiesQualite > 0 ? economiesQualite : 0 },
      { name: 'Sécurité', value: economiesSecurite + economiesTempsArret > 0 ? economiesSecurite + economiesTempsArret : 0 },
      { name: 'Production', value: differenceProduction * (parametresGeneraux.margeUnitaire) > 0 ? differenceProduction * (parametresGeneraux.margeUnitaire) : 0 },
      { name: 'Impact Temps Cycle', value: impactTempsCycle > 0 ? impactTempsCycle : 0 },
      { name: 'Rejets', value: economiesRejets > 0 ? economiesRejets : 0 },
      { name: 'Maintenance', value: parametresSystemeActuel.maintenance - parametresSystemeAutomatise.coutMaintenance > 0 ? parametresSystemeActuel.maintenance - parametresSystemeAutomatise.coutMaintenance : 0 },
      { name: 'Énergie', value: parametresSystemeActuel.energie - parametresSystemeAutomatise.coutEnergie > 0 ? parametresSystemeActuel.energie - parametresSystemeAutomatise.coutEnergie : 0 }
    ];
    
    // Données pour le graphique des coûts cachés
    const dataCoutsSupplementaires = [
      { name: 'Formation Continue', value: parametresSystemeAutomatise.coutFormationContinue },
      { name: 'Mises à Jour Logicielles', value: parametresSystemeAutomatise.coutMiseAJourLogiciel },
      { name: 'Consommables Spécifiques', value: parametresSystemeAutomatise.coutConsommables }
    ];
    
    // Données pour le graphique de ROI cumulatif
    const dataCumulatif = fluxTresorerie.map(item => ({
      annee: `Année ${item.annee}`,
      cumulatif: item.cumulFluxTresorerie,
      seuil: parametresSystemeAutomatise.coutSysteme + parametresSystemeAutomatise.coutInstallation + 
            parametresSystemeAutomatise.coutIngenierie + parametresSystemeAutomatise.coutFormation - 
            parametresSystemeAutomatise.subventions
    }));
    
    // Données pour la répartition des contributions au flux de trésorerie
    const contributionsFlux = fluxTresorerie.length > 0 ? [
      { name: "Main d'œuvre", value: fluxTresorerie[0].economiePersonnel },
      { name: "Qualité", value: fluxTresorerie[0].economieQualite },
      { name: "Temps Cycle", value: fluxTresorerie[0].beneficeTempsCycle },
      { name: "Production", value: fluxTresorerie[0].beneficeSupplementaire },
      { name: "Sécurité", value: fluxTresorerie[0].economieSecuriteAjustee + fluxTresorerie[0].economieTempsArretAjustee + fluxTresorerie[0].economieTempsArretNonPlanifieAjustee },
      { name: "Rejets", value: fluxTresorerie[0].economieRejets },
      { name: "Maintenance", value: fluxTresorerie[0].economieMaintenance },
      { name: "Énergie", value: fluxTresorerie[0].economieEnergie }
    ].filter(item => item.value > 0) : [];
    
    return {
      dataComparaisonCapacite,
      dataComparaisonEmployes,
      dataComparaisonRejets,
      dataComparaisonAccidents,
      dataComparaisonTempsCycle,
      dataCapacitesTheoretiques,
      dataEconomies,
      dataCoutsSupplementaires,
      dataCumulatif,
      contributionsFlux
    };
  }, [
    parametresSystemeActuel, 
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats,
    fluxTresorerie,
    capaciteTheoriqueActuelle,
    capaciteTheoriqueAutomatisee,
    impactTempsCycle,
    differenceProduction,
    economiesSecurite,
    economiesTempsArret,
    economiesRejets,
    economiesQualite,
    reductionMainOeuvre
  ]);
  
  // Fonctions pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };
  
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };
  
  const toggleSynchronisation = () => {
    setUi(prev => ({ ...prev, modeSynchronisation: !prev.modeSynchronisation }));
  };
  
  // Extraction des valeurs de l'UI
  const { afficherDetails, ongletActif, modeSynchronisation } = ui;

  // Composant pour les graphiques verticaux comparatifs
  const VerticalBarGraph = ({ data, title, tooltipLabel, yAxisWidth = 120, suffix = "", height = 300 }) => {
    return (
      <div className="h-auto mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">{title}</h3>
        <div style={{ height: `${height}px` }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => `${value}${suffix}`} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={yAxisWidth}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}${suffix}`, tooltipLabel]}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar 
                dataKey="value" 
                nameKey="name" 
                fill={(entry) => entry.fill} 
                label={{ 
                  position: 'right', 
                  formatter: (value) => `${value}${suffix}`,
                  fontSize: 11,
                  fill: '#666'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Composant pour les graphiques horizontaux
  const HorizontalBarGraph = ({ data, title, tooltipLabel, tooltipFormatter, dataKey = "value", height = 300 }) => {
    return (
      <div className="h-auto mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">{title}</h3>
        <div style={{ height: `${height}px` }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={tooltipFormatter || ((value) => [value, tooltipLabel])}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar 
                dataKey={dataKey} 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Composant pour le graphique linéaire
  const LineGraph = ({ data, title, tooltip, lineInfo, height = 300 }) => {
    return (
      <div className="h-auto mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">{title}</h3>
        <div style={{ height: `${height}px` }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="annee" 
                tick={{ fontSize: 12 }}
                height={40}
                angle={-30}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip 
                formatter={tooltip.formatter}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
              {lineInfo.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={line.width || 2}
                  strokeDasharray={line.dashed ? "5 5" : null}
                  dot={line.dot || { r: 4 }}
                  activeDot={line.activeDot || { r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Déterminer si le projet est recommandé
  const projetRecommande = () => {
    // Un projet est recommandé si:
    // 1. La VAN est positive ET
    // 2. Soit le TRI > taux d'actualisation, soit le délai de récupération < durée vie / 2
    const vanPositive = van > 0;
    const triAcceptable = tri > parametresGeneraux.tauxActualisation;
    const delaiAcceptable = delaiRecuperation < (parametresSystemeAutomatise.dureeVie / 2);
    
    return vanPositive && (triAcceptable || delaiAcceptable);
  };
  
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
        <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
            <p>Augmentation du volume de production et réduction des temps d'arrêt.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Qualité Constante</h4>
            <p>Élimination des erreurs humaines et amélioration de la répétabilité des processus.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-blue-700">Réduction des Coûts</h4>
            <p>Diminution des coûts de main d'œuvre et optimisation de la consommation d'énergie et de matières.</p>
          </div>
        </div>
      </div>
      
      {/* Option de synchronisation temps de cycle/capacité */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800">Mode de saisie des données de production</h3>
            <p className="text-sm text-gray-600">La capacité et le temps de cycle sont liés par la formule: Capacité (unités/h) = 3600 / Temps de cycle (s)</p>
          </div>
          <label className="inline-flex items-center cursor-pointer mt-2 md:mt-0">
            <span className={`mr-3 text-sm font-medium ${modeSynchronisation ? 'text-green-700' : 'text-gray-500'}`}>
              Synchronisation Automatique
            </span>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${modeSynchronisation ? 'bg-green-600' : 'bg-gray-300'}`}>
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${modeSynchronisation ? 'translate-x-6' : 'translate-x-1'}`} 
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={modeSynchronisation}
                onChange={toggleSynchronisation}
              />
            </div>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Système Actuel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Système Actuel
          </h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setTypeSystemeActuel('manuel')}
                className={`py-2 text-sm rounded-md transition-all ${
                  typeSystemeActuel === 'manuel'
                    ? 'bg-red-100 text-red-800 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manuel
              </button>
              <button
                onClick={() => setTypeSystemeActuel('semi-auto')}
                className={`py-2 text-sm rounded-md transition-all ${
                  typeSystemeActuel === 'semi-auto'
                    ? 'bg-red-100 text-red-800 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semi-automatisé
              </button>
              <button
                onClick={() => setTypeSystemeActuel('auto-ancien')}
                className={`py-2 text-sm rounded-md transition-all ${
                  typeSystemeActuel === 'auto-ancien'
                    ? 'bg-red-100 text-red-800 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Auto. (ancien)
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.capacite}
                      onChange={(e) => syncTempsCycleFromCapacite(
                        Number(e.target.value),
                        setParametresSystemeActuel,
                        parametresSystemeActuel
                      )}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.tempsCycle}
                      onChange={(e) => syncCapaciteFromTempsCycle(
                        Number(e.target.value),
                        setParametresSystemeActuel,
                        parametresSystemeActuel
                      )}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
                  </div>
                </div>
                {modeSynchronisation && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      La capacité réelle correspond à {Math.round((parametresSystemeActuel.capacite / capaciteTheoriqueActuelle) * 100)}% de la capacité théorique maximum.
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={parametresSystemeActuel.nombreEmployes}
                    onChange={(e) => setParametresSystemeActuel({
                      ...parametresSystemeActuel,
                      nombreEmployes: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Qualité et problèmes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeActuel.tauxRejets}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        tauxRejets: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pertes production (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeActuel.perteProduction}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        perteProduction: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Sécurité</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Accidents/an</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeActuel.frequenceAccident}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        frequenceAccident: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Coût/accident ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.coutMoyenAccident}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        coutMoyenAccident: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Temps d'arrêt</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Arrêt/accident (h)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.tempsArretAccident}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        tempsArretAccident: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Arrêt non planifié (h/mois)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.tempsArretNonPlanifie}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        tempsArretNonPlanifie: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.maintenance}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        maintenance: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.energie}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        energie: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Système Automatisé */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Système Automatisé
          </h2>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.capacite}
                      onChange={(e) => syncTempsCycleFromCapacite(
                        Number(e.target.value),
                        setParametresSystemeAutomatise,
                        parametresSystemeAutomatise
                      )}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.tempsCycle}
                      onChange={(e) => syncCapaciteFromTempsCycle(
                        Number(e.target.value),
                        setParametresSystemeAutomatise,
                        parametresSystemeAutomatise
                      )}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
                  </div>
                </div>
                {modeSynchronisation && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-800">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      La capacité réelle correspond à {Math.round((parametresSystemeAutomatise.capacite / capaciteTheoriqueAutomatisee) * 100)}% de la capacité théorique maximum.
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutSysteme}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutSysteme: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutInstallation}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutInstallation: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Impacts sur les ressources humaines</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Coût annuel employé ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutMainOeuvre}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutMainOeuvre: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employés remplacés (ETP)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeAutomatise.nbEmployesRemplaces}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        nbEmployesRemplaces: Math.min(Number(e.target.value), parametresSystemeActuel.nombreEmployes)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Améliorations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametresSystemeAutomatise.tauxRejets}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        tauxRejets: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Coût par rejet ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutDechet}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutDechet: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Sécurité et temps d'arrêt</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Réduction accidents (%)</label>
                    <input
                      type="number"
                      step="1"
                      max="100"
                      value={parametresSystemeAutomatise.reductionAccidents}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        reductionAccidents: Math.min(Number(e.target.value), 100)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Réduction temps d'arrêt (%)</label>
                    <input
                      type="number"
                      step="1"
                      max="100"
                      value={parametresSystemeAutomatise.reductionTempsArret}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        reductionTempsArret: Math.min(Number(e.target.value), 100)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutMaintenance}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutMaintenance: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutEnergie}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutEnergie: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Coûts cachés</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Formation continue/an</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutFormationContinue}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutFormationContinue: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mises à jour logicielles</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutMiseAJourLogiciel}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutMiseAJourLogiciel: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Consommables spécifiques</label>
                    <input
                      type="number"
                      value={parametresSystemeAutomatise.coutConsommables}
                      onChange={(e) => setParametresSystemeAutomatise({
                        ...parametresSystemeAutomatise,
                        coutConsommables: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Paramètres généraux communs */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Paramètres généraux</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Production annuelle (unités)</label>
                <input
                  type="number"
                  value={parametresGeneraux.production}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    production: Number(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marge par unité ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={parametresGeneraux.margeUnitaire}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    margeUnitaire: Number(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Heures par jour</label>
                <input
                  type="number"
                  max="24"
                  value={parametresGeneraux.heuresOperationParJour}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    heuresOperationParJour: Math.min(Number(e.target.value), 24)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jours par an</label>
                <input
                  type="number"
                  max="365"
                  value={parametresGeneraux.joursOperationParAn}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    joursOperationParAn: Math.min(Number(e.target.value), 365)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={parametresGeneraux.tauxInflation}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    tauxInflation: Number(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={parametresGeneraux.tauxActualisation}
                  onChange={(e) => setParametresGeneraux({
                    ...parametresGeneraux,
                    tauxActualisation: Number(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Nouvelle section: Impact du temps de cycle */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Impact du temps de cycle
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <VerticalBarGraph 
            data={dataGraphiques.dataComparaisonTempsCycle} 
            title="Temps de cycle (secondes/unité)"
            tooltipLabel="Temps de cycle"
            suffix=" secondes"
            yAxisWidth={150}
          />
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-indigo-800 mb-3">Analyse d'impact du temps de cycle</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Capacité réelle saisie:</p>
                <div className="flex justify-between text-sm">
                  <span>• Système actuel: <strong>{parametresSystemeActuel.capacite} unités/heure</strong></span>
                  <span>• Système automatisé: <strong>{parametresSystemeAutomatise.capacite} unités/heure</strong></span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Amélioration de la production réelle:</p>
                <p className="text-sm">
                  <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenuSupplementairePotentiel)}</strong> par an de revenus supplémentaires grâce à l'augmentation de capacité
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Contribution au flux de trésorerie:</p>
                <p className="text-sm">
                  <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(impactTempsCycle)}</strong> par an d'économies directement attribuables à la réduction du temps de cycle
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Gain de flexibilité de production:</p>
                <p className="text-sm">
                  <strong>×{gainFlexibiliteProduction.toFixed(1)}</strong> (capacité à absorber les pics de demande)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <HorizontalBarGraph 
          data={dataGraphiques.contributionsFlux} 
          title="Contribution des différents facteurs au ROI"
          tooltipLabel="Contribution"
          tooltipFormatter={(value) => [formatCurrency(value), 'Contribution']}
          height={350}
        />
        <p className="text-xs text-center text-gray-500 mt-2">
          * Ce graphique montre la contribution de chaque facteur au flux de trésorerie annuel, permettant d'identifier les principaux moteurs de rentabilité.
        </p>
      </div>
      
      {/* Graphiques comparatifs */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Analyse comparative</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <VerticalBarGraph 
            data={dataGraphiques.dataComparaisonCapacite} 
            title="Capacité de production (unités/heure)"
            tooltipLabel="Capacité"
            suffix=" unités/h"
            yAxisWidth={150}
          />
          
          <VerticalBarGraph 
            data={dataGraphiques.dataComparaisonRejets} 
            title="Taux de rejets (%)"
            tooltipLabel="Taux de rejets"
            suffix="%"
            yAxisWidth={150}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <VerticalBarGraph 
            data={dataGraphiques.dataComparaisonEmployes} 
            title="Main d'œuvre requise (ETP)"
            tooltipLabel="Main d'œuvre"
            suffix=" ETP"
            yAxisWidth={150}
          />
          
          <VerticalBarGraph 
            data={dataGraphiques.dataComparaisonAccidents} 
            title="Fréquence d'accidents (par an)"
            tooltipLabel="Fréquence"
            suffix=" accidents/an"
            yAxisWidth={150}
          />
        </div>
        
        <HorizontalBarGraph 
          data={dataGraphiques.dataEconomies} 
          title="Économies annuelles par catégorie"
          tooltipLabel="Économie"
          tooltipFormatter={(value) => [formatCurrency(value), 'Économie']}
          height={350}
        />
      </div>
      
      {/* Résultats financiers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
          </svg>
          Résultats financiers
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
            <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
            <p className="text-xs text-gray-600 mt-1">Sur {parametresSystemeAutomatise.dureeVie} ans</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
            <p className={`text-2xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
              {delaiRecuperation.toFixed(2)} ans
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">VAN</h3>
            <p className="text-2xl font-bold text-purple-800">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">TRI</h3>
            <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 bg-yellow-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
            </p>
          </div>
          <div className="flex-1 bg-red-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700">Investissement initial net</h3>
            <p className="text-2xl font-bold text-red-700">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                parametresSystemeAutomatise.coutSysteme + 
                parametresSystemeAutomatise.coutInstallation + 
                parametresSystemeAutomatise.coutIngenierie + 
                parametresSystemeAutomatise.coutFormation - 
                parametresSystemeAutomatise.subventions
              )}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2 text-center">Évolution du retour sur investissement</h3>
          <LineGraph 
            data={dataGraphiques.dataCumulatif} 
            title=""
            tooltip={{
              formatter: (value) => [formatCurrency(value), 'Montant']
            }}
            lineInfo={[
              {
                dataKey: "cumulatif",
                name: "Flux cumulatif",
                color: "#22c55e",
                width: 2,
                dot: { r: 4 },
                activeDot: { r: 6 }
              },
              {
                dataKey: "seuil",
                name: "Seuil d'investissement",
                color: "#ef4444",
                width: 2,
                dashed: true
              }
            ]}
            height={350}
          />
          <p className="text-xs text-gray-600 mt-1 italic text-center">
            * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Avantages du système automatisé</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Traitement de <strong>{parametresSystemeAutomatise.capacite} unités/heure</strong> contre {parametresSystemeActuel.capacite} actuellement</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Réduction du temps de cycle de <strong>{ameliorationTempsCycle.toFixed(1)}%</strong> ({parametresSystemeActuel.tempsCycle} à {parametresSystemeAutomatise.tempsCycle} secondes)</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Gain de flexibilité de production de <strong>{((gainFlexibiliteProduction - 1) * 100).toFixed(1)}%</strong></span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Réduction de la main d'œuvre de <strong>{parametresSystemeAutomatise.nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Diminution des rejets de <strong>{(parametresSystemeActuel.tauxRejets - parametresSystemeAutomatise.tauxRejets).toFixed(1)}%</strong></span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Réduction des accidents de <strong>{parametresSystemeAutomatise.reductionAccidents}%</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Attention aux coûts cachés</h3>
          <p className="text-sm text-gray-700 mb-3">
            L'automatisation implique des coûts supplémentaires souvent négligés dans l'analyse initiale:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Formation continue</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutFormationContinue)}/an</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Mises à jour logicielles</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutMiseAJourLogiciel)}/an</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Consommables spécifiques</p>
              <p className="text-sm text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutConsommables)}/an</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
          {projetRecommande() ? (
            <p className="text-green-700">
              <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation est financièrement viable avec un ROI de {roi.toFixed(2)}% et un délai de récupération de {delaiRecuperation.toFixed(2)} ans.
            </p>
          ) : (
            <p className="text-yellow-700">
              <span className="font-bold">⚠ À réévaluer</span> - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables (réduction coûts, augmentation capacité) ou envisagez des alternatives.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateurROI;