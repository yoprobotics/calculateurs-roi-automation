import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import FormInput from '../../common/FormInput';
import Tooltip from '../../common/Tooltip';

/**
 * Composant de formulaire pour les paramètres du système automatisé
 * @returns {JSX.Element} - Formulaire du système automatisé
 */
const SystemeAutomatise = () => {
  const { 
    systemeAutomatise,
    setSystemeAutomatise,
    ui
  } = useCalculateurGeneral();
  
  const { afficherDetails } = ui;
  
  // Gestion du changement de valeur des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSystemeAutomatise({
      ...systemeAutomatise,
      [name]: Number(value)
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M13 7h-2v2h2V7zm0 4h-2v2h2v-2zm-6-4H5v2h2V7zM5 11h2v2H5v-2zm12-4h-2v2h2V7zm-2 4h2v2h-2v-2zM9 3H5a2 2 0 00-2 2v4h2V5h4V3zm0 14H5v-4H3v4a2 2 0 002 2h4v-2zm10-4h-2v4h-4v2h4a2 2 0 002-2v-4zm0-10a2 2 0 00-2-2h-4v2h4v4h2V3z" clipRule="evenodd" />
        </svg>
        Système Automatisé
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="capaciteTraitement"
          name="capaciteTraitement"
          label="Capacité de production (unités/heure)"
          type="number"
          value={systemeAutomatise.capaciteTraitement}
          onChange={handleChange}
          helper="Nombre d'unités produites par heure"
        />
        
        <FormInput
          id="tempsCycle"
          name="tempsCycle"
          label="Temps de cycle (secondes/unité)"
          type="number"
          value={systemeAutomatise.tempsCycle}
          onChange={handleChange}
          helper="Temps nécessaire pour traiter une unité"
        />
        
        <FormInput
          id="nbEmployesRemplaces"
          name="nbEmployesRemplaces"
          label="Nombre d'employés remplacés (ETP)"
          type="number"
          step="0.1"
          value={systemeAutomatise.nbEmployesRemplaces}
          onChange={handleChange}
          helper="Équivalent temps plein remplacé par l'automatisation"
        />
        
        <FormInput
          id="tauxRejets"
          name="tauxRejets"
          label="Taux de rejets prévu (%)"
          type="number"
          step="0.1"
          value={systemeAutomatise.tauxRejets}
          onChange={handleChange}
          helper="Pourcentage de production non conforme attendu"
        />
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-medium text-green-700 mb-2">Coûts d'investissement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="coutSysteme"
            name="coutSysteme"
            label="Coût du système ($)"
            type="number"
            value={systemeAutomatise.coutSysteme}
            onChange={handleChange}
            helper="Prix d'achat de l'équipement d'automatisation"
          />
          
          <FormInput
            id="coutInstallation"
            name="coutInstallation"
            label="Coût d'installation ($)"
            type="number"
            value={systemeAutomatise.coutInstallation}
            onChange={handleChange}
            helper="Coûts liés à l'installation physique"
          />
          
          <FormInput
            id="coutIngenierie"
            name="coutIngenierie"
            label="Coût d'ingénierie ($)"
            type="number"
            value={systemeAutomatise.coutIngenierie}
            onChange={handleChange}
            helper="Conception, plans, adaptation à votre environnement"
          />
          
          <FormInput
            id="coutFormation"
            name="coutFormation"
            label="Coût de formation initiale ($)"
            type="number"
            value={systemeAutomatise.coutFormation}
            onChange={handleChange}
            helper="Formation du personnel à l'utilisation"
          />
          
          <FormInput
            id="coutFormationContinue"
            name="coutFormationContinue"
            label="Coût formation continue ($/an)"
            type="number"
            value={systemeAutomatise.coutFormationContinue}
            onChange={handleChange}
            helper="Formation continue annuelle"
          />
          
          <FormInput
            id="subventions"
            name="subventions"
            label="Subventions/Aides reçues ($)"
            type="number"
            value={systemeAutomatise.subventions}
            onChange={handleChange}
            helper="Financement externe (subventions, crédits d'impôt)"
          />
        </div>
      </div>
      
      {/* Paramètres additionnels */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Paramètres additionnels</span>
          <button 
            onClick={() => {}}
            className="text-sm text-green-600 hover:text-green-800"
          >
            {afficherDetails ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {afficherDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-md">
            <FormInput
              id="dureeVie"
              name="dureeVie"
              label="Durée de vie (années)"
              type="number"
              value={systemeAutomatise.dureeVie}
              onChange={handleChange}
              helper="Durée d'utilisation prévue avant remplacement"
            />
            
            <FormInput
              id="tauxAmortissement"
              name="tauxAmortissement"
              label="Taux d'amortissement (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.tauxAmortissement}
              onChange={handleChange}
              helper="Pourcentage d'amortissement fiscal"
            />
            
            <FormInput
              id="coutMaintenance"
              name="coutMaintenance"
              label="Coût maintenance annuel ($)"
              type="number"
              value={systemeAutomatise.coutMaintenance}
              onChange={handleChange}
              helper="Coût annuel de maintenance préventive et corrective"
            />
            
            <FormInput
              id="coutEnergie"
              name="coutEnergie"
              label="Coût d'énergie annuel ($)"
              type="number"
              value={systemeAutomatise.coutEnergie}
              onChange={handleChange}
              helper="Consommation énergétique annuelle prévue"
            />
            
            <FormInput
              id="coutMainOeuvre"
              name="coutMainOeuvre"
              label="Coût annuel par employé ($)"
              type="number"
              value={systemeAutomatise.coutMainOeuvre}
              onChange={handleChange}
              helper="Coût annuel complet incluant charges et avantages"
            />
            
            <FormInput
              id="reductionAccidents"
              name="reductionAccidents"
              label="Réduction des accidents (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionAccidents}
              onChange={handleChange}
              helper="Pourcentage estimé de réduction des accidents"
            />
            
            <FormInput
              id="ameliorationQualite"
              name="ameliorationQualite"
              label="Amélioration qualité (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.ameliorationQualite}
              onChange={handleChange}
              helper="Impact sur la satisfaction client et les retours"
            />
            
            <FormInput
              id="augmentationProduction"
              name="augmentationProduction"
              label="Augmentation production (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.augmentationProduction}
              onChange={handleChange}
              helper="Augmentation du volume de production en %"
            />
            
            <FormInput
              id="reductionDechet"
              name="reductionDechet"
              label="Réduction des déchets (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionDechet}
              onChange={handleChange}
              helper="Pourcentage de réduction des matières gaspillées"
            />
            
            <FormInput
              id="coutDechet"
              name="coutDechet"
              label="Coût des déchets ($/tonne)"
              type="number"
              step="0.1"
              value={systemeAutomatise.coutDechet}
              onChange={handleChange}
              helper="Coût par tonne de déchets (matière, traitement)"
            />
            
            <FormInput
              id="reductionEmpreinteCO2"
              name="reductionEmpreinteCO2"
              label="Réduction empreinte CO2 (%)"
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionEmpreinteCO2}
              onChange={handleChange}
              helper="Impact environnemental en pourcentage"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemeAutomatise;
