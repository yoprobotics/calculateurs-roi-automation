import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour afficher les erreurs de validation pour les paramètres du calculateur
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.erreurs - Objet contenant les erreurs par champ
 * @returns {JSX.Element} - Bannière d'erreurs si des erreurs existent
 */
const ValidationErreurs = ({ erreurs }) => {
  const nombreErreurs = Object.keys(erreurs).length;
  
  if (nombreErreurs === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div className="flex items-start">
        <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 className="text-red-800 font-medium text-lg">
            {nombreErreurs > 1
              ? `${nombreErreurs} erreurs de validation détectées`
              : "Erreur de validation détectée"}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {Object.values(erreurs).map((erreur, index) => (
                <li key={index}>{erreur}</li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-sm text-red-700">
            Veuillez corriger ces erreurs pour obtenir des calculs précis.
          </p>
        </div>
      </div>
    </div>
  );
};

ValidationErreurs.propTypes = {
  erreurs: PropTypes.object.isRequired
};

export default ValidationErreurs;