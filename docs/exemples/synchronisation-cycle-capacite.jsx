/**
 * Exemple d'implémentation de la synchronisation entre le temps de cycle et la capacité de production
 * 
 * Ce composant montre comment synchroniser automatiquement ces deux paramètres
 * tout en permettant à l'utilisateur de les modifier indépendamment.
 */

import React, { useState, useEffect } from 'react';

const SynchronisationParamètres = () => {
  // États pour les valeurs
  const [tempsCycleActuel, setTempsCycleActuel] = useState(80); // secondes/unité
  const [capaciteActuelle, setCapaciteActuelle] = useState(45); // unités/heure
  
  const [tempsCycleAutomatise, setTempsCycleAutomatise] = useState(30); // secondes/unité  
  const [capaciteAutomatisee, setCapaciteAutomatisee] = useState(120); // unités/heure
  
  // États pour contrôler la synchronisation
  const [syncActif, setSyncActif] = useState(true);
  const [dernierParamModifie, setDernierParamModifie] = useState(null);
  
  // États pour les unités personnalisables
  const [uniteProduction, setUniteProduction] = useState('unités');
  const [uniteTempsCycle, setUniteTempsCycle] = useState('secondes');
  
  // Fonction pour synchroniser le temps de cycle à partir de la capacité
  const synchroniserTempsCycleDepuisCapacite = (capacite, setTempsCycle) => {
    if (capacite > 0) {
      // 3600 secondes dans une heure
      setTempsCycle(Math.round(3600 / capacite));
    }
  };
  
  // Fonction pour synchroniser la capacité à partir du temps de cycle
  const synchroniserCapaciteDepuisTempsCycle = (tempsCycle, setCapacite) => {
    if (tempsCycle > 0) {
      setCapacite(Math.round(3600 / tempsCycle));
    }
  };
  
  // Gestionnaires d'événements pour le système actuel
  const handleTempsCycleActuelChange = (e) => {
    const valeur = Number(e.target.value);
    setTempsCycleActuel(valeur);
    setDernierParamModifie('tempsCycleActuel');
    
    // Synchroniser la capacité si la synchronisation est active
    if (syncActif && valeur > 0) {
      synchroniserCapaciteDepuisTempsCycle(valeur, setCapaciteActuelle);
    }
  };
  
  const handleCapaciteActuelleChange = (e) => {
    const valeur = Number(e.target.value);
    setCapaciteActuelle(valeur);
    setDernierParamModifie('capaciteActuelle');
    
    // Synchroniser le temps de cycle si la synchronisation est active
    if (syncActif && valeur > 0) {
      synchroniserTempsCycleDepuisCapacite(valeur, setTempsCycleActuel);
    }
  };
  
  // Gestionnaires d'événements pour le système automatisé
  const handleTempsCycleAutomatiseChange = (e) => {
    const valeur = Number(e.target.value);
    setTempsCycleAutomatise(valeur);
    setDernierParamModifie('tempsCycleAutomatise');
    
    // Synchroniser la capacité si la synchronisation est active
    if (syncActif && valeur > 0) {
      synchroniserCapaciteDepuisTempsCycle(valeur, setCapaciteAutomatisee);
    }
  };
  
  const handleCapaciteAutomatiseeChange = (e) => {
    const valeur = Number(e.target.value);
    setCapaciteAutomatisee(valeur);
    setDernierParamModifie('capaciteAutomatisee');
    
    // Synchroniser le temps de cycle si la synchronisation est active
    if (syncActif && valeur > 0) {
      synchroniserTempsCycleDepuisCapacite(valeur, setTempsCycleAutomatise);
    }
  };
  
  // Fonction pour gérer le changement d'unité de production
  const handleUniteProductionChange = (e) => {
    setUniteProduction(e.target.value);
  };
  
  // Fonction pour gérer le changement d'unité de temps de cycle
  const handleUniteTempsCycleChange = (e) => {
    setUniteTempsCycle(e.target.value);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Synchronisation des paramètres de production
      </h2>
      
      {/* Option de synchronisation */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="sync-toggle"
          checked={syncActif}
          onChange={() => setSyncActif(!syncActif)}