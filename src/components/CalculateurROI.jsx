import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle avec comparaison avant/après
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États pour les paramètres du système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 35, // unités/heure
    tempsCycle: 102.86, // secondes/unité (3600/capacité)
    nombreEmployes: 2, // ETP
    coutSysteme: 10000, // Coût du système actuel
    maintenance: 5000, // $/an
    energie: 3000, // $/an
    perteProduction: 10, // % perte due aux arrêts et retards
    tauxRejets: 6, // % de rejets/défauts
    frequenceAccident: 3.5, // accidents par an
    coutMoyenAccident: 8000, // coût moyen par accident
    tempsArretAccident: 16, // heures d'arrêt par accident
    formationAnnuelle: 1500, // coût de formation annuel
    consommablesAnnuels: 12000 // coût des consommables par an
  });

  // États pour les paramètres du système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    coutSysteme: 150000,
    coutInstallation: 25000,
    coutIngenierie: 20000,
    coutFormation: 15000, // Formation initiale
    formationContinue: 5000, // Formation continue annuelle
    coutMaintenance: 8000,
    coutEnergie: 6000,
    dureeVie: 10,
    tauxAmortissement: 20,
    coutMainOeuvre: 45000,
    nbEmployesRemplaces: 1.5,
    capaciteTraitement: 80, // unités/heure
    tempsCycle: 45, // secondes/unité
    reductionDechet: 12,
    coutDechet: 150,
    augmentationProduction: 15,
    reductionEnergie: 8,
    coutEnergieTonne: 30,
    reductionEau: 6,
    coutEauTonne: 3.5,
    ameliorationQualite: 4,
    reductionEmpreinteCO2: 5,
    tauxRejets: 2.5,
    reductionAccidents: 75,
    supportTechnique: 3500, // Support technique annuel
    miseANiveauLogicielle: 2500, // Mises à niveau logicielles annuelles
    consommablesAnnuels: 8000, // Coût des consommables par an
    subventions: 0
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    margeBrute: 25, // $/unité
    tauxInflation: 2,
    tauxActualisation: 5,
    productionAnnuelle: 100000, // unités par an
    heuresOperationParJour: 16,
    joursOperationParAn: 250,
    coutQualite: 20000, // Coût annuel lié aux problèmes de qualité
    coutRebut: 15 // Coût par unité rejetée
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
    ongletActif: 'general',
    viewMode: 'basique', // 'basique', 'avance'
    analyseMode: 'standard' // 'standard', 'comparaison', 'sensibilite'
  });
  
  // États pour la comparaison de scénarios
  const [scenarios, setScenarios] = useState([]);
  const [scenarioActif, setScenarioActif] = useState('actuel');
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 35,
        tempsCycle: 102.86,
        nombreEmployes: 2,
        coutSysteme: 10000, 
        maintenance: 3000,
        energie: 2000,
        tauxRejets: 6,
        perteProduction: 12,
        frequenceAccident: 3.5,
        formationAnnuelle: 1500,
        consommablesAnnuels: 12000
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 60,
        tempsCycle: 60,
        nombreEmployes: 1.5,
        coutSysteme: 65000,
        maintenance: 8000,
        energie: 5000,
        tauxRejets: 4,
        perteProduction: 8,
        frequenceAccident: 2.2,
        formationAnnuelle: 3000,
        consommablesAnnuels: 10000
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 70,
        tempsCycle: 51.43,
        nombreEmployes: 1,
        coutSysteme: 120000,
        maintenance: 12000,
        energie: 7000,
        tauxRejets: 3.5,
        perteProduction: 6,
        frequenceAccident: 1.2,
        formationAnnuelle: 4500,
        consommablesAnnuels: 9000
      });
    }
  }, [typeSystemeActuel]);
  
  // Synchroniser le temps de cycle et la capacité pour le système actuel
  useEffect(() => {
    const tempsCycleCalcule = 3600 / parametresSystemeActuel.capacite;
    if (Math.abs(tempsCycleCalcule - parametresSystemeActuel.tempsCycle) > 0.1) {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        tempsCycle: parseFloat(tempsCycleCalcule.toFixed(2))
      });
    }
  }, [parametresSystemeActuel.capacite]);
  
  // Synchroniser le temps de cycle et la capacité pour le système automatisé
  useEffect(() => {
    const tempsCycleCalcule = 3600 / parametresSystemeAutomatise.capaciteTraitement;
    if (Math.abs(tempsCycleCalcule - parametresSystemeAutomatise.tempsCycle) > 0.1) {
      setParametresSystemeAutomatise({
        ...parametresSystemeAutomatise,
        tempsCycle: parseFloat(tempsCycleCalcule.toFixed(2))
      });
    }
  }, [parametresSystemeAutomatise.capaciteTraitement]);
