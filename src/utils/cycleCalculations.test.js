import { tempsVersCacacite, capaciteVersTemps } from './cycleCalculations';

describe('Fonctions de conversion temps de cycle et capacité', () => {
  describe('tempsVersCacacite', () => {
    it('devrait convertir correctement le temps de cycle en capacité horaire', () => {
      // Cas simples avec valeurs entières
      expect(tempsVersCacacite(60)).toBe(60);  // 60 secondes par unité → 60 unités/heure
      expect(tempsVersCacacite(30)).toBe(120); // 30 secondes par unité → 120 unités/heure
      expect(tempsVersCacacite(120)).toBe(30); // 120 secondes par unité → 30 unités/heure
      
      // Cas avec des valeurs décimales
      expect(tempsVersCacacite(45)).toBe(80);  // 45 secondes par unité → 80 unités/heure
      expect(tempsVersCacacite(36)).toBe(100); // 36 secondes par unité → 100 unités/heure
      
      // Cas extrêmes
      expect(tempsVersCacacite(1)).toBe(3600); // 1 seconde par unité → 3600 unités/heure
      expect(tempsVersCacacite(3600)).toBe(1); // 3600 secondes par unité → 1 unité/heure
    });
    
    it('devrait gérer les cas spéciaux', () => {
      // Valeur nulle ou très petite
      expect(tempsVersCacacite(0)).toBe(Infinity);     // Division par zéro donne l'infini
      expect(tempsVersCacacite(0.001)).toBe(3600000);  // Très faible temps → très grande capacité
      
      // Valeurs négatives (non valides en théorie, mais le test est utile)
      expect(tempsVersCacacite(-60)).toBe(-60);        // Devrait retourner une valeur négative
    });
  });
  
  describe('capaciteVersTemps', () => {
    it('devrait convertir correctement la capacité horaire en temps de cycle', () => {
      // Cas simples avec valeurs entières
      expect(capaciteVersTemps(60)).toBe(60);   // 60 unités/heure → 60 secondes par unité
      expect(capaciteVersTemps(120)).toBe(30);  // 120 unités/heure → 30 secondes par unité
      expect(capaciteVersTemps(30)).toBe(120);  // 30 unités/heure → 120 secondes par unité
      
      // Cas avec des valeurs décimales
      expect(capaciteVersTemps(80)).toBe(45);   // 80 unités/heure → 45 secondes par unité
      expect(capaciteVersTemps(100)).toBe(36);  // 100 unités/heure → 36 secondes par unité
      
      // Cas extrêmes
      expect(capaciteVersTemps(3600)).toBe(1);  // 3600 unités/heure → 1 seconde par unité
      expect(capaciteVersTemps(1)).toBe(3600);  // 1 unité/heure → 3600 secondes par unité
    });
    
    it('devrait gérer les cas spéciaux', () => {
      // Valeur nulle ou très petite
      expect(capaciteVersTemps(0)).toBe(Infinity);     // Division par zéro donne l'infini
      expect(capaciteVersTemps(0.001)).toBe(3600000);  // Très faible capacité → très grand temps
      
      // Valeurs négatives (non valides en théorie, mais le test est utile)
      expect(capaciteVersTemps(-60)).toBe(-60);        // Devrait retourner une valeur négative
    });
  });
  
  describe('Cohérence entre les fonctions', () => {
    it('devrait être réciproques', () => {
      // Vérifier que les transformations successives redonnent bien la valeur initiale
      // Pour un temps de cycle initial
      const tempsCycle = 45;  // 45 secondes par unité
      const capacite = tempsVersCacacite(tempsCycle);
      const tempsCycleRetrouve = capaciteVersTemps(capacite);
      expect(tempsCycleRetrouve).toBe(tempsCycle);
      
      // Pour une capacité initiale
      const capaciteInitiale = 80;  // 80 unités/heure
      const tempsCycle2 = capaciteVersTemps(capaciteInitiale);
      const capaciteRetrouvee = tempsVersCacacite(tempsCycle2);
      expect(capaciteRetrouvee).toBe(capaciteInitiale);
    });
  });
});