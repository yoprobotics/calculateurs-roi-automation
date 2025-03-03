#!/usr/bin/env python

# Ce script est utilisé pour fusionner une pull request
# Il est nécessaire car l'API GitHub n'est pas directement exposée
# aux fonctions de Claude.

import os
import requests
import json

# Configurer les informations de base
repo = "calculateurs-roi-automation"
owner = "yoprobotics"
pr_number = 16

# Construire l'URL de l'API pour fusionner
url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}/merge"

# Configuration des en-têtes avec le token d'authentification
headers = {
    "Authorization": f"token {os.environ.get('GITHUB_TOKEN')}",
    "Accept": "application/vnd.github.v3+json"
}

# Préparer les données pour la fusion
data = {
    "commit_title": "Fusion: Suppression des modes détaillé et analyse du calculateur ROI",
    "commit_message": "Cette fusion supprime les modes détaillé et analyse du calculateur ROI pour simplifier l'interface utilisateur. Ces modes seront réintégrés dans une version ultérieure de l'application.",
    "merge_method": "merge"  # Autres options: "squash" ou "rebase"
}

# Envoyer la requête pour fusionner
response = requests.put(url, headers=headers, data=json.dumps(data))

# Vérifier la réponse
if response.status_code == 200:
    print(f"PR #{pr_number} fusionnée avec succès!")
else:
    print(f"Erreur lors de la fusion: {response.status_code}")
    print(response.json())
