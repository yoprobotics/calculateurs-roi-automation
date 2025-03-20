import React from 'react';

/**
 * Composant pour afficher le sommaire des résultats
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.resultats - Résultats des calculs
 * @param {Object} props.parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} props.parametresSystemeAutomatise - Paramètres du système automatisé
 * @returns {JSX.Element} Sommaire des résultats
 */
const ResultatsSommaire = ({ resultats, parametresSystemeActuel, parametresSystemeAutomatise }) => {
  const { 
    roi, roiActualise, delaiRecuperation, delaiRecuperationActualise, van, tri, indiceRentabilite,
    economieAnnuelle, economiesSecurite, economiesTempsArret, parametresOperationnels
  } = resultats;
  
  const { capacite: capaciteActuelle } = parametresSystemeActuel;
  const { 
    capaciteTraitement, 
    nbEmployesRemplaces, 
    reductionAccidents, 
    reductionDechet,
    reductionEmpreinteCO2,
    dureeVie
  } = parametresSystemeAutomatise;
  
  // Calcul de l'amélioration de la capacité en pourcentage
  const ameliorationCapacite = ((capaciteTraitement - capaciteActuelle) / capaciteActuelle) * 100;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
        Résultats financiers
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 mb-2">ROI</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-green-800">{roi.toFixed(1)}%</p>
            <span className="ml-2 text-sm text-gray-500">sur {dureeVie} ans</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">ROI actualisé</span>
            <span className="text-sm font-medium">{roiActualise.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Délai de récupération</h3>
          <div className="flex items-baseline">
            <p className={`text-3xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
              {delaiRecuperation.toFixed(1)}
            </p>
            <span className="ml-2 text-sm text-gray-500">années</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">Délai actualisé</span>
            <span className="text-sm font-medium">{delaiRecuperationActualise.toFixed(1)} ans</span>
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 mb-2">VAN</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-purple-800">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
            </p>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">TRI</span>
            <span className="text-sm font-medium">{tri ? tri.toFixed(1) : "N/A"}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Économie annuelle moyenne</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-yellow-700">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
              </p>
              <span className="ml-2 text-sm text-gray-500">/ an</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Indicateurs complémentaires</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Indice de rentabilité</span>
                <span className="font-medium">{indiceRentabilite.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coût par ballot (avant)</span>
                <span className="font-medium">${parametresOperationnels.coutParBallotActuel.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coût par ballot (après)</span>
                <span className="font-medium">${parametresOperationnels.coutParBallotAutomatise.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TCO sur {dureeVie} ans</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresOperationnels.tco)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Avantages opérationnels clés</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Amélioration de la capacité</div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-green-600">+{ameliorationCapacite.toFixed(1)}%</span>
                  {" "}({capaciteActuelle} → {capaciteTraitement} ballots/h)
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Réduction des coûts de main-d'œuvre</div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-green-600">{nbEmployesRemplaces.toFixed(1)} ETP</span>
                  {" "}économisés
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Amélioration de la sécurité</div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-green-600">-{reductionAccidents}%</span>
                  {" "}d'accidents, économie de{" "}
                  <span className="font-medium">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economiesSecurite + economiesTempsArret)}
                  </span>
                  {" "}/ an
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Impact environnemental</div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-green-600">-{reductionDechet}%</span>
                  {" "}de déchets, {" "}
                  <span className="font-medium text-green-600">-{reductionEmpreinteCO2}%</span>
                  {" "}d'empreinte CO₂
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultatsSommaire;