# Guide de nettoyage de code - Calculateurs ROI

Ce document fournit des instructions détaillées pour nettoyer en toute sécurité les anciens composants du projet Calculateurs ROI Automation.

## Utilisation du script d'analyse

Un script d'analyse a été créé pour vous aider à identifier toutes les références aux anciens composants. Cela vous permettra de déterminer s'il est sûr de supprimer ces composants.

### Prérequis

Installez les dépendances nécessaires:

```bash
npm install glob fs-extra chalk
```

### Exécution du script

```bash
node tools/analyze-old-components.js
```

### Interprétation des résultats

Le script recherchera des références aux anciens composants dans tout le codebase et affichera les résultats:

- Si aucune référence n'est trouvée, il est probablement sûr de supprimer les composants obsolètes.
- Si des références sont trouvées, le script indiquera les fichiers qui contiennent ces références. Vous devrez examiner attentivement ces fichiers avant de procéder à la suppression.

## Procédure de nettoyage sécurisée

Pour nettoyer en toute sécurité les anciens composants, suivez ces étapes:

1. **Sauvegarder l'état actuel du projet**
   ```bash
   git branch sauvegarde-pre-cleanup
   ```

2. **Exécuter le script d'analyse**
   ```bash
   node tools/analyze-old-components.js
   ```

3. **Examiner toutes les références identifiées**
   - Ouvrez chaque fichier mentionné par le script.
   - Déterminez si la référence est active ou un simple commentaire/import inutilisé.
   - Si la référence est active, vous devrez adapter le code pour utiliser la nouvelle structure avant de supprimer les anciens composants.

4. **Supprimer les imports inutilisés**
   - Si le script trouve des imports qui ne sont pas réellement utilisés dans le code, vous pouvez les supprimer en toute sécurité.
   - Par exemple: `import { calculerROI } from './calculateur-roi/utils/calculFinancier';` si la fonction n'est jamais appelée.

5. **Supprimer les composants obsolètes**
   Une fois que vous avez confirmé qu'il n'y a pas de références actives, vous pouvez supprimer les composants:
   ```bash
   rm -rf src/components/calculateur-roi
   ```

6. **Tester minutieusement l'application**
   - Exécutez tous les tests automatisés.
   - Testez manuellement toutes les fonctionnalités importantes.
   - Vérifiez qu'il n'y a pas d'erreurs de compilation ou de runtime.

7. **Créer une PR pour les modifications**
   - Créez une branche dédiée pour ces modifications.
   - Soumettez une PR avec une description détaillée des changements.
   - Demandez une revue de code approfondie.

## Liste de vérification avant la fusion

- [ ] Le script d'analyse ne trouve plus de références aux anciens composants
- [ ] L'application compile sans erreurs
- [ ] Tous les tests automatisés passent
- [ ] Les fonctionnalités principales ont été testées manuellement
- [ ] Le README du projet a été mis à jour (si nécessaire)
- [ ] La documentation technique est à jour
- [ ] La PR a été revue par au moins un autre développeur

## Nettoyage progressif

Pour minimiser les risques, il est recommandé de procéder au nettoyage progressivement:

1. D'abord, supprimez uniquement les imports inutilisés.
2. Ensuite, supprimez les composants qui ne sont clairement pas utilisés.
3. Enfin, supprimez les composants restants une fois que vous êtes sûr qu'ils ne sont pas nécessaires.

Cette approche progressive permet de détecter rapidement tout problème et de le résoudre avant de poursuivre.

## Rapport de nettoyage

Après avoir terminé le nettoyage, documentez vos actions:

- Quels fichiers ont été supprimés
- Quelles modifications ont été apportées aux fichiers existants
- Tout problème rencontré et sa résolution
- Impact sur la taille du projet et les performances

Cette documentation sera utile pour suivre l'évolution du projet et comprendre les décisions prises lors du nettoyage.