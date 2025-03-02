import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Composant pour l'export PDF des résultats de calcul
const PDFExport = ({ contentRef, fileName = 'resultats-roi.pdf', buttonText = 'Exporter en PDF' }) => {
  // Fonction pour générer le PDF
  const handleExport = async () => {
    if (!contentRef.current) return;
    
    try {
      // Message de chargement
      const loadingElement = document.createElement('div');
      loadingElement.style.position = 'fixed';
      loadingElement.style.top = '0';
      loadingElement.style.left = '0';
      loadingElement.style.width = '100%';
      loadingElement.style.height = '100%';
      loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      loadingElement.style.zIndex = '9999';
      loadingElement.style.display = 'flex';
      loadingElement.style.justifyContent = 'center';
      loadingElement.style.alignItems = 'center';
      
      const loadingText = document.createElement('div');
      loadingText.textContent = 'Génération du PDF en cours...';
      loadingText.style.backgroundColor = 'white';
      loadingText.style.padding = '20px';
      loadingText.style.borderRadius = '8px';
      loadingText.style.fontSize = '18px';
      
      loadingElement.appendChild(loadingText);
      document.body.appendChild(loadingElement);
      
      // Définir les options
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
      };
      
      // Capturer le contenu
      const canvas = await html2canvas(contentRef.current, options);
      
      // Créer un PDF au format A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculer le ratio d'aspect
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let position = 0;
      const maxHeight = 287; // A4 height in mm (minus margins)
      
      // Si l'image est plus grande que la hauteur d'une page
      if (imgHeight > maxHeight) {
        let remainingHeight = imgHeight;
        let currentPosition = 0;
        
        // Diviser l'image en plusieurs pages
        while (remainingHeight > 0) {
          // Créer une nouvelle page après la première
          if (position > 0) {
            pdf.addPage();
          }
          
          // Calculer la partie de l'image à rendre
          const canvasPartHeight = Math.min(maxHeight, remainingHeight);
          const partImageData = canvas.toDataURL('image/png', 1.0);
          
          pdf.addImage(
            partImageData,
            'PNG',
            0,
            position === 0 ? 0 : -currentPosition,
            imgWidth,
            imgHeight,
            '',
            'FAST'
          );
          
          // Mettre à jour la position pour la prochaine page
          remainingHeight -= maxHeight;
          position++;
          currentPosition += maxHeight;
        }
      } else {
        // L'image tient sur une seule page
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          0,
          0,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );
      }
      
      // Ajouter des métadonnées
      pdf.setProperties({
        title: 'Résultats du calculateur ROI',
        subject: 'Analyse de retour sur investissement',
        author: 'Calculateurs ROI Automation',
        keywords: 'ROI, automatisation, industrie, pâtes et papiers',
        creator: 'Calculateurs ROI Automation'
      });
      
      // Enregistrer le PDF
      pdf.save(fileName);
      
      // Supprimer le message de chargement
      document.body.removeChild(loadingElement);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  
  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
      aria-label="Exporter les résultats en PDF"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      {buttonText}
    </button>
  );
};

export default PDFExport;