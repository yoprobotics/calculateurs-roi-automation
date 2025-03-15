import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import FormInput from '../../common/FormInput';
import Tooltip from '../../common/Tooltip';
import { TYPES_SYSTEME } from '../../../utils/constants';

/**
 * Composant de formulaire pour les paramètres du système actuel
 * @returns {JSX.Element} - Formulaire du système actuel
 */
const SystemeActuel = () => {
  const { 
    typeSystemeActuel, 
    setTypeSystemeActuel,
    systemeActuel,
    setSystemeActuel,
    ui
  } = useCalculateurGeneral();
  
  const { afficherDetails } = ui;
  
  // Gestion du changement de valeur des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSystemeActuel({
      ...systemeActuel,
      [name]: Number(value)
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Système Actuel
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Type de système actuel</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.MANUEL)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.MANUEL
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manuel
          </button>
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.SEMI_AUTO)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.SEMI_AUTO
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semi-automatisé
          </button>
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.AUTO_ANCIEN)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.AUTO_ANCIEN
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto. (ancien)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="capacite"
          name="capacite"
          label="Capacité de production (unités/heure)"
          type="number"
          value={systemeActuel.capacite}
          onChange={handleChange}
          helper="Nombre d'unités produites par heure"
        />
        
        <FormInput
          id="tempsCycle"
          name="tempsCycle"
          label="Temps de cycle (secondes/unité)"
          type="number"
          value={systemeActuel.tempsCycle}
          onChange={handleChange}
          helper="Temps nécessaire pour traiter une unité"
        />
        
        <FormInput
          id="nombreEmployes"
          name="nombreEmployes"
          label="Nombre d'employés (ETP)"
          type="number"
          step="0.1"
          value={systemeActuel.nombreEmployes}
          onChange={handleChange}
          helper="Équivalent temps plein nécessaire"
        />
        
        <FormInput
          id="tauxRejets"
          name="tauxRejets"
          label="Taux de rejets (%)"
          type="number"
          step="0.1"
          value={systemeActuel.tauxRejets}
          onChange={handleChange}
          helper="Pourcentage de production non conforme"
        />
      </div>
      
      {/* Paramètres additionnels */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Paramètres additionnels</span>
          <button 
            onClick={() => {}}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {afficherDetails ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {afficherDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-md">
            <FormInput
              id="perteProduction"
              name="perteProduction"
              label="Perte de production (%)"
              type="number"
              step="0.1"
              value={systemeActuel.perteProduction}
              onChange={handleChange}
              helper="Pourcentage de temps d'arrêt et retards"
            />
            
            <FormInput
              id="frequenceAccident"
              name="frequenceAccident"
              label="Fréquence d'accidents (par an)"
              type="number"
              step="0.1"
              value={systemeActuel.frequenceAccident}
              onChange={handleChange}
              helper="Nombre d'accidents par an"
            />
            
            <FormInput
              id="coutMoyenAccident"
              name="coutMoyenAccident"
              label="Coût moyen par accident ($)"
              type="number"
              value={systemeActuel.coutMoyenAccident}
              onChange={handleChange}
              helper="Coût directs et indirects par accident"
            />
            
            <FormInput
              id="tempsArretAccident"
              name="tempsArretAccident"
              label="Temps d'arrêt par accident (h)"
              type="number"
              value={systemeActuel.tempsArretAccident}
              onChange={handleChange}
              helper="Durée d'interruption causée par un accident"
            />
            
            <FormInput
              id="maintenance"
              name="maintenance"
              label="Coût de maintenance annuel ($)"
              type="number"
              value={systemeActuel.maintenance}
              onChange={handleChange}
              helper="Coût annuel de maintenance et réparations"
            />
            
            <FormInput
              id="energie"
              name="energie"
              label="Coût d'énergie annuel ($)"
              type="number"
              value={systemeActuel.energie}
              onChange={handleChange}
              helper="Consommation énergétique annuelle"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemeActuel;
