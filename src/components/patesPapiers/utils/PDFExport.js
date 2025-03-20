import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Utilitaire pour exporter les résultats du calculateur en PDF
 * @param {Object} params - Paramètres pour la génération du PDF
 * @param {Object} params.parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} params.parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} params.parametresGeneraux - Paramètres généraux
 * @param {Object} params.resultats - Résultats des calculs
 * @param {string} params.typeSystemeActuel - Type de système actuel
 * @returns {jsPDF} Instance du document PDF généré
 */
export const exporterPDF = ({
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats,
  typeSystemeActuel
}) => {
  // Initialisation du document PDF
  const doc = new jsPDF();
  
  // Ajout de l'en-tête et des informations générales
  ajouterEntete(doc);
  ajouterInformationsGenerales(doc, parametresGeneraux, typeSystemeActuel);
  
  // Ajout des résultats principaux
  ajouterResultatsPrincipaux(doc, resultats, parametresSystemeAutomatise);
  
  // Ajout des détails financiers
  ajouterDetailsFinanciers(doc, parametresSystemeAutomatise, resultats);
  
  // Ajout des informations sur la sécurité et l'environnement
  ajouterSecuriteEnvironnement(doc, parametresSystemeActuel, parametresSystemeAutomatise, resultats);
  
  // Ajout d'un pied de page
  ajouterPiedDePage(doc);
  
  return doc;
};

/**
 * Ajoute l'en-tête au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 */
