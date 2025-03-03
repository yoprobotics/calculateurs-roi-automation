import React, { useState } from 'react';

const Footer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="bg-gray-100 py-4 px-6 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 md:mb-0">
            © {new Date().getFullYear()} YoProbotics - Calculateurs ROI Automation
          </p>
          
          <button 
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Avertissement légal
          </button>
        </div>
        
        {showDisclaimer && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="mb-2 font-medium text-blue-800">Avis de non-responsabilité</p>
            <p>
              Les résultats fournis par ces calculateurs sont uniquement à titre indicatif et ne constituent pas une garantie 
              de performance réelle. Les calculs sont basés sur les données saisies et des hypothèses qui peuvent ne pas 
              correspondre exactement à votre situation. YoProbotics décline toute responsabilité quant aux décisions 
              prises sur la base de ces résultats. Une analyse approfondie par des professionnels qualifiés est toujours 
              nécessaire avant toute prise de décision d'investissement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;