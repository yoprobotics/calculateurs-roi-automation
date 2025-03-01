import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur spécifique à l'industrie des pâtes et papiers
const CalculateurPatesPapiers = () => {
  // États pour les données d'entrée - Paramètres spécifiques à l'industrie des pâtes et papiers
  // Configuration par défaut pour le désempilement et débrochage de ballots
  const [coutSysteme, setCoutSysteme] = useState(380000);
  const [coutInstallation, setCoutInstallation] = useState(45000);
  const [coutIngenierie, setCoutIngenierie] = useState(25000);
  const [coutFormation, setCoutFormation] = useState(15000);
  const [coutMaintenance, setCoutMaintenance] = useState(12000);
  const [coutEnergie, setCoutEnergie] = useState(6500);
  const [dureeVie, setDureeVie] = useState(15);
  const [tauxAmortissement, setTauxAmortissement] = useState(15);
  const [coutMainOeuvre, setCoutMainOeuvre] = useState(55000);
  const [nbEmployesRemplaces, setNbEmployesRemplaces] = useState(2);
  const [reductionDechet, setReductionDechet] = useState(14);
  const [coutDechet, setCoutDechet] = useState(230);
  const [tonnageAnnuel, setTonnageAnnuel] = useState(20000);
  const [augmentationProduction, setAugmentationProduction] = useState(10);
  const [reductionEnergie, setReductionEnergie] = useState(12);
  const [coutEnergieTonne, setCoutEnergieTonne] = useState(40);
  const [reductionEau, setReductionEau] = useState(8);
  const [coutEauTonne, setCoutEauTonne] = useState(4.5);
  const [ameliorationQualite, setAmeliorationQualite] = useState(5);
  const [margeBrute, setMargeBrute] = useState(110);
  const [tauxInflation, setTauxInflation] = useState(2);
  const [tauxActualisation, setTauxActualisation] = useState(5);
  const [subventions, setSubventions] = useState(40000);
  const [reductionEmpreinteCO2, setReductionEmpreinteCO2] = useState(7);
  const [capaciteTraitement, setCapaciteTraitement] = useState(120);
  const [tauxRejetsFils, setTauxRejetsFils] = useState(3.5);
  const [tauxRejetsManuel, setTauxRejetsManuel] = useState(8);
  const [coutRejets, setCoutRejets] = useState(85);
  
  // États pour les résultats
  const [resultatAnnuel, setResultatAnnuel] = useState([]);
  const [roi, setRoi] = useState(0);
  const [delaiRecuperation, setDelaiRecuperation] = useState(0);
  const [van, setVan] = useState(0);
  const [tri, setTri] = useState(0);
  const [economiesAnnuelles, setEconomiesAnnuelles] = useState({
    mainOeuvre: 0,
    dechets: 0,
    energie: 0,
    eau: 0,
    rejets: 0,
    qualite: 0,
    production: 0,
    co2: 0
  });
  const [viewMode, setViewMode] = useState('standard'); // 'standard', 'avance'

  // Fonction de calcul du ROI pour l'industrie des pâtes et papiers
  const calculerROI = () => {
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    
    // Calcul des économies annuelles initiales
    const economieMainOeuvre = coutMainOeuvre * nbEmployesRemplaces;
    const economieDechets = tonnageAnnuel * (reductionDechet / 100) * coutDechet;
    const economieEnergie = tonnageAnnuel * (reductionEnergie / 100) * coutEnergieTonne;
    const economieEau = tonnageAnnuel * (reductionEau / 100) * coutEauTonne;
    const economieRejets = tonnageAnnuel * ((tauxRejetsManuel - tauxRejetsFils) / 100) * coutRejets;
    const beneficeQualite = (tonnageAnnuel * ameliorationQualite / 100) * (margeBrute * 0.2);
    const beneficeProduction = (tonnageAnnuel * augmentationProduction / 100) * margeBrute;
    const reductionCO2 = tonnageAnnuel * (reductionEmpreinteCO2 / 100);
    
    // Mise à jour des économies annuelles pour affichage
    setEconomiesAnnuelles({
      mainOeuvre: economieMainOeuvre,
      dechets: economieDechets,
      energie: economieEnergie,
      eau: economieEau,
      rejets: economieRejets,
      qualite: beneficeQualite,
      production: beneficeProduction,
      co2: reductionCO2
    });
    
    // Calcul des flux de trésorerie annuels
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Application de l'inflation aux coûts et bénéfices
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      
      // Coûts annuels
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const energieAnnuelle = coutEnergie * facteurInflation;
      
      // Économies et bénéfices annuels ajustés avec l'inflation
      const economieMainOeuvreAnnuelle = economieMainOeuvre * facteurInflation;
      const economieDechetAnnuelle = economieDechets * facteurInflation;
      const economieEnergieAnnuelle = economieEnergie * facteurInflation;
      const economieEauAnnuelle = economieEau * facteurInflation;
      const economieRejetsAnnuelle = economieRejets * facteurInflation;
      const beneficeQualiteAnnuel = beneficeQualite * facteurInflation;
      const beneficeProductionAnnuel = beneficeProduction * facteurInflation;
      
      // Avantage fiscal de l'amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Flux de trésorerie annuel
      const fluxAnnuel = economieMainOeuvreAnnuelle + 
                        economieDechetAnnuelle + 
                        economieEnergieAnnuelle + 
                        economieEauAnnuelle + 
                        economieRejetsAnnuelle + 
                        beneficeQualiteAnnuel + 
                        beneficeProductionAnnuel - 
                        maintenanceAnnuelle - 
                        energieAnnuelle + 
                        amortissement;
      
      // Flux actualisé
      const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
      const fluxActualise = fluxAnnuel / facteurActualisation;
      
      // Mise à jour de la VAN
      valeurActuelleNette += fluxActualise;
      
      // Calcul du délai de récupération
      cumulFluxTresorerie += fluxAnnuel;
      if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
        const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
        const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
        periodeRecuperation = annee - 1 + fractionAnnee;
        recuperationAtteinte = true;
      }
      
      // Ajout des résultats annuels
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie,
        economieMainOeuvre: economieMainOeuvreAnnuelle,
        economieDechets: economieDechetAnnuelle,
        economieEnergie: economieEnergieAnnuelle,
        economieEau: economieEauAnnuelle,
        economieRejets: economieRejetsAnnuelle,
        beneficeQualite: beneficeQualiteAnnuel,
        beneficeProduction: beneficeProductionAnnuel,
        maintenanceAnnuelle,
        energieAnnuelle,
        amortissement
      });
    }
    
    // Calcul du ROI global
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation)
    const triApprox = calculerTRI(investissementInitial, fluxTresorerie.map(ft => ft.fluxAnnuel));
    
    // Mise à jour des états avec les résultats
    setResultatAnnuel(fluxTresorerie);
    setRoi(roiCalcule);
    setDelaiRecuperation(periodeRecuperation);
    setVan(valeurActuelleNette);
    setTri(triApprox);
  };
  
  // Déclencher le calcul lors des changements d'état
  useEffect(() => {
    calculerROI();
  }, [
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, coutEnergie,
    dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces, reductionDechet, coutDechet,
    tonnageAnnuel, augmentationProduction, reductionEnergie, coutEnergieTonne, reductionEau,
    coutEauTonne, ameliorationQualite, margeBrute, tauxInflation, tauxActualisation, subventions,
    reductionEmpreinteCO2, capaciteTraitement, tauxRejetsFils, tauxRejetsManuel, coutRejets
  ]);
  
  // Préparation des données pour les graphiques
  const dataFluxTresorerie = resultatAnnuel.map(item => ({
    annee: `Année ${item.annee}`,
    fluxTresorerie: Math.round(item.fluxAnnuel),
    fluxActualise: Math.round(item.fluxActualise)
  }));
  
  const dataCumulatif = resultatAnnuel.map(item => ({
    annee: `Année ${item.annee}`,
    cumulatif: Math.round(item.cumulFluxTresorerie)
  }));
  
  const dataEconomies = [
    { 
      categorie: "Main d'œuvre", 
      valeur: Math.round(economiesAnnuelles.mainOeuvre) 
    },
    { 
      categorie: "Déchets", 
      valeur: Math.round(economiesAnnuelles.dechets) 
    },
    { 
      categorie: "Énergie", 
      valeur: Math.round(economiesAnnuelles.energie) 
    },
    { 
      categorie: "Eau", 
      valeur: Math.round(economiesAnnuelles.eau) 
    },
    { 
      categorie: "Rejets fils", 
      valeur: Math.round(economiesAnnuelles.rejets) 
    },
    { 
      categorie: "Qualité", 
      valeur: Math.round(economiesAnnuelles.qualite) 
    },
    { 
      categorie: "Production", 
      valeur: Math.round(economiesAnnuelles.production) 
    }
  ];
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Calculateur de ROI - Désempilement et Débrochage de Ballots dans l'Industrie des Pâtes et Papiers
      </h1>
      
      <div className="mb-8 bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-2">Automatisation du désempilement et débrochage</h3>
        <p className="mb-2">
          L'automatisation du désempilement et du débrochage des ballots de pâtes offre des avantages considérables en termes 
          d'efficacité opérationnelle, de sécurité et d'impact environnemental.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Efficacité Opérationnelle</h4>
            <p>Augmentation de la capacité de traitement et réduction significative des temps d'arrêt.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Qualité Supérieure</h4>
            <p>Réduction des rejets de fils métalliques et amélioration de la qualité du produit final.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Impact Écologique</h4>
            <p>Diminution des déchets, de la consommation d'eau et d'énergie, et réduction de l'empreinte CO2.</p>
          </div>
        </div>
      </div>
      
      {/* Options de mode d'affichage */}
      <div className="mb-6 flex justify-center">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setViewMode('standard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'standard'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Standard
          </button>
          <button
            onClick={() => setViewMode('avance')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'avance'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Avancé
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire d'entrée */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Paramètres d'investissement</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts initiaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
                <input
                  type="number"
                  value={coutSysteme}
                  onChange={(e) => setCoutSysteme(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
                <input
                  type="number"
                  value={coutInstallation}
                  onChange={(e) => setCoutInstallation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
                <input
                  type="number"
                  value={coutIngenierie}
                  onChange={(e) => setCoutIngenierie(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
                <input
                  type="number"
                  value={coutFormation}
                  onChange={(e) => setCoutFormation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subventions ($)</label>
                <input
                  type="number"
                  value={subventions}
                  onChange={(e) => setSubventions(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coût de maintenance annuel ($)</label>
                <input
                  type="number"
                  value={coutMaintenance}
                  onChange={(e) => setCoutMaintenance(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'énergie annuel ($)</label>
                <input
                  type="number"
                  value={coutEnergie}
                  onChange={(e) => setCoutEnergie(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée de vie (années)</label>
                <input
                  type="number"
                  value={dureeVie}
                  onChange={(e) => setDureeVie(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'amortissement (%)</label>
                <input
                  type="number"
                  value={tauxAmortissement}
                  onChange={(e) => setTauxAmortissement(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tauxInflation}
                  onChange={(e) => setTauxInflation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux d'actualisation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tauxActualisation}
                  onChange={(e) => setTauxActualisation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre et production</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coût annuel par employé ($)</label>
                <input
                  type="number"
                  value={coutMainOeuvre}
                  onChange={(e) => setCoutMainOeuvre(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employés remplacés (nombre)</label>
                <input
                  type="number"
                  step="0.5"
                  value={nbEmployesRemplaces}
                  onChange={(e) => setNbEmployesRemplaces(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tonnage annuel traité (tonnes)</label>
                <input
                  type="number"
                  value={tonnageAnnuel}
                  onChange={(e) => setTonnageAnnuel(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacité de traitement (ballots/heure)</label>
                <input
                  type="number"
                  value={capaciteTraitement}
                  onChange={(e) => setCapaciteTraitement(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Augmentation de production (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={augmentationProduction}
                  onChange={(e) => setAugmentationProduction(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marge brute par tonne ($)</label>
                <input
                  type="number"
                  step="0.5"
                  value={margeBrute}
                  onChange={(e) => setMargeBrute(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          {viewMode === 'avance' && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Paramètres spécifiques à l'industrie des pâtes et papiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction des déchets (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reductionDechet}
                    onChange={(e) => setReductionDechet(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût des déchets par tonne ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={coutDechet}
                    onChange={(e) => setCoutDechet(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taux de rejets manuel (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tauxRejetsManuel}
                    onChange={(e) => setTauxRejetsManuel(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taux de rejets automatisé (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tauxRejetsFils}
                    onChange={(e) => setTauxRejetsFils(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût des rejets par tonne ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={coutRejets}
                    onChange={(e) => setCoutRejets(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amélioration de la qualité (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={ameliorationQualite}
                    onChange={(e) => setAmeliorationQualite(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction d'énergie (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reductionEnergie}
                    onChange={(e) => setReductionEnergie(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût énergie par tonne ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={coutEnergieTonne}
                    onChange={(e) => setCoutEnergieTonne(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction consommation d'eau (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reductionEau}
                    onChange={(e) => setReductionEau(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût de l'eau par tonne ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coutEauTonne}
                    onChange={(e) => setCoutEauTonne(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réduction empreinte CO2 (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={reductionEmpreinteCO2}
                    onChange={(e) => setReductionEmpreinteCO2(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Résultats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Résultats</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Pourcentage de retour sur l'investissement total</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
                <p className="text-2xl font-bold text-blue-800">{delaiRecuperation.toFixed(2)} ans</p>
                <p className="text-xs text-gray-600 mt-1">Temps nécessaire pour récupérer l'investissement</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">VAN</h3>
                <p className="text-2xl font-bold text-purple-800">${van.toFixed(2)}</p>
                <p className="text-xs text-gray-600 mt-1">Valeur Actuelle Nette</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
                <p className="text-xs text-gray-600 mt-1">Taux de Rendement Interne</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Économies annuelles</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataEconomies}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categorie" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} $`, 'Économie']} />
                    <Legend />
                    <Bar dataKey="valeur" name="Économie annuelle ($)" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Impact environnemental</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-700">Réduction des déchets</p>
                  <p className="text-lg font-semibold text-green-700">
                    {(tonnageAnnuel * reductionDechet / 100).toFixed(1)} tonnes/an
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-700">Réduction d'émissions CO2</p>
                  <p className="text-lg font-semibold text-green-700">
                    {(tonnageAnnuel * reductionEmpreinteCO2 / 100).toFixed(1)} tonnes/an
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-700">Économie d'eau</p>
                  <p className="text-lg font-semibold text-green-700">
                    {(tonnageAnnuel * reductionEau / 100).toFixed(1)} m³/an
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-700">Réduction des rejets</p>
                  <p className="text-lg font-semibold text-green-700">
                    {(tonnageAnnuel * (tauxRejetsManuel - tauxRejetsFils) / 100).toFixed(1)} tonnes/an
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Recommandation</h3>
              {van > 0 && tri > tauxActualisation ? (
                <p className="text-green-700">
                  <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation dans l'industrie des pâtes et papiers présente un ROI positif de {roi.toFixed(2)}% et un délai de récupération de {delaiRecuperation.toFixed(2)} ans.
                </p>
              ) : (
                <p className="text-yellow-700">
                  <span className="font-bold">⚠ À réévaluer</span> - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.
                </p>
              )}
            </div>
          </div>
          
          {viewMode === 'avance' && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse détaillée</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Flux de trésorerie annuels</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataFluxTresorerie}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="annee" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} $`, '']} />
                      <Legend />
                      <Bar dataKey="fluxTresorerie" name="Flux de trésorerie" fill="#4CAF50" />
                      <Bar dataKey="fluxActualise" name="Flux actualisé" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Flux de trésorerie cumulatifs</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataCumulatif}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="annee" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} $`, 'Cumulatif']} />
                      <Legend />
                      <Line type="monotone" dataKey="cumulatif" name="Flux cumulatif" stroke="#4CAF50" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateurPatesPapiers;
