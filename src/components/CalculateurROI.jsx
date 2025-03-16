import React, { useState, useEffect } from 'react';

// Importation des composants modulaires
import ParametresSystemeActuel from './calculateur-roi/ParametresSystemeActuel';
import ParametresSystemeAutomatise from './calculateur-roi/ParametresSystemeAutomatise';
import ParametresGeneraux from './calculateur-roi/ParametresGeneraux';
import ResultatsFinanciers from './calculateur-roi/ResultatsFinanciers';
import AnalyseComparative from './calculateur-roi/AnalyseComparative';

// Importation des fonctions de calcul
import { calculerROI } from './calculateur-roi/utils/calculFinancier';

/**
 * Calculateur général pour l'automatisation industrielle avec interface comparative
 */
const CalculateurROI = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États pour les paramètres du système actuel
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 30, // unités/heure
    tempsCycle: 120, // secondes/unité
    nombreEmployes: 6, // ETP
    tauxRejets: 9, // % de rejets
    perteProduction: 12, // % perte due aux arrêts et retards
    frequenceAccident: 4, // accidents par an
    coutMoyenAccident: 8000, // coût moyen par accident
    tempsArretAccident: 16, // heures d'arrêt par accident
    arretNonPlanifie: 15, // heures par mois
    maintenance: 5000, // $/an
    energie: 3000, // $/an
  });
  
  // États pour les paramètres du système automatisé
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
    capaciteTraitement: 85, // unités/heure
    tempsCycle: 42.4, // secondes/unité
    coutSysteme: 500000, // Coût du système 
    coutInstallation: 25000, // Coût d'installation
    coutIngenierie: 15000, // Coût d'ingénierie
    coutFormation: 15000, // Coût de formation
    coutMaintenance: 8000, // $/an
    coutEnergie: 4500, // $/an
    dureeVie: 10, // années
    tauxAmortissement: 15, // %
    coutMainOeuvre: 90000, // $/an
    nbEmployesRemplaces: 3, // ETP
    coutDechet: 500, // $/déchet
    reductionDechet: 25, // %
    augmentationProduction: 15, // %
    ameliorationQualite: 10, // %
    tauxRejets: 2, // %
    reductionAccidents: 90, // %
    reductionTempsArret: 75, // %
    subventions: 0, // $
    coutFormationContinue: 5000, // $/an
    coutMisesAJour: 3000, // $/an
    coutConsommables: 2000, // $/an
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    production: 100000, // unités par an
    margeUnitaire: 10, // $ par unité
    heuresOperationParJour: 8,
    joursOperationParAn: 250,
    tauxInflation: 2, // %
    tauxActualisation: 5, // %
  });
  
  // État pour les résultats
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
    reductionTempsCycle: 0,
    gainFlexibilite: 0
  });
  
  // Effet pour mettre à jour les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 30,
        tempsCycle: 120,
        nombreEmployes: 6,
        tauxRejets: 9,
        perteProduction: 12,
        frequenceAccident: 4,
        maintenance: 5000,
        energie: 3000
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 50,
        tempsCycle: 72,
        nombreEmployes: 4,
        tauxRejets: 6,
        perteProduction: 8,
        frequenceAccident: 2.5,
        maintenance: 12000,
        energie: 6000
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 65,
        tempsCycle: 55.4,
        nombreEmployes: 3,
        tauxRejets: 4,
        perteProduction: 6,
        frequenceAccident: 1.2,
        maintenance: 20000,
        energie: 9000
      });
    }
  }, [typeSystemeActuel]);
  
  // Fonction pour calculer le ROI et les résultats
  const calculerResultats = () => {
    const resultatsCalcules = calculerROI(
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    );
    
    setResultats(resultatsCalcules);
  };
  
  // Recalculer les résultats quand les paramètres changent
  useEffect(() => {
    calculerResultats();
  }, [parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
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
      
      {/* Paramètres généraux */}
      <ParametresGeneraux 
        parametresGeneraux={parametresGeneraux}
        setParametresGeneraux={setParametresGeneraux}
      />
      
      {/* Vue comparative des systèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ParametresSystemeActuel
          parametresSystemeActuel={parametresSystemeActuel}
          setParametresSystemeActuel={setParametresSystemeActuel}
          typeSystemeActuel={typeSystemeActuel}
          setTypeSystemeActuel={setTypeSystemeActuel}
        />
        
        <ParametresSystemeAutomatise
          parametresSystemeAutomatise={parametresSystemeAutomatise}
          setParametresSystemeAutomatise={setParametresSystemeAutomatise}
        />
      </div>
      
      {/* Résultats financiers */}
      <ResultatsFinanciers 
        resultats={resultats}
        parametresSystemeAutomatise={parametresSystemeAutomatise}
      />
      
      {/* Analyse comparative */}
      <AnalyseComparative 
        parametresSystemeActuel={parametresSystemeActuel}
        parametresSystemeAutomatise={parametresSystemeAutomatise}
        resultats={resultats}
        parametresGeneraux={parametresGeneraux}
      />
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
        <p>Les résultats de ce calculateur sont fournis à titre indicatif seulement. Une analyse approfondie est recommandée pour toute décision d'investissement.</p>
      </div>
    </div>
  );
};

export default CalculateurROI;