import { 
  calculerFluxActualise, 
  calculerDelaiRecuperation, 
  calculerTRI, 
  appliquerInflation 
} from './calculationHelpers';

describe('Fonctions de calcul financier', () => {
  describe('calculerFluxActualise', () => {
    it('devrait actualiser correctement un flux de trésorerie', () => {
      // Cas simple : flux de 1000, taux de 5%, année 1
      expect(calculerFluxActualise(1000, 5, 1)).toBeCloseTo(952.38, 2);
      
      // Cas avec année plus éloignée : flux de 1000, taux de 5%, année 5
      expect(calculerFluxActualise(1000, 5, 5)).toBeCloseTo(783.53, 2);
      
      // Cas avec taux nul : pas d'actualisation
      expect(calculerFluxActualise(1000, 0, 3)).toBe(1000);
    });
    
    it('devrait gérer les cas extrêmes', () => {
      // Valeur nulle
      expect(calculerFluxActualise(0, 5, 1)).toBe(0);
      
      // Taux élevé
      expect(calculerFluxActualise(1000, 100, 1)).toBeCloseTo(500, 2);
    });
  });
  
  describe('calculerDelaiRecuperation', () => {
    it('devrait calculer correctement le délai de récupération simple', () => {
      // Investissement de 1000, flux constants de 500 par an
      // Récupération attendue après 2 ans exactement
      const investissement = 1000;
      const fluxTresorerie = [500, 500, 500, 500];
      const dureeMax = 5;
      
      expect(calculerDelaiRecuperation(investissement, fluxTresorerie, dureeMax)).toBe(2);
    });
    
    it('devrait calculer le délai avec interpolation', () => {
      // Investissement de 1000, flux de [400, 400, 400]
      // Récupération après 2.5 ans (2 ans + 200/400)
      const investissement = 1000;
      const fluxTresorerie = [400, 400, 400, 400];
      const dureeMax = 5;
      
      expect(calculerDelaiRecuperation(investissement, fluxTresorerie, dureeMax)).toBeCloseTo(2.5, 2);
    });
    
    it('devrait retourner la durée max si la récupération n\'est pas atteinte', () => {
      // Investissement de 1000, flux insuffisants [100, 100, 100]
      const investissement = 1000;
      const fluxTresorerie = [100, 100, 100];
      const dureeMax = 5;
      
      expect(calculerDelaiRecuperation(investissement, fluxTresorerie, dureeMax)).toBe(dureeMax);
    });
  });
  
  describe('calculerTRI', () => {
    it('devrait calculer correctement le TRI pour des flux positifs constants', () => {
      // Investissement de 1000, flux constants de 400 pendant 3 ans
      // TRI attendu environ 15-16%
      const investissement = 1000;
      const fluxTresorerie = [400, 400, 400];
      
      expect(calculerTRI(investissement, fluxTresorerie)).toBeGreaterThanOrEqual(15);
      expect(calculerTRI(investissement, fluxTresorerie)).toBeLessThanOrEqual(16);
    });
    
    it('devrait retourner 0 pour un projet non rentable', () => {
      // Investissement de 1000, flux insuffisants [200, 200, 200]
      const investissement = 1000;
      const fluxTresorerie = [200, 200, 200];
      
      expect(calculerTRI(investissement, fluxTresorerie)).toBe(0);
    });
    
    it('devrait calculer correctement pour des flux croissants', () => {
      // Investissement de 1000, flux croissants [300, 400, 500]
      const investissement = 1000;
      const fluxTresorerie = [300, 400, 500];
      
      expect(calculerTRI(investissement, fluxTresorerie)).toBeGreaterThan(0);
    });
  });
  
  describe('appliquerInflation', () => {
    it('devrait appliquer correctement l\'inflation sur plusieurs années', () => {
      // Valeur de 1000, inflation de 2%, sur 1 an
      expect(appliquerInflation(1000, 2, 1)).toBeCloseTo(1020, 2);
      
      // Valeur de 1000, inflation de 2%, sur 5 ans
      expect(appliquerInflation(1000, 2, 5)).toBeCloseTo(1104.08, 2);
      
      // Sans inflation
      expect(appliquerInflation(1000, 0, 3)).toBe(1000);
    });
    
    it('devrait gérer des taux d\'inflation négatifs (déflation)', () => {
      // Valeur de 1000, déflation de 2%, sur 1 an
      expect(appliquerInflation(1000, -2, 1)).toBeCloseTo(980, 2);
      
      // Valeur de 1000, déflation de 2%, sur 3 ans
      expect(appliquerInflation(1000, -2, 3)).toBeCloseTo(941.19, 2);
    });
  });
});
