import React from 'react';
import { useCalculateurPatesPapiers } from '../../../context/CalculateurPatesPapiersContext';
import { TYPES_SYSTEME } from '../../../utils/constants';
import FormInput from '../../common/FormInput';

/**
 * Composant pour la configuration du système actuel
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.toggleDetails - Fonction pour afficher/masquer les détails
 * @param {boolean} props.afficherDetails - État d'affichage des détails
 * @returns {JSX.Element} - Formulaire du système actuel
 */
const SystemeActuel = ({ toggleDetails, afficherDetails }) => {
  const { 
    typeSystemeActuel, 
    setTypeSystemeActuel,
    systemeActuel,
    setSystemeActuel,
    parametresGeneraux,
    setParametresGeneraux
  } = useCalculateurPatesPapiers();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Paramètres de base
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Configuration du système actuel</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type de système actuel</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.MANUEL)}
              className={`py-2 text-sm rounded-md transition-all ${
                typeSystemeActuel === TYPES_SYSTEME.MANUEL
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manuel
            </button>
            <button
              onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.SEMI_AUTO)}
              className={`py-2 text-sm rounded-md transition-all ${
                typeSystemeActuel === TYPES_SYSTEME.SEMI_AUTO
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semi-automatisé
            </button>
            <button
              onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.AUTO_ANCIEN)}
              className={`py-2 text-sm rounded-md transition-all ${
                typeSystemeActuel === TYPES_SYSTEME.AUTO_ANCIEN
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Auto. (ancien)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Capacité actuelle (ballots/heure)" 
            value={systemeActuel.capacite}
            onChange={(value) => setSystemeActuel({
              ...systemeActuel,
              capacite: value
            })}
            type="number"
          />
          <FormInput 
            label="Nombre d'employés (ETP)" 
            value={systemeActuel.nombreEmployes}
            onChange={(value) => setSystemeActuel({
              ...systemeActuel,
              nombreEmployes: value
            })}
            type="number"
            step={0.1}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Temps d'opération</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Heures par jour" 
            value={parametresGeneraux.heuresOperationParJour}
            onChange={(value) => setParametresGeneraux({
              ...parametresGeneraux,
              heuresOperationParJour: value
            })}
            type="number"
          />
          <FormInput 
            label="Jours par an" 
            value={parametresGeneraux.joursOperationParAn}
            onChange={(value) => setParametresGeneraux({
              ...parametresGeneraux,
              joursOperationParAn: value
            })}
            type="number"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Tonnage annuel (tonnes)" 
            value={parametresGeneraux.tonnageAnnuel}
            onChange={(value) => setParametresGeneraux({
              ...parametresGeneraux,
              tonnageAnnuel: value
            })}
            type="number"
          />
          <FormInput 
            label="Marge brute par tonne ($)" 
            value={parametresGeneraux.margeBrute}
            onChange={(value) => setParametresGeneraux({
              ...parametresGeneraux,
              margeBrute: value
            })}
            type="number"
            step={0.01}
          />
        </div>
      </div>
      
      <div>
        <button 
          onClick={toggleDetails}
          className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          {afficherDetails ? 'Masquer' : 'Afficher'} les paramètres avancés
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${afficherDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SystemeActuel;