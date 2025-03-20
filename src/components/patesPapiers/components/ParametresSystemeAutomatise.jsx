import React, { useMemo } from 'react';
import InfoBulle from './common/InfoBulle';
import definitionsInfoBulles from '../utils/definitionsInfoBulles';

/**
 * Composant pour les paramètres du système automatisé
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Formulaire des paramètres du système automatisé
 */
const ParametresSystemeAutomatise = ({
  parametresSystemeAutomatise,
  parametresGeneraux,
  setParametresSystemeAutomatise
}) => {
  // Accès aux définitions des info-bulles
  const { systemeAutomatise } = definitionsInfoBulles;
  
  // Calcul des paramètres opérationnels dérivés
  const parametresOperationnels = useMemo(() => {
    // Temps de cycle en secondes par ballot
    const tempsCycle = 3600 / parametresSystemeAutomatise.capaciteTraitement;
    
    // Heures d'opération annuelles
    const heuresOperationAnnuelles = parametresGeneraux.heuresOperationParJour * parametresGeneraux.joursOperationParAn;
    
    // Ballots par jour
    const ballotsParJour = parametresSystemeAutomatise.capaciteTraitement * parametresGeneraux.heuresOperationParJour;
    
    // Capacité annuelle
    const ballotsAnnuels = ballotsParJour * parametresGeneraux.joursOperationParAn;
    
    // Investissement initial
    const investissementInitial = (
      parametresSystemeAutomatise.coutSysteme + 
      parametresSystemeAutomatise.coutInstallation + 
      parametresSystemeAutomatise.coutIngenierie + 
      parametresSystemeAutomatise.coutFormation - 
      parametresSystemeAutomatise.subventions
    );
    
    // Coût opérationnel annuel
    const coutOperationnelAnnuel = (
      parametresSystemeAutomatise.coutMaintenance + 
      parametresSystemeAutomatise.coutEnergie
    );
    
    // Coût par ballot
    const coutParBallot = coutOperationnelAnnuel / ballotsAnnuels;
    
    return {
      tempsCycle,
      heuresOperationAnnuelles,
      ballotsParJour,
      ballotsAnnuels,
      investissementInitial,
      coutOperationnelAnnuel,
      coutParBallot
    };
  }, [parametresSystemeAutomatise, parametresGeneraux]);
  
  /**
   * Helper pour créer un label avec une info-bulle
   * @param {String} texte - Texte du label
   * @param {String} cle - Clé pour la définition de l'info-bulle
   * @returns {JSX.Element} Label avec info-bulle
   */
  const LabelAvecInfoBulle = ({ texte, cle }) => (
    <label className="block text-sm font-medium mb-1 flex items-center">
      {texte}
      <span className="ml-1">
        <InfoBulle texte={systemeAutomatise[cle]} />
      </span>
    </label>
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
        Paramètres du système automatisé
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Capacité de production</h3>
        
        {/* Paramètres de capacité avec temps de cycle correspondant */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <LabelAvecInfoBulle texte="Capacité (ballots/heure)" cle="capaciteTraitement" />
            <input
              type="number"
              value={parametresSystemeAutomatise.capaciteTraitement}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                capaciteTraitement: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <LabelAvecInfoBulle texte="Temps de cycle" cle="tempsCycle" />
            <div className="flex items-center h-10 px-3 bg-blue-50 rounded text-blue-800 font-medium">
              {parametresOperationnels.tempsCycle.toFixed(1)} secondes / ballot
            </div>
          </div>
        </div>
        
        {/* Taux de rejet et amélioration de la production */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <LabelAvecInfoBulle texte="Taux de rejet (%)" cle="tauxRejets" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.tauxRejets}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                tauxRejets: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Augmentation production (%)" cle="augmentationProduction" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.augmentationProduction}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                augmentationProduction: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        {/* Paramètres opérationnels clés */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Indicateurs opérationnels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <LabelAvecInfoBulle texte="Ballots par jour" cle="ballotsParJour" />
              <div className="text-sm font-medium">{parametresOperationnels.ballotsParJour.toFixed(0)}</div>
            </div>
            <div>
              <LabelAvecInfoBulle texte="Coût par ballot" cle="coutParBallot" />
              <div className="text-sm font-medium">${parametresOperationnels.coutParBallot.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Personnel</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Employés remplacés (ETP)" cle="nbEmployesRemplaces" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.nbEmployesRemplaces}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                nbEmployesRemplaces: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût annuel par employé ($)" cle="coutMainOeuvre" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutMainOeuvre}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutMainOeuvre: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Coût du système ($)" cle="coutSysteme" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutSysteme}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutSysteme: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût d'installation ($)" cle="coutInstallation" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutInstallation}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutInstallation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <LabelAvecInfoBulle texte="Coût d'ingénierie ($)" cle="coutIngenierie" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutIngenierie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutIngenierie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût de formation ($)" cle="coutFormation" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutFormation}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutFormation: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-2">
          <LabelAvecInfoBulle texte="Subventions ($)" cle="subventions" />
          <input
            type="number"
            value={parametresSystemeAutomatise.subventions}
            onChange={(e) => setParametresSystemeAutomatise({
              ...parametresSystemeAutomatise,
              subventions: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mt-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-blue-800">Total investissement</div>
            <div className="text-lg font-bold text-blue-800">
              ${parametresOperationnels.investissementInitial.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Maintenance annuelle ($)" cle="coutMaintenance" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutMaintenance}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutMaintenance: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Énergie annuelle ($)" cle="coutEnergie" />
            <input
              type="number"
              value={parametresSystemeAutomatise.coutEnergie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutEnergie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Amortissement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Durée de vie (années)" cle="dureeVie" />
            <input
              type="number"
              value={parametresSystemeAutomatise.dureeVie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                dureeVie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Taux d'amortissement (%)" cle="tauxAmortissement" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.tauxAmortissement}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                tauxAmortissement: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Économies d'énergie et ressources</h3>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <LabelAvecInfoBulle texte="Réduction énergie (%)" cle="reductionEnergie" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionEnergie}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionEnergie: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût énergie par tonne ($)" cle="coutEnergieTonne" />
            <input
              type="number"
              step="0.01"
              value={parametresSystemeAutomatise.coutEnergieTonne}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutEnergieTonne: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Réduction eau (%)" cle="reductionEau" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionEau}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionEau: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût eau par tonne ($)" cle="coutEauTonne" />
            <input
              type="number"
              step="0.01"
              value={parametresSystemeAutomatise.coutEauTonne}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutEauTonne: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Réduction des déchets</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Réduction déchets (%)" cle="reductionDechet" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionDechet}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionDechet: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Coût par tonne de déchet ($)" cle="coutDechet" />
            <input
              type="number"
              step="0.01"
              value={parametresSystemeAutomatise.coutDechet}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                coutDechet: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité et qualité</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelAvecInfoBulle texte="Réduction accidents (%)" cle="reductionAccidents" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.reductionAccidents}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                reductionAccidents: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <LabelAvecInfoBulle texte="Amélioration qualité (%)" cle="ameliorationQualite" />
            <input
              type="number"
              step="0.1"
              value={parametresSystemeAutomatise.ameliorationQualite}
              onChange={(e) => setParametresSystemeAutomatise({
                ...parametresSystemeAutomatise,
                ameliorationQualite: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-2">Impact environnemental</h3>
        <div>
          <LabelAvecInfoBulle texte="Réduction empreinte CO2 (%)" cle="reductionEmpreinteCO2" />
          <input
            type="number"
            step="0.1"
            value={parametresSystemeAutomatise.reductionEmpreinteCO2}
            onChange={(e) => setParametresSystemeAutomatise({
              ...parametresSystemeAutomatise,
              reductionEmpreinteCO2: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ParametresSystemeAutomatise;