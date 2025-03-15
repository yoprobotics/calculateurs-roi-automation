import React from 'react';
import { CalculateurGeneralProvider } from '../../contexts/CalculateurGeneralContext';
import CalculateurGeneralContent from './CalculateurGeneralContent';

/**
 * Composant principal du calculateur général avec son contexte
 */
const CalculateurGeneral = () => {
  return (
    <CalculateurGeneralProvider>
      <CalculateurGeneralContent />
    </CalculateurGeneralProvider>
  );
};

export default CalculateurGeneral;
