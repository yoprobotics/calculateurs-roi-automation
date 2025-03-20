/**
 * Définitions des textes explicatifs pour les info-bulles
 * Organisées par catégories de paramètres et résultats
 */

const definitionsInfoBulles = {
  // Paramètres du système actuel
  systemeActuel: {
    capacite: "Nombre de ballots que le système actuel peut traiter en une heure dans des conditions optimales.",
    tempsCycle: "Temps nécessaire pour traiter un ballot. Calculé automatiquement à partir de la capacité (3600 / capacité).",
    nombreEmployes: "Nombre d'équivalents temps plein (ETP) nécessaires pour opérer le système actuel.",
    tauxRejets: "Pourcentage de produits rejetés en raison de défauts de qualité dans le système actuel.",
    perteProduction: "Pourcentage de capacité de production perdue en raison d'arrêts, pannes et autres inefficacités.",
    ballotsParJour: "Nombre total de ballots traités par jour, calculé à partir de la capacité et des heures d'opération.",
    coutParBallot: "Coût opérationnel moyen pour traiter un ballot, incluant main d'œuvre, maintenance et énergie.",
    frequenceAccident: "Nombre moyen d'accidents de travail par an avec le système actuel.",
    coutMoyenAccident: "Coût moyen direct par accident, incluant soins médicaux, compensations et autres coûts associés.",
    tempsArretAccident: "Nombre moyen d'heures d'arrêt de production suite à un accident.",
    coutMainOeuvre: "Coût annuel moyen par employé, incluant salaire, charges et avantages sociaux.",
    maintenance: "Coût annuel de maintenance du système actuel, incluant pièces de rechange et services.",
    energie: "Coût annuel d'énergie pour le fonctionnement du système actuel.",
    coutDechet: "Coût par tonne pour l'élimination des déchets dans le système actuel.",
    empreinteCO2: "Émissions de CO2 générées par le système actuel, exprimées en tonnes par an.",
    coutEau: "Coût annuel lié à la consommation d'eau du système actuel."
  },
  
  // Paramètres du système automatisé
  systemeAutomatise: {
    capaciteTraitement: "Nombre de ballots que le système automatisé peut traiter en une heure dans des conditions optimales.",
    tempsCycle: "Temps nécessaire pour traiter un ballot avec le système automatisé. Calculé automatiquement (3600 / capacité).",
    tauxRejets: "Pourcentage de produits rejetés en raison de défauts de qualité dans le système automatisé.",
    augmentationProduction: "Pourcentage d'augmentation de production attendu grâce à l'automatisation.",
    ballotsParJour: "Nombre total de ballots traités par jour avec le système automatisé.",
    coutParBallot: "Coût opérationnel moyen pour traiter un ballot avec le système automatisé.",
    nbEmployesRemplaces: "Nombre d'équivalents temps plein (ETP) qui seront remplacés par le système automatisé.",
    coutMainOeuvre: "Coût annuel moyen par employé, incluant salaire, charges et avantages sociaux.",
    coutSysteme: "Coût d'achat du système automatisé, équipements principaux uniquement.",
    coutInstallation: "Coût d'installation du système automatisé, incluant mise en place et intégration.",
    coutIngenierie: "Coût des services d'ingénierie associés à l'implémentation du système.",
    coutFormation: "Coût de la formation du personnel pour opérer le nouveau système.",
    subventions: "Montant total des subventions disponibles pour l'acquisition du système.",
    coutMaintenance: "Coût annuel de maintenance prévu pour le système automatisé.",
    coutEnergie: "Coût annuel d'énergie prévu pour le fonctionnement du système automatisé.",
    dureeVie: "Durée de vie estimée du système automatisé en années.",
    tauxAmortissement: "Pourcentage de l'investissement pouvant être amorti annuellement à des fins fiscales.",
    reductionEnergie: "Pourcentage de réduction de la consommation d'énergie par tonne produite.",
    coutEnergieTonne: "Coût énergétique par tonne de production avec le système actuel.",
    reductionEau: "Pourcentage de réduction de la consommation d'eau par tonne produite.",
    coutEauTonne: "Coût de l'eau par tonne de production avec le système actuel.",
    reductionDechet: "Pourcentage de réduction des déchets attendu avec le système automatisé.",
    coutDechet: "Coût par tonne pour l'élimination des déchets.",
    reductionAccidents: "Pourcentage de réduction des accidents de travail attendu avec le système automatisé.",
    ameliorationQualite: "Pourcentage d'amélioration de la qualité des produits attendu.",
    reductionEmpreinteCO2: "Pourcentage de réduction des émissions de CO2 attendu."
  },
  
  // Paramètres généraux
  parametresGeneraux: {
    heuresOperationParJour: "Nombre d'heures d'opération par jour pour les deux systèmes.",
    joursOperationParAn: "Nombre de jours d'opération par an pour les deux systèmes.",
    tonnageAnnuel: "Tonnage total produit annuellement, utilisé pour divers calculs d'économies.",
    margeBrute: "Marge brute par tonne, utilisée pour calculer les bénéfices liés à l'augmentation de production.",
    tauxInflation: "Taux d'inflation annuel utilisé pour ajuster les coûts futurs.",
    tauxActualisation: "Taux utilisé pour actualiser les flux futurs et refléter la valeur temporelle de l'argent."
  },
  
  // Indicateurs financiers et résultats
  resultats: {
    roi: "Retour sur Investissement simple. Rapport entre le total des bénéfices et l'investissement initial.",
    roiActualise: "ROI qui tient compte de la valeur temporelle de l'argent en utilisant le taux d'actualisation.",
    delaiRecuperation: "Temps nécessaire pour récupérer l'investissement initial à partir des flux non actualisés.",
    delaiRecuperationActualise: "Temps nécessaire pour récupérer l'investissement en tenant compte de l'actualisation.",
    van: "Valeur Actuelle Nette. Somme des flux futurs actualisés moins l'investissement initial.",
    tri: "Taux de Rendement Interne. Taux d'actualisation pour lequel la VAN serait égale à zéro.",
    indiceRentabilite: "Rapport entre la VAN et l'investissement initial. Un IR > 1 indique un projet rentable.",
    economieAnnuelle: "Économie annuelle moyenne sur la durée de vie du système.",
    tco: "Coût Total de Possession sur la durée de vie du système, incluant investissement et coûts opérationnels.",
    economiesTempsArret: "Économies annuelles liées à la réduction du temps d'arrêt suite aux accidents.",
    economiesSecurite: "Économies annuelles liées à la réduction des accidents de travail."
  }
};

export default definitionsInfoBulles;