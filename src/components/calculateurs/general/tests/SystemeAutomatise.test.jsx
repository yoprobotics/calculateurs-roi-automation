import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SystemeAutomatise from '../SystemeAutomatise';
import { CalculateurGeneralProvider } from '../../../../context/CalculateurGeneralContext';

// Mock du hook de contexte
jest.mock('../../../../context/CalculateurGeneralContext', () => {
  const originalModule = jest.requireActual('../../../../context/CalculateurGeneralContext');
  
  return {
    ...originalModule,
    useCalculateurGeneral: () => ({
      systemeAutomatise: {
        capaciteTraitement: 120,
        tempsCycle: 30,
        coutSysteme: 380000,
        coutInstallation: 45000,
        coutIngenierie: 25000,
        coutFormation: 15000,
        coutFormationContinue: 8000,
        coutMaintenance: 12000,
        coutEnergie: 6500,
        dureeVie: 15,
        tauxAmortissement: 15,
        coutMainOeuvre: 55000,
        nbEmployesRemplaces: 2,
        reductionDechet: 14,
        coutDechet: 230,
        augmentationProduction: 10,
        reductionEnergie: 12,
        coutEnergieTonne: 40,
        reductionEau: 8,
        coutEauTonne: 4.5,
        ameliorationQualite: 5,
        reductionEmpreinteCO2: 7,
        tauxRejets: 3.5,
        reductionAccidents: 85,
        subventions: 40000
      },
      setSystemeAutomatise: jest.fn(),
      parametresGeneraux: {
        margeBrute: 110,
        tauxInflation: 2,
        tauxActualisation: 5,
        tonnageAnnuel: 20000,
        heuresOperationParJour: 16,
        joursOperationParAn: 300
      },
      setParametresGeneraux: jest.fn()
    })
  };
});

describe('Composant SystemeAutomatise', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('Rendu correct du composant', () => {
    render(
      <CalculateurGeneralProvider>
        <SystemeAutomatise />
      </CalculateurGeneralProvider>
    );
    
    expect(screen.getByText('Système Automatisé')).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacité/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temps de cycle/)).toBeInTheDocument();
  });

  test('Les champs de capacité et temps de cycle sont indépendants', () => {
    const { useCalculateurGeneral } = jest.requireMock('../../../../context/CalculateurGeneralContext');
    const setSystemeAutomatise = jest.fn();
    
    // Remplacer la fonction setSystemeAutomatise du mock
    useCalculateurGeneral.mockImplementation(() => ({
      ...useCalculateurGeneral(),
      setSystemeAutomatise
    }));
    
    render(
      <CalculateurGeneralProvider>
        <SystemeAutomatise />
      </CalculateurGeneralProvider>
    );
    
    // Modifier la capacité
    const capaciteInput = screen.getByLabelText(/Capacité/);
    fireEvent.change(capaciteInput, { target: { value: '150' } });
    
    // Vérifier que seule la capacité a été mise à jour, pas le temps de cycle
    expect(setSystemeAutomatise).toHaveBeenCalledWith(expect.objectContaining({
      capaciteTraitement: 150
    }));
    expect(setSystemeAutomatise).not.toHaveBeenCalledWith(expect.objectContaining({
      tempsCycle: expect.any(Number)
    }));
    
    // Réinitialiser le mock
    setSystemeAutomatise.mockClear();
    
    // Modifier le temps de cycle
    const tempsCycleInput = screen.getByLabelText(/Temps de cycle/);
    fireEvent.change(tempsCycleInput, { target: { value: '25' } });
    
    // Vérifier que seul le temps de cycle a été mis à jour, pas la capacité
    expect(setSystemeAutomatise).toHaveBeenCalledWith(expect.objectContaining({
      tempsCycle: 25
    }));
    expect(setSystemeAutomatise).not.toHaveBeenCalledWith(expect.objectContaining({
      capaciteTraitement: expect.any(Number)
    }));
  });
});