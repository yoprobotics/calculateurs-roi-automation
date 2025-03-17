// Ce script est destiné à être utilisé localement pour trouver et corriger l'erreur de syntaxe

const fs = require('fs');
const path = require('path');

// Chemin vers le fichier problématique
const filePath = path.join(__dirname, 'src', 'components', 'CalculateurROI.jsx');

try {
  // Lire le fichier
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Diviser en lignes pour identifier la ligne 393
  const lines = content.split('\n');
  
  // Afficher les lignes autour de l'erreur pour contexte
  console.log('Contexte autour de la ligne 393:');
  for (let i = 388; i <= 398; i++) {
    console.log(`${i}: ${lines[i-1]}`);
  }
  
  console.log('\nVérifiez cette région pour les problèmes de syntaxe courants:');
  console.log('- Parenthèses, accolades ou crochets non fermés');
  console.log('- Virgules manquantes ou en trop dans les objets');
  console.log('- Opérateurs incorrects');
  console.log('- Chaînes de caractères non fermées');
} catch (error) {
  console.error('Erreur lors de la lecture du fichier:', error);
}
