import React from 'react';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { ResultCard } from '../../common/ResultCard';

/**
 * Composant d'affichage des résultats du ROI
 * @returns {JSX.Element} - Affichage des résultats
 */
const ResultatsROI = () => {
  const { resultats, systemeActuel, systemeAutomatise } = useCalculateurPatesPapiers();

  const { 
    roi, 
    delaiRecuperation, 
    van, 
    tri, 
    economieAnnuelle,
    reductionMainOeuvre,
    economiesSecurite,
    economiesTempsArret,
    economiesQualite
  } = resultats;

  const {
    capaciteTraitement,
    reductionAccidents,
    nbEmployesRemplaces,
    tauxRejets
  } = systemeAutomatise;

  const {
    capacite: capaciteActuelle,
    tauxRejets: tauxRejetsManuel
  } = systemeActuel;

  // Formatage de montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
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
        <ResultCard 
          title="ROI global"
          value={`${roi.toFixed(2)}%`}
          variant="success"
          description="Pourcentage de retour sur l'investissement total"
        />
        <ResultCard 
          title="Délai de récupération"
          value={`${delaiRecuperation.toFixed(2)} ans`}
          variant={delaiRecuperation <= 2 ? "success" : "info"}
          description="Temps nécessaire pour récupérer l'investissement"
        />
        <ResultCard 
          title="VAN"
          value={formatCurrency(van)}
          variant="purple"
          description="Valeur Actuelle Nette - valeur des flux futurs"
        />
        <ResultCard 
          title="TRI"
          value={`${tri.toFixed(2)}%`}
          variant="indigo"
          description="Taux de Rendement Interne"
        />
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <ResultCard 
            title="Économie annuelle moyenne"
            value={formatCurrency(economieAnnuelle)}
            variant="warning"
            description="Économie moyenne sur la durée de vie de l'investissement"
          />
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
            <span>Réduction de la main d'œuvre de <strong>{nbEmployesRemplaces.toFixed(1)} ETP</strong> ({formatCurrency(reductionMainOeuvre)}/an)</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Diminution des rejets de fils métalliques de <strong>{(tauxRejetsManuel - tauxRejets).toFixed(1)}%</strong></span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Réduction des accidents de <strong>{reductionAccidents}%</strong> ({formatCurrency(economiesSecurite + economiesTempsArret)}/an)</span>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Amélioration de la qualité estimée à <strong>{formatCurrency(economiesQualite)}/an</strong></span>
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
              {formatCurrency(economiesSecurite + economiesTempsArret)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultatsROI;
