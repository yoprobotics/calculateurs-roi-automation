import React, { useState } from 'react';

/**
 * Composant de pied de page avec rappel du disclaimer
 * @returns {JSX.Element} - Pied de page
 */
const Footer = () => {
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleShowDisclaimer = () => {
    // On tente d'abord d'utiliser la fonction globale pour afficher le modal principal
    if (typeof window.showDisclaimer === 'function') {
      window.showDisclaimer();
    } else {
      // Sinon, on affiche notre propre modal
      setShowDisclaimerModal(true);
    }
  };

  return (
    <>
      <footer className="bg-gray-100 mt-12 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-xl font-semibold text-gray-700">YopRobotics - Calculateurs ROI</h4>
              <p className="text-gray-600 mt-2 mb-4">
                Les calculateurs de retour sur investissement pour l'automatisation industrielle.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={handleShowDisclaimer}
                  className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none underline"
                >
                  Revoir les conditions d'utilisation
                </button>
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none underline"
                >
                  Termes et conditions
                </button>
                <button 
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none underline"
                >
                  Politique de confidentialité
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Pour toute information : <a href="mailto:info@yoprobotics.com" className="hover:underline">info@yoprobotics.com</a>
              </p>
            </div>
            
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap mb-6">
                <div className="w-full">
                  <h5 className="text-lg mt-4 lg:mt-0 font-semibold text-gray-700">Avertissement</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les résultats fournis sont à titre indicatif seulement. Une analyse approfondie par des professionnels 
                    qualifiés est toujours nécessaire avant toute décision d'investissement.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="my-6 border-gray-300" />
          
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-600">
                © {new Date().getFullYear()} YopRobotics. Tous droits réservés.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal pour l'avis de non-responsabilité */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Avis de non-responsabilité</h2>
                <button
                  onClick={() => setShowDisclaimerModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-sm text-gray-700 mb-6">
                <p className="font-bold mb-2">En utilisant ces calculateurs, vous reconnaissez et acceptez les conditions suivantes :</p>
                
                <ol className="list-decimal pl-5 space-y-2">
                  <li><span className="font-medium">Résultats indicatifs uniquement :</span> Les résultats fournis par ces calculateurs sont uniquement à titre indicatif et ne constituent pas une garantie de performance réelle.</li>
                  
                  <li><span className="font-medium">Limites des calculs :</span> Les calculs sont basés sur les données saisies et les hypothèses intégrées dans les modèles. Ils ne prennent pas en compte tous les facteurs pouvant influencer les résultats d'un projet d'automatisation réel.</li>
                  
                  <li><span className="font-medium">Conseil professionnel nécessaire :</span> Une analyse approfondie par des professionnels qualifiés est essentielle avant toute décision d'investissement basée sur ces résultats.</li>
                  
                  <li><span className="font-medium">Absence de garantie :</span> YopRobotics ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des résultats fournis pour votre situation spécifique.</li>
                  
                  <li><span className="font-medium">Limitation de responsabilité :</span> YopRobotics décline toute responsabilité quant aux décisions prises sur la base des résultats fournis par ces calculateurs. En aucun cas, YopRobotics ne pourra être tenu responsable des pertes ou dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation de ces calculateurs.</li>
                  
                  <li><span className="font-medium">Évolution des calculateurs :</span> YopRobotics se réserve le droit de modifier, mettre à jour ou supprimer tout ou partie des calculateurs et de leurs fonctionnalités sans préavis.</li>
                  
                  <li><span className="font-medium">Propriété intellectuelle :</span> Tous les contenus et fonctionnalités des calculateurs sont la propriété exclusive de YopRobotics et sont protégés par les lois sur la propriété intellectuelle.</li>
                </ol>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDisclaimerModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les termes et conditions */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Termes et conditions</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-sm text-gray-700 mb-6">
                <p className="mb-4">
                  Bienvenue sur les calculateurs ROI pour l'automatisation industrielle de YopRobotics. En utilisant cette application, vous acceptez les présents termes et conditions d'utilisation.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">1. Acceptation des conditions</h3>
                <p>
                  En accédant à cette application, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser cette application.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">2. Licence d'utilisation</h3>
                <p>
                  YopRobotics vous accorde une licence limitée, non exclusive et non transférable pour utiliser cette application à des fins professionnelles ou personnelles. Cette licence ne vous permet pas de modifier, copier, distribuer, transmettre, afficher, exécuter, reproduire, publier, concéder sous licence, créer des œuvres dérivées, transférer ou vendre les informations ou services fournis.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">3. Limitations d'utilisation</h3>
                <p>
                  Les calculateurs sont fournis en l'état, sans garantie d'aucune sorte. YopRobotics ne garantit pas l'exactitude des résultats obtenus et ne peut être tenu responsable des décisions prises sur la base de ces résultats.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">4. Contact</h3>
                <p>
                  Pour toute question concernant ces termes et conditions, veuillez nous contacter à <a href="mailto:info@yoprobotics.com" className="text-blue-600 hover:underline">info@yoprobotics.com</a>.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour la politique de confidentialité */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Politique de confidentialité</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-sm text-gray-700 mb-6">
                <p className="mb-4">
                  YopRobotics s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez nos calculateurs ROI.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">1. Collecte d'informations</h3>
                <p>
                  Les calculateurs ROI fonctionnent entièrement dans votre navigateur. Aucune donnée saisie n'est transmise à nos serveurs ou stockée de manière permanente, à l'exception de vos préférences d'utilisation (comme l'acceptation du disclaimer) qui sont stockées localement sur votre appareil.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">2. Utilisation des données</h3>
                <p>
                  Les données que vous saisissez dans nos calculateurs sont uniquement utilisées pour réaliser les calculs demandés. Ces données ne sont jamais partagées avec des tiers.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">3. Cookies et technologies similaires</h3>
                <p>
                  Nous utilisons des technologies de stockage local (comme localStorage) pour améliorer votre expérience utilisateur en mémorisant vos préférences. Vous pouvez effacer ces données à tout moment en supprimant les données de navigation de votre navigateur.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">4. Modifications de cette politique</h3>
                <p>
                  Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
                </p>
                
                <h3 className="text-lg font-medium mt-4 mb-2">5. Contact</h3>
                <p>
                  Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à <a href="mailto:info@yoprobotics.com" className="text-blue-600 hover:underline">info@yoprobotics.com</a>.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;