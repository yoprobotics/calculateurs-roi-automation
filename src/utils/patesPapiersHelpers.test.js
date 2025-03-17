import { 
  calculerROIPatesPapiers, 
  ajusterParametresSystemeActuel, 
  preparerDonneesGraphiques,
  validerChampNumerique,
  validerParametres
} from './patesPapiersHelpers';

describe('Fonctions utilitaires pour le calculateur de pâtes et papiers', () => {
  describe('ajusterParametresSystemeActuel', () => {
    it('devrait ajuster les paramètres pour un système manuel', () => {
      const parametresActuels = {
        capacite: 100,
        nombreEmployes: 3,
        coutSysteme: 50000,
        maintenance: 10000,
        energie: 5000,
        tauxRejets: 10,
        perteProduction: 10,
        frequenceAccident: 4
      };
      
      const resultat = ajusterParametresSystemeActuel('manuel', parametresActuels);
      
      expect(resultat.capacite).toBe(45);
      expect(resultat.nombreEmployes).toBe(2.5);
      expect(resultat.coutSysteme).toBe(15000);
      expect(resultat.maintenance).toBe(6000);
      expect(resultat.energie).toBe(4000);
      expect(resultat.tauxRejets).toBe(8);
      expect(resultat.perteProduction).toBe(12);
      expect(resultat.frequenceAccident).toBe(5.2);
    });
    
    it('devrait ajuster les paramètres pour un système semi-automatisé', () => {
      const parametresActuels = {
        capacite: 100,
        nombreEmployes: 3,
        coutSysteme: 50000,
        maintenance: 10000,
        energie: 5000,
        tauxRejets: 10,
        perteProduction: 10,
        frequenceAccident: 4
      };
      
      const resultat = ajusterParametresSystemeActuel('semi-auto', parametresActuels);
      
      expect(resultat.capacite).toBe(80);
      expect(resultat.nombreEmployes).toBe(1.5);
      expect(resultat.coutSysteme).toBe(120000);
      expect(resultat.maintenance).toBe(18000);
      expect(resultat.energie).toBe(8000);
      expect(resultat.tauxRejets).toBe(5.5);
      expect(resultat.perteProduction).toBe(8);
      expect(resultat.frequenceAccident).toBe(3.8);
    });
    
    it('devrait ajuster les paramètres pour un ancien système automatisé', () => {
      const parametresActuels = {
        capacite: 100,
        nombreEmployes: 3,
        coutSysteme: 50000,
        maintenance: 10000,
        energie: 5000,
        tauxRejets: 10,
        perteProduction: 10,
        frequenceAccident: 4
      };
      
      const resultat = ajusterParametresSystemeActuel('auto-ancien', parametresActuels);
      
      expect(resultat.capacite).toBe(100);
      expect(resultat.nombreEmployes).toBe(1);
      expect(resultat.coutSysteme).toBe(250000);
      expect(resultat.maintenance).toBe(25000);
      expect(resultat.energie).toBe(10000);
      expect(resultat.tauxRejets).toBe(4.2);
      expect(resultat.perteProduction).toBe(5);
      expect(resultat.frequenceAccident).toBe(1.5);
    });
    
    it('devrait conserver les paramètres pour un type non reconnu', () => {
      const parametresActuels = {
        capacite: 100,
        nombreEmployes: 3,
        coutSysteme: 50000,
        maintenance: 10000,
        energie: 5000,
        tauxRejets: 10,
        perteProduction: 10,
        frequenceAccident: 4
      };
      
      const resultat = ajusterParametresSystemeActuel('inconnu', parametresActuels);
      
      expect(resultat).toEqual(parametresActuels);
    });
  });
  
  describe('validerChampNumerique', () => {
    it('devrait valider un nombre positif', () => {
      expect(validerChampNumerique(42, { min: 0 })).toBe(true);
      expect(validerChampNumerique('42', { min: 0 })).toBe(true);
    });
    
    it('devrait rejeter un nombre négatif quand min est 0', () => {
      expect(validerChampNumerique(-5, { min: 0 })).toBe(false);
    });
    
    it('devrait rejeter un nombre hors limites', () => {
      expect(validerChampNumerique(101, { min: 0, max: 100 })).toBe(false);
    });
    
    it('devrait rejeter les valeurs non numériques', () => {
      expect(validerChampNumerique('abc', { min: 0 })).toBe(false);
    });
    
    it('devrait gérer les valeurs vides selon le paramètre requis', () => {
      expect(validerChampNumerique('', { requis: true })).toBe(false);
      expect(validerChampNumerique('', { requis: false })).toBe(true);
      expect(validerChampNumerique(null, { requis: false })).toBe(true);
      expect(validerChampNumerique(undefined, { requis: false })).toBe(true);
    });
  });
  
  describe('validerParametres', () => {
    it('devrait valider des paramètres corrects', () => {
      const parametres = {
        parametresGeneraux: {
          margeBrute: 110,
          tonnageAnnuel: 20000,
          heuresOperationParJour: 16,
          joursOperationParAn: 300
        },
        parametresSystemeAutomatise: {
          capaciteTraitement: 120,
          coutSysteme: 380000
        },
        parametresSystemeActuel: {}
      };
      
      const erreurs = validerParametres(parametres);
      expect(Object.keys(erreurs).length).toBe(0);
    });
    
    it('devrait détecter des erreurs dans les paramètres', () => {
      const parametres = {
        parametresGeneraux: {
          margeBrute: -10, // Valeur négative invalide
          tonnageAnnuel: 0, // Doit être > 0
          heuresOperationParJour: 25, // Hors limites (> 24)
          joursOperationParAn: 300
        },
        parametresSystemeAutomatise: {
          capaciteTraitement: 120,
          coutSysteme: 380000
        },
        parametresSystemeActuel: {}
      };
      
      const erreurs = validerParametres(parametres);
      expect(Object.keys(erreurs).length).toBe(3);
      expect(erreurs.margeBrute).toBeDefined();
      expect(erreurs.tonnageAnnuel).toBeDefined();
      expect(erreurs.heuresOperationParJour).toBeDefined();
    });
  });
  
  describe('calculerROIPatesPapiers', () => {
    // Ces tests nécessitent des mocks plus complexes et des scénarios complets
    it('devrait calculer les résultats pour un scénario simple', () => {
      // Test simplifié pour vérifier que la fonction s'exécute sans erreur
      const parametresSystemeAutomatise = {
        coutSysteme: 380000,
        coutInstallation: 45000,
        coutIngenierie: 25000,
        coutFormation: 15000,
        coutMaintenance: 12000,
        coutEnergie: 6500,
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
        subventions: 40000
      };
      
      const parametresSystemeActuel = {
        capacite: 45,
        nombreEmployes: 2.5,
        maintenance: 18000,
        energie: 9500,
        perteProduction: 8,
        tauxRejets: 8,
        frequenceAccident: 5.2,
        coutMoyenAccident: 12500,
        tempsArretAccident: 24
      };
      
      const parametresGeneraux = {
        margeBrute: 110,
        tauxInflation: 2,
        tauxActualisation: 5,
        tonnageAnnuel: 20000,
        heuresOperationParJour: 16,
        joursOperationParAn: 300
      };
      
      const resultats = calculerROIPatesPapiers(
        parametresSystemeAutomatise, 
        parametresSystemeActuel, 
        parametresGeneraux
      );
      
      // Vérifier que les propriétés attendues sont présentes
      expect(resultats.roi).toBeDefined();
      expect(resultats.delaiRecuperation).toBeDefined();
      expect(resultats.van).toBeDefined();
      expect(resultats.tri).toBeDefined();
      expect(resultats.fluxTresorerie).toBeDefined();
      expect(resultats.fluxTresorerie.length).toBe(parametresSystemeAutomatise.dureeVie);
      
      // Le ROI devrait être positif dans ce scénario
      expect(resultats.roi).toBeGreaterThan(0);
    });
  });
  
  describe('preparerDonneesGraphiques', () => {
    it('devrait préparer les données pour les graphiques', () => {
      const resultats = {
        fluxTresorerie: [{ annee: 1, cumulFluxTresorerie: 100000 }],
        reductionMainOeuvre: 110000,
        economiesQualite: 50000,
        economiesSecurite: 20000,
        economiesTempsArret: 15000,
        differenceProduction: 45000
      };
      
      const parametresSystemeActuel = {
        capacite: 45,
        nombreEmployes: 2.5,
        maintenance: 18000,
        energie: 9500,
        tauxRejets: 8,
        frequenceAccident: 5.2
      };
      
      const parametresSystemeAutomatise = {
        capaciteTraitement: 120,
        tauxRejets: 3.5,
        reductionAccidents: 85,
        coutSysteme: 380000,
        coutInstallation: 45000,
        coutIngenierie: 25000,
        coutFormation: 15000,
        coutMaintenance: 12000,
        coutEnergie: 6500,
        nbEmployesRemplaces: 2,
        subventions: 40000
      };
      
      const parametresGeneraux = {
        margeBrute: 110,
        tonnageAnnuel: 20000
      };
      
      const donnees = preparerDonneesGraphiques(
        resultats,
        parametresSystemeActuel,
        parametresSystemeAutomatise,
        parametresGeneraux
      );
      
      // Vérifier que les données de graphiques sont correctement préparées
      expect(donnees.dataComparaisonCapacite).toBeDefined();
      expect(donnees.dataComparaisonEmployes).toBeDefined();
      expect(donnees.dataComparaisonRejets).toBeDefined();
      expect(donnees.dataComparaisonAccidents).toBeDefined();
      expect(donnees.dataEconomies).toBeDefined();
      expect(donnees.dataCumulatif).toBeDefined();
      
      // Vérifier quelques valeurs spécifiques
      expect(donnees.dataComparaisonCapacite[0].value).toBe(45);
      expect(donnees.dataComparaisonCapacite[1].value).toBe(120);
      expect(donnees.dataComparaisonEmployes[0].value).toBe(2.5);
      expect(donnees.dataComparaisonEmployes[1].value).toBe(0.5);
    });
  });
});
