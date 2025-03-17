import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalculateurPatesPapiers from './CalculateurPatesPapiers';
import * as patesPapiersHelpers from '../../../utils/patesPapiersHelpers';

// Mock du localStorage
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

// Mock des helpers
jest.mock('../../../utils/patesPapiersHelpers', () => ({
  calculerROIPatesPapiers: jest.fn().mockReturnValue({
    roi: 120,
    delaiRecuperation: 1.8,
    van: 250000,
    tri: 25,
    fluxTresorerie: [{annee: 1, cumulFluxTresorerie: 100000}],
    economiesCO2: 500,
    differenceProduction: 40000,
    economieAnnuelle: 80000,
    reductionMainOeuvre: 110000,
    economiesSecurite: 25000,
    economiesQualite: 15000,
    economiesTempsArret: 10000
  }),
  ajusterParametresSystemeActuel: jest.fn(params => params),
  preparerDonneesGraphiques: jest.fn().mockReturnValue({
    dataComparaisonCapacite: [
      {name: 'Système Actuel', value: 45, fill: '#ef4444'},
      {name: 'Solution Automatisée', value: 120, fill: '#22c55e'}
    ],
    dataComparaisonEmployes: [
      {name: 'Système Actuel', value: 2.5, fill: '#ef4444'},
      {name: 'Solution Automatisée', value: 0.5, fill: '#22c55e'}
    ],
    dataComparaisonRejets: [],
    dataComparaisonAccidents: [],
    dataEconomies: [],
    dataCumulatif: []
  }),
  sauvegarderParametres: jest.fn(),
  chargerParametres: jest.fn().mockReturnValue(null),
  validerChampNumerique: jest.fn().mockReturnValue(true),
  validerParametres: jest.fn().mockReturnValue({})
}));

// Mock de recharts
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Bar: () => <div data-testid="bar"></div>,
    Line: () => <div data-testid="line"></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>
  };
});

describe('CalculateurPatesPapiers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('rend correctement le composant', () => {
    render(<CalculateurPatesPapiers />);
    expect(screen.getByText(/Solution Automatisée de Désempilement et Débrochage de Ballots/i)).toBeInTheDocument();
  });

  it('affiche les quatre onglets de navigation', () => {
    render(<CalculateurPatesPapiers />);
    expect(screen.getByText('Vue générale')).toBeInTheDocument();
    expect(screen.getByText('Analyse comparative')).toBeInTheDocument();
    expect(screen.getByText('Détails financiers')).toBeInTheDocument();
    expect(screen.getByText('Sécurité & Environnement')).toBeInTheDocument();
  });

  it('change d\'onglet lorsqu\'on clique sur les boutons', async () => {
    render(<CalculateurPatesPapiers />);
    
    // Par défaut, l'onglet "Vue générale" est actif
    expect(screen.getByText('Paramètres de base')).toBeInTheDocument();
    
    // Cliquer sur l'onglet "Analyse comparative"
    fireEvent.click(screen.getByText('Analyse comparative'));
    
    // Attendre que le contenu de l'onglet "Analyse comparative" soit affiché
    await waitFor(() => {
      expect(screen.getByText('Analyse comparative détaillée')).toBeInTheDocument();
    });
  });

  it('utilise les fonctions helpers pour les calculs', () => {
    render(<CalculateurPatesPapiers />);
    expect(patesPapiersHelpers.calculerROIPatesPapiers).toHaveBeenCalled();
    expect(patesPapiersHelpers.preparerDonneesGraphiques).toHaveBeenCalled();
  });

  it('affiche les résultats de calcul', () => {
    render(<CalculateurPatesPapiers />);
    expect(screen.getByText('120.00%')).toBeInTheDocument(); // ROI
    expect(screen.getByText('1.80 ans')).toBeInTheDocument(); // Délai de récupération
  });

  it('change le type de système lorsqu\'on clique sur les boutons', () => {
    render(<CalculateurPatesPapiers />);
    
    // Cliquer sur le type de système "Semi-automatisé"
    fireEvent.click(screen.getByText('Semi-automatisé'));
    
    // Vérifier que la fonction ajusterParametresSystemeActuel a été appelée
    expect(patesPapiersHelpers.ajusterParametresSystemeActuel).toHaveBeenCalledWith('semi-auto', expect.any(Object));
  });

  it('permet de modifier les paramètres de base', () => {
    render(<CalculateurPatesPapiers />);
    
    // Trouver le champ de saisie pour la capacité actuelle
    const capaciteInput = screen.getByLabelText('Capacité actuelle (ballots/heure)');
    
    // Modifier la valeur
    fireEvent.change(capaciteInput, { target: { value: '60' } });
    
    // Vérifier que la valeur a été mise à jour
    expect(capaciteInput.value).toBe('60');
  });

  it('sauvegarde les paramètres dans le localStorage', async () => {
    render(<CalculateurPatesPapiers />);
    
    // Attendre que la sauvegarde soit effectuée
    await waitFor(() => {
      expect(patesPapiersHelpers.sauvegarderParametres).toHaveBeenCalled();
    });
  });

  it('essaie de charger les paramètres depuis le localStorage au chargement', () => {
    render(<CalculateurPatesPapiers />);
    expect(patesPapiersHelpers.chargerParametres).toHaveBeenCalled();
  });

  it('affiche/masque les paramètres avancés lorsqu\'on clique sur le bouton', async () => {
    render(<CalculateurPatesPapiers />);
    
    // Les paramètres avancés sont masqués par défaut
    expect(screen.queryByText('Paramètres avancés')).not.toBeInTheDocument();
    
    // Cliquer sur le bouton "Afficher les paramètres avancés"
    fireEvent.click(screen.getByText('Afficher les paramètres avancés'));
    
    // Attendre que les paramètres avancés soient affichés
    await waitFor(() => {
      expect(screen.getByText('Paramètres avancés')).toBeInTheDocument();
    });
    
    // Cliquer à nouveau pour masquer les paramètres avancés
    fireEvent.click(screen.getByText('Masquer les paramètres avancés'));
    
    // Attendre que les paramètres avancés soient masqués
    await waitFor(() => {
      expect(screen.queryByText('Paramètres avancés')).not.toBeInTheDocument();
    });
  });
});
