import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Service pour l'exportation des résultats des calculateurs
 */
const exportService = {
  /**
   * Exporte les résultats d'un calcul ROI en PDF
   * @param {string} calculateur - Nom du calculateur (général, pates-papiers, etc.)
   * @param {Object} parametres - Paramètres utilisés pour le calcul
   * @param {Object} resultats - Résultats du calcul
   * @returns {void}
   */
  exporterPDF: (calculateur, parametres, resultats) => {
    const doc = new jsPDF();
    const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(0, 70, 140);
    doc.text("Calculateur ROI - Automatisation Industrielle", 15, 20);
    
    if (calculateur === 'general') {
      doc.setFontSize(16);
      doc.text("Calculateur Général", 15, 30);
    } else if (calculateur === 'pates-papiers') {
      doc.setFontSize(16);
      doc.text("Calculateur Désempilement et Débrochage de Ballots", 15, 30);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${today}`, 15, 38);
    
    // Résumé des résultats
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text("Résumé des résultats", 15, 48);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Tableau des résultats principaux
    doc.autoTable({
      startY: 55,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['ROI', `${resultats.roi.toFixed(2)}%`],
        ['Délai de récupération', `${resultats.delaiRecuperation.toFixed(2)} ans`],
        ['VAN', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(resultats.van)}`],
        ['TRI', `${resultats.tri.toFixed(2)}%`]
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 100, 0] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Paramètres utilisés
    const lastY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 70, 140);
    doc.text("Paramètres utilisés", 15, lastY);
    
    // Transformer les paramètres en tableau
    const parametresArray = Object.entries(parametres)
      .map(([key, value]) => {
        let prettyKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        let prettyValue = typeof value === 'number' 
          ? value.toString().includes('.') 
            ? value.toFixed(2) 
            : value.toString()
          : value;
        
        // Ajouter l'unité si nécessaire
        if (key.includes('cout') || key.includes('investissement')) {
          prettyValue += ' €';
        } else if (key.includes('taux')) {
          prettyValue += ' %';
        } else if (key.includes('duree')) {
          prettyValue += ' ans';
        }
        
        return [prettyKey, prettyValue];
      });
    
    doc.autoTable({
      startY: lastY + 5,
      head: [['Paramètre', 'Valeur']],
      body: parametresArray,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 70, 140] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('YoProbotics - Calculateurs ROI pour l\'Automatisation Industrielle', 15, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Télécharger le PDF
    const filename = `ROI_${calculateur}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
    doc.save(filename);
    
    return filename;
  },
  
  /**
   * Exporte les résultats d'un calcul ROI en CSV
   * @param {string} calculateur - Nom du calculateur (général, pates-papiers, etc.)
   * @param {Object} parametres - Paramètres utilisés pour le calcul
   * @param {Object} resultats - Résultats du calcul
   * @returns {void}
   */
  exporterCSV: (calculateur, parametres, resultats) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // En-tête
    csvContent += "Calculateur ROI - Automatisation Industrielle\r\n";
    csvContent += calculateur === 'general' ? "Calculateur Général\r\n" : "Calculateur Désempilement et Débrochage de Ballots\r\n";
    csvContent += `Généré le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}\r\n\r\n`;
    
    // Résultats
    csvContent += "Résumé des résultats\r\n";
    csvContent += "Indicateur,Valeur\r\n";
    csvContent += `ROI,${resultats.roi.toFixed(2)}%\r\n`;
    csvContent += `Délai de récupération,${resultats.delaiRecuperation.toFixed(2)} ans\r\n`;
    csvContent += `VAN,${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(resultats.van)}\r\n`;
    csvContent += `TRI,${resultats.tri.toFixed(2)}%\r\n\r\n`;
    
    // Paramètres
    csvContent += "Paramètres utilisés\r\n";
    csvContent += "Paramètre,Valeur\r\n";
    
    Object.entries(parametres).forEach(([key, value]) => {
      let prettyKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      let prettyValue = typeof value === 'number' 
        ? value.toString().includes('.') 
          ? value.toFixed(2) 
          : value.toString()
        : value;
      
      // Ajouter l'unité si nécessaire
      if (key.includes('cout') || key.includes('investissement')) {
        prettyValue += ' €';
      } else if (key.includes('taux')) {
        prettyValue += ' %';
      } else if (key.includes('duree')) {
        prettyValue += ' ans';
      }
      
      csvContent += `${prettyKey},${prettyValue}\r\n`;
    });
    
    // Télécharger le CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ROI_${calculateur}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default exportService;