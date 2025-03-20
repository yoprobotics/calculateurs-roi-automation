import React, { useState, useCallback, useEffect } from 'react';

// Import des hooks personnalisés
import useParametres from './hooks/useParametres';
import useCalculROI from './hooks/useCalculROI';

// Import des styles d'impression
import './styles/printStyles.css';

// Import des composants d'interface
import Header from './components/Header';
import Navigation from './components/Navigation';
import ActionButtons from './components/ActionButtons';
import RapportComplet from './components/RapportComplet';
import ResetButton from './components/ResetButton';

// Import des composants d'onglets
import VueGenerale from './components/onglets/VueGenerale';
import AnalyseComparative from './components/onglets/AnalyseComparative';
import DetailsFinanciers from './components/onglets/DetailsFinanciers';
import SecuriteEnvironnement from './components/onglets/SecuriteEnvironnement';

/**
 * Calculateur ROI optimisé pour l'industrie des pâtes et papiers
 * @returns {JSX.Element} Composant calculateur complet
 */
const CalculateurPatesPapiers = () => {
  // Utilisation des hooks personnalisés pour gérer l'état
  const {
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    ui,
    setTypeSystemeActuel,
    setParametresSystemeActuel,
    setParametresSystemeAutomatise,
    setParametresGeneraux,
    setUi
  } = useParametres();
  
  // Calcul du ROI et des résultats financiers
  const { resultats, calculerROI } = useCalculROI(
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux
  );
  
  // État pour gérer l'affichage du rapport complet
  const [afficherRapportComplet, setAfficherRapportComplet] = useState(false);
  
  // Gestion de l'impression - Afficher automatiquement le rapport complet en mode impression
  useEffect(() => {
    const handleBeforePrint = () => {
      // Active le rapport complet avant l'impression
      setAfficherRapportComplet(true);
    };
    
    window.addEventListener('beforeprint', handleBeforePrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);
  
  // Fonction pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = useCallback((onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
    // Fermeture du rapport complet lors du changement d'onglet
    setAfficherRapportComplet(false);
  }, [setUi]);
  
  const toggleDetails = useCallback(() => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  }, [setUi]);
  
  // Fonction pour basculer l'affichage du rapport complet
  const toggleRapportComplet = useCallback(() => {
    setAfficherRapportComplet(prev => !prev);
  }, []);
  
  // Extraction des valeurs de l'UI
  const { afficherDetails, ongletActif } = ui;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto print:p-0 print:shadow-none print:max-w-none">
      {/* En-tête */}
      <Header capaciteTraitement={parametresSystemeAutomatise.capaciteTraitement} />
      
      {/* Bouton pour afficher/masquer le rapport complet */}
      {!afficherRapportComplet && (
        <div className="flex justify-between mb-4">
          <ResetButton />
          <button
            onClick={toggleRapportComplet}
            className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors print:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Afficher le rapport complet
          </button>
        </div>
      )}
      
      {/* Affichage conditionnel du rapport complet ou du calculateur */}
      {afficherRapportComplet ? (
        <div>
          <div className="mb-4 print:hidden">
            <button
              onClick={toggleRapportComplet}
              className="flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Retour au calculateur
            </button>
          </div>
          <RapportComplet
            parametresSystemeActuel={parametresSystemeActuel}
            parametresSystemeAutomatise={parametresSystemeAutomatise}
            parametresGeneraux={parametresGeneraux}
            resultats={resultats}
            typeSystemeActuel={typeSystemeActuel}
          />
        </div>
      ) : (
        <>
          {/* Navigation par onglets */}
          <Navigation ongletActif={ongletActif} changerOnglet={changerOnglet} />
          
          {/* Vue générale - Premier onglet */}
          {ongletActif === 'general' && (
            <VueGenerale
              typeSystemeActuel={typeSystemeActuel}
              parametresSystemeActuel={parametresSystemeActuel}
              parametresSystemeAutomatise={parametresSystemeAutomatise}
              parametresGeneraux={parametresGeneraux}
              resultats={resultats}
              ui={ui}
              setTypeSystemeActuel={setTypeSystemeActuel}
              setParametresSystemeActuel={setParametresSystemeActuel}
              setParametresSystemeAutomatise={setParametresSystemeAutomatise}
              setParametresGeneraux={setParametresGeneraux}
              toggleDetails={toggleDetails}
            />
          )}
          
          {/* Analyse comparative - Deuxième onglet */}
          {ongletActif === 'comparatif' && (
            <AnalyseComparative
              typeSystemeActuel={typeSystemeActuel}
              parametresSystemeActuel={parametresSystemeActuel}
              parametresSystemeAutomatise={parametresSystemeAutomatise}
              parametresGeneraux={parametresGeneraux}
              resultats={resultats}
            />
          )}
          
          {/* Détails financiers - Troisième onglet */}
          {ongletActif === 'financier' && (
            <DetailsFinanciers
              parametresSystemeActuel={parametresSystemeActuel}
              parametresSystemeAutomatise={parametresSystemeAutomatise}
              parametresGeneraux={parametresGeneraux}
              resultats={resultats}
            />
          )}
          
          {/* Sécurité & Environnement - Quatrième onglet */}
          {ongletActif === 'securite' && (
            <SecuriteEnvironnement
              parametresSystemeActuel={parametresSystemeActuel}
              parametresSystemeAutomatise={parametresSystemeAutomatise}
              resultats={resultats}
            />
          )}
          
          {/* Boutons d'action pour l'exportation et l'impression */}
          <ActionButtons
            parametresSystemeActuel={parametresSystemeActuel}
            parametresSystemeAutomatise={parametresSystemeAutomatise}
            parametresGeneraux={parametresGeneraux}
            resultats={resultats}
            typeSystemeActuel={typeSystemeActuel}
          />
        </>
      )}
      
      {/* Affichage d'une note en pied de page - uniquement visible à l'impression */}
      <div className="hidden print:block mt-8 text-xs text-gray-500 text-center">
        <p>Calculateur ROI - Industrie des pâtes et papiers</p>
        <p>Rapport généré le {new Date().toLocaleDateString('fr-FR')}</p>
        <p>yoprobotics.com</p>
      </div>
    </div>
  );
};

export default CalculateurPatesPapiers;