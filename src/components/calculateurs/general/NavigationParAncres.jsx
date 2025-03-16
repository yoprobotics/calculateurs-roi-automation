import React, { useState, useEffect } from 'react';

/**
 * Composant de navigation par ancres pour le calculateur général
 * @param {Object} props - Propriétés du composant
 * @param {string} props.sectionActive - ID de la section actuellement visible
 * @param {Function} props.setSectionActive - Fonction pour changer la section active
 * @returns {JSX.Element} - Barre de navigation par ancres
 */
const NavigationParAncres = ({ sectionActive, setSectionActive }) => {
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
  
  // Liste des sections avec leur ID et libellé
  const sections = [
    { id: 'parametres', label: 'Paramètres', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'production', label: 'Production', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'resultats', label: 'Résultats', icon: 'M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'graphiques', label: 'Graphiques', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'securite', label: 'Sécurité', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'recommandation', label: 'Conclusion', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' }
  ];

  // Fonction pour défiler vers une section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSectionActive(sectionId);
      setMenuMobileOuvert(false); // Fermer le menu mobile après sélection
    }
  };
  
  // Observer pour détecter quelle section est visible pendant le défilement
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setSectionActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="sticky top-4 z-50 bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div className="bg-blue-50 p-3 border-b border-blue-100 flex justify-between items-center">
        <h3 className="text-sm font-medium text-blue-800">Navigation du calculateur</h3>
        
        {/* Bouton menu mobile */}
        <button 
          className="md:hidden text-blue-600 focus:outline-none"
          onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {menuMobileOuvert ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Navigation desktop */}
      <div className="hidden md:flex md:flex-wrap">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all ${
              sectionActive === section.id
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
            </svg>
            {section.label}
          </button>
        ))}
      </div>
      
      {/* Navigation mobile (menu déroulant) */}
      <div className={`md:hidden ${menuMobileOuvert ? 'block' : 'hidden'}`}>
        <div className="flex flex-col">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-all ${
                sectionActive === section.id
                  ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
              </svg>
              {section.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Indicateur de section active (version mobile fermée) */}
      <div className={`md:hidden ${menuMobileOuvert ? 'hidden' : 'block'} px-4 py-2`}>
        <div className="flex items-center text-blue-600 text-sm font-medium">
          <span>Section: </span>
          <span className="ml-2 font-bold">
            {sections.find(s => s.id === sectionActive)?.label || 'Paramètres'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavigationParAncres;