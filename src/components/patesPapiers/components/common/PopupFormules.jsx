import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant popup pour afficher les formules utilisées dans le calculateur
 * @param {Object} props - Propriétés du composant
 * @param {Boolean} props.visible - État d'affichage du popup
 * @param {Function} props.onClose - Fonction pour fermer le popup
 * @returns {JSX.Element} Popup avec explications des formules
 */
const PopupFormules = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Formules utilisées dans le calculateur</h2>
          
          <div className="space-y-8">
            {/* ROI */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">ROI (Retour sur Investissement)</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <p className="font-mono text-lg mb-2">ROI (%) = (Total des bénéfices / Investissement initial) × 100</p>
                <p className="text-gray-600 text-sm">Où :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Total des bénéfices = Somme des flux de trésorerie annuels</li>
                  <li>Investissement initial = Coût système + Installation + Ingénierie + Formation - Subventions</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg mb-2">ROI actualisé (%) = (Total des bénéfices actualisés / Investissement initial) × 100</p>
                <p className="text-gray-600 text-sm">Où les bénéfices actualisés tiennent compte de la valeur temporelle de l'argent</p>
              </div>
            </div>
            
            {/* VAN */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">VAN (Valeur Actuelle Nette)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg mb-2">VAN = -Investissement initial + Σ(Flux annuel / (1 + taux d'actualisation)^année)</p>
                <p className="text-gray-600 text-sm">Où :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Σ représente la somme sur toutes les années</li>
                  <li>Flux annuel = Économies et bénéfices - Coûts d'exploitation pour l'année donnée</li>
                </ul>
              </div>
            </div>
            
            {/* TRI */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">TRI (Taux de Rendement Interne)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg mb-2">0 = -Investissement initial + Σ(Flux annuel / (1 + TRI)^année)</p>
                <p className="text-gray-600 text-sm">Le TRI est le taux d'actualisation pour lequel la VAN est égale à zéro.</p>
                <p className="text-gray-600 text-sm mt-2">Notre calculateur utilise la méthode de Newton-Raphson pour déterminer le TRI avec précision.</p>
              </div>
            </div>
            
            {/* Délai de récupération */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Délai de récupération</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <p className="font-mono text-lg mb-2">Délai de récupération = Année + (Investissement restant / Flux annuel)</p>
                <p className="text-gray-600 text-sm">Où :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Année = La dernière année où l'investissement n'est pas encore récupéré</li>
                  <li>Investissement restant = Part de l'investissement qui reste à récupérer au début de l'année</li>
                  <li>Flux annuel = Flux de trésorerie pour l'année en cours</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg mb-2">Délai de récupération actualisé</p>
                <p className="text-gray-600 text-sm">Même principe mais utilise les flux de trésorerie actualisés</p>
              </div>
            </div>
            
            {/* Indice de rentabilité */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Indice de rentabilité (IR)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg mb-2">IR = VAN / Investissement initial</p>
                <p className="text-gray-600 text-sm">Un IR supérieur à 1 indique un projet rentable.</p>
              </div>
            </div>
            
            {/* Économies annuelles */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Économies et bénéfices annuels</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Le calcul des flux de trésorerie annuels prend en compte :</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Économies de personnel = Nombre d'employés remplacés × Coût par employé</li>
                  <li>Économies de maintenance = Maintenance actuelle - Maintenance nouvelle</li>
                  <li>Économies d'énergie = (Système actuel - Système automatisé) + Économies supplémentaires liées à l'efficacité</li>
                  <li>Économies liées aux déchets = Tonnage de déchet réduit × Coût par tonne</li>
                  <li>Bénéfices supplémentaires = Augmentation de production × Marge brute</li>
                  <li>Économies liées à la sécurité = Réduction des accidents × Coût moyen par accident</li>
                  <li>Économies liées au temps d'arrêt = Réduction du temps d'arrêt × Valeur de production horaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PopupFormules.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PopupFormules;