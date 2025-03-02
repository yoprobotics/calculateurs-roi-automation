import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Composant utilitaire pour l'export PDF des résultats du calculateur
 * Ce composant ne rend pas d'UI visible, il fournit des fonctions pour
 * générer des PDF à partir des données du calculateur
 */
const PDFExport = {
  /**
   * Génère un PDF des résultats du calculateur de pâtes et papiers
   * @param {Object} resultats - Objet contenant les résultats calculés
   * @param {Object} parametres - Objet contenant les paramètres utilisés
   * @param {string} typeSysteme - Type de système actuel (manuel, semi-auto, auto-ancien)
   * @param {string} nomEntreprise - Nom de l'entreprise (optionnel)
   */
  genererPDFPatesPapiers: async (resultats, parametres, typeSysteme, nomEntreprise = '') => {
    // Créer un nouveau document PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configuration de base
    const margeGauche = 20;
    const margeHaut = 20;
    const largeurPage = 170;
    
    // Ajout de l'en-tête
    pdf.setFontSize(18);
    pdf.setTextColor(39, 119, 91); // Vert
    pdf.text('Rapport ROI - Solution Automatisée', margeGauche, margeHaut);
    pdf.text('Désempilement et Débrochage de Ballots', margeGauche, margeHaut + 10);
    
    if (nomEntreprise) {
      pdf.setFontSize(12);
      pdf.text(`Entreprise: ${nomEntreprise}`, margeGauche, margeHaut + 20);
    }
    
    // Date du rapport
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Rapport généré le ${date}`, pdf.internal.pageSize.width - 65, margeHaut);

    // Ligne de séparation
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margeGauche, margeHaut + 25, margeGauche + largeurPage, margeHaut + 25);
    
    // Résumé des résultats
    pdf.setFontSize(14);
    pdf.setTextColor(39, 119, 91);
    pdf.text('Résumé des résultats', margeGauche, margeHaut + 35);
    
    // Tableau de résumé
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const formatterCurrency = (valeur) => {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(valeur);
    };
    
    const resultatData = [
      ['ROI global', `${resultats.roi.toFixed(2)}%`],
      ['Délai de récupération', `${resultats.delaiRecuperation.toFixed(2)} ans`],
      ['Valeur Actuelle Nette (VAN)', formatterCurrency(resultats.van)],
      ['Taux de Rendement Interne (TRI)', `${resultats.tri.toFixed(2)}%`],
      ['Économie annuelle moyenne', formatterCurrency(resultats.economieAnnuelle)],
      ['Réduction de main d\'œuvre', `${parametres.systemeAutomatise.nbEmployesRemplaces} ETP`],
      ['Réduction des accidents', `${parametres.systemeAutomatise.reductionAccidents}%`]
    ];
    
    pdf.autoTable({
      startY: margeHaut + 40,
      head: [['Indicateur', 'Valeur']],
      body: resultatData,
      theme: 'grid',
      headStyles: { fillColor: [39, 119, 91], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 85 } }
    });
    
    // Comparaison des systèmes
    pdf.setFontSize(14);
    pdf.setTextColor(39, 119, 91);
    pdf.text('Comparaison des systèmes', margeGauche, pdf.autoTable.previous.finalY + 20);
    
    // Récupérer le type de système en texte lisible
    const getSystemeText = (type) => {
      switch(type) {
        case 'manuel': return 'Manuel';
        case 'semi-auto': return 'Semi-automatisé';
        case 'auto-ancien': return 'Automatisé (ancien)';
        default: return type;
      }
    };
    
    const comparaisonData = [
      ['Capacité de traitement', 
        `${parametres.systemeActuel.capacite} ballots/h`, 
        `${parametres.systemeAutomatise.capaciteTraitement} ballots/h`],
      ['Nombre d\'employés', 
        `${parametres.systemeActuel.nombreEmployes} ETP`, 
        `${parametres.systemeActuel.nombreEmployes - parametres.systemeAutomatise.nbEmployesRemplaces} ETP`],
      ['Taux de rejets', 
        `${parametres.systemeActuel.tauxRejets}%`, 
        `${parametres.systemeAutomatise.tauxRejets}%`],
      ['Fréquence d\'accidents (par an)', 
        `${parametres.systemeActuel.frequenceAccident}`, 
        `${(parametres.systemeActuel.frequenceAccident * (1 - parametres.systemeAutomatise.reductionAccidents/100)).toFixed(2)}`]
    ];
    
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 25,
      head: [['Paramètre', `Système actuel (${getSystemeText(typeSysteme)})`, 'Solution automatisée']],