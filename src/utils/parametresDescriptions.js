/**
 * Descriptions détaillées des paramètres pour les info-bulles
 * Ces descriptions sont utilisées pour fournir des explications approfondies
 * sur chaque paramètre dans les calculateurs.
 */

// Descriptions pour les paramètres du système actuel
export const descriptionSystemeActuel = {
  // Performance
  capacite: {
    titre: "Capacité de production",
    description: "Volume de production que votre système actuel peut traiter par heure en conditions normales. Ce paramètre influe directement sur votre capacité de production totale et les revenus potentiels. Valeur typique pour un système manuel: 20-50 unités/heure; semi-automatisé: 50-100 unités/heure; automatisé ancien: 80-150 unités/heure."
  },
  tempsCycle: {
    titre: "Temps de cycle",
    description: "Temps nécessaire pour traiter une unité de produit, du début à la fin du processus. Un temps de cycle plus court permet une production plus élevée. Exprimé en secondes par unité. Valeur typique: 72 secondes (manuel), 45 secondes (semi-auto), 30 secondes (auto-ancien)."
  },
  
  // Main d'œuvre
  nombreEmployes: {
    titre: "Nombre d'employés (ETP)",
    description: "Nombre d'équivalents temps plein requis pour faire fonctionner votre système actuel. Inclut les opérateurs, superviseurs et personnel de maintenance directement affectés à ce processus. Les fractions représentent des employés à temps partiel (ex: 2.5 = deux temps plein et un mi-temps)."
  },
  
  // Qualité et problèmes
  tauxRejets: {
    titre: "Taux de rejets",
    description: "Pourcentage de produits qui ne répondent pas aux spécifications ou standards de qualité et qui doivent être rejetés ou retravaillés. Impact direct sur les coûts de production et l'efficacité. Valeur typique: 5-15% pour les processus manuels, 3-8% pour les processus semi-automatisés."
  },
  perteProduction: {
    titre: "Pertes de production",
    description: "Pourcentage de temps de production perdu en raison d'arrêts, de retards, de changements de série, ou d'autres inefficacités. Ces pertes réduisent la capacité de production effective. Valeur typique: 10-20% pour les systèmes manuels, 5-15% pour les systèmes semi-automatisés."
  },
  
  // Sécurité
  frequenceAccident: {
    titre: "Fréquence des accidents",
    description: "Nombre moyen d'accidents de travail par an liés à ce processus. Inclut les accidents mineurs et majeurs. Ce paramètre a un impact sur les coûts directs (soins médicaux, indemnités) et indirects (temps d'arrêt, remplacement). Valeur typique: 2-8 accidents/an pour un processus manuel à risque."
  },
  coutMoyenAccident: {
    titre: "Coût moyen par accident",
    description: "Coût total moyen par accident, incluant les frais médicaux, indemnités, amendes potentielles, et coûts administratifs. Ne comprend pas les pertes de production, qui sont calculées séparément. Valeur typique: 5 000 $ à 25 000 $ selon la gravité moyenne et le secteur."
  },
  tempsArretAccident: {
    titre: "Temps d'arrêt par accident",
    description: "Durée moyenne d'interruption de la production suite à un accident, exprimée en heures. Inclut le temps d'arrêt immédiat, les enquêtes de sécurité, et les perturbations opérationnelles. Valeur typique: 4-48 heures selon la gravité et les procédures de sécurité."
  },
  arretNonPlanifie: {
    titre: "Arrêts non planifiés",
    description: "Temps total d'arrêt non planifié par mois, hors accidents, exprimé en heures. Inclut les pannes, maintenance corrective, et autres interruptions imprévues. Impact direct sur la productivité et les délais de livraison. Valeur typique: 8-40 heures/mois selon la fiabilité du système."
  },
  
  // Coûts opérationnels
  maintenance: {
    titre: "Coût de maintenance annuel",
    description: "Coût total annuel pour maintenir le système en état de fonctionnement, incluant la maintenance préventive et corrective, les pièces de rechange, et la main-d'œuvre dédiée. N'inclut pas les mises à niveau majeures. Valeur typique: 5-15% du coût initial du système par an."
  },
  energie: {
    titre: "Coût énergétique annuel",
    description: "Coût annuel de l'énergie consommée par le système (électricité, gaz, air comprimé, etc.). Plus le système est ancien ou inefficace, plus ce coût tend à être élevé. Valeur typique: varie considérablement selon le secteur et la taille du système."
  },
  
  // Ressources et environnement
  consommationEau: {
    titre: "Consommation d'eau",
    description: "Volume annuel d'eau utilisée par le système actuel, exprimé en mètres cubes. Inclut l'eau utilisée pour le processus, le refroidissement, et le nettoyage lié directement au système. Paramètre important pour l'impact environnemental et les coûts opérationnels dans certains secteurs."
  },
  coutEau: {
    titre: "Coût de l'eau",
    description: "Coût moyen par mètre cube d'eau, incluant l'approvisionnement et le traitement des eaux usées. Ce paramètre varie considérablement selon la région et le type d'industrie. Valeur typique: 1-10 $/m³ selon la localisation et le traitement requis."
  },
  consommationAirComprime: {
    titre: "Consommation d'air comprimé",
    description: "Volume annuel d'air comprimé consommé par le système, exprimé en mètres cubes. L'air comprimé est souvent l'une des utilités les plus coûteuses en industrie en raison de sa faible efficacité énergétique. Valeur typique: varie considérablement selon le type de système."
  },
  coutAirComprime: {
    titre: "Coût de l'air comprimé",
    description: "Coût moyen par mètre cube d'air comprimé, incluant l'électricité, la maintenance du compresseur et les pertes du réseau. Valeur typique: 0.01-0.03 $/m³ selon l'efficacité du système de compression et le coût de l'électricité."
  },
  emissionCO2: {
    titre: "Émissions de CO₂",
    description: "Volume annuel d'émissions de dioxyde de carbone attribuables au fonctionnement du système, exprimé en tonnes. Inclut les émissions directes et indirectes (électricité). Paramètre crucial pour l'empreinte carbone et potentiellement pour la conformité réglementaire."
  },
  consommationHydraulique: {
    titre: "Consommation de fluide hydraulique",
    description: "Volume annuel de fluide hydraulique consommé par le système, exprimé en litres. Inclut les fuites, les vidanges, et les remplissages. Impact sur les coûts opérationnels et l'environnement. Valeur typique: varie selon le type et l'âge du système hydraulique."
  }
};

