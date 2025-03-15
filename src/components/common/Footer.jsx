import React from 'react';
import { useDisclaimer } from '../../context/DisclaimerContext';

/**
 * Composant de pied de page
 * @returns {JSX.Element} - Pied de page
 */
const Footer = () => {
  const { showDisclaimer } = useDisclaimer();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} YoProbotics. Tous droits réservés.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button
              onClick={showDisclaimer}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Mentions légales et avertissements
            </button>
            
            <a
              href="https://yoprobotics.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-xs text-center">
            Les résultats fournis par ces calculateurs sont uniquement à titre indicatif.
            Une analyse approfondie par des professionnels qualifiés est toujours nécessaire
            avant de prendre des décisions d'investissement.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
