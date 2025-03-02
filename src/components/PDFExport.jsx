import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Note: Assurez-vous d'installer les dépendances requises:
// npm install jspdf jspdf-autotable html2canvas --save

/**
 * Composant pour exporter les résultats des calculateurs en PDF
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.resultats - Résultats du calculateur
 * @param {string} props.typeCalculateur - Type de calculateur ('general' ou 'patespapiers')
 * @param {Object} props.parametres - Paramètres utilisés pour le calcul
 */
const PDFExport = ({ resultats, typeCalculateur, parametres }) => {
  const exportRef = useRef(null);

  /**
   * Génère un PDF à partir des résultats du calculateur
   */
  const genererPDF = async () => {
    const { roi, delaiRecuperation, van, tri, fluxTresorerie } = resultats;

    // Création du document PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Ajout de l'en-tête
    doc.setFontSize(16);
    doc.setTextColor(20, 80, 140); // Bleu foncé
    
    const titreCalculateur = typeCalculateur === 'general' 
      ? 'Calculateur d\'Automatisation Générale' 
      : 'Calculateur de Désempilement et Débrochage de Ballots';
    
    doc.text('Rapport de Retour sur Investissement', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text(titreCalculateur, pageWidth / 2, 25, { align: 'center' });
    
    // Ajout de la date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gris
    const dateRapport = new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Rapport généré le ${dateRapport}`, pageWidth / 2, 35, { align: 'center' });
    
    // Résumé des résultats
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Résumé des résultats:', 14, 45);
    
    // Tableau des résultats principaux
    const resultatsPrincipaux = [
      ['Indicateur', 'Valeur', 'Interprétation'],
      ['ROI', `${roi.toFixed(2)}%`, roi > 100 ? 'Excellent' : roi > 50 ? 'Bon' : 'À améliorer'],
      ['Délai de récupération', `${delaiRecuperation.toFixed(2)} ans`, delaiRecuperation < 2 ? 'Excellent' : delaiRecuperation < 3 ? 'Bon' : 'À améliorer'],
      ['VAN', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(van)}`, van > 0 ? 'Projet rentable' : 'Non rentable'],
      ['TRI', `${tri.toFixed(2)}%`, tri > parametres.tauxActualisation ? 'Supérieur au taux d\'actualisation' : 'Inférieur au taux d\'actualisation']
    ];
    
    doc.autoTable({
      startY: 50,
      head: [resultatsPrincipaux[0]],
      body: resultatsPrincipaux.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [0, 90, 170], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { fontStyle: 'bold' },
        2: { cellWidth: 60 }
      }
    });
    
    // Paramètres utilisés
    doc.text('Paramètres utilisés:', 14, doc.autoTable.previous.finalY + 10);
    
    // Préparer les paramètres selon le type de calculateur
    let parametresTable = [];
    if (typeCalculateur === 'general') {
      parametresTable = [
        ['Paramètre', 'Valeur'],
        ['Coût du système', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametres.coutSysteme)}`],
        ['Coût d\'installation', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametres.coutInstallation)}`],
        ['Durée de vie', `${parametres.dureeVie} ans`],
        ['Taux d\'actualisation', `${parametres.tauxActualisation}%`],
        ['Nombre d\'employés remplacés', parametres.nbEmployesRemplaces.toFixed(1)]
      ];
    } else {
      // Paramètres spécifiques au calculateur pâtes et papiers
      parametresTable = [
        ['Paramètre', 'Valeur'],
        ['Capacité de traitement', `${parametres.capaciteTraitement} ballots/h`],
        ['Coût du système', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(parametres.coutSysteme)}`],
        ['Réduction des accidents', `${parametres.reductionAccidents}%`],
        ['Réduction des rejets', `${(parametres.tauxRejetsManuel - parametres.tauxRejets).toFixed(1)}%`],
        ['Employés remplacés', parametres.nbEmployesRemplaces.toFixed(1)]
      ];
    }
    
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [parametresTable[0]],
      body: parametresTable.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [70, 130, 180], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Tableau des flux de trésorerie
    if (fluxTresorerie && fluxTresorerie.length > 0) {
      doc.addPage();
      doc.text('Flux de trésorerie prévisionnels:', 14, 20);
      
      const fluxData = [
        ['Année', 'Flux annuel', 'Flux cumulé'],
        ...fluxTresorerie.map((flux, index) => [
          `Année ${flux.annee}`,
          `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(flux.fluxAnnuel)}`,
          `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(flux.cumulFluxTresorerie)}`
        ])
      ];
      
      doc.autoTable({
        startY: 25,
        head: [fluxData[0]],
        body: fluxData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [0, 90, 170], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
    }
    
    // Ajout d'un graphique si disponible
    if (exportRef.current) {
      try {
        const canvas = await html2canvas(exportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        doc.addPage();
        doc.text('Analyse graphique:', 14, 20);
        
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 15, 30, imgWidth, imgHeight);
      } catch (error) {
        console.error('Erreur lors de la capture du graphique:', error);
      }
    }
    
    // Ajout de la conclusion
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(20, 80, 140);
    doc.text('Conclusion et recommandations', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let conclusion = '';
    if (roi > 100 && delaiRecuperation < 3) {
      conclusion = `Ce projet d'automatisation présente un excellent retour sur investissement de ${roi.toFixed(2)}% 
      avec un délai de récupération de seulement ${delaiRecuperation.toFixed(2)} ans. 
      L'investissement est fortement recommandé.`;
    } else if (roi > 50 && delaiRecuperation < 5) {
      conclusion = `Ce projet d'automatisation présente un bon retour sur investissement de ${roi.toFixed(2)}% 
      avec un délai de récupération de ${delaiRecuperation.toFixed(2)} ans. 
      L'investissement est recommandé.`;
    } else {
      conclusion = `Ce projet d'automatisation présente un retour sur investissement de ${roi.toFixed(2)}% 
      avec un délai de récupération de ${delaiRecuperation.toFixed(2)} ans. 
      Des ajustements pourraient être nécessaires pour améliorer la rentabilité.`;
    }
    
    const splitConclusion = doc.splitTextToSize(conclusion, pageWidth - 30);
    doc.text(splitConclusion, 15, 35);
    
    // Remarques supplémentaires
    doc.text('Remarques supplémentaires:', 15, 60);
    
    const remarques = [
      `• Les calculs prennent en compte un taux d'inflation de ${parametres.tauxInflation}%.`,
      `• L'analyse est basée sur une durée de vie estimée de ${parametres.dureeVie} ans.`,
      `• Les avantages non-financiers comme l'amélioration des conditions de travail et la sécurité ne sont pas tous quantifiés.`,
      `• Consultez un expert financier pour valider ces projections avant toute décision d'investissement majeure.`
    ];
    
    let yPos = 70;
    remarques.forEach(remarque => {
      const splitRemarque = doc.splitTextToSize(remarque, pageWidth - 40);
      doc.text(splitRemarque, 20, yPos);
      yPos += splitRemarque.length * 6;
    });
    
    // Pied de page
    const nombrePages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= nombrePages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Calculateurs ROI pour l'Automatisation Industrielle - Page ${i} / ${nombrePages}`, pageWidth / 2, 287, { align: 'center' });
    }
    
    // Téléchargement du PDF
    doc.save(`rapport-roi-${typeCalculateur}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div>
      <button
        onClick={genererPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exporter en PDF
      </button>
      
      {/* Référence pour capturer le graphique (à rendre invisible si nécessaire) */}
      <div ref={exportRef} className="hidden md:block">
        {/* Conteneur pour le graphique à capturer */}
      </div>
    </div>
  );
};

export default PDFExport;