// Descriptions pour les paramètres du système automatisé
export const descriptionSystemeAutomatise = {
  // Performance
  capaciteTraitement: {
    titre: "Capacité de traitement",
    description: "Volume de production que le système automatisé peut traiter par heure en conditions normales. Les systèmes automatisés modernes offrent généralement une capacité supérieure grâce à des temps de cycle réduits et moins d'interruptions. Valeur typique: 100-300 unités/heure selon le degré d'automatisation."
  },
  tempsCycle: {
    titre: "Temps de cycle",
    description: "Temps nécessaire pour traiter une unité de produit avec le système automatisé. L'automatisation permet généralement de réduire significativement ce temps par rapport aux processus manuels. Valeur typique: 12-30 secondes selon la complexité du processus."
  },
  
  // Coûts d'investissement
  coutSysteme: {
    titre: "Coût du système",
    description: "Coût d'acquisition du système automatisé, incluant tous les équipements, logiciels, et composants. Représente généralement la majeure partie de l'investissement initial. Valeur typique: 150 000 $ à 500 000 $ pour un système d'automatisation industrielle moyen."
  },
  coutInstallation: {
    titre: "Coût d'installation",
    description: "Coûts liés à l'installation physique du système, incluant la préparation du site, le montage, les raccordements, et la mise en service. Valeur typique: 15-25% du coût du système."
  },
  coutIngenierie: {
    titre: "Coût d'ingénierie",
    description: "Coûts de conception, d'études techniques, et d'intégration du système. Inclut les honoraires des consultants, les études de faisabilité, et la personnalisation du système pour votre application spécifique. Valeur typique: 10-20% du coût du système."
  },
  coutFormation: {
    titre: "Coût de formation initiale",
    description: "Coût de la formation initiale du personnel à l'utilisation et à la maintenance du nouveau système. Inclut la formation des opérateurs, des techniciens, et du personnel de supervision. Valeur typique: 5-10% du coût du système."
  },
  subventions: {
    titre: "Subventions et aides",
    description: "Montant total des subventions, crédits d'impôt, et autres aides financières pour l'acquisition de technologies d'automatisation. Ces aides peuvent réduire significativement l'investissement initial et améliorer le ROI. Renseignez-vous auprès des organismes de développement économique régionaux."
  },
  
  // Impacts sur les ressources humaines
  coutMainOeuvre: {
    titre: "Coût annuel par employé",
    description: "Coût total annuel par employé, incluant salaires, avantages sociaux, charges, formation continue, et autres coûts indirects. Ce paramètre est utilisé pour calculer les économies de main-d'œuvre. Valeur typique: 40 000 $ à 80 000 $ selon la qualification et la région."
  },
  nbEmployesRemplaces: {
    titre: "Nombre d'employés remplacés",
    description: "Nombre d'équivalents temps plein qui ne seront plus nécessaires après l'automatisation. Certains employés peuvent être réaffectés à des tâches à plus forte valeur ajoutée plutôt que d'être licenciés. Ce nombre ne peut pas dépasser le nombre total d'employés actuels."
  },
  
  // Améliorations
  tauxRejets: {
    titre: "Taux de rejets automatisé",
    description: "Pourcentage de produits rejetés avec le système automatisé. L'automatisation permet généralement de réduire les rejets grâce à une meilleure répétabilité et précision. Valeur typique: 1-5%, soit une réduction de 50-80% par rapport aux processus manuels."
  },
  coutDechet: {
    titre: "Coût par rejet",
    description: "Coût unitaire d'un produit rejeté, incluant les matières premières, l'énergie, la main-d'œuvre, et autres coûts directs. Ce paramètre est utilisé pour calculer les économies liées à la réduction des rejets. Valeur typique: varie considérablement selon le produit."
  },
  augmentationProduction: {
    titre: "Augmentation de production",
    description: "Pourcentage d'augmentation de la production totale attendue grâce à l'automatisation, au-delà de la simple différence de capacité horaire. Inclut les effets de la réduction des temps d'arrêt et l'optimisation des changements de série. Valeur typique: 10-30%."
  },
  ameliorationQualite: {
    titre: "Amélioration de la qualité",
    description: "Pourcentage d'amélioration de la qualité globale des produits, au-delà de la simple réduction des rejets. Inclut une meilleure constance des caractéristiques, l'amélioration de l'aspect, et la réduction des réclamations clients. Valeur typique: 5-20%."
  },
  
  // Sécurité et temps d'arrêt
  reductionAccidents: {
    titre: "Réduction des accidents",
    description: "Pourcentage de réduction des accidents de travail attendu grâce à l'automatisation. Les systèmes automatisés éliminent généralement les tâches dangereuses et répétitives. Valeur typique: 50-90% selon le type de processus."
  },
  reductionTempsArret: {
    titre: "Réduction des temps d'arrêt",
    description: "Pourcentage de réduction des temps d'arrêt non planifiés attendu avec le système automatisé. Les systèmes modernes offrent une meilleure fiabilité et des temps de maintenance plus courts. Valeur typique: 30-70% selon la technologie."
  },
  
  // Coûts opérationnels
  coutMaintenance: {
    titre: "Coût de maintenance automatisé",
    description: "Coût annuel de maintenance du système automatisé. Bien que généralement plus élevé en valeur absolue, ce coût est souvent inférieur en pourcentage du coût du système par rapport aux systèmes manuels. Valeur typique: 3-8% du coût du système par an."
  },
  coutEnergie: {
    titre: "Coût énergétique automatisé",
    description: "Coût annuel de l'énergie consommée par le système automatisé. Les systèmes modernes sont généralement plus écoénergétiques, mais peuvent consommer plus d'électricité s'ils remplacent un processus principalement manuel. Valeur typique: varie selon le secteur."
  },
  
  // Économies d'énergie
  reductionEnergie: {
    titre: "Réduction d'énergie par tonne",
    description: "Pourcentage de réduction de la consommation d'énergie par tonne produite. Ce paramètre mesure l'efficacité énergétique du processus, indépendamment du volume de production. Valeur typique: 5-25% selon la technologie et l'efficacité du système actuel."
  },
  coutEnergieTonne: {
    titre: "Coût énergétique par tonne",
    description: "Coût moyen de l'énergie nécessaire pour produire une tonne de produit. Inclut toutes les formes d'énergie (électricité, gaz, vapeur, etc.) utilisées directement dans le processus. Valeur typique: varie considérablement selon le secteur et le produit."
  },
  
  // Impacts environnementaux
  consommationEau: {
    titre: "Consommation d'eau automatisée",
    description: "Volume annuel d'eau utilisée par le système automatisé. Les systèmes modernes sont généralement plus efficaces en termes de consommation d'eau, avec des circuits fermés et des techniques de récupération."
  },
  reductionConsommationEau: {
    titre: "Réduction de consommation d'eau",
    description: "Pourcentage de réduction de la consommation d'eau par rapport au système actuel. L'automatisation permet souvent une meilleure gestion des ressources en eau. Valeur typique: 5-30% selon la technologie et l'efficacité du système actuel."
  },
  consommationAirComprime: {
    titre: "Consommation d'air comprimé automatisée",
    description: "Volume annuel d'air comprimé consommé par le système automatisé. Les automates pneumatiques modernes sont généralement plus efficaces, mais certaines technologies d'automatisation peuvent augmenter la dépendance à l'air comprimé."
  },
  reductionConsommationAirComprime: {
    titre: "Réduction de consommation d'air comprimé",
    description: "Pourcentage de réduction de la consommation d'air comprimé par rapport au système actuel. Valeur typique: 5-20% selon la technologie."
  },
  emissionCO2: {
    titre: "Émissions CO₂ automatisées",
    description: "Volume annuel d'émissions de CO₂ attribuables au fonctionnement du système automatisé. Les équipements modernes ont généralement une meilleure efficacité énergétique et donc une empreinte carbone réduite par unité produite."
  },
  reductionEmpreinteCO2: {
    titre: "Réduction de l'empreinte CO₂",
    description: "Pourcentage de réduction des émissions de CO₂ par rapport au système actuel. Paramètre important pour les objectifs de développement durable et potentiellement pour la conformité réglementaire. Valeur typique: 5-30% selon la technologie."
  },
  consommationHydraulique: {
    titre: "Consommation hydraulique automatisée",
    description: "Volume annuel de fluide hydraulique consommé par le système automatisé. Les systèmes modernes ont généralement moins de fuites et des intervalles de vidange plus longs."
  },
  reductionConsommationHydraulique: {
    titre: "Réduction de consommation hydraulique",
    description: "Pourcentage de réduction de la consommation de fluide hydraulique par rapport au système actuel. Valeur typique: 10-50% selon la technologie et l'âge du système actuel."
  },
  
  // Coûts cachés
  coutFormationContinue: {
    titre: "Coût de formation continue",
    description: "Coût annuel pour maintenir et développer les compétences du personnel sur le système automatisé. Inclut les formations de perfectionnement, les mises à jour de compétences, et la formation des nouveaux employés. Valeur typique: 1-3% du coût du système par an."
  },
  coutMisesAJour: {
    titre: "Coût des mises à jour logicielles",
    description: "Coût annuel des mises à jour logicielles, licences, et support technique pour le système automatisé. Ce coût est souvent négligé dans l'évaluation initiale mais peut être significatif sur la durée de vie du système. Valeur typique: 2-5% du coût des logiciels par an."
  },
  coutConsommables: {
    titre: "Coût des consommables spécifiques",
    description: "Coût annuel des consommables spécifiques au système automatisé (filtres spéciaux, capteurs remplaçables, etc.) qui s'ajoutent aux consommables standards. Valeur typique: varie considérablement selon la technologie."
  },
  
  // Paramètres financiers
  dureeVie: {
    titre: "Durée de vie",
    description: "Durée d'utilisation prévue du système automatisé avant remplacement ou mise à niveau majeure. Les calculs de ROI et VAN sont basés sur cette période. Valeur typique: 7-15 ans selon le type de technologie et le secteur."
  },
  tauxAmortissement: {
    titre: "Taux d'amortissement",
    description: "Taux d'amortissement fiscal utilisé pour le calcul de l'avantage fiscal. Ce paramètre varie selon la législation fiscale applicable et le type d'équipement. Valeur typique: 10-30% selon la réglementation locale et la catégorie d'équipement."
  }
};

