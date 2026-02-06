# 🔧 Résoudre le problème de page blanche

## 🔍 Causes possibles

1. **Chemins des assets incorrects** (le plus probable)
2. **Erreurs JavaScript dans la console**
3. **Variables d'environnement manquantes**
4. **Base path mal configuré**

## ✅ Solutions

### 1. Vérifier la console du navigateur

**Ouvrez la console** (F12) et regardez les erreurs :
- Erreurs 404 pour les fichiers JS/CSS → problème de chemins
- Erreurs de variables d'environnement → secrets manquants
- Erreurs JavaScript → problème de code

### 2. Vérifier les fichiers déployés

Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/tree/gh-pages`

Vous devriez voir :
- `index.html`
- Dossier `assets/` avec les fichiers JS/CSS

### 3. Vérifier le base path

Dans `index.html` déployé, les chemins doivent commencer par `/yes-conciergerie/` :
- ✅ `<script src="/yes-conciergerie/assets/index-xxx.js">`
- ❌ `<script src="/assets/index-xxx.js">`

### 4. Créer un fichier 404.html pour GitHub Pages

GitHub Pages a besoin d'un fichier 404.html qui redirige vers index.html pour gérer le routing.
