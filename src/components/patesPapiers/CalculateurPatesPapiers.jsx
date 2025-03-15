import React from 'react';

// Import des hooks personnalisés
import useParametres from './hooks/useParametres';
import useCalculROI from './hooks/useCalculROI';

// Import des composants d'interface
import Header from './components/Header';
import Navigation from './components/Navigation';

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
  const { resultats } = useCalculROI(
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux
  );
  
  // Fonction pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };
  
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };
  
  // Extraction des valeurs de l'UI
  const { afficherDetails, ongletActif } = ui;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* En-tête */}
      <Header capaciteTraitement={parametresSystemeAutomatise.capaciteTraitement} />
      
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
    </div>
  );
};

export default CalculateurPatesPapiers;