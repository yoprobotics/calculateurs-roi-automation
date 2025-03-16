import React from 'react';
import { CalculateurGeneralProvider, useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import SystemeActuel from './SystemeActuel';
import SystemeAutomatise from './SystemeAutomatise';
import ResultatsROI from './ResultatsROI';
import GraphiquesROI from './GraphiquesROI';
import OngletProduction from './OngletProduction';
import OngletSecurite from './OngletSecurite';

/**
 * Conteneur interne du calculateur général - Vue unique et comparative
 * @returns {JSX.Element} - Contenu du calculateur
 */
const CalculateurGeneralContent = () => {
  const { resultats } = useCalculateurGeneral();

  // Déterminer si le projet est recommandable
  const projetRecommandable = resultats.van > 0 && resultats.delaiRecuperation < resultats.dureeVie;

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
      
      {/* Section relative à la production */}
      <div className="mb-8">
        <OngletProduction />
      </div>
      
      {/* Vue comparative côte à côte des systèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col space-y-8">
          <SystemeActuel />
        </div>
        <div className="flex flex-col space-y-8">
          <SystemeAutomatise />
        </div>
      </div>
      
      {/* Résultats financiers */}
      <div className="mb-8">
        <ResultatsROI />
      </div>
      
      {/* Graphiques comparatifs */}
      <div className="mb-8">
        <GraphiquesROI />
      </div>
      
      {/* Section sécurité et environnement */}
      <div className="mb-8">
        <OngletSecurite />
      </div>
      
      {/* Recommandation - Visible sur tous les onglets */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
        {projetRecommandable ? (
          <div className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-green-700">Projet recommandé</p>
              <p className="text-sm">Cet investissement en automatisation est financièrement viable avec un ROI positif et un délai de récupération raisonnable.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold text-amber-700">À réévaluer</p>
              <p className="text-sm">Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
        <p>Les résultats de ce calculateur sont fournis à titre indicatif seulement. Une analyse approfondie est recommandée pour toute décision d'investissement.</p>
      </div>
    </div>
  );
};

/**
 * Conteneur principal du calculateur général avec son provider de contexte
 * @returns {JSX.Element} - Calculateur général complet
 */
const CalculateurGeneral = () => {
  return (
    <CalculateurGeneralProvider>
      <CalculateurGeneralContent />
    </CalculateurGeneralProvider>
  );
};

export default CalculateurGeneral;