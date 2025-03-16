/**
 * Script d'analyse pour identifier les références aux anciens composants
 * 
 * Pour exécuter ce script:
 * 1. npm install glob fs-extra chalk
 * 2. node tools/analyze-old-components.js
 */

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const chalk = require('chalk');

// Composants à rechercher
const componentsToCheck = [
  './calculateur-roi/AnalyseComparative',
  './calculateur-roi/ParametresGeneraux',
  './calculateur-roi/ParametresSystemeActuel',
  './calculateur-roi/ParametresSystemeAutomatise',
  './calculateur-roi/ResultatsFinanciers',
  './calculateur-roi/utils/calculFinancier',
  'calculateur-roi',
  'CalculateurROI'
];

// Fonction principale
async function analyzeOldComponents() {
  console.log(chalk.blue('Analyse des références aux anciens composants...'));
  console.log(chalk.gray('--------------------------------------------------'));
  
  // Récupérer tous les fichiers JavaScript/JSX
  const files = glob.sync('src/**/*.{js,jsx}', { ignore: 'src/components/calculateur-roi/**' });
  const results = {};
  
  // Initialiser les résultats
  componentsToCheck.forEach(component => {
    results[component] = [];
  });
  
  // Analyser chaque fichier
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    
    for (const component of componentsToCheck) {
      if (content.includes(component)) {
        results[component].push(file);
      }
    }
  }
  
  // Afficher les résultats
  let foundReferences = false;
  
  Object.keys(results).forEach(component => {
    const references = results[component];
    
    if (references.length > 0) {
      foundReferences = true;
      console.log(chalk.yellow(`Références à "${component}" trouvées dans:`));
      references.forEach(file => {
        console.log(`  - ${file}`);
      });
      console.log('');
    }
  });
  
  if (!foundReferences) {
    console.log(chalk.green('Aucune référence aux anciens composants trouvée.'));
    console.log(chalk.green('Il est probablement sûr de supprimer le dossier src/components/calculateur-roi/.'));
  } else {
    console.log(chalk.red('Des références aux anciens composants ont été trouvées.'));
    console.log(chalk.red('Examinez attentivement ces références avant de supprimer les composants.'));
  }
  
  console.log(chalk.gray('--------------------------------------------------'));
  console.log(chalk.blue('Analyse terminée.'));
}

analyzeOldComponents().catch(err => {
  console.error(chalk.red('Erreur lors de l\'analyse:'), err);
  process.exit(1);
});