const ajouterEntete = (doc) => {
  doc.setFontSize(22);
  doc.setTextColor(39, 119, 54); // Vert
  doc.text('Calculateur ROI - Pâtes et Papiers', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(90, 90, 90); // Gris
  doc.text('Solution Automatisée de Désempilement et Débrochage de Ballots', 14, 30);
  
  doc.setDrawColor(39, 119, 54); // Vert
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
};

/**
 * Ajoute les informations générales au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 * @param {Object} parametresGeneraux - Paramètres généraux
 * @param {string} typeSystemeActuel - Type de système actuel
 */
const ajouterInformationsGenerales = (doc, parametresGeneraux, typeSystemeActuel) => {
  doc.setFontSize(12);
  doc.setTextColor(39, 119, 54); // Vert
  doc.text('Informations générales', 14, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Noir
  
  // Tableau des paramètres généraux
  const typeSystemeLabel = 
    typeSystemeActuel === 'manuel' ? 'Manuel' :
    typeSystemeActuel === 'semi-auto' ? 'Semi-automatisé' : 'Automatisé (ancien)';
  
  doc.autoTable({
    startY: 50,
    head: [['Paramètre', 'Valeur']],
    body: [
      ['Type de système actuel', typeSystemeLabel],
      ['Tonnage annuel', `${parametresGeneraux.tonnageAnnuel.toLocaleString()} tonnes`],
      ['Marge brute par tonne', `$${parametresGeneraux.margeBrute.toFixed(2)}`],
      ['Heures d\'opération par jour', `${parametresGeneraux.heuresOperationParJour} heures`],
      ['Jours d\'opération par an', `${parametresGeneraux.joursOperationParAn} jours`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [39, 119, 54] },
    margin: { left: 14, right: 14 }
  });
};

/**
 * Ajoute les résultats principaux au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 * @param {Object} resultats - Résultats des calculs
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 */
const ajouterResultatsPrincipaux = (doc, resultats, parametresSystemeAutomatise) => {
  const finalY = doc.lastAutoTable.finalY || 130;
  
  doc.setFontSize(12);
  doc.setTextColor(39, 119, 54); // Vert
  doc.text('Résultats principaux', 14, finalY + 10);
  
  doc.autoTable({
    startY: finalY + 15,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['ROI global', `${resultats.roi.toFixed(2)}%`],
      ['Délai de récupération', `${resultats.delaiRecuperation.toFixed(2)} ans`],
      ['Valeur Actuelle Nette (VAN)', `$${resultats.van.toLocaleString()}`],
      ['Taux de Rendement Interne (TRI)', `${resultats.tri.toFixed(2)}%`],
      ['Économie annuelle moyenne', `$${resultats.economieAnnuelle.toLocaleString()}`],
      ['Capacité de traitement', `${parametresSystemeAutomatise.capaciteTraitement} ballots/heure`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [39, 119, 54] },
    margin: { left: 14, right: 14 }
  });
};

/**
 * Ajoute les détails financiers au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} resultats - Résultats des calculs
 */
const ajouterDetailsFinanciers = (doc, parametresSystemeAutomatise, resultats) => {
  const finalY = doc.lastAutoTable.finalY || 180;
  
  // Ajout d'une nouvelle page si nécessaire
  if (finalY > 200) {
    doc.addPage();
  } else {
    doc.setFontSize(12);
    doc.setTextColor(39, 119, 54); // Vert
    doc.text('Détails financiers', 14, finalY + 10);
  }
  
  const startY = finalY > 200 ? 20 : finalY + 15;
  
  // Tableau de l'investissement initial
  const investissementTotal = parametresSystemeAutomatise.coutSysteme + 
                              parametresSystemeAutomatise.coutInstallation + 
                              parametresSystemeAutomatise.coutIngenierie + 
                              parametresSystemeAutomatise.coutFormation - 
                              parametresSystemeAutomatise.subventions;
  
  doc.autoTable({
    startY: startY,
    head: [['Investissement initial', 'Coût ($)']],
    body: [
      ['Coût du système', parametresSystemeAutomatise.coutSysteme.toLocaleString()],
      ['Coût d\'installation', parametresSystemeAutomatise.coutInstallation.toLocaleString()],
      ['Coût d\'ingénierie', parametresSystemeAutomatise.coutIngenierie.toLocaleString()],
      ['Coût de formation', parametresSystemeAutomatise.coutFormation.toLocaleString()],
      ['Subventions', `-${parametresSystemeAutomatise.subventions.toLocaleString()}`],
      ['Total de l\'investissement', investissementTotal.toLocaleString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [39, 119, 54] },
    margin: { left: 14, right: 14 }
  });
};

/**
 * Ajoute les informations sur la sécurité et l'environnement au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 * @param {Object} parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} resultats - Résultats des calculs
 */
const ajouterSecuriteEnvironnement = (doc, parametresSystemeActuel, parametresSystemeAutomatise, resultats) => {
  const finalY = doc.lastAutoTable.finalY || 250;
  
  // Ajout d'une nouvelle page
  if (finalY > 200) {
    doc.addPage();
  }
  
  const startY = finalY > 200 ? 20 : finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(39, 119, 54); // Vert
  doc.text('Sécurité et environnement', 14, startY);
  
  // Tableau de sécurité
  doc.autoTable({
    startY: startY + 5,
    head: [['Indicateur de sécurité', 'Valeur']],
    body: [
      ['Fréquence d\'accidents actuelle', `${parametresSystemeActuel.frequenceAccident.toFixed(1)} par an`],
      ['Coût moyen par accident', `$${parametresSystemeActuel.coutMoyenAccident.toLocaleString()}`],
      ['Réduction des accidents', `${parametresSystemeAutomatise.reductionAccidents}%`],
      ['Économie annuelle due à la sécurité', `$${(resultats.economiesSecurite + resultats.economiesTempsArret).toLocaleString()}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [39, 119, 54] },
    margin: { left: 14, right: 14 }
  });
  
  // Tableau environnemental
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Indicateur environnemental', 'Valeur']],
    body: [
      ['Réduction des émissions de CO2', `${parametresSystemeAutomatise.reductionEmpreinteCO2}%`],
      ['Tonnes de CO2 économisées sur la durée de vie', `${resultats.economiesCO2.toFixed(0)} tonnes`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [39, 119, 54] },
    margin: { left: 14, right: 14 }
  });
};

/**
 * Ajoute un pied de page au document PDF
 * @param {jsPDF} doc - Instance du document PDF
 */
const ajouterPiedDePage = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 280, 196, 280);
    
    // Date et numéro de page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('fr-FR');
    doc.text(`Rapport généré le ${date}`, 14, 287);
    doc.text(`Page ${i} / ${pageCount}`, 180, 287);
  }
};
