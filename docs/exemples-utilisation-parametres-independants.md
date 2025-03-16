# Exemples d'utilisation des paramètres indépendants

Ce document présente des cas d'utilisation réels où l'indépendance des paramètres de capacité et de temps de cycle permet une modélisation plus fidèle des processus industriels.

## 1. Industrie de l'emballage - Ligne de conditionnement

### Situation réelle
Dans une ligne de conditionnement de produits alimentaires, une machine d'emballage a un temps de cycle technique de 2 secondes par unité (théoriquement 1800 unités/heure). Cependant, plusieurs facteurs limitent la capacité effective :

- Les changements de bobines de film (environ 10 minutes toutes les 2 heures)
- Les contrôles qualité (échantillonnage toutes les 30 minutes)
- Les micro-arrêts dus aux bourrage de matériaux d'emballage

### Paramètres indépendants
- **Temps de cycle** : 2 secondes/unité (performance technique de la machine)
- **Capacité effective** : 1400 unités/heure (en tenant compte des arrêts)

*Avec les paramètres liés, il aurait fallu définir un temps de cycle artificiel de 2,57 secondes pour obtenir cette capacité effective.*

## 2. Industrie automobile - Ligne d'assemblage

### Situation réelle
Sur une chaîne d'assemblage automobile, le temps de cycle théorique est de 60 secondes pour chaque poste de travail. Cependant, la capacité de production effective est limitée par :

- Le poste de travail le plus lent (goulot d'étranglement)
- Le taux de reprise des défauts
- Les changements de modèles et de configurations

### Paramètres indépendants
- **Temps de cycle** : 60 secondes/unité (cadence théorique)
- **Capacité effective** : 52 unités/heure (au lieu de 60 théoriques)

*Avec des paramètres liés, il aurait fallu augmenter artificiellement le temps de cycle à 69 secondes pour représenter la réalité productive.*

## 3. Industrie pharmaceutique - Ligne de remplissage

### Situation réelle
Une ligne de remplissage de flacons a un temps de cycle très rapide de 0,5 seconde par flacon (7200/heure). Cependant, la capacité est fortement limitée par :

- Les validations de processus obligatoires (arrêts programmés)
- Les changements de lots avec nettoyage complet
- Les contrôles réglementaires stricts

### Paramètres indépendants
- **Temps de cycle** : 0,5 seconde/flacon (vitesse technique)
- **Capacité effective** : 4000 flacons/heure

*La différence est considérable et démontre l'importance de pouvoir paramétrer ces valeurs indépendamment.*

## 4. Industrie des pâtes et papiers - Système de coupe

### Situation réelle
Une machine de découpe de papier a un temps de cycle technique de 3 secondes par coupe. Mais plusieurs facteurs affectent la capacité :

- Le temps de manipulation entre les coupes
- Le réglage des outils de coupe pour différentes dimensions
- Les limitations de l'alimentation en amont ou de l'évacuation en aval

### Paramètres indépendants
- **Temps de cycle** : 3 secondes/coupe (performance de la machine)
- **Capacité effective** : 800 coupes/heure (au lieu des 1200 théoriques)

## 5. Industrie agroalimentaire - Ligne de conditionnement variable

### Situation réelle
Dans l'industrie agroalimentaire, une même ligne de production peut traiter différents formats de produits avec des temps de cycle variables. Cependant, la capacité horaire maximale reste relativement constante en raison des contraintes logistiques.

### Paramètres indépendants
- **Temps de cycle** : Variable selon le format (2 à 6 secondes)
- **Capacité effective** : Constante à environ 1000 unités/heure

*La capacité reste constante malgré la variation des temps de cycle, ce qui serait impossible à modéliser avec des paramètres liés.*

## Conclusion

Ces exemples illustrent pourquoi l'indépendance des paramètres de temps de cycle et de capacité est essentielle pour modéliser fidèlement les processus industriels réels. Dans la plupart des situations concrètes, la capacité effective diffère significativement de la capacité théorique calculée à partir du temps de cycle.

Cette modification du calculateur permet donc de représenter plus fidèlement la réalité industrielle et d'obtenir des projections financières plus précises pour les projets d'automatisation.
