import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Calculateur spécifique à l'industrie des pâtes et papiers
const CalculateurPatesPapiers = () => {
  // États pour les données d'entrée - Paramètres spécifiques à l'industrie des pâtes et papiers
  // Configuration par défaut pour le désempilement et débrochage de ballots
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
  
  // Fonction de calcul des résultats
  const calculerROI = () => {
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
  };
  
  // Calcul initial et lors des changements
  useEffect(() => {
    calculerROI();
  }, [
    coutSysteme, coutInstallation, coutIngenierie, coutFormation, coutMaintenance, coutEnergie,
    dureeVie, tauxAmortissement, coutMainOeuvre, nbEmployesRemplaces,
    reductionDechet, coutDechet, tonnageAnnuel, augmentationProduction,
    reductionEnergie, coutEnergieTonne, reductionEau, coutEauTonne,
    ameliorationQualite, margeBrute, tauxInflation, tauxActualisation, subventions,
    reductionEmpreinteCO2, capaciteTraitement, tauxRejetsFils, tauxRejetsManuel, coutRejets
  ]);

  // Données pour les graphiques
  const dataComparaisonTauxRejets = [
    {
      name: 'Système manuel',
      taux: tauxRejetsManuel
    },
    {
      name: 'Système automatisé',
      taux: tauxRejetsFils
    }
  ];

  // Données pour le graphique de flux de trésorerie
  const dataFluxTresorerie = resultatAnnuel.map(item => ({
    annee: `Année ${item.annee}`,
    fluxTresorerie: item.fluxAnnuel
  }));

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-8 bg-green-100 p-4 rounded-lg border border-green-300">
        <h3 className="text-xl font-bold text-green-800 mb-2">Avantages de l'Automatisation du Désempilement et Débrochage de Ballots</h3>
        <p className="mb-2">Notre système automatisé de débrochage de ballots peut traiter jusqu'à <span className="font-bold">{capaciteTraitement} ballots par heure</span>, offrant un ROI généralement inférieur à 2 ans.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Efficacité Maximale</h4>
            <p>Augmentation notable de la capacité de production avec une alimentation continue du triturateur.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Sécurité Améliorée</h4>
            <p>Réduction des risques d'accidents liés à la manipulation manuelle des ballots et des fils métalliques.</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-bold text-green-700">Qualité Supérieure</h4>
            <p>Moins de contamination par les fils métalliques, réduisant les arrêts machine et améliorant la qualité du produit final.</p>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Calculateur de ROI pour l'Automatisation du Désempilement et Débrochage de Ballots</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire d'entrée */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Paramètres d'investissement</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts initiaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coût du système ($)</label>
                <input
                  type="number"
                  value={coutSysteme}
                  onChange={(e) => setCoutSysteme(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'installation ($)</label>
                <input
                  type="number"
                  value={coutInstallation}
                  onChange={(e) => setCoutInstallation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût d'ingénierie ($)</label>
                <input
                  type="number"
                  value={coutIngenierie}
                  onChange={(e) => setCoutIngenierie(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût de formation ($)</label>
                <input
                  type="number"
                  value={coutFormation}
                  onChange={(e) => setCoutFormation(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subventions ($)</label>
                <input
                  type="number"
                  value={subventions}
                  onChange={(e) => setSubventions(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Performance du système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Capacité (ballots/heure)</label>
                <input
                  type="number"
                  value={capaciteTraitement}
                  onChange={(e) => setCapaciteTraitement(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Nombre de ballots que le système peut traiter par heure à pleine capacité.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux de rejet fils système (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tauxRejetsFils}
                  onChange={(e) => setTauxRejetsFils(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Pourcentage de fils métalliques retrouvés dans la pâte avec le système automatisé.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Taux de rejet fils manuel (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tauxRejetsManuel}
                  onChange={(e) => setTauxRejetsManuel(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Pourcentage de fils métalliques retrouvés dans la pâte avec le système manuel actuel.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût des rejets/tonne ($)</label>
                <input
                  type="number"
                  value={coutRejets}
                  onChange={(e) => setCoutRejets(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Coût moyen par tonne associé au retraitement ou à la perte liée aux rejets de fils métalliques.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Coûts opérationnels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance annuelle ($)</label>
                <input
                  type="number"
                  value={coutMaintenance}
                  onChange={(e) => setCoutMaintenance(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coût énergie système/an ($)</label>
                <input
                  type="number"
                  value={coutEnergie}
                  onChange={(e) => setCoutEnergie(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Résultats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Résultats</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">ROI global</h3>
                <p className="text-2xl font-bold text-green-800">{roi.toFixed(2)}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">Délai de récupération</h3>
                <p className={`text-2xl font-bold ${delaiRecuperation <= 2 ? 'text-green-600' : 'text-blue-800'}`}>
                  {delaiRecuperation.toFixed(2)} ans
                  {delaiRecuperation <= 2 && <span className="text-sm font-normal block">ROI inférieur à 2 ans ✓</span>}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">VAN</h3>
                <p className="text-2xl font-bold text-purple-800">${van.toFixed(2)}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-700">TRI</h3>
                <p className="text-2xl font-bold text-indigo-800">{tri.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded mb-6">
              <h3 className="text-sm font-medium text-gray-700">Impact opérationnel - Capacité</h3>
              <p className="text-2xl font-bold text-green-800">{capaciteTraitement} ballots/heure</p>
              <p className="text-sm text-gray-600">Une alimentation continue et fiable pour votre triturateur</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Avantages par rapport au système actuel</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Taux de rejet manuel</h4>
                  <p className="text-xl font-bold text-red-600">{tauxRejetsManuel}%</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Taux de rejet système</h4>
                  <p className="text-xl font-bold text-green-600">{tauxRejetsFils}%</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Main d'œuvre</h4>
                  <p className="text-xl font-bold text-red-600">2+ opérateurs</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-700">Main d'œuvre</h4>
                  <p className="text-xl font-bold text-green-600">0-1 opérateur</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pourquoi automatiser?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sécurité: réduction des risques liés à la manipulation des fils métalliques</li>
                <li>Qualité: moins de fils dans le pulpeur = moins d'arrêts et meilleure pâte</li>
                <li>Production: capacité accrue et constante d'alimentation</li>
                <li>Économies: réduction de la main d'œuvre et des déchets</li>
                <li>Environnement: moins de pertes et de consommation d'énergie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Section Impact environnemental */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Impact environnemental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium text-green-800 mb-1">Réduction émissions CO2</h3>
            <p className="text-2xl font-bold text-green-600">{reductionEmpreinteCO2}%</p>
            <p className="text-sm text-gray-600">Des processus de production</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium text-blue-800 mb-1">Économie d'eau</h3>
            <p className="text-2xl font-bold text-blue-600">{reductionEau}%</p>
            <p className="text-sm text-gray-600">De la consommation habituelle</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium text-purple-800 mb-1">Tonnes CO2 économisées</h3>
            <p className="text-2xl font-bold text-purple-600">{economiesCO2.toFixed(0)} tonnes</p>
            <p className="text-sm text-gray-600">Sur la durée de vie du système</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">L'automatisation contribue significativement à la réduction de l'empreinte environnementale de votre usine, un argument de plus en plus important pour les clients et régulateurs.</p>
      </div>
    </div>
  );
};

export default CalculateurPatesPapiers;
