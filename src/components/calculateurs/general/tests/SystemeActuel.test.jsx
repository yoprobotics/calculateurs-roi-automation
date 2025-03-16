import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SystemeActuel from '../SystemeActuel';
import { CalculateurGeneralProvider } from '../../../../context/CalculateurGeneralContext';

// Mock du hook de contexte
jest.mock('../../../../context/CalculateurGeneralContext', () => {
  const originalModule = jest.requireActual('../../../../context/CalculateurGeneralContext');
  
  return {
    ...originalModule,
    useCalculateurGeneral: () => ({
      typeSystemeActuel: 'manuel',
      setTypeSystemeActuel: jest.fn(),
      systemeActuel: {
        capacite: 45,
        tempsCycle: 80,
        nombreEmployes: 2.5,
        maintenance: 6000,
        energie: 4000,
        tauxRejets: 8,
        perteProduction: 12,
        frequenceAccident: 5.2,
        coutMoyenAccident: 12500,
        tempsArretAccident: 24,
        consommationEau: 15000,
        coutEau: 4.5,
        consommationAirComprime: 12000,
        coutAirComprime: 0.25,
        emissionCO2: 180,
        consommationHydraulique: 2500,
        coutHydraulique: 8,
        arretNonPlanifie: 24
      },
      setSystemeActuel: jest.fn()
    })
  };
});

describe('Composant SystemeActuel', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('Rendu correct du composant', () => {
    render(
      <CalculateurGeneralProvider>
        <SystemeActuel />
      </CalculateurGeneralProvider>
    );
    
    expect(screen.getByText('Système Actuel')).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacité/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temps de cycle/)).toBeInTheDocument();
  });

  test('Les champs de capacité et temps de cycle sont indépendants', () => {
    const { useCalculateurGeneral } = jest.requireMock('../../../../context/CalculateurGeneralContext');
    const setSystemeActuel = jest.fn();
    
    // Remplacer la fonction setSystemeActuel du mock
    useCalculateurGeneral.mockImplementation(() => ({
      ...useCalculateurGeneral(),
      setSystemeActuel
    }));
    
    render(
      <CalculateurGeneralProvider>
        <SystemeActuel />
      </CalculateurGeneralProvider>
    );
    
    // Modifier la capacité
    const capaciteInput = screen.getByLabelText(/Capacité/);
    fireEvent.change(capaciteInput, { target: { value: '60' } });
    
    // Vérifier que seule la capacité a été mise à jour, pas le temps de cycle
    expect(setSystemeActuel).toHaveBeenCalledWith(expect.objectContaining({
      capacite: 60
    }));
    expect(setSystemeActuel).not.toHaveBeenCalledWith(expect.objectContaining({
      tempsCycle: expect.any(Number)
    }));
    
    // Réinitialiser le mock
    setSystemeActuel.mockClear();
    
    // Modifier le temps de cycle
    const tempsCycleInput = screen.getByLabelText(/Temps de cycle/);
    fireEvent.change(tempsCycleInput, { target: { value: '45' } });
    
    // Vérifier que seul le temps de cycle a été mis à jour, pas la capacité
    expect(setSystemeActuel).toHaveBeenCalledWith(expect.objectContaining({
      tempsCycle: 45
    }));
    expect(setSystemeActuel).not.toHaveBeenCalledWith(expect.objectContaining({
      capacite: expect.any(Number)
    }));
  });
});