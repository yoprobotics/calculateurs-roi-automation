import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} YoProbotics. Tous droits réservés.
            </p>
          </div>
          <div className="text-xs text-gray-500 md:text-right">
            <p className="mb-1">
              Les résultats fournis sont uniquement à titre indicatif.
              Une analyse approfondie est toujours nécessaire.
            </p>
            <button 
              onClick={() => {
                localStorage.removeItem('disclaimerAccepted');
                window.location.reload();
              }}
              className="text-blue-600 hover:underline"
            >
              Revoir l'avis de non-responsabilité
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;