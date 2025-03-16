import React, { useState, useEffect } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { validateParams, validateEmployeeReplacement } from '../../../utils/validationService';
import InfoBulle from '../../communs/InfoBulle';
import { descriptionSystemeAutomatise, descriptionParametresGeneraux } from '../../../utils/parametresDescriptions';

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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Capacité (unités/heure)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.capaciteTraitement.titre}
                texte={descriptionSystemeAutomatise.capaciteTraitement.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Temps de cycle (sec)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.tempsCycle.titre}
                texte={descriptionSystemeAutomatise.tempsCycle.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût du système ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutSysteme.titre}
                texte={descriptionSystemeAutomatise.coutSysteme.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût d'installation ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutInstallation.titre}
                texte={descriptionSystemeAutomatise.coutInstallation.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût d'ingénierie ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutIngenierie.titre}
                texte={descriptionSystemeAutomatise.coutIngenierie.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût de formation ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutFormation.titre}
                texte={descriptionSystemeAutomatise.coutFormation.description}
              />
            </label>
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
          <label className="block text-sm font-medium mb-1 flex items-center">
            Subventions ($)
            <InfoBulle 
              titre={descriptionSystemeAutomatise.subventions.titre}
              texte={descriptionSystemeAutomatise.subventions.description}
            />
          </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût annuel employé ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutMainOeuvre.titre}
                texte={descriptionSystemeAutomatise.coutMainOeuvre.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Employés remplacés (ETP)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.nbEmployesRemplaces.titre}
                texte={descriptionSystemeAutomatise.nbEmployesRemplaces.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Taux de rejets (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.tauxRejets.titre}
                texte={descriptionSystemeAutomatise.tauxRejets.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Coût par rejet ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutDechet.titre}
                texte={descriptionSystemeAutomatise.coutDechet.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Augmentation production (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.augmentationProduction.titre}
                texte={descriptionSystemeAutomatise.augmentationProduction.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Amélioration qualité (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.ameliorationQualite.titre}
                texte={descriptionSystemeAutomatise.ameliorationQualite.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction accidents (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionAccidents.titre}
                texte={descriptionSystemeAutomatise.reductionAccidents.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction temps d'arrêt (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionTempsArret.titre}
                texte={descriptionSystemeAutomatise.reductionTempsArret.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Maintenance/an ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutMaintenance.titre}
                texte={descriptionSystemeAutomatise.coutMaintenance.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Énergie/an ($)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutEnergie.titre}
                texte={descriptionSystemeAutomatise.coutEnergie.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Tonnage annuel (tonnes)
              <InfoBulle 
                titre={descriptionParametresGeneraux.tonnageAnnuel.titre}
                texte={descriptionParametresGeneraux.tonnageAnnuel.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction énergie/tonne (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionEnergie.titre}
                texte={descriptionSystemeAutomatise.reductionEnergie.description}
              />
            </label>
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
          <label className="block text-sm font-medium mb-1 flex items-center">
            Coût énergie par tonne ($/tonne)
            <InfoBulle 
              titre={descriptionSystemeAutomatise.coutEnergieTonne.titre}
              texte={descriptionSystemeAutomatise.coutEnergieTonne.description}
            />
          </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Consommation d'eau (m³/an)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.consommationEau.titre}
                texte={descriptionSystemeAutomatise.consommationEau.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction consommation eau (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionConsommationEau.titre}
                texte={descriptionSystemeAutomatise.reductionConsommationEau.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Air comprimé (m³/an)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.consommationAirComprime.titre}
                texte={descriptionSystemeAutomatise.consommationAirComprime.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction air comprimé (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionConsommationAirComprime.titre}
                texte={descriptionSystemeAutomatise.reductionConsommationAirComprime.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Émissions CO₂ (tonnes/an)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.emissionCO2.titre}
                texte={descriptionSystemeAutomatise.emissionCO2.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction empreinte CO₂ (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionEmpreinteCO2.titre}
                texte={descriptionSystemeAutomatise.reductionEmpreinteCO2.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Fluide hydraulique (L/an)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.consommationHydraulique.titre}
                texte={descriptionSystemeAutomatise.consommationHydraulique.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Réduction hydraulique (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.reductionConsommationHydraulique.titre}
                texte={descriptionSystemeAutomatise.reductionConsommationHydraulique.description}
              />
            </label>
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
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          Coûts cachés
          <InfoBulle 
            titre="Coûts souvent négligés"
            texte="Ces coûts sont fréquemment omis dans l'évaluation initiale d'un projet d'automatisation, mais peuvent représenter une part significative du coût total de possession (TCO) sur la durée de vie du système."
            position="right"
          />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              Formation continue/an
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutFormationContinue.titre}
                texte={descriptionSystemeAutomatise.coutFormationContinue.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Mises à jour logicielles
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutMisesAJour.titre}
                texte={descriptionSystemeAutomatise.coutMisesAJour.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Consommables spécifiques
              <InfoBulle 
                titre={descriptionSystemeAutomatise.coutConsommables.titre}
                texte={descriptionSystemeAutomatise.coutConsommables.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Durée de vie (années)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.dureeVie.titre}
                texte={descriptionSystemeAutomatise.dureeVie.description}
              />
            </label>
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
            <label className="block text-sm font-medium mb-1 flex items-center">
              Taux d'amortissement (%)
              <InfoBulle 
                titre={descriptionSystemeAutomatise.tauxAmortissement.titre}
                texte={descriptionSystemeAutomatise.tauxAmortissement.description}
              />
            </label>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              Taux d'inflation (%)
              <InfoBulle 
                titre={descriptionParametresGeneraux.tauxInflation.titre}
                texte={descriptionParametresGeneraux.tauxInflation.description}
              />
            </label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxInflation}
              onChange={(e) => updateParametreGeneral('tauxInflation', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tauxInflation ? 'border-red-500' : ''}`}
            />
            {erreurs.tauxInflation && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tauxInflation}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              Taux d'actualisation (%)
              <InfoBulle 
                titre={descriptionParametresGeneraux.tauxActualisation.titre}
                texte={descriptionParametresGeneraux.tauxActualisation.description}
              />
            </label>
            <input
              type="number"
              step="0.1"
              value={parametresGeneraux.tauxActualisation}
              onChange={(e) => updateParametreGeneral('tauxActualisation', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tauxActualisation ? 'border-red-500' : ''}`}
            />
            {erreurs.tauxActualisation && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tauxActualisation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lien vers la documentation des formules */}
      <div className="mt-6 text-center">
        <a 
          href="/docs/formules-calculateur-general.md" 
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Consulter la documentation détaillée des formules utilisées
        </a>
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