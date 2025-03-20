import React from 'react';
import { exporterPDF } from '../utils/PDFExport';

/**
 * Composant pour les boutons d'action du calculateur
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} props.parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} props.parametresGeneraux - Paramètres généraux
 * @param {Object} props.resultats - Résultats des calculs
 * @param {string} props.typeSystemeActuel - Type de système actuel
 * @returns {JSX.Element} Boutons d'action
 */
const ActionButtons = ({
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats,
  typeSystemeActuel
}) => {
  /**
   * Gère l'exportation du PDF
   */
  const handleExportPDF = () => {
    // Génération du PDF
    const doc = exporterPDF({
      parametresSystemeActuel,
      parametresSystemeAutomatise,
      parametresGeneraux,
      resultats,
      typeSystemeActuel
    });
    
    // Nom du fichier
    const fileName = `calculateur-roi-pates-papiers-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Téléchargement du PDF
    doc.save(fileName);
  };
  
  /**
   * Gère l'impression du calculateur
   */
  const handlePrint = () => {
    window.print();
  };
  
  /**
   * Partage le rapport par email
   */
  const handleShareByEmail = () => {
    const subject = 'Rapport ROI - Solution automatisée pour Pâtes et Papiers';
    
    const body = `
Bonjour,

Voici les résultats du calculateur ROI pour notre projet d'automatisation:

- ROI global: ${resultats.roi.toFixed(2)}%
- Délai de récupération: ${resultats.delaiRecuperation.toFixed(2)} ans
- Valeur Actuelle Nette (VAN): $${resultats.van.toLocaleString()}
- Économie annuelle: $${resultats.economieAnnuelle.toLocaleString()}

Pour plus de détails, veuillez consulter le rapport PDF ci-joint.

Cordialement,
    `;
    
    // Ouverture du client de messagerie par défaut
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  return (
    <div className="flex flex-wrap gap-2 justify-end mt-6">
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Exporter en PDF
      </button>
      
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        Imprimer
      </button>
      
      <button
        onClick={handleShareByEmail}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Partager par email
      </button>
    </div>
  );
};

export default ActionButtons;