// Descriptions pour les paramètres généraux
export const descriptionParametresGeneraux = {
  tonnageAnnuel: {
    titre: "Tonnage annuel",
    description: "Volume total de production annuelle exprimé en tonnes. Ce paramètre est utilisé pour calculer les économies d'énergie, d'eau, et l'impact environnemental en fonction de la production. Valeur typique: varie considérablement selon le secteur et la taille de l'entreprise."
  },
  margeBrute: {
    titre: "Marge brute par tonne",
    description: "Différence entre le prix de vente et le coût de production direct par tonne de produit. Ce paramètre est utilisé pour évaluer l'impact financier des améliorations de qualité et de l'augmentation de production. Valeur typique: varie considérablement selon le secteur et le produit."
  },
  tauxInflation: {
    titre: "Taux d'inflation",
    description: "Augmentation annuelle moyenne attendue du coût des biens et services. Ce paramètre est utilisé pour ajuster les coûts et bénéfices futurs dans le calcul du ROI. Valeur typique: 1-5% selon les prévisions économiques."
  },
  tauxActualisation: {
    titre: "Taux d'actualisation",
    description: "Taux utilisé pour calculer la valeur actuelle des flux de trésorerie futurs. Reflète le coût du capital et le risque du projet. Doit être supérieur au taux d'inflation. Valeur typique: 5-12% selon le secteur et le profil de risque de l'entreprise."
  },
  heuresOperationParJour: {
    titre: "Heures d'opération quotidiennes",
    description: "Nombre moyen d'heures de fonctionnement du système par jour. Ce paramètre est utilisé pour calculer la production annuelle et les économies d'énergie. Valeur typique: 8-24 heures selon le mode de fonctionnement (1-3 équipes)."
  },
  joursOperationParAn: {
    titre: "Jours d'opération annuels",
    description: "Nombre de jours de fonctionnement du système par an. Prend en compte les arrêts planifiés, les jours fériés, et les périodes de maintenance majeure. Valeur typique: 220-350 jours selon le secteur et le mode de fonctionnement."
  }
};
