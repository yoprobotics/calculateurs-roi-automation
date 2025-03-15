import React from 'react';
import ComparaisonCapacite from '../graphiques/ComparaisonCapacite';
import ComparaisonEmployes from '../graphiques/ComparaisonEmployes';
import EconomiesGraphique from '../graphiques/EconomiesGraphique';
import useGraphiques from '../../hooks/useGraphiques';

/**
 * Composant pour l'onglet Analyse comparative
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element} Contenu de l'onglet Analyse comparative
 */
const AnalyseComparative = ({
  typeSystemeActuel,
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats
}) => {
  // Utilisation du hook personnalisé pour générer les données des graphiques
  const dataGraphiques = useGraphiques(
    parametresSystemeActuel,
    parametresSystemeAutomatise,
    resultats,
    parametresGeneraux
  );
  
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Analyse comparative détaillée</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700">Comparaison des systèmes</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm text-gray-600">
                  Système Actuel (
                  {typeSystemeActuel === 'manuel' ? 'Manuel' : 
                   typeSystemeActuel === 'semi-auto' ? 'Semi-auto' : 'Auto ancien'}
                  )
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Solution Automatisée</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ComparaisonCapacite data={dataGraphiques.dataComparaisonCapacite} />
            <ComparaisonEmployes data={dataGraphiques.dataComparaisonEmployes} />
          </div>
        </div>
        
        <div className="mt-8">
          <EconomiesGraphique data={dataGraphiques.dataEconomies} />
        </div>
      </div>
    </div>
  );
};

export default AnalyseComparative;