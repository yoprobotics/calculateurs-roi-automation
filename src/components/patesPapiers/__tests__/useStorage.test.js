import { renderHook, act } from '@testing-library/react-hooks';
import useStorage, { clearCalculatorStorage } from '../hooks/useStorage';

// Mock du localStorage pour les tests
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Hook useStorage', () => {
  beforeEach(() => {
    // Réinitialisation du localStorage mock et des spy avant chaque test
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });
  
  test('Devrait initialiser avec la valeur par défaut lorsque rien n\'est stocké', () => {
    // Vérification qu'aucune valeur n'est stockée au départ
    expect(localStorage.getItem('testKey')).toBeNull();
    
    // Rendu du hook avec une valeur initiale
    const { result } = renderHook(() => useStorage('testKey', { test: 'value' }));
    
    // Vérification que le hook renvoie la valeur initiale
    expect(result.current[0]).toEqual({ test: 'value' });
    
    // Vérification que la valeur a été stockée dans le localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ test: 'value' }));
  });
  
  test('Devrait récupérer la valeur existante depuis le localStorage', () => {
    // Pré-stockage d'une valeur
    localStorage.setItem('testKey', JSON.stringify({ stored: 'data' }));
    
    // Rendu du hook avec une autre valeur initiale
    const { result } = renderHook(() => useStorage('testKey', { test: 'value' }));
    
    // Vérification que le hook récupère la valeur stockée et non la valeur initiale
    expect(result.current[0]).toEqual({ stored: 'data' });
  });
  
  test('Devrait mettre à jour la valeur stockée lors de l\'appel de setValue', () => {
    // Rendu du hook
    const { result } = renderHook(() => useStorage('testKey', { count: 0 }));
    
    // Mise à jour de la valeur
    act(() => {
      result.current[1]({ count: 1 });
    });
    
    // Vérification que le hook a mis à jour la valeur
    expect(result.current[0]).toEqual({ count: 1 });
    
    // Vérification que le localStorage a été mis à jour
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ count: 1 }));
  });
  
  test('Devrait réinitialiser la valeur à sa valeur initiale', () => {
    // Rendu du hook avec une valeur initiale
    const { result } = renderHook(() => useStorage('testKey', { count: 0 }));
    
    // Mise à jour de la valeur
    act(() => {
      result.current[1]({ count: 5 });
    });
    
    // Vérification de la mise à jour
    expect(result.current[0]).toEqual({ count: 5 });
    
    // Réinitialisation de la valeur
    act(() => {
      result.current[2]();
    });
    
    // Vérification que la valeur a été réinitialisée
    expect(result.current[0]).toEqual({ count: 0 });
    
    // Vérification que le localStorage a été mis à jour
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ count: 0 }));
  });
  
  test('Devrait utiliser la valeur initiale en cas d\'erreur lors de la récupération', () => {
    // Simulation d'une erreur lors de la récupération
    localStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Espionnage de console.error pour vérifier que l'erreur est loguée
    console.error = jest.fn();
    
    // Rendu du hook
    const { result } = renderHook(() => useStorage('testKey', { test: 'fallback' }));
    
    // Vérification que la valeur par défaut est utilisée en cas d'erreur
    expect(result.current[0]).toEqual({ test: 'fallback' });
    
    // Vérification que l'erreur a été loguée
    expect(console.error).toHaveBeenCalled();
  });
  
  test('clearCalculatorStorage devrait supprimer toutes les données du calculateur', () => {
    // Pré-stockage des données du calculateur
    localStorage.setItem('patesPapiers_typeSystemeActuel', JSON.stringify('manuel'));
    localStorage.setItem('patesPapiers_parametresSystemeActuel', JSON.stringify({}));
    localStorage.setItem('patesPapiers_parametresSystemeAutomatise', JSON.stringify({}));
    localStorage.setItem('patesPapiers_parametresGeneraux', JSON.stringify({}));
    localStorage.setItem('patesPapiers_ui', JSON.stringify({}));
    
    // Ajout d'une valeur qui ne devrait pas être supprimée
    localStorage.setItem('autre_valeur', JSON.stringify('test'));
    
    // Appel de la fonction de nettoyage
    clearCalculatorStorage();
    
    // Vérification que les éléments ont été supprimés
    expect(localStorage.removeItem).toHaveBeenCalledWith('patesPapiers_typeSystemeActuel');
    expect(localStorage.removeItem).toHaveBeenCalledWith('patesPapiers_parametresSystemeActuel');
    expect(localStorage.removeItem).toHaveBeenCalledWith('patesPapiers_parametresSystemeAutomatise');
    expect(localStorage.removeItem).toHaveBeenCalledWith('patesPapiers_parametresGeneraux');
    expect(localStorage.removeItem).toHaveBeenCalledWith('patesPapiers_ui');
    
    // Vérification que l'autre valeur n'a pas été touchée
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('autre_valeur');
  });
});
