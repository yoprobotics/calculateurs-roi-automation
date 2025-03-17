import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CalculateurPatesPapiers, { CalculateurPapierContext } from './CalculateurPatesPapiers';
import { sauvegarderParametres, chargerParametres } from '../../../utils/patesPapiersHelpers';

// Mock des fonctions d'utilitaires
jest.mock('../../../utils/patesPapiersHelpers', () => {
  return {
    ...jest.requireActual('../../../utils/patesPapiersHelpers'),
    sauvegarderParametres: jest.fn().mockReturnValue(true),
    chargerParametres: jest.fn().mockReturnValue(null)
  };
});

// Mock des composants enfants
jest.mock('./ParametresSysteme', () => () => <div data-testid="parametres-systeme">Paramètres Système</div>);
jest.mock('./ComparatifSystemes', () => () => <div data-testid="comparatif-systemes">Comparatif Systèmes</div>);
jest.mock('./ResultatsFinanciers', () => () => <div data-testid="resultats-financiers">Résultats Financiers</div>);
jest.mock('./ImpactEnvironnemental', () => () => <div data-testid="impact-environnemental">Impact Environnemental</div>);

// Mock de localStorage pour les tests
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CalculateurPatesPapiers', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });
  
  test('affiche le composant ParametresSysteme par défaut', () => {
    render(<CalculateurPatesPapiers />);
    
    expect(screen.getByTestId('parametres-systeme')).toBeInTheDocument();
    expect(screen.queryByTestId('comparatif-systemes')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resultats-financiers')).not.toBeInTheDocument();
    expect(screen.queryByTestId('impact-environnemental')).not.toBeInTheDocument();
  });
  
  test('change d\'onglet lors du clic sur les boutons de navigation', () => {
    render(<CalculateurPatesPapiers />);
    
    // D'abord l'onglet Paramètres est affiché
    expect(screen.getByTestId('parametres-systeme')).toBeInTheDocument();
    
    // Clic sur l'onglet Comparatif
    fireEvent.click(screen.getByText('Analyse comparative'));
    expect(screen.getByTestId('comparatif-systemes')).toBeInTheDocument();
    expect(screen.queryByTestId('parametres-systeme')).not.toBeInTheDocument();
    
    // Clic sur l'onglet Financier
    fireEvent.click(screen.getByText('Détails financiers'));
    expect(screen.getByTestId('resultats-financiers')).toBeInTheDocument();
    expect(screen.queryByTestId('comparatif-systemes')).not.toBeInTheDocument();
    
    // Clic sur l'onglet Sécurité
    fireEvent.click(screen.getByText('Sécurité & Environnement'));
    expect(screen.getByTestId('impact-environnemental')).toBeInTheDocument();
    expect(screen.queryByTestId('resultats-financiers')).not.toBeInTheDocument();
  });
  
  test('charge les paramètres sauvegardés au démarrage', () => {
    // Configuration du mock pour simuler des paramètres sauvegardés
    const parametresMock = {
      typeSystemeActuel: 'semi-auto',
      parametresSystemeActuel: { capacite: 80 },
      parametresSystemeAutomatise: { capaciteTraitement: 150 },
      parametresGeneraux: { tonnageAnnuel: 25000 },
      dateEnregistrement: new Date().toISOString()
    };
    
    chargerParametres.mockReturnValueOnce(parametresMock);
    
    render(<CalculateurPatesPapiers />);
    
    // Vérification que la fonction chargerParametres a été appelée
    expect(chargerParametres).toHaveBeenCalledTimes(1);
    
    // Vérification que la notification de chargement réussi est affichée
    expect(screen.getByText(/Paramètres chargés/)).toBeInTheDocument();
  });
  
  test('sauvegarde automatiquement les paramètres lorsqu\'ils changent', async () => {
    // On rend le composant dans un wrapper qui nous donne accès au contexte
    const TestComponent = () => {
      const context = React.useContext(CalculateurPapierContext);
      
      return (
        <div>
          <button
            data-testid="change-capacite"
            onClick={() => context.setParametresSystemeActuel({
              ...context.parametresSystemeActuel,
              capacite: 60
            })}
          >
            Modifier Capacité
          </button>
          <div data-testid="capacite-actuelle">{context.parametresSystemeActuel.capacite}</div>
        </div>
      );
    };
    
    render(
      <CalculateurPatesPapiers>
        <TestComponent />
      </CalculateurPatesPapiers>
    );
    
    // Simuler le changement d'un paramètre
    fireEvent.click(screen.getByTestId('change-capacite'));
    
    // Vérification que la fonction sauvegarderParametres est appelée
    await waitFor(() => expect(sauvegarderParametres).toHaveBeenCalled());
    
    // Vérification que la notification est affichée
    expect(screen.getByText(/Paramètres sauvegardés automatiquement/)).toBeInTheDocument();
  });
  
  test('calcule correctement les résultats initiaux', () => {
    // On rend le composant pour accéder au contexte
    const TestComponent = () => {
      const context = React.useContext(CalculateurPapierContext);
      
      return (
        <div>
          <div data-testid="roi">{context.resultats.roi.toFixed(2)}</div>
          <div data-testid="delai-recuperation">{context.resultats.delaiRecuperation.toFixed(2)}</div>
          <div data-testid="van">{context.resultats.van.toFixed(2)}</div>
        </div>
      );
    };
    
    render(
      <CalculateurPatesPapiers>
        <TestComponent />
      </CalculateurPatesPapiers>
    );
    
    // Vérification que les résultats ne sont pas nuls
    const roi = screen.getByTestId('roi').textContent;
    const delaiRecuperation = screen.getByTestId('delai-recuperation').textContent;
    const van = screen.getByTestId('van').textContent;
    
    expect(parseFloat(roi)).toBeGreaterThan(0);
    expect(parseFloat(delaiRecuperation)).toBeGreaterThan(0);
    expect(parseFloat(van)).not.toBe(0);
  });
});