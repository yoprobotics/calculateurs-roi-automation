import React from 'react';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';

/**
 * Composant d'analyse sur la sécurité et l'environnement
 * @returns {JSX.Element} - Interface d'analyse de sécurité et d'environnement
 */
const EnvironnementSecurite = () => {
  const {
    systemeActuel,
    systemeAutomatise,
    resultats
  } = useCalculateurPatesPapiers();

  const {
    frequenceAccident,
    coutMoyenAccident,
    tempsArretAccident
  } = systemeActuel;

  const {
    reductionAccidents,
    reductionEmpreinteCO2,
    dureeVie
  } = systemeAutomatise;

  const {
    economiesCO2,
    economiesSecurite,
    economiesTempsArret
  } = resultats;

  // Formatage de montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Sécurité des travailleurs et impact environnemental</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Amélioration de la sécurité
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Statistiques actuelles</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-500">Fréquence d'accidents</p>
                  <p className="text-xl font-bold text-red-600">{frequenceAccident.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span></p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-500">Coût moyen par accident</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(coutMoyenAccident)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-1">Impact financier et qualitatif</h4>
                <p className="text-sm">Réduction des accidents : <span className="font-bold">{reductionAccidents}%</span></p>
                <p className="text-sm">Économie annuelle estimée : <span className="font-bold">{formatCurrency(economiesSecurite + economiesTempsArret)}</span></p>
                <p className="text-sm mt-2">L'automatisation des tâches de désempilement et débrochage de ballots permettra de:</p>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  <li>Éliminer les risques liés à la manutention manuelle de charges lourdes</li>
                  <li>Supprimer l'exposition aux fils métalliques sous tension</li>
                  <li>Réduire les troubles musculo-squelettiques (TMS)</li>
                  <li>Limiter les risques de coupures et de blessures aux mains</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Dispositifs de sécurité intégrés</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5 mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Barrières immatérielles</p>
                    <p className="text-xs text-gray-600">Détection d'intrusion dans les zones dangereuses avec arrêt immédiat</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5 mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Système d'arrêt d'urgence</p>
                    <p className="text-xs text-gray-600">Boutons d'arrêt accessibles et redondants dans toute la zone</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5 mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Interface opérateur ergonomique</p>
                    <p className="text-xs text-gray-600">Poste de contrôle à distance en zone sécurisée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
              Impact environnemental
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Réduction de l'empreinte écologique</h4>
              
              <div className="space-y-4 mb-4">
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Réduction des émissions de CO2</p>
                  <p className="flex justify-between">
                    <span className="text-xl font-bold text-green-600">{reductionEmpreinteCO2}%</span>
                    <span className="text-sm font-medium text-green-700">{economiesCO2.toFixed(0)} tonnes sur {dureeVie} ans</span>
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded border border-green-200 mb-6">
                <h4 className="text-sm font-medium text-green-800 mb-1">Bénéfices environnementaux</h4>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  <li>Optimisation de la consommation d'énergie grâce aux moteurs à haut rendement</li>
                  <li>Réduction des déchets et des pertes de matières grâce à une meilleure précision</li>
                  <li>Diminution des rejets de fils métalliques</li>
                  <li>Gestion optimisée de l'eau lors des processus de production</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Conformité réglementaire</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Notre solution automatisée est conçue pour respecter et dépasser les normes environnementales actuelles :
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span>ISO 14001</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span>BREF Papier</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Directive IED</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Écoconception</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Engagement pour un avenir durable</h3>
          <p className="text-sm mb-3">
            Notre système automatisé s'inscrit dans une démarche globale de développement durable en combinant :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-blue-700 font-medium text-sm mb-1">Performance économique</h4>
              <p className="text-xs text-gray-600">
                ROI rapide et optimisation des processus de production pour une compétitivité accrue.
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-green-700 font-medium text-sm mb-1">Responsabilité environnementale</h4>
              <p className="text-xs text-gray-600">
                Réduction de l'empreinte carbone et économie des ressources naturelles.
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="text-indigo-700 font-medium text-sm mb-1">Engagement social</h4>
              <p className="text-xs text-gray-600">
                Amélioration des conditions de travail et requalification des opérateurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironnementSecurite;
