import React, { useState } from 'react';
import FormulasModal from '../FormulasModal';

/**
 * Composant réutilisable pour ouvrir la documentation des formules dans un modal
 * @param {Object} props - Propriétés du composant
 * @param {string} props.document - Nom du document à afficher (formules-financieres.md, formules-calculateur-general.md)
 * @param {string} props.label - Texte du lien 
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.showIcon - Afficher l'icône d'information
 * @returns {JSX.Element} - Lien vers la documentation avec modal
 */
const DocumentationLink = ({ 
  document = 'formules-financieres.md', 
  label = 'Documentation des formules',
  className = '',
  showIcon = true
}) => {
  // État local pour gérer l'ouverture/fermeture du modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fonction pour ouvrir le modal
  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  
  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <button 
        onClick={openModal}
        className={`text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center ${className}`}
      >
        {showIcon && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {label}
      </button>
      
      {/* Modal pour afficher les formules */}
      <FormulasModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        document={document}
      />
    </>
  );
};

export default DocumentationLink;