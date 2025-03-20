import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResetButton from '../components/ResetButton';
import { clearCalculatorStorage } from '../hooks/useStorage';

// Mock de la fonction clearCalculatorStorage
jest.mock('../hooks/useStorage', () => ({
  clearCalculatorStorage: jest.fn()
}));

// Mock de la fonction window.location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn()
  }
});

describe('Composant ResetButton', () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });
  
  test('Devrait afficher le bouton de réinitialisation', () => {
    // Rendu du composant
    render(<ResetButton />);
    
    // Vérification que le bouton est affiché
    expect(screen.getByText(/Réinitialiser le calculateur/i)).toBeInTheDocument();
  });
  
  test('Devrait afficher la confirmation au clic sur le bouton', () => {
    // Rendu du composant
    render(<ResetButton />);
    
    // Clic sur le bouton de réinitialisation
    fireEvent.click(screen.getByText(/Réinitialiser le calculateur/i));
    
    // Vérification que la confirmation est affichée
    expect(screen.getByText(/Réinitialiser tous les paramètres ?/i)).toBeInTheDocument();
    expect(screen.getByText('Oui')).toBeInTheDocument();
    expect(screen.getByText('Non')).toBeInTheDocument();
  });
  
  test('Devrait appeler clearCalculatorStorage et recharger la page au clic sur Oui', () => {
    // Rendu du composant
    render(<ResetButton />);
    
    // Clic sur le bouton de réinitialisation
    fireEvent.click(screen.getByText(/Réinitialiser le calculateur/i));
    
    // Clic sur le bouton Oui
    fireEvent.click(screen.getByText('Oui'));
    
    // Vérification que clearCalculatorStorage a été appelé
    expect(clearCalculatorStorage).toHaveBeenCalled();
    
    // Vérification que window.location.reload a été appelé
    expect(window.location.reload).toHaveBeenCalled();
  });
  
  test('Devrait masquer la confirmation au clic sur Non', () => {
    // Rendu du composant
    render(<ResetButton />);
    
    // Clic sur le bouton de réinitialisation
    fireEvent.click(screen.getByText(/Réinitialiser le calculateur/i));
    
    // Vérification que la confirmation est affichée
    expect(screen.getByText(/Réinitialiser tous les paramètres ?/i)).toBeInTheDocument();
    
    // Clic sur le bouton Non
    fireEvent.click(screen.getByText('Non'));
    
    // Vérification que la confirmation n'est plus affichée
    expect(screen.queryByText(/Réinitialiser tous les paramètres ?/i)).not.toBeInTheDocument();
    
    // Vérification que le bouton de réinitialisation est à nouveau affiché
    expect(screen.getByText(/Réinitialiser le calculateur/i)).toBeInTheDocument();
    
    // Vérification que clearCalculatorStorage n'a pas été appelé
    expect(clearCalculatorStorage).not.toHaveBeenCalled();
    
    // Vérification que window.location.reload n'a pas été appelé
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
