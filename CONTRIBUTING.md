# Guide de contribution

Merci de votre intérêt pour contribuer au projet Calculateurs ROI Automation. Voici quelques lignes directrices pour vous aider à participer efficacement.

## Workflow de développement

1. **Issues** : Toute nouvelle fonctionnalité ou correction de bug doit commencer par une issue GitHub. Décrivez clairement le problème ou la fonctionnalité souhaitée.

2. **Branches** : Créez une nouvelle branche à partir de `main` pour chaque fonctionnalité ou correction. Utilisez une convention de nommage claire :
   - `feature/nom-de-la-fonctionnalite` pour les nouvelles fonctionnalités
   - `bugfix/description-du-bug` pour les corrections
   - `docs/sujet` pour les modifications de documentation

3. **Commits** : Utilisez des messages de commit descriptifs et concis qui expliquent clairement les modifications apportées.

4. **Pull Requests** : Une fois votre travail terminé, soumettez une pull request vers la branche `main`. Incluez une description détaillée de vos modifications, ainsi que les références aux issues concernées.

5. **Revue de code** : Toutes les pull requests doivent être revues avant d'être fusionnées. Soyez ouvert aux commentaires et aux suggestions d'amélioration.

## Style de code

- Suivez les conventions React/JavaScript modernes
- Utilisez les fonctions composants (React Hooks) plutôt que les classes
- Documentez votre code avec des commentaires clairs
- Préférez les noms de variables et fonctions descriptifs en français

## Tests

- Écrivez des tests unitaires pour toute nouvelle fonctionnalité
- Assurez-vous que tous les tests existants passent avant de soumettre une PR
- Les tests sont exécutés automatiquement via GitHub Actions

## Configuration de l'environnement de développement

```bash
# Cloner le dépôt
git clone https://github.com/yoprobotics/calculateurs-roi-automation.git
cd calculateurs-roi-automation

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start

# Exécuter les tests
npm test
```

## Déploiement

Le déploiement est automatisé via GitHub Actions. Toute modification fusionnée dans la branche `main` déclenche automatiquement un nouveau déploiement.

## Questions

Si vous avez des questions ou besoin d'aide, n'hésitez pas à créer une issue avec le label "question".
