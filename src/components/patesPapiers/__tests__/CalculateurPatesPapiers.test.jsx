import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculateurPatesPapiers from '../CalculateurPatesPapiers';

// Mock des hooks et composants
jest.mock('../hooks/useParametres', () => {
  return jest.fn(() => ({
    typeSystemeActuel: 'manuel',
    parametresSystemeActuel: {
      capacite: 45,
      nombreEmployes: 2.5
    },
    parametresSystemeAutomatise: {
      capaciteTraitement: 120,
      coutSysteme: 380000
    },
    parametresGeneraux: {
      margeBrute: 110
    },
    ui: {
      afficherDetails: false,
      ongletActif: 'general'
    },
    setTypeSystemeActuel: jest.fn(),
    setParametresSystemeActuel: jest.fn(),
    setParametresSystemeAutomatise: jest.fn(),
    setParametresGeneraux: jest.fn(),
    setUi: jest.fn()
  }));
});

jest.mock('../hooks/useCalculROI', () => {
  return jest.fn(() => ({
    resultats: {
      roi: 25.5,
      delaiRecuperation: 1.8,
      van: 250000,
      economieAnnuelle: 75000
    },
    calculerROI: jest.fn()
  }));
});

// Mock des composants
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../components/Navigation', () => {
  return function MockNavigation({ changerOnglet }) {
    return (
      <div data-testid="navigation">
        <button onClick={() => changerOnglet('general')}>Vue générale</button>
        <button onClick={() => changerOnglet('comparatif')}>Analyse comparative</button>
      </div>
    );
  };
});

jest.mock('../components/onglets/VueGenerale', () => {
  return function MockVueGenerale() {
    return <div data-testid="vue-generale">Vue générale</div>;
  };
});

jest.mock('../components/onglets/AnalyseComparative', () => {
  return function MockAnalyseComparative() {
    return <div data-testid="analyse-comparative">Analyse comparative</div>;
  };
});

jest.mock('../components/ActionButtons', () => {
  return function MockActionButtons() {
    return <div data-testid="action-buttons">Action Buttons</div>;
  };
});

jest.mock('../components/RapportComplet', () => {
  return function MockRapportComplet() {
    return <div data-testid="rapport-complet">Rapport complet</div>;
  };
});

jest.mock('../components/ResetButton', () => {
  return function MockResetButton() {
    return <div data-testid="reset-button">Reset Button</div>;
  };
});

describe('Composant CalculateurPatesPapiers', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });
  
  test('Devrait rendre le calculateur avec les composants principaux', () => {
    // Rendu du composant
    render(<CalculateurPatesPapiers />);
    
    // Vérification que les composants principaux sont rendus
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('vue-generale')).toBeInTheDocument();
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    
    // Vérification que le bouton pour afficher le rapport complet est présent
    expect(screen.getByText(/Afficher le rapport complet/i)).toBeInTheDocument();
  });
  
  test('Devrait basculer vers le rapport complet au clic sur le bouton', () => {
    // Rendu du composant
    render(<CalculateurPatesPapiers />);
    
    // Vérification que le rapport complet n'est pas affiché initialement
    expect(screen.queryByTestId('rapport-complet')).not.toBeInTheDocument();
    
    // Clic sur le bouton pour afficher le rapport complet
    fireEvent.click(screen.getByText(/Afficher le rapport complet/i));
    
    // Vérification que le rapport complet est affiché
    expect(screen.getByTestId('rapport-complet')).toBeInTheDocument();
    
    // Vérification que le bouton pour revenir au calculateur est présent
    expect(screen.getByText(/Retour au calculateur/i)).toBeInTheDocument();
    
    // Vérification que les autres composants ne sont plus affichés
    expect(screen.queryByTestId('vue-generale')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-buttons')).not.toBeInTheDocument();
  });
  
  test('Devrait revenir au calculateur depuis le rapport complet', () => {
    // Rendu du composant
    render(<CalculateurPatesPapiers />);
    
    // Affichage du rapport complet
    fireEvent.click(screen.getByText(/Afficher le rapport complet/i));
    
    // Clic sur le bouton pour revenir au calculateur
    fireEvent.click(screen.getByText(/Retour au calculateur/i));
    
    // Vérification que le calculateur est à nouveau affiché
    expect(screen.getByTestId('vue-generale')).toBeInTheDocument();
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
    
    // Vérification que le rapport complet n'est plus affiché
    expect(screen.queryByTestId('rapport-complet')).not.toBeInTheDocument();
  });
  
  test('Devrait changer d\'onglet au clic sur les boutons de navigation', () => {
    // Mock de setUi pour tester le changement d'onglet
    const mockSetUi = jest.fn();
    require('../hooks/useParametres').mockImplementation(() => ({
      typeSystemeActuel: 'manuel',
      parametresSystemeActuel: {},
      parametresSystemeAutomatise: { capaciteTraitement: 120 },
      parametresGeneraux: {},
      ui: { afficherDetails: false, ongletActif: 'general' },
      setTypeSystemeActuel: jest.fn(),
      setParametresSystemeActuel: jest.fn(),
      setParametresSystemeAutomatise: jest.fn(),
      setParametresGeneraux: jest.fn(),
      setUi: mockSetUi
    }));
    
    // Rendu du composant
    render(<CalculateurPatesPapiers />);
    
    // Clic sur le bouton pour changer d'onglet
    fireEvent.click(screen.getByText('Analyse comparative'));
    
    // Vérification que setUi a été appelé pour changer l'onglet
    expect(mockSetUi).toHaveBeenCalledWith(expect.objectContaining({
      ongletActif: 'comparatif'
    }));
  });
});
