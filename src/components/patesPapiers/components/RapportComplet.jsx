import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Composant pour afficher le rapport complet
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.parametresSystemeActuel - Paramètres du système actuel
 * @param {Object} props.parametresSystemeAutomatise - Paramètres du système automatisé
 * @param {Object} props.parametresGeneraux - Paramètres généraux
 * @param {Object} props.resultats - Résultats des calculs
 * @param {string} props.typeSystemeActuel - Type de système actuel
 * @returns {JSX.Element} Rapport complet
 */
const RapportComplet = ({
  parametresSystemeActuel,
  parametresSystemeAutomatise,
  parametresGeneraux,
  resultats,
  typeSystemeActuel
}) => {
  /**
   * Référence au composant pour l'exportation
   */
  const rapportRef = React.useRef(null);
  
  /**
   * Gère l'exportation du rapport complet en PDF
   */
  const handleExportRapport = async () => {
    if (rapportRef.current) {
      // Capture du contenu HTML
      const canvas = await html2canvas(rapportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Conversion en image
      const imgData = canvas.toDataURL('image/png');
      
      // Création du PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Dimensions du PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Ratio de l'image
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Ajout de l'image au PDF
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        imgWidth * ratio,
        imgHeight * ratio
      );
      
      // Téléchargement du PDF
      pdf.save(`rapport-complet-roi-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };
  
  // Extraction des valeurs pour le rapport
  const { 
    roi, delaiRecuperation, van, tri, economieAnnuelle, economiesSecurite, 
    economiesTempsArret, economiesCO2, fluxTresorerie 
  } = resultats;
  
  // Formatage du type de système actuel
  const typeSystemeLabel = 
    typeSystemeActuel === 'manuel' ? 'Manuel' :
    typeSystemeActuel === 'semi-auto' ? 'Semi-automatisé' : 'Automatisé (ancien)';
  
  // Calcul de l'investissement initial
  const investissementInitial = 
    parametresSystemeAutomatise.coutSysteme +
    parametresSystemeAutomatise.coutInstallation +
    parametresSystemeAutomatise.coutIngenierie +
    parametresSystemeAutomatise.coutFormation -
    parametresSystemeAutomatise.subventions;
  
  return (
    <div ref={rapportRef} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-0 print:p-0">
      {/* En-tête du rapport */}
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Rapport d'analyse ROI - Solution d'automatisation</h1>
        <h2 className="text-xl font-medium text-gray-700">Industrie des pâtes et papiers</h2>
        <p className="text-sm text-gray-500 mt-1">Rapport généré le {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      
      {/* Résumé exécutif */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Résumé exécutif</h3>
        <p className="mb-4 text-gray-700">
          Ce rapport présente l'analyse de retour sur investissement pour l'implémentation d'une
          solution automatisée de désempilement et débrochage de ballots, en remplacement du système
          {` ${typeSystemeLabel.toLowerCase()} `}actuel. L'analyse démontre un ROI de <strong>{roi.toFixed(2)}%</strong> avec
          un délai de récupération de <strong>{delaiRecuperation.toFixed(2)} ans</strong>.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-sm text-gray-600">ROI global</p>
            <p className="text-xl font-bold text-green-800">{roi.toFixed(2)}%</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600">Délai de récupération</p>
            <p className="text-xl font-bold text-blue-800">{delaiRecuperation.toFixed(2)} ans</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <p className="text-sm text-gray-600">VAN</p>
            <p className="text-xl font-bold text-purple-800">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(van)}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <p className="text-sm text-gray-600">TRI</p>
            <p className="text-xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      
      {/* Informations sur le système */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Système actuel */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3">Système actuel</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Type de système</td>
                <td className="py-2 font-medium">{typeSystemeLabel}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Capacité</td>
                <td className="py-2 font-medium">{parametresSystemeActuel.capacite} ballots/h</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Nombre d'employés</td>
                <td className="py-2 font-medium">{parametresSystemeActuel.nombreEmployes} ETP</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Maintenance annuelle</td>
                <td className="py-2 font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeActuel.maintenance)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Consommation d'énergie</td>
                <td className="py-2 font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeActuel.energie)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Taux de rejets</td>
                <td className="py-2 font-medium">{parametresSystemeActuel.tauxRejets}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Système automatisé */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3">Solution automatisée</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Capacité</td>
                <td className="py-2 font-medium">{parametresSystemeAutomatise.capaciteTraitement} ballots/h</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Nombre d'employés requis</td>
                <td className="py-2 font-medium">{parametresSystemeActuel.nombreEmployes - parametresSystemeAutomatise.nbEmployesRemplaces} ETP</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Maintenance annuelle</td>
                <td className="py-2 font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutMaintenance)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Consommation d'énergie</td>
                <td className="py-2 font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutEnergie)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Taux de rejets</td>
                <td className="py-2 font-medium">{parametresSystemeAutomatise.tauxRejets}%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Durée de vie estimée</td>
                <td className="py-2 font-medium">{parametresSystemeAutomatise.dureeVie} ans</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Analyse financière */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Analyse financière</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Investissement initial */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Investissement initial</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Coût du système</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutSysteme)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Coût d'installation</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutInstallation)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Coût d'ingénierie</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutIngenierie)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Coût de formation</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.coutFormation)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Subventions</td>
                  <td className="py-2 font-medium text-right text-green-600">
                    -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parametresSystemeAutomatise.subventions)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-semibold">Total</td>
                  <td className="py-2 font-bold text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(investissementInitial)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Bénéfices annuels */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Économies annuelles moyennes</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Économie annuelle totale</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Économie liée à la sécurité</td>
                  <td className="py-2 font-medium text-right">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economiesSecurite + economiesTempsArret)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Délai de récupération</td>
                  <td className="py-2 font-medium text-right">{delaiRecuperation.toFixed(2)} ans</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-800">Résultat sur la durée de vie ({parametresSystemeAutomatise.dureeVie} ans)</p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(economieAnnuelle * parametresSystemeAutomatise.dureeVie)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact environnemental et sécurité */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Impact environnemental et sécurité</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-md font-medium text-blue-800 mb-2">Sécurité des travailleurs</h4>
            <p className="mb-2 text-sm text-gray-700">
              Notre solution automatisée réduit les risques d'accidents de <strong>{parametresSystemeAutomatise.reductionAccidents}%</strong>,
              améliorant significativement la sécurité des opérateurs.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-600">Fréquence d'accidents actuelle</p>
                <p className="text-lg font-bold text-red-600">{parametresSystemeActuel.frequenceAccident.toFixed(1)}<span className="text-xs font-normal ml-1">par an</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Fréquence projetée</p>
                <p className="text-lg font-bold text-green-600">{(parametresSystemeActuel.frequenceAccident * (1 - parametresSystemeAutomatise.reductionAccidents/100)).toFixed(2)}<span className="text-xs font-normal ml-1">par an</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="text-md font-medium text-green-800 mb-2">Impact environnemental</h4>
            <p className="mb-2 text-sm text-gray-700">
              Notre système permet une réduction de <strong>{parametresSystemeAutomatise.reductionEmpreinteCO2}%</strong> des
              émissions de CO2 liées à la production.
            </p>
            <div className="mt-3">
              <p className="text-xs text-gray-600">Réduction totale des émissions sur la durée de vie</p>
              <p className="text-lg font-bold text-green-700">{economiesCO2.toFixed(0)} tonnes de CO<sub>2</sub></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton d'exportation - visible uniquement à l'écran */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={handleExportRapport}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Exporter ce rapport en PDF
        </button>
      </div>
    </div>
  );
};

export default RapportComplet;
