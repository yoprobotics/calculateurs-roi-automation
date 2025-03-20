import { renderHook, act } from '@testing-library/react-hooks';
import useParametres from '../hooks/useParametres';
import { SYSTEME_MANUEL, SYSTEME_SEMI_AUTO, SYSTEME_AUTO_ANCIEN } from '../constants';

// Mock du hook useStorage pour tester useParametres sans dépendance au localStorage
jest.mock('../hooks/useStorage', () => {
  return jest.fn((key, initialValue) => {
    const [state, setState] = jest.requireActual('react').useState(initialValue);
    return [state, setState, jest.fn()];
  });
});

describe('Hook useParametres', () => {
  test('Devrait initialiser les paramètres avec les valeurs par défaut', () => {
    const { result } = renderHook(() => useParametres());
    
    // Vérification des valeurs initiales
    expect(result.current.typeSystemeActuel).toBe('manuel');
    expect(result.current.parametresSystemeActuel).toEqual(expect.objectContaining(SYSTEME_MANUEL));
    expect(result.current.ui).toEqual(expect.objectContaining({
      afficherDetails: false,
      ongletActif: 'general'
    }));
  });
  
  test('Devrait mettre à jour le type de système actuel', () => {
    const { result } = renderHook(() => useParametres());
    
    // Mise à jour du type de système
    act(() => {
      result.current.setTypeSystemeActuel('semi-auto');
    });
    
    // Vérification du changement
    expect(result.current.typeSystemeActuel).toBe('semi-auto');
    
    // Vérification que les paramètres du système actuel ont été mis à jour
    // en fonction du nouveau type de système
    expect(result.current.parametresSystemeActuel).toEqual(
      expect.objectContaining(SYSTEME_SEMI_AUTO)
    );
  });
  
  test('Devrait mettre à jour les paramètres du système automatisé', () => {
    const { result } = renderHook(() => useParametres());
    
    const nouveauxParametres = {
      ...result.current.parametresSystemeAutomatise,
      capaciteTraitement: 150,
      coutSysteme: 400000
    };
    
    // Mise à jour des paramètres
    act(() => {
      result.current.setParametresSystemeAutomatise(nouveauxParametres);
    });
    
    // Vérification des changements
    expect(result.current.parametresSystemeAutomatise.capaciteTraitement).toBe(150);
    expect(result.current.parametresSystemeAutomatise.coutSysteme).toBe(400000);
  });
  
  test('Devrait mettre à jour les paramètres généraux', () => {
    const { result } = renderHook(() => useParametres());
    
    const nouveauxParametresGeneraux = {
      ...result.current.parametresGeneraux,
      margeBrute: 125,
      tauxInflation: 3
    };
    
    // Mise à jour des paramètres
    act(() => {
      result.current.setParametresGeneraux(nouveauxParametresGeneraux);
    });
    
    // Vérification des changements
    expect(result.current.parametresGeneraux.margeBrute).toBe(125);
    expect(result.current.parametresGeneraux.tauxInflation).toBe(3);
  });
  
  test('Devrait mettre à jour l\'état de l\'interface utilisateur', () => {
    const { result } = renderHook(() => useParametres());
    
    // Mise à jour de l'UI
    act(() => {
      result.current.setUi({
        ...result.current.ui,
        afficherDetails: true,
        ongletActif: 'financier'
      });
    });
    
    // Vérification des changements
    expect(result.current.ui.afficherDetails).toBe(true);
    expect(result.current.ui.ongletActif).toBe('financier');
  });
  
  test('Devrait changer les paramètres du système en fonction du type sélectionné', () => {
    const { result } = renderHook(() => useParametres());
    
    // Test pour le système semi-automatisé
    act(() => {
      result.current.setTypeSystemeActuel('semi-auto');
    });
    
    expect(result.current.parametresSystemeActuel.capacite).toBe(SYSTEME_SEMI_AUTO.capacite);
    expect(result.current.parametresSystemeActuel.nombreEmployes).toBe(SYSTEME_SEMI_AUTO.nombreEmployes);
    
    // Test pour le système automatisé ancien
    act(() => {
      result.current.setTypeSystemeActuel('auto-ancien');
    });
    
    expect(result.current.parametresSystemeActuel.capacite).toBe(SYSTEME_AUTO_ANCIEN.capacite);
    expect(result.current.parametresSystemeActuel.nombreEmployes).toBe(SYSTEME_AUTO_ANCIEN.nombreEmployes);
    
    // Retour au système manuel
    act(() => {
      result.current.setTypeSystemeActuel('manuel');
    });
    
    expect(result.current.parametresSystemeActuel.capacite).toBe(SYSTEME_MANUEL.capacite);
    expect(result.current.parametresSystemeActuel.nombreEmployes).toBe(SYSTEME_MANUEL.nombreEmployes);
  });
});
