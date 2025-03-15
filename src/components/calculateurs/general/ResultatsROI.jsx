import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import ResultCard from '../../common/ResultCard';
import { formaterDevise, formaterPourcentage, formaterDuree } from '../../../utils/formatters';

/**
 * Composant d'affichage des résultats du calculateur ROI
 * @returns {JSX.Element} - Affichage des résultats
 */
const ResultatsROI = () => {
  const { resultats } = useCalculateurGeneral();
  
  const {
    roi,
    delaiRecuperation,
    van,
    tri,
    economieAnnuelle,
    ameliorationEfficacite,
    investissementInitial
  } = resultats;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
        Résultats
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ResultCard
          title="ROI global"
          value={roi ? roi.toFixed(2) : '0.00'}
          unit="%"
          description="Pourcentage de retour sur investissement"
          tooltip="Pourcentage de retour sur l'investissement total sur la durée de vie du système"
          color="blue"
        />
        
        <ResultCard
          title="Délai de récupération"
          value={delaiRecuperation ? delaiRecuperation.toFixed(2) : '0.00'}
          unit="ans"
          description="Temps nécessaire pour récupérer l'investissement"
          tooltip="Temps nécessaire pour que les bénéfices cumulés égalent l'investissement initial"
          color={delaiRecuperation <= 2 ? 'green' : delaiRecuperation <= 3 ? 'blue' : 'yellow'}
        />
        
        <ResultCard
          title="VAN"
          value={van ? formaterDevise(van, 'USD', 0) : '$0'}
          description="Valeur Actuelle Nette"
          tooltip="Valeur Actuelle Nette - valeur actualisée des flux futurs moins l'investissement initial"
          color="purple"
        />
        
        <ResultCard
          title="TRI"
          value={tri ? tri.toFixed(2) : '0.00'}
          unit="%"
          description="Taux de Rendement Interne"
          tooltip="Taux de Rendement Interne - taux d'actualisation qui annule la VAN"
          color="indigo"
        />
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <ResultCard
            title="Économie annuelle moyenne"
            value={economieAnnuelle ? formaterDevise(economieAnnuelle, 'USD', 0) : '$0'}
            description="Économie moyenne par an"
            tooltip="Économie annuelle moyenne sur toute la durée de vie de l'investissement"
            color="yellow"
            size="large"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ResultCard
          title="Capacité"
          value={ameliorationEfficacite?.capacite ? `+${ameliorationEfficacite.capacite.toFixed(1)}` : '0'}
          unit="%"
          description="Amélioration de la capacité de production"
          color="green"
          size="small"
        />
        
        <ResultCard
          title="Temps de cycle"
          value={ameliorationEfficacite?.tempsCycle ? `+${ameliorationEfficacite.tempsCycle.toFixed(1)}` : '0'}
          unit="%"
          description="Réduction du temps de cycle"
          color="green"
          size="small"
        />
        
        <ResultCard
          title="Main d'œuvre"
          value={ameliorationEfficacite?.mainOeuvre ? `${ameliorationEfficacite.mainOeuvre.toFixed(1)}` : '0'}
          unit="%"
          description="Réduction de la main d'œuvre requise"
          color="green"
          size="small"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <h3 className="font-medium text-gray-800 mb-2">Interprétation des résultats</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><span className="font-medium">ROI &gt; 100%</span> : L'investissement génère plus de valeur qu'il n'en coûte.</li>
          <li><span className="font-medium">Délai de récupération &lt; 3 ans</span> : Considéré comme un très bon investissement dans l'industrie.</li>
          <li><span className="font-medium">VAN positive</span> : Le projet crée de la valeur pour l'entreprise.</li>
          <li><span className="font-medium">TRI &gt; taux d'actualisation</span> : Le projet est financièrement viable.</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Recommandation</h3>
        {van > 0 && roi > 0 ? (
          <p className="text-green-700">
            <span className="font-bold">✓ Projet recommandé</span> - Cet investissement en automatisation semble financièrement viable avec un ROI positif et un délai de récupération raisonnable.
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

export default ResultatsROI;
