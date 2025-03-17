import React, { useState } from 'react';
import logo from '../../logo.png';

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
            <img src={logo} alt="YoProbotics" className="h-8 w-auto mr-3" />
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