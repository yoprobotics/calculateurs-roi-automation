import React from 'react';
import ParametresBase from '../ParametresBase';
import ParametresAvances from '../ParametresAvances';
import ResultatsSommaire from '../ResultatsSommaire';
import ParametresSystemeAutomatise from '../ParametresSystemeAutomatise';

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
      {/* Première rangée: Paramètres système actuel et automatisé côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Paramètres système actuel */}
        <ParametresBase
          typeSystemeActuel={typeSystemeActuel}
          parametresSystemeActuel={parametresSystemeActuel}
          parametresGeneraux={parametresGeneraux}
          setTypeSystemeActuel={setTypeSystemeActuel}
          setParametresSystemeActuel={setParametresSystemeActuel}
          setParametresGeneraux={setParametresGeneraux}
          toggleDetails={toggleDetails}
        />
        
        {/* Paramètres système automatisé */}
        <ParametresSystemeAutomatise
          parametresSystemeAutomatise={parametresSystemeAutomatise}
          parametresSystemeActuel={parametresSystemeActuel}
          parametresGeneraux={parametresGeneraux}
          setParametresSystemeAutomatise={setParametresSystemeAutomatise}
        />
      </div>
      
      {/* Paramètres avancés - affichage conditionnel au-dessus des résultats */}
      {ui.afficherDetails && (
        <div className="mb-8">
          <ParametresAvances
            parametresSystemeAutomatise={parametresSystemeAutomatise}
            parametresGeneraux={parametresGeneraux}
            setParametresSystemeAutomatise={setParametresSystemeAutomatise}
            setParametresGeneraux={setParametresGeneraux}
          />
        </div>
      )}
      
      {/* Résultats financiers - en troisième position */}
      <div className="mb-8">
        <ResultatsSommaire
          resultats={resultats}
          parametresSystemeActuel={parametresSystemeActuel}
          parametresSystemeAutomatise={parametresSystemeAutomatise}
        />
      </div>
    </>
  );
};

export default VueGenerale;