# Documentation des formules du calculateur général d'automatisation

Ce document décrit en détail les formules et calculs utilisés dans le calculateur général pour l'automatisation industrielle.

## Formules financières de base

### Investissement initial

L'investissement initial représente le coût total d'acquisition et de mise en place du système automatisé:

```
Investissement initial = Coût du système + Coût d'installation + Coût d'ingénierie + Coût de formation - Subventions
```

### ROI (Retour sur Investissement)

Le ROI est exprimé en pourcentage et représente le ratio entre les bénéfices nets générés par l'investissement et le coût de cet investissement:

```
ROI (%) = (Bénéfices nets totaux / Investissement initial) × 100
```

Où:
- **Bénéfices nets totaux**: Somme de tous les flux de trésorerie positifs sur la durée de vie du projet

### VAN (Valeur Actuelle Nette)

La VAN est la somme des flux de trésorerie futurs actualisés, moins l'investissement initial:

```
VAN = -Investissement initial + Σ [Flux annuel / (1 + Taux d'actualisation)^année]
```

Où:
- **Flux annuel**: Flux de trésorerie à l'année considérée
- **Taux d'actualisation**: Taux utilisé pour refléter la valeur temporelle de l'argent

### TRI (Taux de Rendement Interne)

Le TRI est le taux d'actualisation pour lequel la VAN est égale à zéro:

```
0 = -Investissement initial + Σ [Flux annuel / (1 + TRI)^année]
```

### Délai de récupération

Le délai de récupération est la période nécessaire pour récupérer l'investissement initial:

```
Délai de récupération = A + (B / C)
```

Où:
- **A**: Dernière période avec un flux de trésorerie cumulé négatif
- **B**: Valeur absolue du flux de trésorerie cumulé à la période A
- **C**: Flux de trésorerie de la période A+1

## Formules spécifiques à la comparaison des systèmes

### Économies de main d'œuvre

```
Économie annuelle = Coût annuel par employé × Nombre d'employés remplacés
```

### Économies liées à la réduction des rejets

```
Économie annuelle = Production annuelle × (Taux de rejet actuel - Taux de rejet automatisé) / 100 × Coût par rejet
```

### Économies liées aux accidents

```
Économie accidents = Fréquence accidents système actuel × Coût moyen par accident × Réduction accidents (%) / 100
```

### Économies liées à la réduction du temps d'arrêt

```
Économie temps d'arrêt = Fréquence accidents × Temps d'arrêt par accident × Valeur production horaire × Réduction accidents (%) / 100
```

Où:
- **Valeur production horaire** = (Production annuelle × Marge) / Heures opération annuelles

### Économies d'énergie

```
Économie énergie système = Coût énergie système actuel - Coût énergie système automatisé
```

```
Économie énergie production = (Production annuelle × Réduction énergie (%)) × Coût énergie par tonne
```

### Bénéfices liés à l'amélioration de la qualité

```
Bénéfice qualité = (Production annuelle × Amélioration qualité (%)) × (Marge × 0.2)
```

### Bénéfices liés à l'augmentation de production

```
Bénéfice production = Production annuelle × (Augmentation production (%)) × Marge
```

## Formules pour les impacts environnementaux

### Économies d'eau

```
Économie eau = (Production annuelle × Réduction eau (%)) × Coût eau par tonne
```

### Réduction des émissions CO2

```
Tonnes CO2 économisées par an = Production annuelle × (Réduction empreinte CO2 (%)) / 100
```

### Économies liées à la réduction de consommation d'air comprimé

```
Économie air comprimé = (Consommation air comprimé actuelle - Consommation air comprimé automatisé) × Coût air comprimé par m³
```

## Calcul du flux de trésorerie annuel

Le flux de trésorerie annuel intègre toutes les économies et les coûts supplémentaires:

```
Flux annuel = Économie main d'œuvre + Économie rejets + Économie accidents + Économie temps d'arrêt + Économie énergie système + Économie énergie production + Économie eau + Économie air comprimé + Bénéfice qualité + Bénéfice production - Coût maintenance - Coût énergie - Coût formation continue - Coût mises à jour - Coût consommables + Amortissement
```

### Prise en compte de l'inflation

Toutes les valeurs monétaires sont ajustées année après année en fonction du taux d'inflation:

```
Valeur ajustée (année n) = Valeur initiale × (1 + Taux d'inflation / 100)^(n-1)
```

### Amortissement fiscal

L'avantage fiscal lié à l'amortissement est calculé comme suit:

```
Avantage fiscal annuel = (Investissement initial / Durée vie) × (Taux amortissement / 100)
```

## Paramètres spécifiques au calculateur général

Le calculateur général prend en compte plusieurs paramètres qui permettent une analyse détaillée et personnalisée:

### Performance

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Capacité | Volume de production horaire | unités/heure |
| Temps de cycle | Temps de traitement par unité | secondes |

### Main d'œuvre

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Nombre d'employés | Personnel requis pour le système actuel | Équivalent Temps Plein (ETP) |
| Employés remplacés | Personnel remplacé par le système automatisé | ETP |
| Coût annuel employé | Coût total par employé incluant salaires et charges | $ |

### Qualité et problèmes

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Taux de rejets | Pourcentage de production rejetée | % |
| Pertes production | Pertes dues aux arrêts et inefficacités | % |
| Coût par rejet | Coût unitaire d'un produit rejeté | $ |
| Amélioration qualité | Amélioration attendue de la qualité des produits | % |

### Sécurité

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Accidents/an | Fréquence des accidents | nombre/an |
| Coût/accident | Coût moyen par accident | $ |
| Arrêt/accident | Temps d'arrêt moyen par accident | heures |
| Arrêt non planifié | Temps d'arrêt non planifié hors accidents | heures/mois |
| Réduction accidents | Réduction attendue des accidents | % |
| Réduction temps d'arrêt | Réduction attendue du temps d'arrêt | % |

### Coûts opérationnels

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Maintenance/an | Coût annuel de maintenance | $ |
| Énergie/an | Coût annuel d'énergie du système | $ |
| Formation continue | Coût annuel de formation continue | $ |
| Mises à jour logicielles | Coût annuel des mises à jour | $ |
| Consommables spécifiques | Coût annuel des consommables | $ |

### Impacts environnementaux

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Consommation d'eau | Volume d'eau consommée | m³/an |
| Émissions CO₂ | Émissions de CO₂ directes et indirectes | tonnes/an |
| Air comprimé | Consommation d'air comprimé | m³/an |
| Fluide hydraulique | Consommation de fluide hydraulique | L/an |

### Paramètres financiers

| Paramètre | Description | Unité |
|-----------|-------------|-------|
| Durée de vie | Durée d'utilisation prévue du système | années |
| Taux d'amortissement | Taux utilisé pour l'amortissement fiscal | % |
| Taux d'actualisation | Taux utilisé pour calculer la valeur actuelle | % |
| Taux d'inflation | Augmentation annuelle du coût des biens et services | % |