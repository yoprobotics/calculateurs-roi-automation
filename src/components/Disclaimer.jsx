import React, { useState, useEffect } from 'react';

const Disclaimer = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return isVisible ? (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Avertissement important</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p className="mb-1">
              Les résultats fournis par cet outil sont uniquement à titre indicatif et ne constituent
              en aucun cas une garantie de performance ou de résultats réels.
            </p>
            <p>
              Une analyse approfondie par des professionnels qualifiés est toujours nécessaire avant toute
              décision d'investissement. YoProbotics décline toute responsabilité quant aux décisions
              prises sur la base de ces calculs.
            </p>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="text-xs text-yellow-600 hover:text-yellow-800 font-medium"
              onClick={() => setIsVisible(false)}
            >
              Compris, ne plus afficher
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Disclaimer;