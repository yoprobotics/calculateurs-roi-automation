import React from 'react';
import ParametresBase from '../ParametresBase';
import ParametresAvances from '../ParametresAvances';
import ResultatsSommaire from '../ResultatsSommaire';

/**
 * Composant pour l'onglet Vue générale
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Contenu de l'onglet Vue générale
 */
const VueGenerale = ({
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats,
  ui,
  setTypeSystemeActuel,
  setParametresSystemeActuel,
  setParametresSystemeAutomatise,
  setParametresGeneraux,
  toggleDetails
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Paramètres de base */}
        <ParametresBase
          typeSystemeActuel={typeSystemeActuel}
          parametresSystemeActuel={parametresSystemeActuel}
          parametresGeneraux={parametresGeneraux}
          setTypeSystemeActuel={setTypeSystemeActuel}
          setParametresSystemeActuel={setParametresSystemeActuel}
          setParametresGeneraux={setParametresGeneraux}
          toggleDetails={toggleDetails}
        />
        
        {/* Résultats */}
        <ResultatsSommaire
          resultats={resultats}
          parametresSystemeActuel={parametresSystemeActuel}
          parametresSystemeAutomatise={parametresSystemeAutomatise}
        />
      </div>
      
      {/* Paramètres avancés - affichage conditionnel */}
      {ui.afficherDetails && (
        <ParametresAvances
          parametresSystemeAutomatise={parametresSystemeAutomatise}
          setParametresSystemeAutomatise={setParametresSystemeAutomatise}
        />
      )}
    </>
  );
};

export default VueGenerale;