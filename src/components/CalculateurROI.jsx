import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculerTRI, calculerDelaiRecuperation, calculerFluxActualise, appliquerInflation } from '../utils/calculationHelpers';

// Calculateur général pour l'automatisation industrielle
const CalculateurROI = () => {
  // États pour les données d'entrée
  const [coutSysteme, setCoutSysteme] = useState(150000);
  const [coutInstallation, setCoutInstallation] = useState(25000);
  const [coutIngenierie, setCoutIngenierie] = useState(20000);
  const [coutFormation, setCoutFormation] = useState(10000);
  const [coutMaintenance, setCoutMaintenance] = useState(5000);
  const [coutEnergie, setCoutEnergie] = useState(3000);
  const [dureeVie, setDureeVie] = useState(10);
  const [tauxAmortissement, setTauxAmortissement] = useState(20);
  const [coutMainOeuvre, setCoutMainOeuvre] = useState(45000);
  const [nbEmployesRemplaces, setNbEmployesRemplaces] = useState(1.5);
  const [nombreEmployesActuel, setNombreEmployesActuel] = useState(5);
  const [coutErrorHumaine, setCoutErrorHumaine] = useState(15000);
  const [augmentationProduction, setAugmentationProduction] = useState(15);
  const [tauxProblemeQualite, setTauxProblemeQualite] = useState(8);
  const [coutQualite, setCoutQualite] = useState(20000);
  const [production, setProduction] = useState(100000);
  const [margeUnitaire, setMargeUnitaire] = useState(0.2);
  const [tauxInflation, setTauxInflation] = useState(2);
  const [tauxActualisation, setTauxActualisation] = useState(5);
  const [subventions, setSubventions] = useState(0);
  const [coutFormationContinue, setCoutFormationContinue] = useState(3000);
  
  // État pour gérer les erreurs de validation
  const [erreurs, setErreurs] = useState({});
  
  // États pour les résultats
  const [resultatAnnuel, setResultatAnnuel] = useState([]);
  const [roi, setRoi] = useState(0);
  const [delaiRecuperation, setDelaiRecuperation] = useState(0);
  const [van, setVan] = useState(0);
  const [tri, setTri] = useState(0);
  
  // États pour la comparaison de scénarios
  const [scenarios, setScenarios] = useState([]);
  const [scenarioActif, setScenarioActif] = useState('actuel');
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  const [analyseMode, setAnalyseMode] = useState('standard'); // 'standard', 'comparaison', 'sensibilite'
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  const [variationSensibilite, setVariationSensibilite] = useState(20); // variation en pourcentage
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);
  const [viewMode, setViewMode] = useState('basique'); // 'basique', 'avance'
  
  // Fonction de validation des entrées
  const validerEntrees = () => {
    const nouvellesErreurs = {};
    
    // Validation des pourcentages (ne peuvent pas dépasser 100%)
    if (augmentationProduction < 0 || augmentationProduction > 100) {
      nouvellesErreurs.augmentationProduction = "L'augmentation de production doit être entre 0 et 100%";
    }
    
    if (tauxProblemeQualite < 0 || tauxProblemeQualite > 100) {
      nouvellesErreurs.tauxProblemeQualite = "Le taux de problème de qualité doit être entre 0 et 100%";
    }
    
    if (tauxAmortissement < 0 || tauxAmortissement > 100) {
      nouvellesErreurs.tauxAmortissement = "Le taux d'amortissement doit être entre 0 et 100%";
    }
    
    // Validation du nombre d'employés remplacés
    if (nbEmployesRemplaces > nombreEmployesActuel) {
      nouvellesErreurs.nbEmployesRemplaces = "Le nombre d'employés remplacés ne peut pas être supérieur au nombre total d'employés";
    }
    
    if (nbEmployesRemplaces < 0) {
      nouvellesErreurs.nbEmployesRemplaces = "Le nombre d'employés remplacés doit être positif";
    }
    
    if (nombreEmployesActuel <= 0) {
      nouvellesErreurs.nombreEmployesActuel = "Le nombre d'employés actuels doit être supérieur à 0";
    }
    
    // Validation des valeurs négatives pour les coûts
    if (coutSysteme < 0) nouvellesErreurs.coutSysteme = "Le coût doit être positif";
    if (coutInstallation < 0) nouvellesErreurs.coutInstallation = "Le coût doit être positif";
    if (coutIngenierie < 0) nouvellesErreurs.coutIngenierie = "Le coût doit être positif";
    if (coutFormation < 0) nouvellesErreurs.coutFormation = "Le coût doit être positif";
    if (coutMaintenance < 0) nouvellesErreurs.coutMaintenance = "Le coût doit être positif";
    if (coutEnergie < 0) nouvellesErreurs.coutEnergie = "Le coût doit être positif";
    if (coutMainOeuvre < 0) nouvellesErreurs.coutMainOeuvre = "Le coût doit être positif";
    if (coutErrorHumaine < 0) nouvellesErreurs.coutErrorHumaine = "Le coût doit être positif";
    if (coutQualite < 0) nouvellesErreurs.coutQualite =