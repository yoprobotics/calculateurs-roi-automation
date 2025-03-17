import React, { useState } from 'react';
import exportService from '../../services/exportService';

/**
 * Composant bouton d'export pour les calculateurs
 * @param {Object} props - Propriétés du composant
 * @param {string} props.calculateur - Nom du calculateur (general, pates-papiers)
 * @param {Object} props.parametres - Paramètres utilisés pour le calcul
 * @param {Object} props.resultats - Résultats du calcul
 */
const ExportButton = ({ calculateur, parametres, resultats }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setExported(false);
  };
  
  const handleExport = (format) => {
    setExporting(true);
    
    setTimeout(() => {
      try {
        if (format === 'pdf') {
          exportService.exporterPDF(calculateur, parametres, resultats);
        } else if (format === 'csv') {
          exportService.exporterCSV(calculateur, parametres, resultats);
        }
        
        setExported(true);
        setTimeout(() => setShowOptions(false), 2000);
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
      } finally {
        setExporting(false);
      }
    }, 500);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleOptions}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Exporter les résultats
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-2 transition-transform ${showOptions ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {showOptions && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 animate-fade-in">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {exporting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 7a1 1 0 100-2 1 1 0 000 2zm0 2a1 1 0 110 2 1 1 0 010-2zm6-2a1 1 0 100-2 1 1 0 000 2zm2 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              )}
              Exporter en PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {exporting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
              Exporter en CSV
            </button>
          </div>
          
          {exported && (
            <div className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-b-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Exporté avec succès!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportButton;