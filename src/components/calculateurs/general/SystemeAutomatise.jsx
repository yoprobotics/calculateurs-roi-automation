import React from 'react';
import { useCalculateurGeneral } from '../../../context/CalculateurGeneralContext';

/**
 * Composant pour les paramètres du système automatisé
 */
const SystemeAutomatise = () => {
  const { 
    systemeAutomatise, 
    setSystemeAutomatise 
  } = useCalculateurGeneral();
  
  // Fonction pour mettre à jour un paramètre spécifique
  const updateParametre = (param, value) => {
    setSystemeAutomatise({
      ...systemeAutomatise,
      [param]: Number(value)
    });
  };
  
  // Calculer le temps de cycle basé sur la capacité
  const calculerTempsCycle = (capacite) => {
    if (!capacite || capacite <= 0) return 0;
    return Math.round((3600 / capacite) * 10) / 10; // Convertir capacité/heure en secondes/unité
  };
  
  // Calculer la capacité basée sur le temps de cycle
  const calculerCapacite = (tempsCycle) => {
    if (!tempsCycle || tempsCycle <= 0) return 0;
    return Math.round((3600 / tempsCycle) * 10) / 10; // Convertir secondes/unité en capacité/heure
  };
  
  // Synchroniser temps de cycle et capacité
  const updateCapacite = (value) => {
    const capacite = Number(value);
    updateParametre('capaciteTraitement', capacite);
    updateParametre('tempsCycle', calculerTempsCycle(capacite));
  };
  
  const updateTempsCycle = (value) => {
    const tempsCycle = Number(value);
    updateParametre('tempsCycle', tempsCycle);
    updateParametre('capaciteTraitement', calculerCapacite(tempsCycle));
  };

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
              onChange={(e) => updateCapacite(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Volume de production horaire</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps de cycle (sec)</label>
            <input
              type="number"
              value={systemeAutomatise.tempsCycle}
              onChange={(e) => updateTempsCycle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Temps de traitement par unité</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-50 rounded-md text-sm text-green-800">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
            <p>La capacité réelle correspond à 100% de la capacité théorique maximum.</p>
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutInstallation}
              onChange={(e) => updateParametre('coutInstallation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutIngenierie}
              onChange={(e) => updateParametre('coutIngenierie', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutFormation}
              onChange={(e) => updateParametre('coutFormation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Subventions ($)</label>
          <input
            type="number"
            value={systemeAutomatise.subventions}
            onChange={(e) => updateParametre('subventions', e.target.value)}
            className="w-full p-2 border rounded"
          />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employés remplacés (ETP)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.nbEmployesRemplaces}
              onChange={(e) => updateParametre('nbEmployesRemplaces', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coût par rejet ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutDechet}
              onChange={(e) => updateParametre('coutDechet', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amélioration qualité (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.ameliorationQualite}
              onChange={(e) => updateParametre('ameliorationQualite', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction temps d'arrêt (%)</label>
            <input
              type="number"
              step="1"
              value={systemeAutomatise.reductionTempsArret}
              onChange={(e) => updateParametre('reductionTempsArret', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Énergie/an ($)</label>
            <input
              type="number"
              value={systemeAutomatise.coutEnergie}
              onChange={(e) => updateParametre('coutEnergie', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction consommation eau (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationEau}
              onChange={(e) => updateParametre('reductionConsommationEau', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction air comprimé (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationAirComprime}
              onChange={(e) => updateParametre('reductionConsommationAirComprime', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Émissions CO₂ (tonnes/an)</label>
            <input
              type="number"
              value={systemeAutomatise.emissionCO2}
              onChange={(e) => updateParametre('emissionCO2', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction empreinte CO₂ (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionEmpreinteCO2}
              onChange={(e) => updateParametre('reductionEmpreinteCO2', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fluide hydraulique (L/an)</label>
            <input
              type="number"
              value={systemeAutomatise.consommationHydraulique}
              onChange={(e) => updateParametre('consommationHydraulique', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Réduction hydraulique (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemeAutomatise.reductionConsommationHydraulique}
              onChange={(e) => updateParametre('reductionConsommationHydraulique', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mises à jour logicielles</label>
            <input
              type="number"
              value={systemeAutomatise.coutMisesAJour || 0}
              onChange={(e) => updateParametre('coutMisesAJour', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Consommables spécifiques</label>
            <input
              type="number"
              value={systemeAutomatise.coutConsommables || 0}
              onChange={(e) => updateParametre('coutConsommables', e.target.value)}
              className="w-full p-2 border rounded"
            />
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux d'amortissement (%)</label>
            <input
              type="number"
              step="1"
              value={systemeAutomatise.tauxAmortissement}
              onChange={(e) => updateParametre('tauxAmortissement', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemeAutomatise;