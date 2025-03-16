import React, { useState, useEffect } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { validateParams, validateEmployeeReplacement } from '../../../utils/validationService';

/**
 * Composant pour les paramètres du système automatisé
 */
const SystemeAutomatise = () => {
  const { 
    systemeAutomatise, 
    setSystemeAutomatise,
    parametresGeneraux,
    setParametresGeneraux,
    systemeActuel
  } = useCalculateurGeneral();
  
  // État local pour les erreurs de validation
  const [erreurs, setErreurs] = useState({});
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    // Conversion en nombre
    const numValue = Number(value);
    
    // Création du nouvel état
    const nouveauSystemeAutomatise = {
      ...systemeAutomatise,
      [param]: numValue
    };
    
    // Validation spécifique pour le paramètre mis à jour
    const parametreAValider = { [param]: numValue };
    const erreursParam = validateParams(parametreAValider);
    
    // Validation croisée pour le nombre d'employés remplacés
    if (param === 'nbEmployesRemplaces') {
      const erreurEmployes = validateEmployeeReplacement(numValue, systemeActuel.nombreEmployes);
      if (erreurEmployes) {
        erreursParam.nbEmployesRemplaces = erreurEmployes;
      }
    }
    
    // Mise à jour des erreurs
    setErreurs(prev => ({
      ...prev,
      [param]: erreursParam[param] || null
    }));
    
    // Mise à jour de l'état
    setSystemeAutomatise(nouveauSystemeAutomatise);
  };
  
  // Fonction pour mettre à jour un paramètre général
  const updateParametreGeneral = (param, value) => {
    const numValue = Number(value);
    
    // Validation du paramètre
    const parametreAValider = { [param]: numValue };
    const erreursParam = validateParams(parametreAValider);
    
    // Mise à jour des erreurs
    setErreurs(prev => ({
      ...prev,
      [param]: erreursParam[param] || null
    }));
    
    // Mise à jour de l'état
    setParametresGeneraux({
      ...parametresGeneraux,
      [param]: numValue
    });
  };
  
  // Validation complète lors des changements majeurs
  useEffect(() => {
    // Validation générale
    const erreursSysteme = validateParams(systemeAutomatise);
    
    // Validation croisée spécifique pour le nombre d'employés
    const erreurEmployes = validateEmployeeReplacement(
      systemeAutomatise.nbEmployesRemplaces, 
      systemeActuel.nombreEmployes
    );
    
    if (erreurEmployes) {
      erreursSysteme.nbEmployesRemplaces = erreurEmployes;
    }
    
    setErreurs(erreursSysteme);
  }, [systemeAutomatise, systemeActuel]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Système Automatisé
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
            <input
              type="number"
              value={systemeAutomatise.capaciteTraitement}
              onChange={(e) => updateParametre('capaciteTraitement', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.capaciteTraitement ? 'border-red-500' : ''}`}
            />
            {erreurs.capaciteTraitement && (
              <p className="text-xs text-red-500 mt-1">{erreurs.capaciteTraitement}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
            <input
              type="number"
              value={systemeAutomatise.tempsCycle}
              onChange={(e) => updateParametre('tempsCycle', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tempsCycle ? 'border-red-500' : ''}`}
            />
            {erreurs.tempsCycle && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tempsCycle}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
            <p>La capacité et le temps de cycle sont des paramètres indépendants qui permettent de modéliser différentes approches d'automatisation selon votre contexte spécifique.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts d'investissement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutSysteme}
              onChange={(e) => updateParametre('coutSysteme', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutSysteme ? 'border-red-500' : ''}`}
            />
            {erreurs.coutSysteme && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutSysteme}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutInstallation}
              onChange={(e) => updateParametre('coutInstallation', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutInstallation ? 'border-red-500' : ''}`}
            />
            {erreurs.coutInstallation && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutInstallation}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutIngenierie}
              onChange={(e) => updateParametre('coutIngenierie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutIngenierie ? 'border-red-500' : ''}`}
            />
            {erreurs.coutIngenierie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutIngenierie}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutFormation}
              onChange={(e) => updateParametre('coutFormation', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutFormation ? 'border-red-500' : ''}`}
            />
            {erreurs.coutFormation && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutFormation}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Subventions ($)</label>
          <input
            type="number"
            value={systemeAutomatise.subventions}
            onChange={(e) => updateParametre('subventions', e.target.value)}
            className={`w-full p-2 border rounded ${erreurs.subventions ? 'border-red-500' : ''}`}
          />
          {erreurs.subventions && (
              <p className="text-xs text-red-500 mt-1">{erreurs.subventions}</p>
            )}
          <p className="text-xs text-gray-500 mt-1">Subventions, crédits d'impôt ou autres aides financières</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Impacts sur les ressources humaines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût annuel employé ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutMainOeuvre}
              onChange={(e) => updateParametre('coutMainOeuvre', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutMainOeuvre ? 'border-red-500' : ''}`}
            />
            {erreurs.coutMainOeuvre && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutMainOeuvre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employés remplacés (ETP)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.nbEmployesRemplaces}
              onChange={(e) => updateParametre('nbEmployesRemplaces', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.nbEmployesRemplaces ? 'border-red-500' : ''}`}
            />
            {erreurs.nbEmployesRemplaces && (
              <p className="text-xs text-red-500 mt-1">{erreurs.nbEmployesRemplaces}</p>
            )}
            {!erreurs.nbEmployesRemplaces && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {systemeActuel.nombreEmployes} ETP (nombre actuel d'employés)
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Améliorations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.tauxRejets}
              onChange={(e) => updateParametre('tauxRejets', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tauxRejets ? 'border-red-500' : ''}`}
            />
            {erreurs.tauxRejets && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tauxRejets}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût par rejet ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutDechet}
              onChange={(e) => updateParametre('coutDechet', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutDechet ? 'border-red-500' : ''}`}
            />
            {erreurs.coutDechet && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutDechet}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Augmentation production (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.augmentationProduction}
              onChange={(e) => updateParametre('augmentationProduction', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.augmentationProduction ? 'border-red-500' : ''}`}
            />
            {erreurs.augmentationProduction && (
              <p className="text-xs text-red-500 mt-1">{erreurs.augmentationProduction}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.ameliorationQualite}
              onChange={(e) => updateParametre('ameliorationQualite', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.ameliorationQualite ? 'border-red-500' : ''}`}
            />
            {erreurs.ameliorationQualite && (
              <p className="text-xs text-red-500 mt-1">{erreurs.ameliorationQualite}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité et temps d'arrêt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Réduction accidents (%)</label>
            <input
              type="number"
              step="1"
              value={systemeAutomatise.reductionAccidents}
              onChange={(e) => updateParametre('reductionAccidents', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionAccidents ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionAccidents && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionAccidents}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction temps d'arrêt (%)</label>
            <input
              type="number"
              step="1"
              value={systemeAutomatise.reductionTempsArret}
              onChange={(e) => updateParametre('reductionTempsArret', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionTempsArret ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionTempsArret && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionTempsArret}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance/an ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutMaintenance}
              onChange={(e) => updateParametre('coutMaintenance', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutMaintenance ? 'border-red-500' : ''}`}
            />
            {erreurs.coutMaintenance && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutMaintenance}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutEnergie}
              onChange={(e) => updateParametre('coutEnergie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutEnergie ? 'border-red-500' : ''}`}
            />
            {erreurs.coutEnergie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutEnergie}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section pour les paramètres d'économie d'énergie qui manquaient */}
      <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Économies d'énergie dans le processus
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tonnage annuel (tonnes)</label>
            <input
              type="number"
              value={parametresGeneraux.tonnageAnnuel}
              onChange={(e) => updateParametreGeneral('tonnageAnnuel', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tonnageAnnuel ? 'border-red-500' : ''}`}
            />
            {erreurs.tonnageAnnuel && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tonnageAnnuel}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">Volume total de production annuelle</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction énergie/tonne (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionEnergie}
              onChange={(e) => updateParametre('reductionEnergie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionEnergie ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionEnergie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionEnergie}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">Réduction énergétique par tonne produite</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Coût énergie par tonne ($/tonne)</label>
          <input
            type="number"
            step="0.01"
            value={systemeAutomatise.coutEnergieTonne}
            onChange={(e) => updateParametre('coutEnergieTonne', e.target.value)}
            className={`w-full p-2 border rounded ${erreurs.coutEnergieTonne ? 'border-red-500' : ''}`}
          />
          {erreurs.coutEnergieTonne && (
            <p className="text-xs text-red-500 mt-1">{erreurs.coutEnergieTonne}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">Coût moyen de l'énergie pour produire une tonne</p>
        </div>
        
        <div className="mt-2 p-2 bg-yellow-100 rounded-md text-sm text-yellow-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-600 mr-2"></div>
            <p>Ces paramètres sont essentiels pour calculer les économies d'énergie dans le processus de production, distinctes des coûts énergétiques directs du système.</p>
          </div>
        </div>
      </div>

      {/* Nouvelle section pour les impacts environnementaux */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
          </svg>
          Impacts Environnementaux
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Consommation d'eau (m³/an)</label>
            <input
              type="number"
              value={systemeAutomatise.consommationEau}
              onChange={(e) => updateParametre('consommationEau', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationEau ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationEau && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationEau}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction consommation eau (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationEau}
              onChange={(e) => updateParametre('reductionConsommationEau', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionConsommationEau ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionConsommationEau && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionConsommationEau}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Réduction par rapport au système actuel</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Air comprimé (m³/an)</label>
            <input
              type="number"
              value={systemeAutomatise.consommationAirComprime}
              onChange={(e) => updateParametre('consommationAirComprime', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationAirComprime ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationAirComprime && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationAirComprime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction air comprimé (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationAirComprime}
              onChange={(e) => updateParametre('reductionConsommationAirComprime', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionConsommationAirComprime ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionConsommationAirComprime && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionConsommationAirComprime}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Émissions CO₂ (tonnes/an)</label>
            <input
              type="number"
              value={systemeAutomatise.emissionCO2}
              onChange={(e) => updateParametre('emissionCO2', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.emissionCO2 ? 'border-red-500' : ''}`}
            />
            {erreurs.emissionCO2 && (
              <p className="text-xs text-red-500 mt-1">{erreurs.emissionCO2}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction empreinte CO₂ (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionEmpreinteCO2}
              onChange={(e) => updateParametre('reductionEmpreinteCO2', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionEmpreinteCO2 ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionEmpreinteCO2 && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionEmpreinteCO2}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fluide hydraulique (L/an)</label>
            <input
              type="number"
              value={systemeAutomatise.consommationHydraulique}
              onChange={(e) => updateParametre('consommationHydraulique', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationHydraulique ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationHydraulique && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationHydraulique}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction hydraulique (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationHydraulique}
              onChange={(e) => updateParametre('reductionConsommationHydraulique', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.reductionConsommationHydraulique ? 'border-red-500' : ''}`}
            />
            {erreurs.reductionConsommationHydraulique && (
              <p className="text-xs text-red-500 mt-1">{erreurs.reductionConsommationHydraulique}</p>
            )}
          </div>
        </div>
        
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
            <p>L'automatisation peut réduire significativement l'empreinte environnementale de vos opérations.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Coûts cachés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Formation continue/an</label>
            <input
              type="number"
              value={systemeAutomatise.coutFormationContinue}
              onChange={(e) => updateParametre('coutFormationContinue', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutFormationContinue ? 'border-red-500' : ''}`}
            />
            {erreurs.coutFormationContinue && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutFormationContinue}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mises à jour logicielles</label>
            <input
              type="number"
              value={systemeAutomatise.coutMisesAJour || 0}
              onChange={(e) => updateParametre('coutMisesAJour', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutMisesAJour ? 'border-red-500' : ''}`}
            />
            {erreurs.coutMisesAJour && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutMisesAJour}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Consommables spécifiques</label>
            <input
              type="number"
              value={systemeAutomatise.coutConsommables || 0}
              onChange={(e) => updateParametre('coutConsommables', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutConsommables ? 'border-red-500' : ''}`}
            />
            {erreurs.coutConsommables && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutConsommables}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Paramètres financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Durée de vie (années)</label>
            <input
              type="number"
              value={systemeAutomatise.dureeVie}
              onChange={(e) => updateParametre('dureeVie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.dureeVie ? 'border-red-500' : ''}`}
            />
            {erreurs.dureeVie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.dureeVie}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'amortissement (%)</label>
            <input
              type="number"
              step="1"
              value={systemeAutomatise.tauxAmortissement}
              onChange={(e) => updateParametre('tauxAmortissement', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tauxAmortissement ? 'border-red-500' : ''}`}
            />
            {erreurs.tauxAmortissement && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tauxAmortissement}</p>
            )}
          </div>
        </div>
      </div>

      {/* Affichage d'erreurs globales si nécessaire */}
      {Object.keys(erreurs).length > 0 && (
        <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-700 mb-1">Des erreurs de validation ont été détectées :</h4>
          <ul className="text-xs text-red-600 list-disc list-inside">
            {Object.entries(erreurs).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemeAutomatise;