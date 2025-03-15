import React from 'react';
import { useCalculateurGeneral } from '../../../contexts/CalculateurGeneralContext';

/**
 * Section d'affichage des résultats du calculateur
 */
const ResultatsSection = () => {
  const { resultats, systemeActuel, parametresSystemeAutomatise } = useCalculateurGeneral();
  
  // Extraction des valeurs de résultats pour plus de lisibilité
  const { 
    roi, delaiRecuperation, van, tri, economieAnnuelle,
    differenceProduction, reductionMainOeuvre, economiesSecurite, 
    economiesQualite, economiesTempsArret
  } = resultats;
  
  // Extraction des valeurs des paramètres du système actuel
  const {
    capacite: capaciteActuelle, tauxRejets: tauxRejetsActuel,
    frequenceAccident: frequenceAccidentActuel
  } = systemeActuel;
  
  // Extraction des valeurs des paramètres du système automatisé
  const {
    capaciteTraitement, tauxRejets: tauxRejetsAuto,
    reductionAccidents
  } = parametresSystemeAutomatise;
  
  // Formatage monétaire
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
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
          <p className="text-xs text-gray-600 mt-1">Pourcentage de retour sur l'investissement total</p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
          <p className={`text-2xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
            {delaiRecuperation.toFixed(2)} ans
          </p>
          <p className="text-xs text-gray-600 mt-1">Temps de récupération de l'investissement</p>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">VAN</h3>
          <p className="text-2xl font-bold text-purple-800">
            {formatMoney(van)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Valeur Actuelle Nette</p>
        </div>
        <div className="bg-indigo-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">TRI</h3>
          <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
          <p className="text-xs text-gray-600 mt-1">Taux de Rendement Interne</p>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 bg-yellow-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700">Économie annuelle moyenne</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {formatMoney(economieAnnuelle)}
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
            <span>Traitement de <strong>{capaciteTraitement} unités/heure</strong> contre {capaciteActuelle} actuellement</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Réduction de main d'œuvre: <strong>{formatMoney(reductionMainOeuvre)}/an</strong></span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Diminution des rejets de <strong>{(tauxRejetsActuel - tauxRejetsAuto).toFixed(1)}%</strong></span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Réduction des accidents de <strong>{reductionAccidents}%</strong></span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Recommandation
        </h3>
        {van > 0 && tri > 5 ? (
          <p className="text-green-700">
            <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation est financièrement viable avec un ROI positif et un délai de récupération raisonnable.
          </p>
        ) : (
          <p className="text-yellow-700">
            <span className="font-bold">⚠ À réévaluer</span> - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultatsSection;
