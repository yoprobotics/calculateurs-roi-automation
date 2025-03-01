import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Calculateur spécifique à l'industrie des pâtes et papiers
const CalculateurPatesPapiers = () => {
  // États pour les données d'entrée - Paramètres spécifiques à l'industrie des pâtes et papiers
  const [coutSysteme, setCoutSysteme] = useState(380000);
  const [coutInstallation, setCoutInstallation] = useState(45000);
  const [coutIngenierie, setCoutIngenierie] = useState(25000);
  const [coutFormation, setCoutFormation] = useState(15000);
  const [coutMaintenance, setCoutMaintenance] = useState(12000);
  const [coutEnergie, setCoutEnergie] = useState(6500);
  const [dureeVie, setDureeVie] = useState(15);
  const [tauxAmortissement, setTauxAmortissement] = useState(15);
  const [coutMainOeuvre, setCoutMainOeuvre] = useState(55000);
  const [nbEmployesRemplaces, setNbEmployesRemplaces] = useState(2);
  const [reductionDechet, setReductionDechet] = useState(14);
  const [coutDechet, setCoutDechet] = useState(230);
  const [tonnageAnnuel, setTonnageAnnuel] = useState(20000);
  const [augmentationProduction, setAugmentationProduction] = useState(10);
  const [reductionEnergie, setReductionEnergie] = useState(12);
  const [coutEnergieTonne, setCoutEnergieTonne] = useState(40);
  const [reductionEau, setReductionEau] = useState(8);
  const [coutEauTonne, setCoutEauTonne] = useState(4.5);
  const [ameliorationQualite, setAmeliorationQualite] = useState(5);
  const [margeBrute, setMargeBrute] = useState(110);
  const [tauxInflation, setTauxInflation] = useState(2);
  const [tauxActualisation, setTauxActualisation] = useState(5);
  const [subventions, setSubventions] = useState(40000);
  const [reductionEmpreinteCO2, setReductionEmpreinteCO2] = useState(7);
  const [capaciteTraitement, setCapaciteTraitement] = useState(120);
  const [tauxRejetsFils, setTauxRejetsFils] = useState(3.5);
  const [tauxRejetsManuel, setTauxRejetsManuel] = useState(8);
  const [coutRejets, setCoutRejets] = useState(85);
  
  // États pour les résultats
  const [resultatAnnuel, setResultatAnnuel] = useState([]);
  const [roi, setRoi] = useState(0);
  const [delaiRecuperation, setDelaiRecuperation] = useState(0);
  const [van, setVan] = useState(0);
  const [tri, setTri] = useState(0);
  const [economiesCO2, setEconomiesCO2] = useState(0);
  
  // Fonction de calcul des résultats optimisée avec useCallback
  const calculerROI = useCallback(() => {
    const investissementInitial = coutSysteme + coutInstallation + coutIngenierie + coutFormation - subventions;
    let fluxTresorerie = [];
    let cumulFluxTresorerie = 0;
    let valeurActuelleNette = -investissementInitial;
    let periodeRecuperation = dureeVie;
    let recuperationAtteinte = false;
    let totalTonnesCO2Economisees = 0;
    
    // Calcul des économies annuelles et bénéfices
    for (let annee = 1; annee <= dureeVie; annee++) {
      // Calcul des coûts ajustés avec l'inflation
      const facteurInflation = Math.pow(1 + tauxInflation / 100, annee - 1);
      const maintenanceAnnuelle = coutMaintenance * facteurInflation;
      const energieOperationAnnuelle = coutEnergie * facteurInflation;
      const coutEmployeAnnuel = coutMainOeuvre * facteurInflation;
      
      // Calcul des économies
      const economiePersonnel = coutEmployeAnnuel * nbEmployesRemplaces;
      
      // Économies liées à la réduction des déchets
      const tonnageDechetReduit = (tonnageAnnuel * reductionDechet) / 100;
      const economieDechet = tonnageDechetReduit * coutDechet * facteurInflation;
      
      // Économies liées à la réduction des rejets (fils vs manuel)
      const economieRejets = tonnageAnnuel * (tauxRejetsManuel - tauxRejetsFils) / 100 * coutRejets * facteurInflation;
      
      // Économies liées à la réduction de consommation d'énergie
      const economieEnergie = (tonnageAnnuel * reductionEnergie / 100) * coutEnergieTonne * facteurInflation;
      
      // Économies liées à la réduction de consommation d'eau
      const economieEau = (tonnageAnnuel * reductionEau / 100) * coutEauTonne * facteurInflation;
      
      // Calcul des bénéfices supplémentaires
      const productionSupplementaire = tonnageAnnuel * (augmentationProduction / 100);
      const beneficeSupplementaire = productionSupplementaire * margeBrute * facteurInflation;
      
      // Bénéfices liés à l'amélioration de la qualité (moins de retours, meilleure réputation)
      const beneficeQualite = (tonnageAnnuel * ameliorationQualite / 100) * (margeBrute * 0.2) * facteurInflation;
      
      // Calcul de la réduction des émissions de CO2 (en tonnes)
      const tonnesCO2Economisees = (tonnageAnnuel * reductionEmpreinteCO2 / 100);
      totalTonnesCO2Economisees += tonnesCO2Economisees;
      
      // Amortissement
      const amortissement = (investissementInitial / dureeVie) * (tauxAmortissement / 100);
      
      // Calcul du flux de trésorerie annuel
      const fluxAnnuel = economiePersonnel + economieDechet + economieEnergie + economieEau + 
                       beneficeSupplementaire + beneficeQualite + economieRejets - 
                       maintenanceAnnuelle - energieOperationAnnuelle + amortissement;
      
      // Calcul du flux de trésorerie actualisé
      const facteurActualisation = Math.pow(1 + tauxActualisation / 100, annee);
      const fluxActualise = fluxAnnuel / facteurActualisation;
      
      // Mise à jour de la VAN
      valeurActuelleNette += fluxActualise;
      
      // Calcul du délai de récupération
      cumulFluxTresorerie += fluxAnnuel;
      if (cumulFluxTresorerie >= investissementInitial && !recuperationAtteinte) {
        const cumulPrecedent = cumulFluxTresorerie - fluxAnnuel;
        const fractionAnnee = (investissementInitial - cumulPrecedent) / fluxAnnuel;
        periodeRecuperation = annee - 1 + fractionAnnee;
        recuperationAtteinte = true;
      }
      
      // Ajout des résultats annuels
      fluxTresorerie.push({
        annee,
        fluxAnnuel,
        fluxActualise,
        cumulFluxTresorerie,
        economiePersonnel,
        economieDechet,
        economieEnergie,
        economieEau,
        beneficeSupplementaire,
        beneficeQualite,
        economieRejets,
        maintenanceAnnuelle,
        energieOperationAnnuelle,
        amortissement,
        tonnesCO2Economisees
      });
    }
    
    // Calcul du ROI
    const totalBenefices = fluxTresorerie.reduce((sum, item) => sum + item.fluxAnnuel, 0);
    const roiCalcule = (totalBenefices / investissementInitial) * 100;
    
    // Calcul du TRI (approximation simplifiée)
    let triApprox = 0;
    for (let r = 1; r <= 100; r++) {
      let npv = -investissementInitial;
      for (let t = 0; t < fluxTresorerie.length; t++) {
        npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + r / 100, t + 1);
      }
      if (npv <= 0) {
        triApprox = r - 1;
        break;
      }
    }
    
    // Mise à jour des états
    setResultatAnnuel(fluxTresorerie);
    setRoi(roiCalcule);
    setDelaiRecuperation(periodeRecuperation);
    setVan(valeurActuelleNette);
    setTri(triApprox);
    setEconomiesCO2(totalTonnesCO2Economisees);

    return {
      resultatAnnuel: fluxTresorerie,
      roi: roiCalcule,
      delaiRecuperation: periodeRecuperation,
      van: valeurActuelleNette,
      tri: triApprox,
      economiesCO2: totalTonnesCO2Economisees
    };
  }, [
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, 
    coutMaintenance, coutEnergie, dureeVie, tauxAmortissement, 
    coutMainOeuvre, nbEmployesRemplaces, reductionDechet, 
    coutDechet, tonnageAnnuel, augmentationProduction, 
    reductionEnergie, coutEnergieTonne, reductionEau, 
    coutEauTonne, ameliorationQualite, margeBrute, 
    tauxInflation, tauxActualisation, subventions, 
    reductionEmpreinteCO2, tauxRejetsFils, tauxRejetsManuel, 
    coutRejets
  ]);

  // Utilisation de useEffect avec la fonction de calcul
  useEffect(() => {
    calculerROI();
  }, [calculerROI]);

  // Données pour les graphiques (memoized pour éviter des recalculs inutiles)
  const dataComparaisonTauxRejets = useMemo(() => [
    {
      name: 'Système manuel',
      taux: tauxRejetsManuel
    },
    {
      name: 'Système automatisé',
      taux: tauxRejetsFils
    }
  ], [tauxRejetsManuel, tauxRejetsFils]);

  // Données pour le graphique de flux de trésorerie
  const dataFluxTresorerie = useMemo(() => 
    resultatAnnuel.map(item => ({
      annee: `Année ${item.annee}`,
      fluxTresorerie: item.fluxAnnuel
    })), 
    [resultatAnnuel]
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Le reste du code de rendu reste identique à votre version originale */}
      
      {/* Graphique de comparaison des taux de rejet */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Comparaison des taux de rejet de fils métalliques</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataComparaisonTauxRejets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Taux de rejet (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Taux de rejet']} />
              <Legend />
              <Bar dataKey="taux" name="Taux de rejet (%)" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-2">Le système automatisé réduit considérablement le taux de fils métalliques retrouvés dans la pâte, améliorant ainsi la qualité du produit final et réduisant les arrêts machine.</p>
      </div>

      {/* Le reste de votre composant reste identique */}
    </div>
  );
};

export default CalculateurPatesPapiers;
