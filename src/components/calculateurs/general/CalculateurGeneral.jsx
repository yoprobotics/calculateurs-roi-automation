import React, { useState } from 'react';
import { CalculateurGeneralProvider, useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import SystemeActuel from './SystemeActuel';
import SystemeAutomatise from './SystemeAutomatise';
import ResultatsROI from './ResultatsROI';
import GraphiquesROI from './GraphiquesROI';
import OngletProduction from './OngletProduction';
import OngletSecurite from './OngletSecurite';
import NavigationParAncres from './NavigationParAncres';
import DocumentationLink from '../../communs/DocumentationLink';

/**
 * Conteneur interne du calculateur général - Vue unique et comparative
 * @returns {JSX.Element} - Contenu du calculateur
 */
const CalculateurGeneralContent = () => {
  const { resultats } = useCalculateurGeneral();
  const [sectionActive, setSectionActive] = useState('parametres');
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);

  // Déterminer si le projet est recommandable
  const projetRecommandable = resultats.van > 0 && resultats.delaiRecuperation < resultats.dureeVie;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto relative">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Calculateur de Retour sur Investissement pour l'Automatisation Industrielle</h1>

      {/* Bannière de documentation */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
            <p className="mb-2">L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité de vos opérations tout en réduisant les coûts opérationnels.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <DocumentationLink 
              document="formules-calculateur-general.md" 
              label="Documentation des formules" 
              className="font-medium"
            />
            <button 
              onClick={() => setIsDocumentationOpen(!isDocumentationOpen)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isDocumentationOpen ? 'Masquer l\'aide' : 'Afficher l\'aide'}
            </button>
          </div>
        </div>
        
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
      
      {/* Panel d'aide contextuelle */}
      {isDocumentationOpen && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-yellow-800">Guide d'utilisation du calculateur</h3>
            <button 
              onClick={() => setIsDocumentationOpen(false)}
              className="text-yellow-700 hover:text-yellow-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Comment utiliser ce calculateur ?</h4>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                <li>Configurez les paramètres de votre système actuel (gauche)</li>
                <li>Définissez les caractéristiques du système automatisé (droite)</li>
                <li>Consultez les résultats financiers et les graphiques comparatifs</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Comprendre les résultats</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>ROI</strong> : Retour sur investissement sur la durée de vie</li>
                <li><strong>Délai de récupération</strong> : Temps pour récupérer l'investissement</li>
                <li><strong>VAN</strong> : Valeur actualisée nette des flux futurs</li>
                <li><strong>TRI</strong> : Taux de rendement interne du projet</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-1">Conseil</h4>
            <p className="text-sm">Survolez les icônes <span className="inline-block ml-1 w-4 h-4 text-xs font-bold text-white bg-blue-500 rounded-full text-center">i</span> pour obtenir des explications détaillées sur chaque paramètre.</p>
          </div>
        </div>
      )}
      
      {/* Navigation par ancres */}
      <NavigationParAncres sectionActive={sectionActive} setSectionActive={setSectionActive} />
      
      {/* Vue comparative côte à côte des systèmes */}
      <section id="parametres" className="scroll-mt-20 mb-12 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Paramètres des systèmes à comparer</h2>
          <p className="text-sm text-blue-700">Configurez les caractéristiques de votre système actuel et de la solution automatisée envisagée.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-8">
            <SystemeActuel />
          </div>
          <div className="flex flex-col space-y-8">
            <SystemeAutomatise />
          </div>
        </div>
      </section>
      
      {/* Section relative à la production */}
      <section id="production" className="scroll-mt-20 mb-12 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Analyse détaillée de la production</h2>
          <p className="text-sm text-blue-700">Visualisez l'impact de l'automatisation sur vos capacités et votre efficacité de production.</p>
        </div>
        <OngletProduction />
      </section>
      
      {/* Résultats financiers */}
      <section id="resultats" className="scroll-mt-20 mb-12 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Résultats financiers</h2>
          <p className="text-sm text-blue-700">Examinez les indicateurs de rentabilité et le retour sur investissement projeté.</p>
        </div>
        <ResultatsROI />
      </section>
      
      {/* Graphiques comparatifs */}
      <section id="graphiques" className="scroll-mt-20 mb-12 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Graphiques comparatifs</h2>
          <p className="text-sm text-blue-700">Visualisez les écarts de performance et les économies générées par catégorie.</p>
        </div>
        <GraphiquesROI />
      </section>
      
      {/* Section sécurité et environnement */}
      <section id="securite" className="scroll-mt-20 mb-12 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Sécurité & Environnement</h2>
          <p className="text-sm text-blue-700">Évaluez les bénéfices en termes de sécurité des opérateurs et d'impact environnemental.</p>
        </div>
        <OngletSecurite />
      </section>
      
      {/* Recommandation - Visible sur tous les onglets */}
      <section id="recommandation" className="scroll-mt-20 mb-6 pt-2">
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6">
          <h2 className="font-bold text-lg text-blue-800">Recommandation</h2>
          <p className="text-sm text-blue-700">Conclusion et recommandation basées sur l'analyse globale.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-blue-800 mb-2">Notre recommandation</h3>
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
      </section>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
        <p>Les résultats de ce calculateur sont fournis à titre indicatif seulement. Une analyse approfondie est recommandée pour toute décision d'investissement.</p>
        <DocumentationLink 
          document="formules-calculateur-general.md" 
          label="Consultez la documentation détaillée des formules utilisées" 
          className="mt-2 justify-center"
        />
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