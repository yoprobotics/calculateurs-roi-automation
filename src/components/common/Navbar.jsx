import React, { useState } from 'react';

/**
 * Composant de barre de navigation
 * @returns {JSX.Element} - Barre de navigation
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const refreshApp = () => {
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et nom - Actualise l'application au clic */}
          <div className="flex items-center cursor-pointer" onClick={refreshApp}>
            {/* SVG Logo de YoProbotics directement inclus dans le code */}
            <svg 
              width="100" 
              height="40" 
              viewBox="0 0 400 150" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 mr-3"
            >
              <g>
                <path 
                  d="M27,20 L65,20 L65,60 L90,20 L40,100 L65,100 Z" 
                  fill="#F9DC5C" 
                  stroke="#636363" 
                  strokeWidth="5"
                />
                <rect 
                  x="100" 
                  y="20" 
                  width="60" 
                  height="80" 
                  fill="#F9DC5C" 
                  stroke="#636363" 
                  strokeWidth="5"
                />
                <path 
                  d="M170,20 L230,20 L230,60 L170,60 L170,20 Z M170,70 L230,70 L230,100 L200,100 L170,70 Z" 
                  fill="#F9DC5C" 
                  stroke="#636363" 
                  strokeWidth="5"
                />
                <path 
                  d="M240,20 L305,20 L305,35 L270,35 L270,45 L300,45 L300,60 L270,60 L270,85 L305,85 L305,100 L240,100 Z" 
                  fill="#000000"
                />
                <path 
                  d="M310,20 L345,20 C365,20 375,35 375,60 C375,85 365,100 345,100 L310,100 Z" 
                  fill="#000000"
                />
                <path 
                  d="M325,35 L340,35 C350,35 355,45 355,60 C355,75 350,85 340,85 L325,85 Z" 
                  fill="#FFFFFF"
                />
                <rect x="380,20" y="20" width="15" height="80" fill="#000000" />
                <rect x="380,45" y="45" width="30" height="15" fill="#000000" />
                <path 
                  d="M420,20 L455,20 L455,85 L475,85 L475,100 L420,100 Z" 
                  fill="#000000"
                />
                <rect x="480,20" y="20" width="15" height="80" fill="#000000" />
                <path 
                  d="M505,20 L565,20 L565,35 L550,35 L550,100 L520,100 L520,35 L505,35 Z" 
                  fill="#000000"
                />
                <rect x="570,20" y="20" width="15" height="80" fill="#000000" />
                <path 
                  d="M595,35 L620,35 L620,45 L595,45 Z M595,75 L620,75 L620,85 L595,85 Z M595,20 L635,20 L635,100 L595,100 Z" 
                  fill="#000000"
                />
                <path 
                  d="M640,100 L675,20 L685,20 L720,100 L695,100 L690,85 L670,85 L665,100 Z M675,70 L685,70 L680,55 Z" 
                  fill="#000000"
                />
              </g>
            </svg>
            <span className="text-xl font-semibold text-gray-800">Calculateurs ROI</span>
          </div>
          
          {/* Navigation principale - desktop */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://www.yoprobotics.com/formulaire1735622456560" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Réserver une consultation gratuite
            </a>
          </div>
          
          {/* Bouton menu hamburger - mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {/* Icône hamburger */}
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icône de fermeture (X) */}
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="https://www.yoprobotics.com/formulaire1735622456560"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Réserver une consultation gratuite
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;