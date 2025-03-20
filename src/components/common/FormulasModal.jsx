import React from 'react';

/**
 * Modal pour afficher les formules financières utilisées dans les calculateurs
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture du modal
 * @param {Function} props.onClose - Fonction de fermeture du modal
 * @param {string} props.document - Document à afficher (formules-financieres.md ou formules-calculateur-general.md)
 * @returns {JSX.Element} - Modal avec les formules financières
 */
const FormulasModal = ({ isOpen, onClose, document = 'formules-financieres.md' }) => {
  if (!isOpen) return null;

  // Déterminer le titre et le contenu en fonction du document demandé
  let title = "Formules Financières";
  let content = null;

  // Contenu pour formules-financieres.md (utilisé par défaut)
  if (document === 'formules-financieres.md') {
    title = "Formules Financières";
    content = (
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">ROI (Retour sur Investissement)</h3>
        <p>Le ROI est exprimé en pourcentage et représente le ratio entre les bénéfices nets générés par l'investissement et le coût de cet investissement.</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold text-lg">
            ROI (%) = (Bénéfices nets totaux / Investissement initial) × 100
          </code>
        </div>
        <p className="text-sm text-gray-600">
          <strong>Bénéfices nets totaux</strong> : Somme des flux de trésorerie positifs sur la durée de vie du projet<br />
          <strong>Investissement initial</strong> : Coût total de l'acquisition et de l'installation du système d'automatisation
        </p>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">VAN (Valeur Actuelle Nette)</h3>
        <p>La VAN est la somme des flux de trésorerie futurs actualisés, moins l'investissement initial.</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold text-lg">
            VAN = -I₀ + Σ [CFₜ / (1 + r)ᵗ]
          </code>
        </div>
        <p className="text-sm text-gray-600">
          <strong>I₀</strong> : Investissement initial<br />
          <strong>CFₜ</strong> : Flux de trésorerie à la période t<br />
          <strong>r</strong> : Taux d'actualisation<br />
          <strong>t</strong> : Période (année)
        </p>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">TRI (Taux de Rendement Interne)</h3>
        <p>Le TRI est le taux d'actualisation pour lequel la VAN est égale à zéro.</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold text-lg">
            0 = -I₀ + Σ [CFₜ / (1 + TRI)ᵗ]
          </code>
        </div>
        <p className="text-sm text-gray-600">
          Dans notre application, le TRI est calculé par une méthode d'approximation itérative.
        </p>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Délai de récupération</h3>
        <p>Le délai de récupération est la période nécessaire pour récupérer l'investissement initial.</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold text-lg">
            Délai de récupération = A + (B / C)
          </code>
        </div>
        <p className="text-sm text-gray-600">
          <strong>A</strong> : Dernière période avec un flux de trésorerie cumulé négatif<br />
          <strong>B</strong> : Valeur absolue du flux de trésorerie cumulé à la période A<br />
          <strong>C</strong> : Flux de trésorerie de la période A+1
        </p>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Formules spécifiques à l'automatisation industrielle</h3>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies de main d'œuvre</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie annuelle = Coût annuel par employé × Nombre d'employés remplacés
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies liées à la réduction des déchets</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie annuelle = Tonnage annuel × (% Réduction des déchets / 100) × Coût par tonne de déchets
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies liées à la réduction d'énergie</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie annuelle = Tonnage annuel × (% Réduction d'énergie / 100) × Coût énergétique par tonne
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Bénéfices liés à l'augmentation de production</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Bénéfice annuel = Production annuelle × (% Augmentation de production / 100) × Marge unitaire
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Prise en compte de l'inflation</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Valeur ajustée (année n) = Valeur initiale × (1 + Taux d'inflation / 100)^(n-1)
          </code>
        </div>
      </div>
    );
  } 
  // Contenu pour formules-calculateur-general.md
  else if (document === 'formules-calculateur-general.md') {
    title = "Formules du Calculateur Général";
    content = (
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Investissement initial</h3>
        <p>L'investissement initial représente le coût total d'acquisition et de mise en place du système automatisé:</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold text-lg">
            Investissement initial = Coût du système + Coût d'installation + Coût d'ingénierie + Coût de formation - Subventions
          </code>
        </div>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Formules spécifiques à la comparaison des systèmes</h3>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies de main d'œuvre</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie annuelle = Coût annuel par employé × Nombre d'employés remplacés
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies liées à la réduction des rejets</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie annuelle = Production annuelle × (Taux de rejet actuel - Taux de rejet automatisé) / 100 × Coût par rejet
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies liées aux accidents</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie accidents = Fréquence accidents système actuel × Coût moyen par accident × Réduction accidents (%) / 100
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies liées à la réduction du temps d'arrêt</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie temps d'arrêt = Fréquence accidents × Temps d'arrêt par accident × Valeur production horaire × Réduction accidents (%) / 100
          </code>
        </div>
        <p className="text-sm text-gray-600">
          <strong>Valeur production horaire</strong> = (Production annuelle × Marge) / Heures opération annuelles
        </p>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Économies d'énergie</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Économie énergie système = Coût énergie système actuel - Coût énergie système automatisé
          </code>
        </div>
        
        <hr className="my-6" />
        
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Calcul du flux de trésorerie annuel</h3>
        <p>Le flux de trésorerie annuel intègre toutes les économies et les coûts supplémentaires:</p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Flux annuel = Économie main d'œuvre + Économie rejets + Économie accidents + Économie temps d'arrêt + Économie énergie système + Économie énergie production + Économie eau + Économie air comprimé + Bénéfice qualité + Bénéfice production - Coût maintenance - Coût énergie - Coût formation continue - Coût mises à jour - Coût consommables + Amortissement
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Prise en compte de l'inflation</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Valeur ajustée (année n) = Valeur initiale × (1 + Taux d'inflation / 100)^(n-1)
          </code>
        </div>
        
        <h4 className="text-lg font-medium text-blue-500 mb-2">Amortissement fiscal</h4>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <code className="font-semibold">
            Avantage fiscal annuel = (Investissement initial / Durée vie) × (Taux amortissement / 100)
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-700">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-6">
          {content}
        </div>
        
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulasModal;