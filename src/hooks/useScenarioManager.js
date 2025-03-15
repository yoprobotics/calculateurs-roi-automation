import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour la gestion des scénarios de calcul
 * @param {string} storageKey - Clé pour le stockage local des scénarios
 * @returns {Object} - Fonctions et état pour la gestion des scénarios
 */
const useScenarioManager = (storageKey = 'calculateurs-roi-scenarios') => {
  // État pour les scénarios
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState('current');
  const [scenarioName, setScenarioName] = useState('Scénario de base');
  
  // Charger les scénarios depuis le localStorage au chargement
  useEffect(() => {
    try {
      const savedScenarios = localStorage.getItem(storageKey);
      if (savedScenarios) {
        setScenarios(JSON.parse(savedScenarios));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des scénarios:', error);
    }
  }, [storageKey]);
  
  // Sauvegarder les scénarios dans le localStorage lors des changements
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des scénarios:', error);
    }
  }, [scenarios, storageKey]);
  
  /**
   * Sauvegarde un nouveau scénario
   * @param {Object} scenarioData - Données du scénario à sauvegarder
   * @param {string} name - Nom du scénario (optionnel)
   * @returns {string} - ID du nouveau scénario
   */
  const saveScenario = (scenarioData, name = scenarioName) => {
    const newScenario = {
      id: Date.now().toString(),
      name,
      data: scenarioData,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };
    
    setScenarios(prevScenarios => [...prevScenarios, newScenario]);
    return newScenario.id;
  };
  
  /**
   * Met à jour un scénario existant
   * @param {string} id - ID du scénario à mettre à jour
   * @param {Object} scenarioData - Nouvelles données du scénario
   * @param {string} name - Nouveau nom du scénario (optionnel)
   * @returns {boolean} - Succès de la mise à jour
   */
  const updateScenario = (id, scenarioData, name) => {
    let success = false;
    
    setScenarios(prevScenarios => {
      const index = prevScenarios.findIndex(s => s.id === id);
      if (index >= 0) {
        const updatedScenarios = [...prevScenarios];
        updatedScenarios[index] = {
          ...updatedScenarios[index],
          name: name || updatedScenarios[index].name,
          data: scenarioData,
          modifiedAt: new Date().toISOString()
        };
        success = true;
        return updatedScenarios;
      }
      return prevScenarios;
    });
    
    return success;
  };
  
  /**
   * Supprime un scénario
   * @param {string} id - ID du scénario à supprimer
   * @returns {boolean} - Succès de la suppression
   */
  const deleteScenario = (id) => {
    let success = false;
    
    setScenarios(prevScenarios => {
      const index = prevScenarios.findIndex(s => s.id === id);
      if (index >= 0) {
        const updatedScenarios = [...prevScenarios];
        updatedScenarios.splice(index, 1);
        success = true;
        
        // Si le scénario actif est supprimé, revenir au scénario courant
        if (activeScenarioId === id) {
          setActiveScenarioId('current');
        }
        
        return updatedScenarios;
      }
      return prevScenarios;
    });
    
    return success;
  };
  
  /**
   * Charge un scénario et le définit comme actif
   * @param {string} id - ID du scénario à charger
   * @returns {Object|null} - Données du scénario ou null si non trouvé
   */
  const loadScenario = (id) => {
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      setActiveScenarioId(id);
      setScenarioName(scenario.name);
      return scenario.data;
    }
    return null;
  };
  
  /**
   * Récupère un scénario par son ID
   * @param {string} id - ID du scénario à récupérer
   * @returns {Object|null} - Scénario trouvé ou null
   */
  const getScenarioById = (id) => {
    return scenarios.find(s => s.id === id) || null;
  };
  
  /**
   * Duplique un scénario existant
   * @param {string} id - ID du scénario à dupliquer
   * @returns {string|null} - ID du nouveau scénario ou null si échec
   */
  const duplicateScenario = (id) => {
    const scenario = getScenarioById(id);
    if (scenario) {
      const newName = `${scenario.name} (copie)`;
      return saveScenario(scenario.data, newName);
    }
    return null;
  };
  
  /**
   * Exporte tous les scénarios au format JSON
   * @returns {string} - Chaîne JSON des scénarios
   */
  const exportScenarios = () => {
    return JSON.stringify(scenarios);
  };
  
  /**
   * Importe des scénarios depuis une chaîne JSON
   * @param {string} jsonString - Chaîne JSON à importer
   * @returns {boolean} - Succès de l'importation
   */
  const importScenarios = (jsonString) => {
    try {
      const importedScenarios = JSON.parse(jsonString);
      if (Array.isArray(importedScenarios)) {
        setScenarios(prevScenarios => [...prevScenarios, ...importedScenarios]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'importation des scénarios:', error);
      return false;
    }
  };
  
  /**
   * Compare deux scénarios
   * @param {string} id1 - ID du premier scénario
   * @param {string} id2 - ID du deuxième scénario
   * @returns {Object|null} - Résultat de la comparaison ou null si échec
   */
  const compareScenarios = (id1, id2) => {
    const scenario1 = getScenarioById(id1);
    const scenario2 = getScenarioById(id2);
    
    if (!scenario1 || !scenario2) {
      return null;
    }
    
    // Exemple simple de comparaison - à adapter selon les besoins spécifiques
    const comparison = {
      roi: {
        scenario1: scenario1.data.resultats?.roi || 0,
        scenario2: scenario2.data.resultats?.roi || 0,
        difference: (scenario1.data.resultats?.roi || 0) - (scenario2.data.resultats?.roi || 0)
      },
      delaiRecuperation: {
        scenario1: scenario1.data.resultats?.delaiRecuperation || 0,
        scenario2: scenario2.data.resultats?.delaiRecuperation || 0,
        difference: (scenario1.data.resultats?.delaiRecuperation || 0) - (scenario2.data.resultats?.delaiRecuperation || 0)
      },
      investissement: {
        scenario1: calculateInvestissement(scenario1.data),
        scenario2: calculateInvestissement(scenario2.data),
        difference: calculateInvestissement(scenario1.data) - calculateInvestissement(scenario2.data)
      }
    };
    
    return comparison;
  };
  
  /**
   * Calcule l'investissement total d'un scénario
   * @param {Object} scenarioData - Données du scénario
   * @returns {number} - Montant de l'investissement
   */
  const calculateInvestissement = (scenarioData) => {
    const systemParams = scenarioData.parametresSystemeAutomatise || {};
    return (systemParams.coutSysteme || 0) +
           (systemParams.coutInstallation || 0) +
           (systemParams.coutIngenierie || 0) +
           (systemParams.coutFormation || 0) +
           (systemParams.coutLogiciel || 0) -
           (systemParams.subventions || 0);
  };
  
  return {
    scenarios,
    activeScenarioId,
    scenarioName,
    setScenarioName,
    saveScenario,
    updateScenario,
    deleteScenario,
    loadScenario,
    getScenarioById,
    duplicateScenario,
    exportScenarios,
    importScenarios,
    compareScenarios
  };
};

export default useScenarioManager;
