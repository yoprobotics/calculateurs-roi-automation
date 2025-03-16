import React from 'react';

/**
 * Composant réutilisable pour lier vers la documentation
 * @param {Object} props - Propriétés du composant
 * @param {string} props.document - Chemin du document (relatif à /docs)
 * @param {string} props.label - Texte du lien 
 * @param {string} props.className - Classes CSS additionnelles
 * @returns {JSX.Element} - Lien vers la documentation
 */
const DocumentationLink = ({ 
  document = 'formules-financieres.md', 
  label = 'Documentation des formules',
  className = '',
  showIcon = true
}) => {
  // Utiliser le chemin absolu GitHub vers le fichier markdown dans le repo 
  // Cela ouvrira directement le fichier dans GitHub où il peut être visualisé
  const githubDocsUrl = `https://github.com/yoprobotics/calculateurs-roi-automation/blob/main/docs/${document}`;
  
  return (
    <a 
      href={githubDocsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center ${className}`}
    >
      {showIcon && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {label}
    </a>
  );
};

export default DocumentationLink;