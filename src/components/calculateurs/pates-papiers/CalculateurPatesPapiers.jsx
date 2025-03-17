import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

/**
 * Calculateur optimisé pour l'industrie des pâtes et papiers
 * Spécialisation pour le désempilement et débrochage de ballots
 */
const CalculateurPatesPapiers = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États regroupés par catégorie pour réduire le nombre de useState
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 45, // ballots/heure
    nombreEmployes: 2.5, // ETP
    coutSysteme: 85000, // Coût d'un système semi-auto
    maintenance: 18000, // $/an
    energie: 9500, // $/an
    perteProduction: 8, // % perte due aux arrêts et retards
    tauxRejets: 8, // % de rejets
    frequenceAccident: 5.2, // accidents par an
    coutMoyenAccident: 12500, // coût moyen par accident
    tempsArretAccident: 24 // heures d'arrêt par accident
  });
  
  // États pour les données d'entrée - Paramètres spécifiques
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 380000,
    coutInstallation: 45000,
    coutIngenierie: 25000,
    coutFormation: 15000,
    coutMaintenance: 12000,
    coutEnergie: 6500,
    dureeVie: 15,
    tauxAmortissement: 15,
    coutMainOeuvre: 55000,
    nbEmployesRemplaces: 2,
    reductionDechet: 14,
    coutDechet: 230,
    augmentationProduction: 10,
    reductionEnergie: 12,
    coutEnergieTonne: 40,
    reductionEau: 8,
    coutEauTonne: 4.5,
    ameliorationQualite: 5,
    reductionEmpreinteCO2: 7,
    capaciteTraitement: 120,
    tauxRejets: 3.5,
    reductionAccidents: 85,
    subventions: 40000
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    margeBrute: 110,
    tauxInflation: 2,
    tauxActualisation: 5,
    tonnageAnnuel: 20000,
    heuresOperationParJour: 16,
    joursOperationParAn: 300
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    economiesCO2: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0
  });
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    afficherDetails: false,
    ongletActif: 'general'
  });
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 45,
        nombreEmployes: 2.5,
        coutSysteme: 15000, 
        maintenance: 6000,
        energie: 4000,
        tauxRejets: 8,
        perteProduction: 12,
        frequenceAccident: 5.2
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 80,
        nombreEmployes: 1.5,
        coutSysteme: 120000,
        maintenance: 18000,
        energie: 8000,
        tauxRejets: 5.5,
        perteProduction: 8,
        frequenceAccident: 3.8
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 100,
        nombreEmployes: 1,
        coutSysteme: 250000,
        maintenance: 25000,
        energie: 10000,
        tauxRejets: 4.2,
        perteProduction: 5,
        frequenceAccident: 1.5
      });
    }
  }, [typeSystemeActuel]);
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, 
      coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
      reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
      coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
      reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
      subventions
    } = parametresSystemeAutomatise;

    const {
      capacite, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsManuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = parametresSystemeActuel;

    const {
      margeBrute, tauxInflation, tauxActualisation, tonnageAnnuel,
      heuresOperationParJour, joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (tonnageAnnuel * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;
    
    // Variable pour stocker le bénéfice de qualité de la dernière année (pour l'affichage)
    let dernierBeneficeQualite = 0;
    
    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (tonnageAnnuel * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets (fils vs manuel)
      const economieRejets = tonnageAnnuel * (tauxRejetsManuel - tauxRejets) / 100 * coutDechet * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie dans le processus
      const economieEnergieProcessus = (tonnageAnnuel * reductionEnergie / 100) * coutEnergieTonne * facteurInflation;
      
      // Économies liées à la réduction de consommation d'eau
      const economieEau = (tonnageAnnuel * reductionEau / 100) * coutEauTonne * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const productionSupplementaire = tonnageAnnuel * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeBrute * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (tonnageAnnuel * ameliorationQualite / 100) * (margeBrute * 0.2) * facteurInflation;
      
      // Stockage de la dernière valeur pour l'affichage
      if (annee === dureeVie) {
        dernierBeneficeQualite = beneficeQualite;
      }
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (en tonnes)
      const tonnesCO2Economisees = (tonnageAnnuel * reductionEmpreinteCO2 / 100);
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets +
                       beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
      
      // Calcul du flux de trésorerie actualisé
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
        economiePersonnel,
        economieDechet,
        economieMaintenance,
        economieEnergie,
        economieEnergieProcessus,
        economieEau,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        amortissement,
        tonnesCO2Economisees
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = 0;
    for (let r = 1; r <= 100; r++) {
      let npv = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + r / 100, t + 1);
      }
      if (npv <= 0) {
        triApprox = r - 1;
        break;
      }
    }
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  };
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, economiesCO2, differenceProduction, 
    economieAnnuelle, reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret, fluxTresorerie 
  } = resultats;
  
  // Extraction des valeurs des paramètres généraux
  const { 
    margeBrute, tonnageAnnuel, heuresOperationParJour, joursOperationParAn 
  } = parametresGeneraux;
  
  // Extraction des valeurs des paramètres du système actuel
  const {
    capacite: capaciteActuelle, nombreEmployes: nombreEmployesActuel,
    maintenance: maintenanceActuelle, energie: energieActuelle,
    tauxRejets: tauxRejetsManuel, frequenceAccident: frequenceAccidentActuel,
    coutMoyenAccident
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
  
  // Fonctions pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };
  
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };
  
  // Extraction des valeurs de l'UI
  const { afficherDetails, ongletActif } = ui;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Solution Automatisée de Désempilement et Débrochage de Ballots</h2>
            <p className="mb-4 text-gray-700">Notre système automatisé haute performance transforme votre chaîne de production avec un ROI en moins de 2 ans.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <p className="font-bold text-gray-700">Efficacité maximale</p>
              <p className="text-3xl font-bold text-green-600">{capaciteTraitement} ballots/h</p>
              <p className="text-xs text-gray-500">30 secondes par opération</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">ROI Rapide</h3>
            <p className="text-gray-600 text-sm mb-2">ROI inférieur à 2 ans avec des économies sur la main d'œuvre et l'amélioration de la qualité.</p>
            <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {delaiRecuperation <= 2 ? "ROI < 2 ans ✓" : `ROI: ${delaiRecuperation.toFixed(1)} ans`}
            </span>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-blue-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Sécurité Améliorée</h3>
            <p className="text-gray-600 text-sm mb-2">Réduction des risques d'accidents grâce à l'automatisation des tâches dangereuses.</p>
            <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Réduction des accidents de {reductionAccidents}%
            </span>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-purple-100 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Productivité Maximale</h3>
            <p className="text-gray-600 text-sm mb-2">Augmentation de la capacité et réduction des temps d'arrêt grâce à une alimentation continue.</p>
            <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {capaciteTraitement} ballots/heure
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
        <button
          onClick={() => changerOnglet('general')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'general'
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Vue générale
        </button>
        <button
          onClick={() => changerOnglet('comparatif')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'comparatif'
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Analyse comparative
        </button>
        <button
          onClick={() => changerOnglet('financier')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'financier'
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Détails financiers
        </button>
        <button
          onClick={() => changerOnglet('securite')}
          className={`px-4 py-3 font-medium transition-all ${
            ongletActif === 'securite'
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Sécurité & Environnement
        </button>
      </div>
      
      {/* Vue générale - Premier onglet */}
      {ongletActif === 'general' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Paramètres de base */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Paramètres de base
              </h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Configuration du système actuel</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Type de système actuel</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTypeSystemeActuel('manuel')}
                      className={`py-2 text-sm rounded-md transition-all ${
                        typeSystemeActuel === 'manuel'
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Manuel
                    </button>
                    <button
                      onClick={() => setTypeSystemeActuel('semi-auto')}
                      className={`py-2 text-sm rounded-md transition-all ${
                        typeSystemeActuel === 'semi-auto'
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Semi-automatisé
                    </button>
                    <button
                      onClick={() => setTypeSystemeActuel('auto-ancien')}
                      className={`py-2 text-sm rounded-md transition-all ${
                        typeSystemeActuel === 'auto-ancien'
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Auto. (ancien)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacité actuelle (ballots/heure)</label>
                    <input
                      type="number"
                      value={parametresSystemeActuel.capacite}
                      onChange={(e) => setParametresSystemeActuel({
                        ...parametresSystemeActuel,
                        capacite: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
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
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heures par jour</label>
                    <input
                      type="number"
                      value={parametresGeneraux.heuresOperationParJour}
                      onChange={(e) => setParametresGeneraux({
                        ...parametresGeneraux,
                        heuresOperationParJour: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jours par an</label>
                    <input
                      type="number"
                      value={parametresGeneraux.joursOperationParAn}
                      onChange={(e) => setParametresGeneraux({
                        ...parametresGeneraux,
                        joursOperationParAn: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tonnage annuel (tonnes)</label>
                    <input
                      type="number"
                      value={parametresGeneraux.tonnageAnnuel}
                      onChange={(e) => setParametresGeneraux({
                        ...parametresGeneraux,
                        tonnageAnnuel: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marge brute par tonne (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametresGeneraux.margeBrute}
                      onChange={(e) => setParametresGeneraux({
                        ...parametresGeneraux,
                        margeBrute: Number(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={toggleDetails}
                  className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                >
                  {afficherDetails ? 'Masquer' : 'Afficher'} les paramètres avancés
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${afficherDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Résultats */}
            <div className="flex flex-col gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                  Résultats
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-3 rounded">
                    <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                    <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
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
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(van)}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded">
                    <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                    <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1 bg-yellow-50 p-3 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
                    <p className="text-2xl font-bold text-yellow-700">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(economieAnnuelle)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Avantages du système automatisé</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Traitement de <strong>{capaciteTraitement} ballots/heure</strong> contre {capaciteActuelle} actuellement</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Réduction de la main d'œuvre de <strong>{nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Diminution des rejets de fils métalliques de <strong>{(tauxRejetsManuel - tauxRejetsFils).toFixed(1)}%</strong></span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Réduction des accidents de <strong>{reductionAccidents}%</strong></span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instructions de sécurité */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sécurité: un investissement rentable
                </h3>
                <p className="text-sm mb-2">
                  Notre système intègre des dispositifs de sécurité avancés: barrières immatérielles, arrêts d'urgence, zones de sécurité et interface opérateur ergonomique.
                </p>
                <div className="mt-2 p-2 bg-white rounded border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Impact financier de la sécurité améliorée:</p>
                  <p className="text-sm">
                    Économie annuelle estimée: <span className="font-bold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(economiesSecurite + economiesTempsArret)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Paramètres avancés - affichage conditionnel */}
          {afficherDetails && (
            <div className="bg-white p-4 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Paramètres avancés</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Système automatisé</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacité de traitement (ballots/h)</label>
                      <input
                        type="number"
                        value={parametresSystemeAutomatise.capaciteTraitement}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          capaciteTraitement: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Taux de rejet fils système (%)</label>
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
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Maintenance actuelle/an (€)</label>
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
                      <label className="block text-sm font-medium mb-1">Maintenance système/an (€)</label>
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
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Avantages du système</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Réduction des déchets (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeAutomatise.reductionDechet}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          reductionDechet: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parametresSystemeAutomatise.ameliorationQualite}
                        onChange={(e) => setParametresSystemeAutomatise({
                          ...parametresSystemeAutomatise,
                          ameliorationQualite: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Analyse comparative - Deuxième onglet */}
      {ongletActif === 'comparatif' && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse comparative détaillée</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Comparaison des systèmes</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-sm text-gray-600">Système Actuel ({typeSystemeActuel === 'manuel' ? 'Manuel' : typeSystemeActuel === 'semi-auto' ? 'Semi-auto' : 'Auto ancien'})</span>
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
            
            <div className="mt-8 h-80">
              <h3 className="font-medium text-gray-700 mb-4">Économies annuelles par catégorie</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraphiques.dataEconomies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value), 'Économie']} />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Détails financiers - Troisième onglet */}
      {ongletActif === 'financier' && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse financière détaillée</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Investissement initial</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Coût du système</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutSysteme)}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Coût d'installation</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutInstallation)}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Coût d'ingénierie</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutIngenierie)}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Coût de formation</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutFormation)}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Subventions</td>
                        <td className="px-4 py-2 text-right font-medium text-green-600">
                          -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(subventions)}
                        </td>
                      </tr>
                      <tr className="border-t border-gray-400">
                        <td className="px-4 py-2 text-left font-bold">Total de l'investissement</td>
                        <td className="px-4 py-2 text-right font-bold">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Indicateurs de rentabilité</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Retour sur Investissement (ROI)</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {roi.toFixed(2)}%
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Délai de récupération</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {delaiRecuperation.toFixed(2)} ans
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Valeur Actuelle Nette (VAN)</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(van)}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-left">Taux de Rendement Interne (TRI)</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {tri.toFixed(2)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium text-gray-700 mb-3">Projection des flux de trésorerie</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataGraphiques.dataCumulatif}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip formatter={(value) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value), 'Montant']} />
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
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">
                * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sécurité & Environnement - Quatrième onglet */}
      {ongletActif === 'securite' && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Sécurité des travailleurs et impact environnemental</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Amélioration de la sécurité
                </h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Statistiques actuelles</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-red-50 rounded">
                      <p className="text-xs text-gray-500">Fréquence d'accidents</p>
                      <p className="text-xl font-bold text-red-600">{frequenceAccidentActuel.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span></p>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <p className="text-xs text-gray-500">Coût moyen par accident</p>
                      <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(coutMoyenAccident)}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Impact financier</h4>
                    <p className="text-sm">Réduction des accidents : <span className="font-bold">{reductionAccidents}%</span></p>
                    <p className="text-sm">Économie annuelle estimée : <span className="font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(economiesSecurite + economiesTempsArret)}</span></p>
                  </div>
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
                  
                  <div className="space-y-4 mb-4">
                    <div className="p-3 bg-green-50 rounded">
                      <p className="text-xs text-gray-500">Réduction des émissions de CO2</p>
                      <p className="flex justify-between">
                        <span className="text-xl font-bold text-green-600">{parametresSystemeAutomatise.reductionEmpreinteCO2}%</span>
                        <span className="text-sm font-medium text-green-700">{economiesCO2.toFixed(0)} tonnes sur {dureeVie} ans</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculateurPatesPapiers;