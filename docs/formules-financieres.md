# Documentation des formules financières

Ce document décrit les formules financières utilisées dans les calculateurs ROI pour l'automatisation industrielle.

## Formules principales

### ROI (Retour sur Investissement)

Le ROI est exprimé en pourcentage et représente le ratio entre les bénéfices nets générés par l'investissement et le coût de cet investissement.

```
ROI (%) = (Bénéfices nets totaux / Investissement initial) × 100
```

Où :
- **Bénéfices nets totaux** : Somme des flux de trésorerie positifs sur la durée de vie du projet
- **Investissement initial** : Coût total de l'acquisition et de l'installation du système d'automatisation

### VAN (Valeur Actuelle Nette)

La VAN est la somme des flux de trésorerie futurs actualisés, moins l'investissement initial.

```
VAN = -I₀ + Σ [CFₜ / (1 + r)ᵗ]
```

Où :
- **I₀** : Investissement initial
- **CFₜ** : Flux de trésorerie à la période t
- **r** : Taux d'actualisation
- **t** : Période (année)

### TRI (Taux de Rendement Interne)

Le TRI est le taux d'actualisation pour lequel la VAN est égale à zéro.

```
0 = -I₀ + Σ [CFₜ / (1 + TRI)ᵗ]
```

Dans notre application, le TRI est calculé par une méthode d'approximation itérative.

### Délai de récupération

Le délai de récupération est la période nécessaire pour récupérer l'investissement initial.

```
Délai de récupération = A + (B / C)
```

Où :
- **A** : Dernière période avec un flux de trésorerie cumulé négatif
- **B** : Valeur absolue du flux de trésorerie cumulé à la période A
- **C** : Flux de trésorerie de la période A+1

## Conversions entre temps de cycle et capacité de production

### Temps de cycle vers capacité horaire
Le temps de cycle est le temps nécessaire pour produire une unité. La conversion en capacité horaire se fait selon la formule :

```
Capacité horaire (unités/heure) = 3600 / Temps de cycle (secondes/unité)
```

### Capacité horaire vers temps de cycle
Inversement, pour déterminer le temps de cycle à partir de la capacité horaire :

```
Temps de cycle (secondes/unité) = 3600 / Capacité horaire (unités/heure)
```

Ces formules sont fondamentales pour comparer les performances des systèmes actuels et automatisés.

## Formules spécifiques à l'automatisation industrielle

### Économies de main d'œuvre
```
Économie annuelle = Coût annuel par employé × (Nombre d'employés avant - Nombre d'employés après)
```

### Coûts cachés de formation continue
Les coûts cachés de formation continue sont des dépenses récurrentes souvent négligées dans l'analyse ROI :

```
Coût annuel de formation continue = Coût initial × Facteur d'inflation^(année-1)
```

Ces coûts sont soustraits des flux de trésorerie annuels.

### Économies liées à la réduction des déchets
```
Économie annuelle = Production annuelle × (% Réduction des déchets / 100) × Coût par unité de déchets
```

### Économies liées à la réduction d'énergie
```
Économie annuelle = Production annuelle × (% Réduction d'énergie / 100) × Coût énergétique par unité
```

### Bénéfices liés à l'augmentation de production
```
Bénéfice annuel = Production annuelle × (% Augmentation de production / 100) × Marge unitaire
```

### Prise en compte de l'inflation
Toutes les valeurs monétaires sont ajustées année après année en fonction du taux d'inflation :

```
Valeur ajustée (année n) = Valeur initiale × (1 + Taux d'inflation / 100)^(n-1)
```

## Particularités du calculateur spécifique à l'industrie des pâtes et papiers

### Économies liées à la réduction des rejets de fils métalliques
```
Économie annuelle = Tonnage annuel × (Taux de rejet manuel - Taux de rejet automatisé) / 100 × Coût par tonne de rejets
```

### Réduction de l'empreinte CO2
```
Tonnes CO2 économisées par an = Tonnage annuel × (% Réduction empreinte CO2 / 100)
```

### Amélioration de la qualité
```
Bénéfice annuel = (Tonnage annuel × % Amélioration qualité / 100) × (Marge brute × 0.2)
```
Le facteur 0.2 est utilisé pour estimer la valeur économique de l'amélioration de qualité.

## Notes sur l'actualisation et l'amortissement

### Actualisation des flux futurs
Les flux de trésorerie futurs sont actualisés pour tenir compte de la valeur temporelle de l'argent :

```
Flux actualisé = Flux nominal / (1 + Taux d'actualisation / 100)^Période
```

### Avantage fiscal de l'amortissement
Le calculateur prend en compte l'avantage fiscal de l'amortissement :

```
Avantage fiscal annuel = (Investissement initial / Durée vie) × (Taux amortissement / 100)
```

Cet avantage est ajouté au flux de trésorerie annuel.

## Sécurité et temps d'arrêt

### Économies liées aux accidents
Les économies liées à la réduction des accidents de travail sont calculées comme suit :

```
Économie annuelle = Fréquence d'accidents × Coût moyen par accident × (% Réduction des accidents / 100)
```

### Économies liées au temps d'arrêt
Les économies liées à la réduction du temps d'arrêt dû aux accidents :

```
Économie annuelle = Fréquence d'accidents × Temps d'arrêt moyen par accident × Valeur de production horaire × (% Réduction des accidents / 100)
```

Où :
- **Valeur de production horaire** = (Production annuelle × Marge unitaire) / Heures d'opération annuelles