import {
  calculerFluxActualise,
  appliquerInflation,
  calculerEconomiesCO2,
  calculerEconomieDechet,
  calculerEconomieRejets,
  validerParametres,
  formaterMontant,
  formaterPourcentage,
  formaterNombre
} from './patesPapiersHelpers';

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

describe('Fonctions utilitaires pour le calculateur pâtes et papiers', () => {
  describe('calculerFluxActualise', () => {
    test('devrait actualiser correctement un flux de trésorerie', () => {
      // Flux de 1000, taux de 5%, année 1
      expect(calculerFluxActualise(1000, 5, 1)).toBeCloseTo(952.38, 2);
      
      // Flux de 1000, taux de 5%, année 5
      expect(calculerFluxActualise(1000, 5, 5)).toBeCloseTo(783.53, 2);
      
      // Taux nul : pas d'actualisation
      expect(calculerFluxActualise(1000, 0, 3)).toBe(1000);
    });
    
    test('devrait gérer les valeurs extrêmes correctement', () => {
      // Valeur nulle
      expect(calculerFluxActualise(0, 5, 1)).toBe(0);
      
      // Taux élevé
      expect(calculerFluxActualise(1000, 100, 1)).toBeCloseTo(500, 2);
    });
  });
  
  describe('appliquerInflation', () => {
    test('devrait appliquer correctement l\'inflation sur plusieurs années', () => {
      // Valeur de 1000, inflation de 2%, sur 1 an
      expect(appliquerInflation(1000, 2, 1)).toBeCloseTo(1020, 2);
      
      // Valeur de 1000, inflation de 2%, sur 5 ans
      expect(appliquerInflation(1000, 2, 5)).toBeCloseTo(1104.08, 2);
      
      // Sans inflation
      expect(appliquerInflation(1000, 0, 3)).toBe(1000);
    });
    
    test('devrait gérer l\'inflation négative (déflation)', () => {
      // Valeur de 1000, déflation de 2%, sur 1 an
      expect(appliquerInflation(1000, -2, 1)).toBeCloseTo(980, 2);
      
      // Valeur de 1000, déflation de 2%, sur 3 ans
      expect(appliquerInflation(1000, -2, 3)).toBeCloseTo(941.19, 2);
    });
  });
  
  describe('calculerEconomiesCO2', () => {
    test('devrait calculer correctement les tonnes de CO2 économisées', () => {
      // 20 000 tonnes annuelles, réduction de 7%, sur 15 ans
      expect(calculerEconomiesCO2(20000, 7, 15)).toBeCloseTo(21000, 2);
      
      // Aucune réduction
      expect(calculerEconomiesCO2(20000, 0, 15)).toBe(0);
    });
  });
  
  describe('calculerEconomieDechet', () => {
    test('devrait calculer correctement l\'économie liée à la réduction des déchets', () => {
      // 20 000 tonnes annuelles, réduction de 14%, coût de 230$/tonne, inflation de 2%, année 1
      expect(calculerEconomieDechet(20000, 14, 230, 2, 1)).toBeCloseTo(644000, 2);
      
      // Avec inflation (année 2)
      expect(calculerEconomieDechet(20000, 14, 230, 2, 2)).toBeCloseTo(656880, 2);
    });
  });
  
  describe('calculerEconomieRejets', () => {
    test('devrait calculer correctement l\'économie liée à la réduction des rejets', () => {
      // 20 000 tonnes, taux actuel 8%, taux automatisé 3.5%, coût de 230$/tonne, inflation de 2%, année 1
      expect(calculerEconomieRejets(20000, 8, 3.5, 230, 2, 1)).toBeCloseTo(207000, 2);
      
      // Avec inflation (année 3)
      expect(calculerEconomieRejets(20000, 8, 3.5, 230, 2, 3)).toBeCloseTo(215330.8, 2);
    });
  });
  
  describe('validerParametres', () => {
    test('devrait valider correctement des paramètres valides', () => {
      const parametresValides = {
        capacite: 45,
        nombreEmployes: 2.5,
        nbEmployesRemplaces: 2,
        perteProduction: 8,
        tauxRejets: 8,
        reductionDechet: 14
      };
      
      const resultat = validerParametres(parametresValides);
      expect(resultat.valide).toBe(true);
      expect(resultat.erreurs.length).toBe(0);
    });
    
    test('devrait détecter les valeurs négatives', () => {
      const parametresInvalides = {
        capacite: -45,
        nombreEmployes: 2.5
      };
      
      const resultat = validerParametres(parametresInvalides);
      expect(resultat.valide).toBe(false);
      expect(resultat.erreurs.length).toBeGreaterThan(0);
      expect(resultat.erreurs[0]).toContain('ne peut pas être négatif');
    });
    
    test('devrait détecter les pourcentages supérieurs à 100%', () => {
      const parametresInvalides = {
        capacite: 45,
        nombreEmployes: 2.5,
        reductionDechet: 140
      };
      
      const resultat = validerParametres(parametresInvalides);
      expect(resultat.valide).toBe(false);
      expect(resultat.erreurs.length).toBeGreaterThan(0);
      expect(resultat.erreurs[0]).toContain('ne peut pas dépasser 100%');
    });
    
    test('devrait détecter les incohérences d\'employés remplacés', () => {
      const parametresInvalides = {
        nombreEmployes: 2,
        nbEmployesRemplaces: 3
      };
      
      const resultat = validerParametres(parametresInvalides);
      expect(resultat.valide).toBe(false);
      expect(resultat.erreurs.length).toBeGreaterThan(0);
      expect(resultat.erreurs[0]).toContain('employés remplacés');
    });
  });
  
  describe('fonctions de formatage', () => {
    test('formaterMontant devrait formater correctement les montants', () => {
      expect(formaterMontant(1000)).toBe('1 000 $US');
      expect(formaterMontant(1234.567, 'EUR', 2)).toBe('1 234,57 €');
    });
    
    test('formaterPourcentage devrait formater correctement les pourcentages', () => {
      expect(formaterPourcentage(12.345)).toBe('12.35%');
      expect(formaterPourcentage(10, 0)).toBe('10%');
    });
    
    test('formaterNombre devrait formater correctement les nombres', () => {
      expect(formaterNombre(1234.567)).toBe('1 234,57');
      expect(formaterNombre(1234.567, 0)).toBe('1 235');
    });
  });
});