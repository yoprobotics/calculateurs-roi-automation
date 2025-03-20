import { exporterPDF } from '../utils/PDFExport';
import { jsPDF } from 'jspdf';

// Mock de jsPDF
jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      text: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      line: jest.fn(),
      lastAutoTable: { finalY: 150 },
      autoTable: jest.fn().mockImplementation(function() {
        this.lastAutoTable = { finalY: 150 };
        return this;
      }),
      addPage: jest.fn(),
      internal: {
        getNumberOfPages: jest.fn().mockReturnValue(2),
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297)
        }
      },
      setPage: jest.fn(),
      save: jest.fn()
    }))
  };
});

// Mock de jspdf-autotable
jest.mock('jspdf-autotable');

describe('Utilitaire PDFExport', () => {
  // Données factices pour les tests
  const mockParams = {
    parametresSystemeActuel: {
      capacite: 45,
      nombreEmployes: 2.5,
      maintenance: 6000,
      energie: 4000,
      frequenceAccident: 5.2,
      coutMoyenAccident: 12500,
      tempsArretAccident: 24
    },
    parametresSystemeAutomatise: {
      coutSysteme: 380000,
      coutInstallation: 45000,
      coutIngenierie: 25000,
      coutFormation: 15000,
      dureeVie: 15,
      capaciteTraitement: 120,
      reductionAccidents: 85,
      reductionEmpreinteCO2: 7,
      subventions: 40000
    },
    parametresGeneraux: {
      margeBrute: 110,
      tonnageAnnuel: 20000
    },
    resultats: {
      roi: 25.5,
      delaiRecuperation: 1.8,
      van: 250000,
      tri: 18.4,
      economieAnnuelle: 75000,
      economiesSecurite: 12000,
      economiesTempsArret: 8000,
      economiesCO2: 500
    },
    typeSystemeActuel: 'manuel'
  };
  
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });
  
  test('Devrait créer un document PDF', () => {
    // Appel de la fonction d'exportation
    const result = exporterPDF(mockParams);
    
    // Vérification que jsPDF a été appelé
    expect(jsPDF).toHaveBeenCalled();
    
    // Vérification que le document a été retourné
    expect(result).toBeDefined();
  });
  
  test('Devrait générer l\'en-tête du document', () => {
    // Appel de la fonction d'exportation
    const doc = exporterPDF(mockParams);
    
    // Vérification que les méthodes d'en-tête ont été appelées
    expect(doc.setFontSize).toHaveBeenCalledWith(22);
    expect(doc.setTextColor).toHaveBeenCalledWith(39, 119, 54); // Vert
    expect(doc.text).toHaveBeenCalledWith('Calculateur ROI - Pâtes et Papiers', 14, 20);
  });
  
  test('Devrait générer les tableaux de résultats', () => {
    // Appel de la fonction d'exportation
    const doc = exporterPDF(mockParams);
    
    // Vérification que autoTable a été appelé plusieurs fois pour les différentes sections
    expect(doc.autoTable).toHaveBeenCalledTimes(5);
  });
  
  test('Devrait ajouter une nouvelle page si nécessaire', () => {
    // Configuration du mock pour simuler un besoin de nouvelle page
    jsPDF.mockImplementationOnce(() => ({
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      text: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      line: jest.fn(),
      lastAutoTable: { finalY: 250 }, // Valeur élevée pour simuler un besoin de nouvelle page
      autoTable: jest.fn().mockImplementation(function() {
        this.lastAutoTable = { finalY: 250 };
        return this;
      }),
      addPage: jest.fn(),
      internal: {
        getNumberOfPages: jest.fn().mockReturnValue(2),
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297)
        }
      },
      setPage: jest.fn(),
      save: jest.fn()
    }));
    
    // Appel de la fonction d'exportation
    const doc = exporterPDF(mockParams);
    
    // Vérification que addPage a été appelé
    expect(doc.addPage).toHaveBeenCalled();
  });
  
  test('Devrait ajouter un pied de page à chaque page', () => {
    // Appel de la fonction d'exportation
    const doc = exporterPDF(mockParams);
    
    // Vérification que setPage a été appelé pour chaque page
    expect(doc.setPage).toHaveBeenCalledWith(1);
    expect(doc.setPage).toHaveBeenCalledWith(2);
    
    // Vérification que le pied de page a été ajouté
    expect(doc.setFontSize).toHaveBeenCalledWith(8);
    expect(doc.setTextColor).toHaveBeenCalledWith(100, 100, 100);
  });
});
