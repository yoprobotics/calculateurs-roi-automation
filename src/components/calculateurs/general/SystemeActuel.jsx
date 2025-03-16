import React, { useState, useEffect } from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';
import { TYPES_SYSTEME } from '../../../utils/constants';
import { validateParams } from '../../../utils/validationService';

/**
 * Composant pour les paramètres du système actuel
 */
const SystemeActuel = () => {
  const { 
    typeSystemeActuel, 
    setTypeSystemeActuel, 
    systemeActuel, 
    setSystemeActuel 
  } = useCalculateurGeneral();
  
  // État local pour les erreurs de validation
  const [erreurs, setErreurs] = useState({});
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    const newValue = Number(value);
    
    // Validation du nouveau paramètre
    const newSystemeActuel = {
      ...systemeActuel,
      [param]: newValue
    };
    
    // Validation du paramètre spécifique
    const parametreAValider = { [param]: newValue };
    const erreurs = validateParams(parametreAValider, systemeActuel);
    
    // Mise à jour des erreurs
    setErreurs(prevErreurs => ({
      ...prevErreurs,
      [param]: erreurs[param] || null
    }));
    
    // Si le paramètre est valide ou si c'est juste une erreur non bloquante, mettre à jour l'état
    setSystemeActuel(newSystemeActuel);
  };
  
  // Validation complète lors du changement de type de système
  useEffect(() => {
    const erreurs = validateParams(systemeActuel);
    setErreurs(erreurs);
  }, [typeSystemeActuel, systemeActuel]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        Système Actuel
      </h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Type de système actuel</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.MANUEL)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.MANUEL
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manuel
          </button>
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.SEMI_AUTO)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.SEMI_AUTO
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semi-automatisé
          </button>
          <button
            onClick={() => setTypeSystemeActuel(TYPES_SYSTEME.AUTO_ANCIEN)}
            className={`py-2 text-sm rounded-md transition-all ${
              typeSystemeActuel === TYPES_SYSTEME.AUTO_ANCIEN
                ? 'bg-red-100 text-red-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto. (ancien)
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacité (unités/heure)</label>
            <input
              type="number"
              value={systemeActuel.capacite}
              onChange={(e) => updateParametre('capacite', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.capacite ? 'border-red-500' : ''}`}
            />
            {erreurs.capacite && (
              <p className="text-xs text-red-500 mt-1">{erreurs.capacite}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
            <input
              type="number"
              value={systemeActuel.tempsCycle}
              onChange={(e) => updateParametre('tempsCycle', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tempsCycle ? 'border-red-500' : ''}`}
            />
            {erreurs.tempsCycle && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tempsCycle}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
            <p>La capacité et le temps de cycle peuvent être définis indépendamment selon le contexte de votre production.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Main d'œuvre</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre d'employés (ETP)</label>
          <input
            type="number"
            step="0.1"
            value={systemeActuel.nombreEmployes}
            onChange={(e) => updateParametre('nombreEmployes', e.target.value)}
            className={`w-full p-2 border rounded ${erreurs.nombreEmployes ? 'border-red-500' : ''}`}
          />
          {erreurs.nombreEmployes && (
            <p className="text-xs text-red-500 mt-1">{erreurs.nombreEmployes}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Équivalent temps plein</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Qualité et problèmes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Taux de rejets (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeActuel.tauxRejets}
              onChange={(e) => updateParametre('tauxRejets', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tauxRejets ? 'border-red-500' : ''}`}
            />
            {erreurs.tauxRejets && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tauxRejets}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pertes production (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeActuel.perteProduction}
              onChange={(e) => updateParametre('perteProduction', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.perteProduction ? 'border-red-500' : ''}`}
            />
            {erreurs.perteProduction && (
              <p className="text-xs text-red-500 mt-1">{erreurs.perteProduction}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Sécurité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Accidents/an</label>
            <input
              type="number"
              step="0.1"
              value={systemeActuel.frequenceAccident}
              onChange={(e) => updateParametre('frequenceAccident', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.frequenceAccident ? 'border-red-500' : ''}`}
            />
            {erreurs.frequenceAccident && (
              <p className="text-xs text-red-500 mt-1">{erreurs.frequenceAccident}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût/accident ($)</label>
            <input
              type="number"
              value={systemeActuel.coutMoyenAccident}
              onChange={(e) => updateParametre('coutMoyenAccident', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutMoyenAccident ? 'border-red-500' : ''}`}
            />
            {erreurs.coutMoyenAccident && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutMoyenAccident}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Arrêt/accident (h)</label>
            <input
              type="number"
              step="0.5"
              value={systemeActuel.tempsArretAccident}
              onChange={(e) => updateParametre('tempsArretAccident', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.tempsArretAccident ? 'border-red-500' : ''}`}
            />
            {erreurs.tempsArretAccident && (
              <p className="text-xs text-red-500 mt-1">{erreurs.tempsArretAccident}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Arrêt non planifié (h/mois)</label>
            <input
              type="number"
              step="0.5"
              value={systemeActuel.arretNonPlanifie}
              onChange={(e) => updateParametre('arretNonPlanifie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.arretNonPlanifie ? 'border-red-500' : ''}`}
            />
            {erreurs.arretNonPlanifie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.arretNonPlanifie}</p>
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
              value={systemeActuel.maintenance}
              onChange={(e) => updateParametre('maintenance', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.maintenance ? 'border-red-500' : ''}`}
            />
            {erreurs.maintenance && (
              <p className="text-xs text-red-500 mt-1">{erreurs.maintenance}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
            <input
              type="number"
              value={systemeActuel.energie}
              onChange={(e) => updateParametre('energie', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.energie ? 'border-red-500' : ''}`}
            />
            {erreurs.energie && (
              <p className="text-xs text-red-500 mt-1">{erreurs.energie}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nouvelle section pour les paramètres environnementaux */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
          </svg>
          Ressources & Environnement
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Consommation d'eau (m³/an)</label>
            <input
              type="number"
              value={systemeActuel.consommationEau}
              onChange={(e) => updateParametre('consommationEau', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationEau ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationEau && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationEau}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de l'eau ($/m³)</label>
            <input
              type="number"
              step="0.01"
              value={systemeActuel.coutEau}
              onChange={(e) => updateParametre('coutEau', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutEau ? 'border-red-500' : ''}`}
            />
            {erreurs.coutEau && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutEau}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Air comprimé (m³/an)</label>
            <input
              type="number"
              value={systemeActuel.consommationAirComprime}
              onChange={(e) => updateParametre('consommationAirComprime', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationAirComprime ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationAirComprime && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationAirComprime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût air comprimé ($/m³)</label>
            <input
              type="number"
              step="0.01"
              value={systemeActuel.coutAirComprime}
              onChange={(e) => updateParametre('coutAirComprime', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.coutAirComprime ? 'border-red-500' : ''}`}
            />
            {erreurs.coutAirComprime && (
              <p className="text-xs text-red-500 mt-1">{erreurs.coutAirComprime}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Émissions CO₂ (tonnes/an)</label>
            <input
              type="number"
              value={systemeActuel.emissionCO2}
              onChange={(e) => updateParametre('emissionCO2', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.emissionCO2 ? 'border-red-500' : ''}`}
            />
            {erreurs.emissionCO2 && (
              <p className="text-xs text-red-500 mt-1">{erreurs.emissionCO2}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Émissions directes et indirectes</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fluide hydraulique (L/an)</label>
            <input
              type="number"
              value={systemeActuel.consommationHydraulique}
              onChange={(e) => updateParametre('consommationHydraulique', e.target.value)}
              className={`w-full p-2 border rounded ${erreurs.consommationHydraulique ? 'border-red-500' : ''}`}
            />
            {erreurs.consommationHydraulique && (
              <p className="text-xs text-red-500 mt-1">{erreurs.consommationHydraulique}</p>
            )}
          </div>
        </div>
        
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
            <p>Ces données permettront d'évaluer l'impact environnemental et les économies potentielles.</p>
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

export default SystemeActuel;