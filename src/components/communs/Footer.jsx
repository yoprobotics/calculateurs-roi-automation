import React, { useState } from 'react';
import { showDisclaimer } from './DisclaimerModal';

const Footer = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">YopRobotics</h3>
            <p className="text-gray-400 text-sm">Solutions d'automatisation industrielle</p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => showDisclaimer()}
              className="text-gray-300 hover:text-white text-sm"
            >
              Revoir les conditions d'utilisation
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-gray-300 hover:text-white text-sm"
            >
              Termes et Conditions
            </button>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-gray-300 hover:text-white text-sm"
            >
              Politique de Confidentialité
            </button>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-400 text-sm">Contact: <a href="mailto:info@yoprobotics.com" className="hover:text-white">info@yoprobotics.com</a></p>
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} YopRobotics. Tous droits réservés.</p>
          </div>
        </div>
      </div>
      
      {/* Modal pour les Termes et Conditions */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl mx-auto text-gray-800 relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <div className="p-6 pt-10 overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-bold mb-4">Termes et Conditions</h2>
              
              <h3 className="font-bold mt-4 mb-2">1. Acceptation des Conditions</h3>
              <p className="mb-2">En utilisant l'application Calculateurs ROI Automation, vous acceptez d'être lié par ces termes et conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.</p>
              
              <h3 className="font-bold mt-4 mb-2">2. Description du Service</h3>
              <p className="mb-2">L'application Calculateurs ROI Automation fournit des outils de calcul et d'estimation pour évaluer le retour sur investissement de projets d'automatisation industrielle. Les résultats fournis sont des estimations basées sur les données saisies par l'utilisateur et des formules générales.</p>
              
              <h3 className="font-bold mt-4 mb-2">3. Limitation de Responsabilité</h3>
              <p className="mb-2">L'application est fournie "telle quelle" sans garantie d'aucune sorte. YopRobotics ne peut être tenu responsable des décisions d'investissement prises sur la base des estimations fournies par cette application.</p>
              
              <h3 className="font-bold mt-4 mb-2">4. Exactitude des Informations</h3>
              <p className="mb-2">Bien que nous nous efforcions de fournir des calculs précis, l'exactitude des résultats dépend des données saisies par l'utilisateur. YopRobotics ne garantit pas l'exactitude, l'exhaustivité ou l'utilité des estimations générées.</p>
              
              <h3 className="font-bold mt-4 mb-2">5. Modifications des Conditions</h3>
              <p className="mb-2">YopRobotics se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs sont encouragés à consulter régulièrement ces conditions.</p>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour la Politique de Confidentialité */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl mx-auto text-gray-800 relative">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <div className="p-6 pt-10 overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-bold mb-4">Politique de Confidentialité</h2>
              
              <h3 className="font-bold mt-4 mb-2">1. Collecte de Données</h3>
              <p className="mb-2">L'application Calculateurs ROI Automation enregistre localement (dans le navigateur de l'utilisateur) les paramètres saisis pour faciliter l'utilisation. Aucune donnée n'est transmise à nos serveurs.</p>
              
              <h3 className="font-bold mt-4 mb-2">2. Utilisation des Données</h3>
              <p className="mb-2">Les données saisies par l'utilisateur sont utilisées uniquement pour effectuer les calculs demandés et pour sauvegarder les paramètres entre les sessions.</p>
              
              <h3 className="font-bold mt-4 mb-2">3. Stockage Local</h3>
              <p className="mb-2">L'application utilise le stockage local (localStorage) du navigateur pour sauvegarder les paramètres saisis par l'utilisateur. Ces données restent sur l'appareil de l'utilisateur et ne sont pas accessibles par YopRobotics.</p>
              
              <h3 className="font-bold mt-4 mb-2">4. Cookies et Technologies Similaires</h3>
              <p className="mb-2">L'application n'utilise pas de cookies de suivi ou d'analyse. Seul le stockage local technique nécessaire au fonctionnement de l'application est utilisé.</p>
              
              <h3 className="font-bold mt-4 mb-2">5. Modifications de la Politique</h3>
              <p className="mb-2">YopRobotics se réserve le droit de modifier cette politique de confidentialité à tout moment. Les utilisateurs sont encouragés à consulter régulièrement cette politique.</p>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;