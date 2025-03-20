import React from 'react';
import InfoBulle from './common/InfoBulle';
import definitionsInfoBulles from '../utils/definitionsInfoBulles';

/**
 * Composant pour les paramètres avancés
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} props.parametresGeneraux - Paramètres généraux
 * @param {Function} props.setParametresSystemeAutomatise - Fonction pour mettre à jour les paramètres automatisés
 * @param {Function} props.setParametresGeneraux - Fonction pour mettre à jour les paramètres généraux
 * @returns {JSX.Element} Formulaire des paramètres avancés
 */
const ParametresAvances = ({ 
  parametresSystemeAutomatise, 
  parametresGeneraux,
  setParametresSystemeAutomatise,
  setParametresGeneraux
}) => {
  // Accès aux définitions des info-bulles
  const { systemeAutomatise, parametresGeneraux: defGeneraux } = definitionsInfoBulles;
  
  /**
   * Helper pour créer un label avec une info-bulle
   * @param {String} texte - Texte du label
   * @param {String} cle - Clé pour la définition de l'info-bulle
   * @param {String} categorie - Catégorie dans les définitions
   * @returns {JSX.Element} Label avec info-bulle
   */
  const LabelAvecInfoBulle = ({ texte, cle, categorie = 'systemeAutomatise' }) => (
    <label className="block text-sm font-medium mb-1 flex items-center">
      {texte}
      <span className="ml-1">
        <InfoBulle texte={definitionsInfoBulles[categorie][cle]} />
      </span>
    </label>
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Paramètres avancés
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Données de production */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Données de production</h3>
          <div className="space-y-3">
            <div>
              <LabelAvecInfoBulle 
                texte="Tonnage annuel (tonnes)" 
                cle="tonnageAnnuel" 
                categorie="parametresGeneraux" 
              />
              <input
                type="number"
                value={parametresGeneraux.tonnageAnnuel}
                onChange={(e) => setParametresGeneraux({
                  ...parametresGeneraux,
                  tonnageAnnuel: Number(e.target.value)
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <LabelAvecInfoBulle 
                texte="Marge brute par tonne ($)" 
                cle="margeBrute" 
                categorie="parametresGeneraux" 
              />
              <input
                type="number"
                step="0.01"
                value={parametresGeneraux.margeBrute}
                onChange={(e) => setParametresGeneraux({
                  ...parametresGeneraux,
                  margeBrute: Number(e.target.value)
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Qualité et efficacité */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Qualité et efficacité</h3>
          <div className="space-y-3">
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
          </div>
        </div>
        
        {/* Paramètres environnementaux */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Paramètres environnementaux</h3>
          <div className="space-y-3">
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
          </div>
        </div>
        
        {/* Paramètres financiers avancés */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers avancés</h3>
          <div className="space-y-3">
            <div>
              <LabelAvecInfoBulle 
                texte="Taux d'amortissement (%)" 
                cle="tauxAmortissement" 
              />
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
            <div>
              <LabelAvecInfoBulle 
                texte="Subventions ($)" 
                cle="subventions" 
              />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresAvances;