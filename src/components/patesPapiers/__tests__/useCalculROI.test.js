import { renderHook, act } from '@testing-library/react-hooks';
import useCalculROI from '../hooks/useCalculROI';
import {
  SYSTEME_MANUEL,
  SYSTEME_AUTOMATISE_DEFAUT,
  PARAMETRES_GENERAUX_DEFAUT
} from '../constants';

// Mocking les dépendances externes si nécessaire
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    // Mock des hooks React si besoin
  };
});

describe('Hook useCalculROI', () => {
  // Données de test
  const typeSystemeActuel = 'manuel';
  const parametresSystemeActuel = { ...SYSTEME_MANUEL };
  const parametresSystemeAutomatise = { ...SYSTEME_AUTOMATISE_DEFAUT };
  const parametresGeneraux = { ...PARAMETRES_GENERAUX_DEFAUT };
  
  test('Devrait calculer correctement le ROI et les résultats financiers', () => {
    // Rendu du hook avec les paramètres de test
    const { result } = renderHook(() => useCalculROI(
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    ));
    
    // Vérification des résultats initiaux
    expect(result.current.resultats).toBeDefined();
    expect(result.current.resultats.roi).toBeGreaterThan(0);
    expect(result.current.resultats.delaiRecuperation).toBeGreaterThan(0);
    expect(result.current.resultats.van).toBeDefined();
    expect(result.current.resultats.tri).toBeDefined();
    expect(result.current.resultats.economiesCO2).toBeDefined();
  });
  
  test('Devrait recalculer les résultats lorsque les paramètres changent', () => {
    // Préparation des paramètres modifiés
    const parametresModifies = {
      ...parametresSystemeAutomatise,
      coutSysteme: 450000, // Augmentation du coût du système
      capaciteTraitement: 150 // Augmentation de la capacité
    };
    
    // Premier rendu avec les paramètres initiaux
    const { result, rerender } = renderHook(
      ({ type, actuel, automatise, generaux }) => 
        useCalculROI(type, actuel, automatise, generaux),
      { 
        initialProps: {
          type: typeSystemeActuel,
          actuel: parametresSystemeActuel, 
          automatise: parametresSystemeAutomatise,
          generaux: parametresGeneraux
        }
      }
    );
    
    // Capture des résultats initiaux
    const resultatInitial = { ...result.current.resultats };
    
    // Rendu avec les paramètres modifiés
    rerender({
      type: typeSystemeActuel,
      actuel: parametresSystemeActuel,
      automatise: parametresModifies,
      generaux: parametresGeneraux
    });
    
    // Vérification que les résultats ont été recalculés
    expect(result.current.resultats.roi).not.toEqual(resultatInitial.roi);
    
    // Le délai de récupération devrait être plus long car le coût a augmenté
    expect(result.current.resultats.delaiRecuperation).toBeGreaterThan(resultatInitial.delaiRecuperation);
    
    // Vérification des autres valeurs recalculées
    expect(result.current.resultats.van).not.toEqual(resultatInitial.van);
  });
  
  test('Devrait générer des flux de trésorerie pour chaque année', () => {
    // Rendu du hook
    const { result } = renderHook(() => useCalculROI(
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    ));
    
    // Vérification de la présence des flux de trésorerie
    expect(result.current.resultats.fluxTresorerie).toBeDefined();
    expect(Array.isArray(result.current.resultats.fluxTresorerie)).toBe(true);
    
    // La longueur du tableau devrait correspondre à la durée de vie du système
    expect(result.current.resultats.fluxTresorerie.length).toBe(parametresSystemeAutomatise.dureeVie);
    
    // Vérification des propriétés de chaque élément du flux
    const premierFlux = result.current.resultats.fluxTresorerie[0];
    expect(premierFlux).toHaveProperty('annee');
    expect(premierFlux).toHaveProperty('fluxAnnuel');
    expect(premierFlux).toHaveProperty('fluxActualise');
    expect(premierFlux).toHaveProperty('cumulFluxTresorerie');
  });
  
  test('Devrait calculer des économies environnementales', () => {
    // Rendu du hook
    const { result } = renderHook(() => useCalculROI(
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    ));
    
    // Vérification des économies environnementales
    expect(result.current.resultats.economiesCO2).toBeGreaterThan(0);
    
    // Test avec des paramètres modifiés pour l'environnement
    const parametresEcoModifies = {
      ...parametresSystemeAutomatise,
      reductionEmpreinteCO2: 15 // Augmentation de la réduction des émissions
    };
    
    // Rendu avec les nouveaux paramètres
    const { result: resultEco } = renderHook(() => useCalculROI(
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresEcoModifies,
      parametresGeneraux
    ));
    
    // Vérification que l'augmentation de la réduction entraîne des économies plus importantes
    expect(resultEco.current.resultats.economiesCO2).toBeGreaterThan(result.current.resultats.economiesCO2);
  });
});
