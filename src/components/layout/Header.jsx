import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant d'en-tête de l'application
 */
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-green-700 text-white">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 mr-3" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Calculateurs ROI</h1>
                <p className="text-sm text-blue-100">Automatisation Industrielle</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex flex-wrap gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              Accueil
            </Link>
            <Link 
              to="/calculateurs/general" 
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              Calculateur Général
            </Link>
            <Link 
              to="/calculateurs/pates-papiers" 
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              Industrie Pâtes et Papiers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;