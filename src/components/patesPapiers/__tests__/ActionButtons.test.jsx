import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '../components/ActionButtons';
import { exporterPDF } from '../utils/PDFExport';

// Mock de la fonction d'exportation PDF
jest.mock('../utils/PDFExport', () => ({
  exporterPDF: jest.fn().mockReturnValue({
    save: jest.fn()
  })
}));

// Mock de la fonction window.print
global.print = jest.fn();
Object.defineProperty(window, 'print', {
  value: jest.fn(),
});

// Mock de window.location.href pour les tests d'email
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true
});

describe('Composant ActionButtons', () => {
  // Données factices pour les tests
  const mockProps = {
    parametresSystemeActuel: {
      capacite: 45,
      nombreEmployes: 2.5
    },
    parametresSystemeAutomatise: {
      capaciteTraitement: 120,
      coutSysteme: 380000
    },
    parametresGeneraux: {
      margeBrute: 110
    },
    resultats: {
      roi: 25.5,
      delaiRecuperation: 1.8,
      van: 250000,
      economieAnnuelle: 75000
    },
    typeSystemeActuel: 'manuel'
  };
  
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });
  
  test('Devrait rendre les trois boutons d\'action', () => {
    // Rendu du composant
    render(<ActionButtons {...mockProps} />);
    
    // Vérification que tous les boutons sont présents
    expect(screen.getByText(/Exporter en PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Imprimer/i)).toBeInTheDocument();
    expect(screen.getByText(/Partager par email/i)).toBeInTheDocument();
  });
  
  test('Devrait appeler la fonction d\'exportation PDF au clic sur le bouton PDF', () => {
    // Rendu du composant
    render(<ActionButtons {...mockProps} />);
    
    // Clic sur le bouton d'exportation PDF
    fireEvent.click(screen.getByText(/Exporter en PDF/i));
    
    // Vérification que la fonction d'exportation a été appelée avec les bons paramètres
    expect(exporterPDF).toHaveBeenCalledWith({
      parametresSystemeActuel: mockProps.parametresSystemeActuel,
      parametresSystemeAutomatise: mockProps.parametresSystemeAutomatise,
      parametresGeneraux: mockProps.parametresGeneraux,
      resultats: mockProps.resultats,
      typeSystemeActuel: mockProps.typeSystemeActuel
    });
    
    // Vérification que la méthode save du PDF a été appelée
    expect(exporterPDF().save).toHaveBeenCalled();
  });
  
  test('Devrait appeler window.print au clic sur le bouton Imprimer', () => {
    // Rendu du composant
    render(<ActionButtons {...mockProps} />);
    
    // Clic sur le bouton d'impression
    fireEvent.click(screen.getByText(/Imprimer/i));
    
    // Vérification que window.print a été appelé
    expect(window.print).toHaveBeenCalled();
  });
  
  test('Devrait ouvrir le client de messagerie au clic sur le bouton Partager', () => {
    // Rendu du composant
    render(<ActionButtons {...mockProps} />);
    
    // Clic sur le bouton de partage par email
    fireEvent.click(screen.getByText(/Partager par email/i));
    
    // Vérification que window.location.href a été modifié pour ouvrir un client de messagerie
    expect(window.location.href).toContain('mailto:?subject=');
    expect(window.location.href).toContain('body=');
    
    // Vérification que le contenu de l'email contient les résultats
    expect(window.location.href).toContain(`ROI global: ${mockProps.resultats.roi.toFixed(2)}%`);
    expect(window.location.href).toContain(`Délai de récupération: ${mockProps.resultats.delaiRecuperation.toFixed(2)} ans`);
  });
});
