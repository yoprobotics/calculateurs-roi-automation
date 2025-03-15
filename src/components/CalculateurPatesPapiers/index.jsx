import React from 'react';
import { CalculateurPatesPapiersProvider } from '../../contexts/CalculateurPatesPapiersContext';
import CalculateurPatesPapiersContent from './CalculateurPatesPapiersContent';

/**
 * Composant principal du calculateur pâtes et papiers avec son contexte
 */
const CalculateurPatesPapiers = () => {
  return (
    <CalculateurPatesPapiersProvider>
      <CalculateurPatesPapiersContent />
    </CalculateurPatesPapiersProvider>
  );
};

export default CalculateurPatesPapiers;
