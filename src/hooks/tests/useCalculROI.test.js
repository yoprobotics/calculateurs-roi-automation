import { renderHook } from '@testing-library/react-hooks';
import useCalculROI from '../useCalculROI';

describe('useCalculROI', () => {
  // Données de test pour les systèmes
  const systemeActuelTest = {
    capacite: 45,
    nombreEmployes: 2.5,
    coutSysteme: 15000,
    maintenance: 6000,
    energie: 10000,
    tauxRejets: 8,
    perteProduction: 12,
    frequenceAccident: 5.2,
    coutMoyenAccident: 12500,
    tempsArretAccident: 24,
    tempsCycle: 80,
    consommationEau: 15000,
    emissionCO2: 180
  };

  const systemeAutomatiseTest = {
    coutSysteme: 380000,
    coutInstallation: 45000,
    coutIngenierie: 25000,
    coutFormation: 15000,
    coutFormationContinue: 8000,
    coutMaintenance: 12000,
    coutEnergie: 6000,
    dureeVie: 15,
    tauxAmortissement: 15,
    coutMainOeuvre: 55000,
    nbEmployesRemplaces: 2,
    reductionDechet: 14,
    coutDechet: 230,
    augmentationProduction: 10,
    reductionEnergie: 12,
    coutEnergieTonne: 40,
    reductionEau: 8,
    coutEauTonne: 4.5,
    ameliorationQualite: 5,
    reductionEmpreinteCO2: 7,
    capaciteTraitement: 120,
    tauxRejets: 3.5,
    reductionAccidents: 85,
    subventions: 40000,
    tempsCycle: 30,
    emissionCO2: 110
  };

  const parametresGenerauxTest = {
    margeBrute: 110,
    tauxInflation: 2,
    tauxActualisation: 5,
    tonnageAnnuel: 20000,
    heuresOperationParJour: 16,
    joursOperationParAn: 300
  };

  // Test principal
  it('devrait calculer correctement les indicateurs financiers', () => {
    // Rendu du hook avec les données de test
    const { result } = renderHook(() => 
      useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
    );

    // Vérification des indicateurs principaux
    expect(result.current.roi).toBeGreaterThan(0);
    expect(result.current.van).toBeGreaterThan(0);
    expect(result.current.delaiRecuperation).toBeLessThan(systemeAutomatiseTest.dureeVie);
    expect(result.current.tri).toBeGreaterThan(0);
  });

  // Tests spécifiques pour les économies d'énergie
  describe('Calculs des économies d\'énergie', () => {
    it('devrait calculer correctement les économies d\'énergie directes', () => {
      // Rendu du hook avec les données de test
      const { result } = renderHook(() => 
        useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
      );

      // L'économie directe devrait être la différence entre les coûts énergétiques
      // La première année, sans inflation
      const premierFlux = result.current.fluxTresorerie[0];
      
      // Énergie actuelle - Énergie automatisée = 10000 - 6000 = 4000
      expect(premierFlux.economieEnergieDirect).toBeCloseTo(4000, 0);
      
      // Vérifier que cette économie est bien incluse dans le flux annuel
      expect(premierFlux.fluxAnnuel).toBeGreaterThan(premierFlux.economieEnergieDirect);
    });

    it('devrait calculer correctement les économies d\'énergie de processus', () => {
      // Rendu du hook avec les données de test
      const { result } = renderHook(() => 
        useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
      );

      const premierFlux = result.current.fluxTresorerie[0];
      
      // Formule: tonnageAnnuel * (reductionEnergie / 100) * coutEnergieTonne
      // 20000 * (12 / 100) * 40 = 96000
      expect(premierFlux.economieEnergieProcessus).toBeCloseTo(96000, 0);
      
      // Vérifier que cette économie est bien distincte de l'économie directe
      expect(premierFlux.economieEnergieProcessus).not.toEqual(premierFlux.economieEnergieDirect);
    });

    it('devrait fournir le total des économies d\'énergie pour la rétrocompatibilité', () => {
      // Rendu du hook avec les données de test
      const { result } = renderHook(() => 
        useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
      );

      const premierFlux = result.current.fluxTresorerie[0];
      
      // Le total devrait être la somme des deux types d'économies
      expect(premierFlux.economieEnergie).toBeCloseTo(
        premierFlux.economieEnergieDirect + premierFlux.economieEnergieProcessus, 
        0
      );
    });

    it('devrait calculer correctement les économies de CO2 en cohérence avec les économies d\'énergie', () => {
      // Rendu du hook avec les données de test
      const { result } = renderHook(() => 
        useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
      );

      // Les économies de CO2 devraient être cohérentes avec la réduction des émissions
      const firstYearCO2Savings = result.current.fluxTresorerie[0].tonnesCO2Economisees;
      const expectedCO2Reduction = systemeActuelTest.emissionCO2 - systemeAutomatiseTest.emissionCO2;
      
      // La réduction devrait être au moins égale à la différence entre les émissions des systèmes
      expect(firstYearCO2Savings).toBeGreaterThanOrEqual(expectedCO2Reduction);
    });

    it('devrait inclure les détails des économies d\'énergie dans les résultats', () => {
      // Rendu du hook avec les données de test
      const { result } = renderHook(() => 
        useCalculROI(systemeActuelTest, systemeAutomatiseTest, parametresGenerauxTest)
      );

      // Vérifier que les détails sont présents
      expect(result.current.detailsEconomiesEnergie).toBeDefined();
      expect(result.current.detailsEconomiesEnergie.economieDirecte).toBeCloseTo(4000, 0);
      expect(result.current.detailsEconomiesEnergie.economieProcessus).toBeCloseTo(96000, 0);
      expect(result.current.detailsEconomiesEnergie.pourcentageAmelioration).toBe(12);
      expect(result.current.detailsEconomiesEnergie.coutEnergieTonne).toBe(40);
      expect(result.current.detailsEconomiesEnergie.economieAnnuelleMoyenne).toBeGreaterThan(0);
    });
  });

  // Test avec un scénario sans économies d'énergie
  it('devrait gérer correctement un scénario sans économies d\'énergie', () => {
    // Système automatisé sans économie d'énergie
    const systemeAutomatiseSansEconomie = {
      ...systemeAutomatiseTest,
      coutEnergie: systemeActuelTest.energie, // Même coût énergétique
      reductionEnergie: 0, // Pas de réduction d'énergie par tonne
      reductionEmpreinteCO2: 0 // Pas de réduction d'empreinte CO2
    };

    // Rendu du hook avec les données modifiées
    const { result } = renderHook(() => 
      useCalculROI(systemeActuelTest, systemeAutomatiseSansEconomie, parametresGenerauxTest)
    );

    const premierFlux = result.current.fluxTresorerie[0];
    
    // Les économies d'énergie directes devraient être nulles
    expect(premierFlux.economieEnergieDirect).toBeCloseTo(0, 0);
    
    // Les économies d'énergie de processus devraient être nulles
    expect(premierFlux.economieEnergieProcessus).toBeCloseTo(0, 0);
    
    // Le total des économies d'énergie devrait être nul
    expect(premierFlux.economieEnergie).toBeCloseTo(0, 0);
    
    // Le ROI devrait être plus faible que dans le scénario avec économies
    expect(result.current.roi).toBeLessThan(result.current.roi);
  });
});
