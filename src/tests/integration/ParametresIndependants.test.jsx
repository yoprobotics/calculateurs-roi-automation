import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculateurGeneralProvider } from '../../context/CalculateurGeneralContext';
import SystemeActuel from '../../components/calculateurs/general/SystemeActuel';
import SystemeAutomatise from '../../components/calculateurs/general/SystemeAutomatise';

// Créer un composant de test qui intègre les deux systèmes
const TestIntegrationCalculateur = () => (
  <CalculateurGeneralProvider>
    <div data-testid="systeme-actuel">
      <SystemeActuel />
    </div>
    <div data-testid="systeme-automatise">
      <SystemeAutomatise />
    </div>
  </CalculateurGeneralProvider>
);

describe('Test d\'intégration des paramètres indépendants', () => {
  test('Les changements de temps de cycle et capacité restent indépendants entre les systèmes', () => {
    render(<TestIntegrationCalculateur />);
    
    // 1. Récupérer les champs pour le système actuel
    const capaciteActuelleInput = screen.getByLabelText(/Capacité/i, { 
      container: screen.getByTestId('systeme-actuel')
    });
    const tempsCycleActuelInput = screen.getByLabelText(/Temps de cycle/i, { 
      container: screen.getByTestId('systeme-actuel')
    });
    
    // 2. Récupérer les champs pour le système automatisé
    const capaciteAutomatiseeInput = screen.getByLabelText(/Capacité/i, { 
      container: screen.getByTestId('systeme-automatise')
    });
    const tempsCycleAutomatiseInput = screen.getByLabelText(/Temps de cycle/i, { 
      container: screen.getByTestId('systeme-automatise')
    });
    
    // 3. Vérifier les valeurs initiales
    const capaciteActuelleInitiale = capaciteActuelleInput.value;
    const tempsCycleActuelInitial = tempsCycleActuelInput.value;
    const capaciteAutomatiseeInitiale = capaciteAutomatiseeInput.value;
    const tempsCycleAutomatiseInitial = tempsCycleAutomatiseInput.value;
    
    // 4. Modifier la capacité du système actuel
    fireEvent.change(capaciteActuelleInput, { target: { value: '75' } });
    
    // 5. Vérifier que seule la capacité du système actuel a changé
    expect(capaciteActuelleInput.value).toBe('75');
    expect(tempsCycleActuelInput.value).toBe(tempsCycleActuelInitial);
    expect(capaciteAutomatiseeInput.value).toBe(capaciteAutomatiseeInitiale);
    expect(tempsCycleAutomatiseInput.value).toBe(tempsCycleAutomatiseInitial);
    
    // 6. Modifier le temps de cycle du système automatisé
    fireEvent.change(tempsCycleAutomatiseInput, { target: { value: '22' } });
    
    // 7. Vérifier que seul le temps de cycle du système automatisé a changé
    expect(capaciteActuelleInput.value).toBe('75');
    expect(tempsCycleActuelInput.value).toBe(tempsCycleActuelInitial);
    expect(capaciteAutomatiseeInput.value).toBe(capaciteAutomatiseeInitiale);
    expect(tempsCycleAutomatiseInput.value).toBe('22');
    
    // 8. Modifier le temps de cycle du système actuel
    fireEvent.change(tempsCycleActuelInput, { target: { value: '65' } });
    
    // 9. Vérifier que seul le temps de cycle du système actuel a changé
    expect(capaciteActuelleInput.value).toBe('75');
    expect(tempsCycleActuelInput.value).toBe('65');
    expect(capaciteAutomatiseeInput.value).toBe(capaciteAutomatiseeInitiale);
    expect(tempsCycleAutomatiseInput.value).toBe('22');
    
    // 10. Modifier la capacité du système automatisé
    fireEvent.change(capaciteAutomatiseeInput, { target: { value: '180' } });
    
    // 11. Vérifier que seule la capacité du système automatisé a changé
    expect(capaciteActuelleInput.value).toBe('75');
    expect(tempsCycleActuelInput.value).toBe('65');
    expect(capaciteAutomatiseeInput.value).toBe('180');
    expect(tempsCycleAutomatiseInput.value).toBe('22');
  });
});