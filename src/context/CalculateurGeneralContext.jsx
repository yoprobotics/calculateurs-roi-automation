import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useCalculROI from '../hooks/useCalculROI';
import { 
  PARAMETRES_DEFAUT_SYSTEME_ACTUEL, 
  PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE,
  PARAMETRES_GENERAUX_DEFAUT,
  TYPES_SYSTEME,
  MODES_AFFICHAGE,
  MODES_ANALYSE
} from '../utils/constants';

// Création du context
const CalculateurGeneralContext = createContext();

/**
 * Provider pour le context du calculateur général
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Provider du context
 */
export const CalculateurGeneralProvider = ({ children }) => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState(TYPES_SYSTEME.MANUEL);

  // État pour les paramètres du système actuel
  const [systemeActuel, setSystemeActuel] = useState(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[TYPES_SYSTEME.MANUEL]);

  // État pour les paramètres du système automatisé
  const [systemeAutomatise, setSystemeAutomatise] = useState(PARAMETRES_DEFAUT_SYSTEME_AUTOMATISE);

  // État pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState(PARAMETRES_GENERAUX_DEFAUT);

  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    ongletActif: 'general',
    modeAffichage: MODES_AFFICHAGE.BASIQUE,
    modeAnalyse: MODES_ANALYSE.STANDARD,
    afficherDetails: false
  });

  // État pour les scénarios sauvegardés
  const [scenarios, setScenarios] = useLocalStorage('scenarios-calculateur-general', []);
  
  // État pour le scénario actif
  const [scenarioActif, setScenarioActif] = useState('actuel');
  
  // État pour le nom du scénario actuel
  const [nomScenario, setNomScenario] = useState('Scénario de base');
  
  // État pour le paramètre d'analyse de sensibilité
  const [parametreSensibilite, setParametreSensibilite] = useState('coutSysteme');
  
  // État pour la variation de sensibilité
  const [variationSensibilite, setVariationSensibilite] = useState(20);
  
  // État pour les résultats de l'analyse de sensibilité
  const [resultatsSensibilite, setResultatsSensibilite] = useState([]);

  // Calcul des résultats avec le hook personnalisé
  const resultats = useCalculROI(systemeActuel, systemeAutomatise, parametresGeneraux);

  // Mise à jour des paramètres du système actuel lorsque le type change
  useEffect(() => {
    setSystemeActuel(PARAMETRES_DEFAUT_SYSTEME_ACTUEL[typeSystemeActuel]);
  }, [typeSystemeActuel]);

  // Fonction pour changer l'onglet actif
  const changerOnglet = (onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  };

  // Fonction pour basculer l'affichage des détails
  const toggleDetails = () => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  };

  // Fonction pour changer le mode d'affichage
  const changerModeAffichage = (mode) => {
    setUi(prev => ({ ...prev, modeAffichage: mode }));
  };

  // Fonction pour changer le mode d'analyse
  const changerModeAnalyse = (mode) => {
    setUi(prev => ({ ...prev, modeAnalyse: mode }));
  };

  // Fonction pour sauvegarder un scénario
  const sauvegarderScenario = () => {
    const scenarioActuel = {
      id: Date.now().toString(),
      nom: nomScenario,
      typeSystemeActuel,
      systemeActuel,
      systemeAutomatise,
      parametresGeneraux,
      resultats: {
        roi: resultats.roi,
        delaiRecuperation: resultats.delaiRecuperation,
        van: resultats.van,
        tri: resultats.tri
      }
    };
    
    setScenarios([...scenarios, scenarioActuel]);
    setScenarioActif(scenarioActuel.id);
  };

  // Fonction pour charger un scénario
  const chargerScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setTypeSystemeActuel(scenario.typeSystemeActuel);
      setSystemeActuel(scenario.systemeActuel);
      setSystemeAutomatise(scenario.systemeAutomatise);
      setParametresGeneraux(scenario.parametresGeneraux);
      setScenarioActif(scenarioId);
      setNomScenario(scenario.nom);
    }
  };

  // Fonction pour supprimer un scénario
  const supprimerScenario = (scenarioId) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
    if (scenarioActif === scenarioId) {
      setScenarioActif('actuel');
    }
  };

  // Fonction pour calculer l'analyse de sensibilité
  const calculerSensibilite = () => {
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];
    const resultats = [];
    
    // Valeur actuelle du paramètre
    const valeurBase = {
      'coutSysteme': systemeAutomatise.coutSysteme,
      'coutInstallation': systemeAutomatise.coutInstallation,
      'coutIngenierie': systemeAutomatise.coutIngenierie,
      'coutFormation': systemeAutomatise.coutFormation,
      'nbEmployesRemplaces': systemeAutomatise.nbEmployesRemplaces,
      'augmentationProduction': systemeAutomatise.augmentationProduction,
      'coutMainOeuvre': systemeAutomatise.coutMainOeuvre,
      'capaciteTraitement': systemeAutomatise.capaciteTraitement
    }[parametreSensibilite];
    
    // Pour chaque variation, calculer les nouveaux résultats
    for (const variation of variations) {
      // Appliquer la variation
      const facteur = 1 + variation / 100;
      const valeurModifiee = valeurBase * facteur;
      
      // Créer un clone des paramètres actuels
      const systemeAutomatiseModifie = { ...systemeAutomatise };
      
      // Mettre à jour le paramètre concerné
      systemeAutomatiseModifie[parametreSensibilite] = valeurModifiee;
      
      // Calcul manuel des résultats au lieu d'utiliser le hook
      const investissementInitial = systemeAutomatiseModifie.coutSysteme + 
                                   systemeAutomatiseModifie.coutInstallation + 
                                   systemeAutomatiseModifie.coutIngenierie + 
                                   systemeAutomatiseModifie.coutFormation - 
                                   systemeAutomatiseModifie.subventions;
      
      // Calcul simplifié du ROI, VAN et délai de récupération pour l'analyse de sensibilité
      let fluxTresorerie = [];
      let cumulFluxTresorerie = 0;
      let valeurActuelleNette = -investissementInitial;
      let periodeRecuperation = parametresGeneraux.dureeVie;
      let recuperationAtteinte = false;
      
      // Facteur d'économie basé sur la modification du paramètre
      const facteurEconomie = 1 + (variation / 200); // Simplifié pour l'exemple
      
      // Calcul simplifié des flux de trésorerie pour l'analyse de sensibilité
      for (let annee = 1; annee <= systemeAutomatiseModifie.dureeVie; annee++) {
        // Calcul des économies annuelles (simplifié)
        const economiePersonnel = systemeAutomatiseModifie.coutMainOeuvre * systemeAutomatiseModifie.nbEmployesRemplaces;
        const economieQualite = parametresGeneraux.tonnageAnnuel * 0.05 * 0.1 * parametresGeneraux.margeBrute;
        const economieTempsArret = (systemeActuel.frequenceAccident * systemeActuel.tempsArretAccident * 
                                  (parametresGeneraux.tonnageAnnuel * parametresGeneraux.margeBrute) / 
                                  (parametresGeneraux.heuresOperationParJour * parametresGeneraux.joursOperationParAn)) * 
                                  (systemeAutomatiseModifie.reductionAccidents / 100);
        
        // Flux de trésorerie annuel simplifié
        const fluxAnnuel = (economiePersonnel + economieQualite + economieTempsArret) * facteurEconomie;
        
        // Actualisation
        const facteurActualisation = Math.pow(1 + parametresGeneraux.tauxActualisation / 100, annee);
        const fluxActualise = fluxAnnuel / facteurActualisation;
        
        // Mise à jour de la VAN
        valeurActuelleNette += fluxActualise;
        
        // Calcul du délai de récupération
        cumulFluxTresorerie += fluxAnnuel;
        if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
          const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
          const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
          periodeRecuperation = annee - 1 + fractionAnnee;
          recuperationAtteinte = true;
        }
        
        fluxTresorerie.push({ annee, fluxAnnuel, fluxActualise, cumulFluxTresorerie });
      }
      
      // Calcul du ROI simplifié
      const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
      const roiCalcule = (totalBenefices / investissementInitial) * 100;
      
      // Ajouter les résultats à notre tableau
      resultats.push({
        variation,
        roi: roiCalcule,
        delaiRecuperation: periodeRecuperation,
        van: valeurActuelleNette
      });
    }
    
    setResultatsSensibilite(resultats);
  };

  // Calculer l'analyse de sensibilité lorsque le paramètre change
  useEffect(() => {
    if (ui.modeAnalyse === MODES_ANALYSE.SENSIBILITE) {
      calculerSensibilite();
    }
  }, [parametreSensibilite, systemeActuel, systemeAutomatise, parametresGeneraux, ui.modeAnalyse]);

  // Valeur fournie par le context
  const value = {
    typeSystemeActuel,
    setTypeSystemeActuel,
    systemeActuel,
    setSystemeActuel,
    systemeAutomatise,
    setSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    ui,
    setUi,
    changerOnglet,
    toggleDetails,
    changerModeAffichage,
    changerModeAnalyse,
    resultats,
    scenarios,
    scenarioActif,
    nomScenario,
    setNomScenario,
    sauvegarderScenario,
    chargerScenario,
    supprimerScenario,
    parametreSensibilite,
    setParametreSensibilite,
    variationSensibilite,
    setVariationSensibilite,
    resultatsSensibilite,
    calculerSensibilite
  };

  return (
    <CalculateurGeneralContext.Provider value={value}>
      {children}
    </CalculateurGeneralContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le context du calculateur général
 * @returns {Object} - Valeurs et fonctions du context
 */
export const useCalculateurGeneral = () => {
  const context = useContext(CalculateurGeneralContext);
  
  if (context === undefined) {
    throw new Error('useCalculateurGeneral doit être utilisé à l\'intérieur d\'un CalculateurGeneralProvider');
  }
  
  return context;
};

export default CalculateurGeneralContext;
