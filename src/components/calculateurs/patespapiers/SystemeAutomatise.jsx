import React from 'react';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { FormInput } from '../../common/FormInput';

/**
 * Composant pour la configuration du système automatisé
 * @returns {JSX.Element} - Formulaire des paramètres avancés du système automatisé
 */
const SystemeAutomatise = () => {
  const { 
    systemeAutomatise,
    setSystemeAutomatise,
    systemeActuel
  } = useCalculateurPatesPapiers();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Paramètres avancés</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Système automatisé</h3>
          <div className="space-y-3">
            <FormInput 
              label="Capacité de traitement (ballots/h)" 
              value={systemeAutomatise.capaciteTraitement}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                capaciteTraitement: value
              })}
              type="number"
            />
            <FormInput 
              label="Taux de rejet fils système (%)" 
              value={systemeAutomatise.tauxRejets}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                tauxRejets: value
              })}
              type="number"
              step={0.1}
            />
            <FormInput 
              label="Temps de cycle (sec/ballot)" 
              value={systemeAutomatise.tempsCycle}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                tempsCycle: value
              })}
              type="number"
              step={0.1}
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Coûts d'exploitation</h3>
          <div className="space-y-3">
            <FormInput 
              label="Maintenance actuelle/an ($)" 
              value={systemeActuel.maintenance}
              readOnly
              type="number"
              description="La maintenance du système actuel est déterminée par le type de système sélectionné."
            />
            <FormInput 
              label="Maintenance système/an ($)" 
              value={systemeAutomatise.coutMaintenance}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                coutMaintenance: value
              })}
              type="number"
            />
            <FormInput 
              label="Formation continue/an ($)" 
              value={systemeAutomatise.coutFormationContinue}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                coutFormationContinue: value
              })}
              type="number"
              description="Coût annuel de formation continue des opérateurs du nouveau système."
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Avantages du système</h3>
          <div className="space-y-3">
            <FormInput 
              label="Réduction des déchets (%)" 
              value={systemeAutomatise.reductionDechet}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                reductionDechet: value
              })}
              type="number"
              step={0.1}
            />
            <FormInput 
              label="Amélioration qualité (%)" 
              value={systemeAutomatise.ameliorationQualite}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                ameliorationQualite: value
              })}
              type="number"
              step={0.1}
            />
            <FormInput 
              label="Réduction des accidents (%)" 
              value={systemeAutomatise.reductionAccidents}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                reductionAccidents: value
              })}
              type="number"
              step={1}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Investissement initial</h3>
          <div className="space-y-3">
            <FormInput 
              label="Coût du système ($)" 
              value={systemeAutomatise.coutSysteme}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                coutSysteme: value
              })}
              type="number"
              description="Prix d'achat de l'équipement d'automatisation, incluant tous les composants."
            />
            <FormInput 
              label="Coût d'installation ($)" 
              value={systemeAutomatise.coutInstallation}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                coutInstallation: value
              })}
              type="number"
              description="Coûts liés à l'installation physique et à l'intégration."
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Autres paramètres</h3>
          <div className="space-y-3">
            <FormInput 
              label="Durée de vie (années)" 
              value={systemeAutomatise.dureeVie}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                dureeVie: value
              })}
              type="number"
              description="Durée d'utilisation prévue avant remplacement ou mise à niveau majeure."
            />
            <FormInput 
              label="Subventions ($)" 
              value={systemeAutomatise.subventions}
              onChange={(value) => setSystemeAutomatise({
                ...systemeAutomatise,
                subventions: value
              })}
              type="number"
              description="Montant des subventions ou crédits d'impôt pour l'automatisation."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemeAutomatise;
