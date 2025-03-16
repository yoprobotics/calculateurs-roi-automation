import React, { useState } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import InfoBulle from '../../communs/InfoBulle';

/**
 * Composant pour afficher les résultats financiers du ROI
 */
const ResultatsROI = () => {
  const { 
    resultats, 
    systemeAutomatise,
    systemeActuel,
    parametresGeneraux
  } = useCalculateurGeneral();
  
  // État local pour l'affichage du détail des coûts cachés
  const [afficherDetailCoutsCache, setAfficherDetailCoutsCache] = useState(false);
  
  // Extraction des valeurs pertinentes
  const {
    roi,
    delaiRecuperation,
    van,
    tri,
    economieAnnuelle,
    fluxTresorerie,
    ameliorationEfficacite,
    investissementInitial,
    coutsCaches
  } = resultats;
  
  const { dureeVie, coutFormationContinue, coutMisesAJour, coutConsommables } = systemeAutomatise;
  
  // Données pour le graphique d'évolution du retour sur investissement
  const dataFluxCumulatif = fluxTresorerie.map(item => ({
    annee: `Année ${item.annee}`,
    fluxCumulatif: item.cumulFluxTresorerie,
    seuil: investissementInitial
  }));
  
  // Données pour le graphique des coûts cachés
  const dataCoutsCache = [
    { name: 'Formation continue', value: coutFormationContinue || 0 },
    { name: 'Mises à jour', value: coutMisesAJour || 0 },
    { name: 'Consommables', value: coutConsommables || 0 }
  ];
  
  // Calculer le total des coûts cachés
  const totalCoutsCache = (coutFormationContinue || 0) + (coutMisesAJour || 0) + (coutConsommables || 0);
  
  // Formater les nombres avec séparateurs de milliers et devise
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(montant);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Résultats financiers
        </h2>
        <a 
          href="/docs/formules-calculateur-general.md" 
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Documentation des formules
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            ROI global
            <InfoBulle 
              titre="Retour sur Investissement (ROI)" 
              texte="Le ROI est le pourcentage de retour sur l'investissement initial sur la durée de vie du projet. Il est calculé en divisant les bénéfices nets totaux par l'investissement initial multiplié par 100. Un ROI supérieur à 100% indique que l'investissement génère plus de valeur qu'il n'en coûte."
            />
          </h3>
          <p className="text-2xl font-bold text-green-800">{Math.min(roi, 1000).toFixed(2)}%</p>
          <p className="text-xs text-gray-600">Sur {dureeVie} ans</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            Délai de récupération
            <InfoBulle 
              titre="Délai de récupération" 
              texte="Le délai de récupération est la période nécessaire pour récupérer l'investissement initial grâce aux flux de trésorerie générés. Un délai inférieur à 3 ans est généralement considéré comme excellent pour les projets d'automatisation industrielle."
            />
          </h3>
          <p className={`text-2xl font-bold ${delaiRecuperation < 3 ? 'text-green-600' : 'text-blue-800'}`}>
            {delaiRecuperation.toFixed(2)} ans
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            VAN
            <InfoBulle 
              titre="Valeur Actuelle Nette (VAN)" 
              texte="La VAN est la somme des flux de trésorerie futurs actualisés, moins l'investissement initial. Une VAN positive indique que le projet crée de la valeur pour l'entreprise. Plus la VAN est élevée, plus le projet est intéressant financièrement."
            />
          </h3>
          <p className="text-2xl font-bold text-purple-800">
            {formatMontant(van)}
          </p>
        </div>
        
        <div className="bg-indigo-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            TRI
            <InfoBulle 
              titre="Taux de Rendement Interne (TRI)" 
              texte="Le TRI est le taux d'actualisation pour lequel la VAN est égale à zéro. Il représente le taux de rentabilité du projet. Si le TRI est supérieur au taux d'actualisation (coût du capital), le projet est financièrement viable."
            />
          </h3>
          <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-yellow-50 p-3 rounded flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              Économie annuelle moyenne
              <InfoBulle 
                titre="Économie annuelle moyenne" 
                texte="L'économie annuelle moyenne représente les bénéfices nets moyens générés chaque année par le système automatisé, après déduction des coûts opérationnels. Cette valeur est utilisée pour calculer le ROI et le délai de récupération."
              />
            </h3>
            <p className="text-2xl font-bold text-yellow-700">
              {formatMontant(economieAnnuelle)}
            </p>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <span className="font-medium">Hors coûts cachés :</span> {formatMontant(economieAnnuelle + totalCoutsCache)}
          </div>
        </div>
        
        <div className="bg-red-50 p-3 rounded">
          <div>
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              Investissement initial net
              <InfoBulle 
                titre="Investissement initial net" 
                texte="L'investissement initial net correspond au montant total à investir pour acquérir et déployer le système automatisé, après déduction des subventions et aides financières. Il inclut le coût du système, de l'installation, de l'ingénierie et de la formation initiale."
                position="left"
              />
            </h3>
            <p className="text-2xl font-bold text-red-700">
              {formatMontant(investissementInitial)}
            </p>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <span className="font-medium">Inclut :</span> Système, installation, ingénierie et formation
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          Évolution du retour sur investissement
          <InfoBulle 
            titre="Graphique d'évolution du ROI" 
            texte="Ce graphique montre l'évolution des flux de trésorerie cumulés au fil du temps par rapport à l'investissement initial. Le point d'intersection entre la courbe verte (flux cumulatif) et la ligne rouge (seuil d'investissement) représente le délai de récupération de l'investissement."
            position="right"
          />
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataFluxCumulatif}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="annee" />
              <YAxis />
              <Tooltip formatter={(value) => [formatMontant(value), 'Montant']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="fluxCumulatif" 
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
        <p className="text-xs text-gray-500 mt-2 italic">
          * Le point d'intersection entre la courbe verte et la ligne rouge représente le délai de récupération de l'investissement.
        </p>
      </div>
      
      <div className="p-4 bg-white rounded-lg border border-green-200 mb-6">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center">
          Avantages du système automatisé
          <InfoBulle 
            titre="Avantages clés" 
            texte="Ces indicateurs montrent les améliorations quantitatives apportées par le système automatisé par rapport au système actuel, notamment en termes de capacité de production, de main d'œuvre, de qualité et de sécurité."
          />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ameliorationEfficacite && ameliorationEfficacite.capacite > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Traitement de <strong>{systemeAutomatise.capaciteTraitement} unités/heure</strong> contre {systemeActuel.capacite} actuellement</span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.mainOeuvre > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction de la main d'œuvre de <strong>{systemeAutomatise.nbEmployesRemplaces.toFixed(1)} ETP</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.tauxRejets > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Diminution des rejets de <strong>{ameliorationEfficacite.tauxRejets.toFixed(1)}%</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.tempsCycle > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction du temps de cycle de <strong>{ameliorationEfficacite.tempsCycle.toFixed(1)}%</strong></span>
            </div>
          )}
          
          {ameliorationEfficacite && ameliorationEfficacite.accidents > 0 && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Réduction des accidents de <strong>{ameliorationEfficacite.accidents}%</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Attention aux coûts cachés</span>
            <InfoBulle 
              titre="Coûts cachés" 
              texte="Les coûts cachés sont des dépenses qui n'apparaissent pas dans l'évaluation initiale du projet mais qui ont un impact significatif sur la rentabilité à long terme. Ils incluent la formation continue, les mises à jour logicielles et les consommables spécifiques requis par le système automatisé."
              position="right"
            />
          </div>
          <button 
            onClick={() => setAfficherDetailCoutsCache(!afficherDetailCoutsCache)} 
            className="text-sm text-amber-700 hover:text-amber-800"
          >
            {afficherDetailCoutsCache ? 'Masquer le détail' : 'Voir le détail'}
          </button>
        </h3>
        
        <p className="text-sm mb-2">L'automatisation implique des coûts supplémentaires souvent négligés dans l'analyse initiale:</p>
        
        {afficherDetailCoutsCache ? (
          <>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCoutsCache}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatMontant(value), 'Coût annuel']} />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-2 bg-white rounded shadow-sm">
                <p className="font-medium flex items-center">
                  Formation continue
                  <InfoBulle 
                    titre="Formation continue" 
                    texte="Coût annuel pour maintenir et développer les compétences du personnel sur le système automatisé. Inclut les formations de perfectionnement, les mises à jour de compétences, et la formation des nouveaux employés."
                    position="bottom"
                  />
                </p>
                <p className="text-sm">{formatMontant(coutFormationContinue || 0)}/an</p>
                <p className="text-xs text-gray-500">Formation récurrente des opérateurs et maintenance</p>
              </div>
              <div className="p-2 bg-white rounded shadow-sm">
                <p className="font-medium flex items-center">
                  Mises à jour logicielles
                  <InfoBulle 
                    titre="Mises à jour logicielles" 
                    texte="Coût annuel des mises à jour logicielles, licences, et support technique pour le système automatisé. Ce coût est souvent négligé dans l'évaluation initiale mais peut être significatif sur la durée de vie du système."
                    position="bottom"
                  />
                </p>
                <p className="text-sm">{formatMontant(coutMisesAJour || 0)}/an</p>
                <p className="text-xs text-gray-500">Licences et maintenance logicielle</p>
              </div>
              <div className="p-2 bg-white rounded shadow-sm">
                <p className="font-medium flex items-center">
                  Consommables spécifiques
                  <InfoBulle 
                    titre="Consommables spécifiques" 
                    texte="Coût annuel des consommables spécifiques au système automatisé (filtres spéciaux, capteurs remplaçables, etc.) qui s'ajoutent aux consommables standards."
                    position="bottom"
                  />
                </p>
                <p className="text-sm">{formatMontant(coutConsommables || 0)}/an</p>
                <p className="text-xs text-gray-500">Pièces d'usure et consommables spécifiques</p>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-2 bg-white rounded shadow-sm">
              <p className="font-medium">Formation continue</p>
              <p className="text-sm">{formatMontant(coutFormationContinue || 0)}/an</p>
            </div>
            <div className="p-2 bg-white rounded shadow-sm">
              <p className="font-medium">Mises à jour logicielles</p>
              <p className="text-sm">{formatMontant(coutMisesAJour || 0)}/an</p>
            </div>
            <div className="p-2 bg-white rounded shadow-sm">
              <p className="font-medium">Consommables spécifiques</p>
              <p className="text-sm">{formatMontant(coutConsommables || 0)}/an</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            Impact total des coûts cachés: {formatMontant(totalCoutsCache)}/an
            {totalCoutsCache > 0 && economieAnnuelle > 0 && (
              <span className="ml-2">({Math.round((totalCoutsCache / economieAnnuelle) * 100)}% de l'économie annuelle)</span>
            )}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Sur {dureeVie} ans, ces coûts représentent un total de {formatMontant(totalCoutsCache * dureeVie)}, soit {Math.round((totalCoutsCache * dureeVie / investissementInitial) * 100)}% de l'investissement initial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultatsROI;