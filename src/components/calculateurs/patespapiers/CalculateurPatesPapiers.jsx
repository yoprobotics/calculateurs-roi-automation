import React, { useState, useEffect, createContext, useCallback } from 'react';
import ParametresSysteme from './ParametresSysteme';
import ComparatifSystemes from './ComparatifSystemes';
import ResultatsFinanciers from './ResultatsFinanciers';
import ImpactEnvironnemental from './ImpactEnvironnemental';
import { 
  sauvegarderParametres, 
  chargerParametres,
  validerParametres,
  calculerFluxActualise,
  formaterMontant
} from '../../../utils/patesPapiersHelpers';

// Création du contexte pour partager les états entre les composants
export const CalculateurPapierContext = createContext();

// Calculateur optimisé pour l'industrie des pâtes et papiers
const CalculateurPatesPapiers = () => {
  // État pour le type de système actuel
  const [typeSystemeActuel, setTypeSystemeActuel] = useState('manuel');
  
  // États regroupés par catégorie pour réduire le nombre de useState
  const [parametresSystemeActuel, setParametresSystemeActuel] = useState({
    capacite: 45, // ballots/heure
    nombreEmployes: 2.5, // ETP
    coutSysteme: 85000, // Coût d'un système semi-auto
    maintenance: 18000, // $/an
    energie: 9500, // $/an
    perteProduction: 8, // % perte due aux arrêts et retards
    tauxRejets: 8, // % de rejets
    frequenceAccident: 5.2, // accidents par an
    coutMoyenAccident: 12500, // coût moyen par accident
    tempsArretAccident: 24 // heures d'arrêt par accident
  });
  
  // États pour les données d'entrée - Paramètres spécifiques
  const [parametresSystemeAutomatise, setParametresSystemeAutomatise] = useState({
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
  });
  
  // États pour les paramètres généraux
  const [parametresGeneraux, setParametresGeneraux] = useState({
    margeBrute: 110,
    tauxInflation: 2,
    tauxActualisation: 5,
    tonnageAnnuel: 20000,
    heuresOperationParJour: 16,
    joursOperationParAn: 300
  });
  
  // États pour les résultats
  const [resultats, setResultats] = useState({
    fluxTresorerie: [],
    roi: 0,
    delaiRecuperation: 0,
    van: 0,
    tri: 0,
    economiesCO2: 0,
    differenceProduction: 0,
    economieAnnuelle: 0,
    reductionMainOeuvre: 0,
    economiesSecurite: 0,
    economiesQualite: 0,
    economiesTempsArret: 0
  });
  
  // État pour l'interface utilisateur
  const [ui, setUi] = useState({
    afficherDetails: false,
    ongletActif: 'general',
    erreurs: [],
    notification: null
  });
  
  // Chargement des paramètres depuis le localStorage au démarrage
  useEffect(() => {
    const parametresSauvegardes = chargerParametres();
    if (parametresSauvegardes) {
      try {
        // Mettre à jour les états avec les paramètres sauvegardés
        setTypeSystemeActuel(parametresSauvegardes.typeSystemeActuel);
        setParametresSystemeActuel(parametresSauvegardes.parametresSystemeActuel);
        setParametresSystemeAutomatise(parametresSauvegardes.parametresSystemeAutomatise);
        setParametresGeneraux(parametresSauvegardes.parametresGeneraux);
        
        // Afficher une notification de succès
        setUi(prev => ({
          ...prev,
          notification: {
            type: 'success',
            message: `Paramètres chargés (sauvegardés le ${new Date(parametresSauvegardes.dateEnregistrement).toLocaleString()})`,
            duree: 5000
          }
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        setUi(prev => ({
          ...prev,
          notification: {
            type: 'error',
            message: 'Erreur lors du chargement des paramètres sauvegardés',
            duree: 5000
          }
        }));
      }
    }
  }, []);
  
  // Effet pour fermer automatiquement les notifications après leur durée
  useEffect(() => {
    if (ui.notification) {
      const timer = setTimeout(() => {
        setUi(prev => ({ ...prev, notification: null }));
      }, ui.notification.duree);
      
      return () => clearTimeout(timer);
    }
  }, [ui.notification]);
  
  // Fonction qui adapte les paramètres par défaut en fonction du type de système actuel
  useEffect(() => {
    if (typeSystemeActuel === 'manuel') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 45,
        nombreEmployes: 2.5,
        coutSysteme: 15000, 
        maintenance: 6000,
        energie: 4000,
        tauxRejets: 8,
        perteProduction: 12,
        frequenceAccident: 5.2
      });
    } else if (typeSystemeActuel === 'semi-auto') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 80,
        nombreEmployes: 1.5,
        coutSysteme: 120000,
        maintenance: 18000,
        energie: 8000,
        tauxRejets: 5.5,
        perteProduction: 8,
        frequenceAccident: 3.8
      });
    } else if (typeSystemeActuel === 'auto-ancien') {
      setParametresSystemeActuel({
        ...parametresSystemeActuel,
        capacite: 100,
        nombreEmployes: 1,
        coutSysteme: 250000,
        maintenance: 25000,
        energie: 10000,
        tauxRejets: 4.2,
        perteProduction: 5,
        frequenceAccident: 1.5
      });
    }
  }, [typeSystemeActuel]);
  
  // Fonction de calcul des résultats
  const calculerROI = useCallback(() => {
    // Valider les paramètres avant calcul
    const validationActuel = validerParametres(parametresSystemeActuel);
    const validationAutomatise = validerParametres(parametresSystemeAutomatise);
    const validationGeneraux = validerParametres(parametresGeneraux);
    
    // Combiner toutes les erreurs
    const erreursCombinees = [
      ...validationActuel.erreurs,
      ...validationAutomatise.erreurs,
      ...validationGeneraux.erreurs
    ];
    
    // Mettre à jour les erreurs dans l'UI
    setUi(prev => ({ ...prev, erreurs: erreursCombinees }));
    
    // Ne pas procéder au calcul si des erreurs sont présentes
    if (erreursCombinees.length > 0) {
      return;
    }
    
    const {
      coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, 
      coutEnergie, dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
      reductionDechet, coutDechet, augmentationProduction, reductionEnergie,
      coutEnergieTonne, reductionEau, coutEauTonne, ameliorationQualite,
      reductionEmpreinteCO2, capaciteTraitement, tauxRejets, reductionAccidents,
      subventions
    } = parametresSystemeAutomatise;

    const {
      capacite, nombreEmployes, maintenance: maintenanceActuelle, 
      energie: energieActuelle, perteProduction, tauxRejets: tauxRejetsManuel,
      frequenceAccident, coutMoyenAccident, tempsArretAccident
    } = parametresSystemeActuel;

    const {
      margeBrute, tauxInflation, tauxActualisation, tonnageAnnuel,
      heuresOperationParJour, joursOperationParAn
    } = parametresGeneraux;
    
    // Calcul de l'investissement initial
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    
    // Initialisation des variables
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul du nombre d'heures d'opération par an
    const heuresOperationAnnuelles = heuresOperationParJour * joursOperationParAn;
    
    // Calcul de la production annuelle (actuelle vs automatisée)
    const productionActuelle = capacite * heuresOperationAnnuelles * (1 - perteProduction / 100);
    const productionAutomatisee = capaciteTraitement * heuresOperationAnnuelles;
    const differenceProductionCalc = productionAutomatisee - productionActuelle;
    
    // Calcul des économies d'accidents
    const economiesAccidents = (frequenceAccident * coutMoyenAccident * reductionAccidents / 100);
    
    // Calcul des économies liées au temps d'arrêt dû aux accidents
    const valeurProductionHoraire = (tonnageAnnuel * margeBrute) / heuresOperationAnnuelles;
    const economiesTempsArretCalc = frequenceAccident * tempsArretAccident * valeurProductionHoraire * reductionAccidents / 100;
    
    // Calcul de la réduction de main d'œuvre
    const reductionMainOeuvreCalc = (nombreEmployes - (nombreEmployes - nbEmployesRemplaces)) * coutMainOeuvre;
    
    // Variable pour stocker le bénéfice de qualité de la dernière année (pour l'affichage)
    let dernierBeneficeQualite = 0;
    
    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const maintenanceActuelleAjustee = maintenanceActuelle * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const energieActuelleAjustee = energieActuelle * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = reductionMainOeuvreCalc * facteurInflation;
      const economieMaintenance = maintenanceActuelleAjustee - maintenanceAnnuelle;
      const economieEnergie = energieActuelleAjustee - energieOperationAnnuelle;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (tonnageAnnuel * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets (fils vs manuel)
      const economieRejets = tonnageAnnuel * (tauxRejetsManuel - tauxRejets) / 100 * coutDechet * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie dans le processus
      const economieEnergieProcessus = (tonnageAnnuel * reductionEnergie / 100) * coutEnergieTonne * facteurInflation;
      
      // Économies liées à la réduction de consommation d'eau
      const economieEau = (tonnageAnnuel * reductionEau / 100) * coutEauTonne * facteurInflation;
      
      // Bénéfices liés à l'augmentation de la production
      const productionSupplementaire = tonnageAnnuel * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeBrute * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (tonnageAnnuel * ameliorationQualite / 100) * (margeBrute * 0.2) * facteurInflation;
      
      // Stockage de la dernière valeur pour l'affichage
      if (annee === dureeVie) {
        dernierBeneficeQualite = beneficeQualite;
      }
      
      // Économies liées à la sécurité (ajustées pour l'inflation)
      const economieSecuriteAjustee = economiesAccidents * facteurInflation;
      const economieTempsArretAjustee = economiesTempsArretCalc * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (en tonnes)
      const tonnesCO2Economisees = (tonnageAnnuel * reductionEmpreinteCO2 / 100);
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieMaintenance + economieEnergie + 
                       economieEnergieProcessus + economieEau + economieRejets +
                       beneficeSupplementaire + beneficeQualite + 
                       economieSecuriteAjustee + economieTempsArretAjustee - 
                       maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
      
      // Calcul du flux de trésorerie actualisé
      const fluxActualise = calculerFluxActualise(fluxAnnuel, tauxActualisation, annee);
      
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
      
      // Ajout des résultats annuels
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie,
        economiePersonnel,
        economieDechet,
        economieMaintenance,
        economieEnergie,
        economieEnergieProcessus,
        economieEau,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        economieSecuriteAjustee,
        economieTempsArretAjustee,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        amortissement,
        tonnesCO2Economisees
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = 0;
    for (let r = 1; r <= 100; r++) {
      let npv = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + r / 100, t + 1);
      }
      if (npv <= 0) {
        triApprox = r - 1;
        break;
      }
    }
    
    // Calcul de l'économie annuelle moyenne
    const economieAnnuelleCalc = totalBenefices / dureeVie;
    
    // Mise à jour des résultats
    setResultats({
      fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees,
      differenceProduction: differenceProductionCalc,
      economieAnnuelle: economieAnnuelleCalc,
      reductionMainOeuvre: reductionMainOeuvreCalc,
      economiesSecurite: economiesAccidents,
      economiesQualite: dernierBeneficeQualite,
      economiesTempsArret: economiesTempsArretCalc
    });
  }, [parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Sauvegarde automatique des paramètres lorsqu'ils changent
  useEffect(() => {
    const success = sauvegarderParametres(
      typeSystemeActuel,
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux
    );
    
    if (success) {
      // Notification discrète de sauvegarde
      setUi(prev => ({
        ...prev,
        notification: {
          type: 'info',
          message: 'Paramètres sauvegardés automatiquement',
          duree: 3000
        }
      }));
    }
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux]);
  
  // Calcul initial et lors des changements des paramètres principaux
  useEffect(() => {
    calculerROI();
  }, [typeSystemeActuel, parametresSystemeActuel, parametresSystemeAutomatise, parametresGeneraux, calculerROI]);
  
  // Fonctions pour changer l'onglet et afficher/masquer les détails
  const changerOnglet = useCallback((onglet) => {
    setUi(prev => ({ ...prev, ongletActif: onglet }));
  }, []);
  
  const toggleDetails = useCallback(() => {
    setUi(prev => ({ ...prev, afficherDetails: !prev.afficherDetails }));
  }, []);
  
  // Création d'un objet contexte avec tous les états et fonctions à partager
  const contextValue = {
    // États
    typeSystemeActuel,
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    parametresGeneraux,
    resultats,
    ui,
    
    // Fonctions de mise à jour
    setTypeSystemeActuel,
    setParametresSystemeActuel,
    setParametresSystemeAutomatise,
    setParametresGeneraux,
    setUi,
    changerOnglet,
    toggleDetails,
    
    // Fonctions de calcul
    calculerROI,
    
    // Fonctions utilitaires
    formaterMontant
  };
  
  return (
    <CalculateurPapierContext.Provider value={contextValue}>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
        {/* Notification */}
        {ui.notification && (
          <div className={`mb-4 p-3 rounded-lg ${
            ui.notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            ui.notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {ui.notification.type === 'success' && (
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {ui.notification.type === 'error' && (
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {ui.notification.type === 'info' && (
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{ui.notification.message}</span>
              </div>
              <button
                onClick={() => setUi(prev => ({ ...prev, notification: null }))}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Affichage des erreurs */}
        {ui.erreurs.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-200 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {ui.erreurs.length} erreur(s) détectée(s)
            </h3>
            <ul className="list-disc list-inside pl-2">
              {ui.erreurs.map((erreur, index) => (
                <li key={index} className="text-sm">{erreur}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* En-tête */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Solution Automatisée de Désempilement et Débrochage de Ballots</h2>
              <p className="mb-4 text-gray-700">Notre système automatisé haute performance transforme votre chaîne de production avec un ROI en moins de 2 ans.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-3 rounded-lg shadow-md text-center">
                <p className="font-bold text-gray-700">Efficacité maximale</p>
                <p className="text-3xl font-bold text-green-600">{parametresSystemeAutomatise.capaciteTraitement} ballots/h</p>
                <p className="text-xs text-gray-500">30 secondes par opération</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">ROI Rapide</h3>
              <p className="text-gray-600 text-sm mb-2">ROI inférieur à 2 ans avec des économies sur la main d'œuvre et l'amélioration de la qualité.</p>
              <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {resultats.delaiRecuperation <= 2 ? "ROI < 2 ans ✓" : `ROI: ${resultats.delaiRecuperation.toFixed(1)} ans`}
              </span>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-blue-100 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Sécurité Améliorée</h3>
              <p className="text-gray-600 text-sm mb-2">Réduction des risques d'accidents grâce à l'automatisation des tâches dangereuses.</p>
              <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Réduction des accidents de {parametresSystemeAutomatise.reductionAccidents}%
              </span>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-purple-100 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Productivité Maximale</h3>
              <p className="text-gray-600 text-sm mb-2">Augmentation de la capacité et réduction des temps d'arrêt grâce à une alimentation continue.</p>
              <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {parametresSystemeAutomatise.capaciteTraitement} ballots/heure
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation par onglets */}
        <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md">
          <button
            onClick={() => changerOnglet('general')}
            className={`px-4 py-3 font-medium transition-all ${
              ui.ongletActif === 'general'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Vue générale
          </button>
          <button
            onClick={() => changerOnglet('comparatif')}
            className={`px-4 py-3 font-medium transition-all ${
              ui.ongletActif === 'comparatif'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Analyse comparative
          </button>
          <button
            onClick={() => changerOnglet('financier')}
            className={`px-4 py-3 font-medium transition-all ${
              ui.ongletActif === 'financier'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Détails financiers
          </button>
          <button
            onClick={() => changerOnglet('securite')}
            className={`px-4 py-3 font-medium transition-all ${
              ui.ongletActif === 'securite'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Sécurité & Environnement
          </button>
        </div>
        
        {/* Composants modulaires selon l'onglet actif */}
        {ui.ongletActif === 'general' && <ParametresSysteme />}
        {ui.ongletActif === 'comparatif' && <ComparatifSystemes />}
        {ui.ongletActif === 'financier' && <ResultatsFinanciers />}
        {ui.ongletActif === 'securite' && <ImpactEnvironnemental />}
      </div>
    </CalculateurPapierContext.Provider>
  );
};

export default CalculateurPatesPapiers;