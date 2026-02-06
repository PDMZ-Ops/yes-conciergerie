# Guide de déploiement sur GitHub Pages

Ce guide vous explique comment déployer votre application Yes Conciergerie sur GitHub Pages et la mettre à jour.

## 📋 Prérequis

1. Un compte GitHub
2. Git installé sur votre machine
3. Votre projet déjà sur GitHub (ou prêt à être poussé)

## 🚀 Étapes de déploiement initial

### 1. Préparer votre repository GitHub

1. Créez un nouveau repository sur GitHub (ou utilisez un existant)
   - **Important** : Notez le nom exact de votre repository (ex: `yes-conciergerie`)

2. Si vous n'avez pas encore initialisé Git localement :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

### 2. Configurer le base path

**⚠️ IMPORTANT** : Modifiez le fichier `vite.config.ts` ligne 10 :
- Remplacez `'/yes-conciergerie/'` par le nom de VOTRE repository
- Exemple : Si votre repo s'appelle `mon-app`, mettez `'/mon-app/'`
- Si votre repo s'appelle exactement `username.github.io`, mettez `'/'`

### 3. Activer GitHub Pages

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **Source**, sélectionnez :
   - **Source** : `GitHub Actions`
5. Sauvegardez

### 4. Déployer automatiquement

Le workflow GitHub Actions est déjà configuré ! Il se déclenchera automatiquement :

- ✅ À chaque push sur la branche `main`
- ✅ Vous pouvez aussi le déclencher manuellement depuis l'onglet **Actions** de GitHub

**Premier déploiement** :
1. Poussez votre code sur GitHub :
```bash
git add .
git commit -m "Configuration pour GitHub Pages"
git push origin main
```

2. Allez dans l'onglet **Actions** de votre repository
3. Vous verrez le workflow "Deploy to GitHub Pages" en cours
4. Attendez qu'il se termine (environ 2-3 minutes)

### 5. Accéder à votre site

Une fois le déploiement terminé :
- Votre site sera disponible à : `https://VOTRE_USERNAME.github.io/VOTRE_REPO/`
- L'URL exacte est affichée dans l'onglet **Settings > Pages** de votre repository

## 🔄 Mettre à jour votre application

### Méthode automatique (recommandée)

1. Faites vos modifications en local
2. Testez avec `npm run dev`
3. Commitez et poussez :
```bash
git add .
git commit -m "Description de vos modifications"
git push origin main
```

4. Le workflow GitHub Actions se déclenchera automatiquement
5. Attendez 2-3 minutes, votre site sera mis à jour !

### Vérifier le déploiement

1. Allez dans **Actions** sur GitHub
2. Cliquez sur le dernier workflow
3. Vérifiez qu'il est marqué en vert (✅)
4. Votre site est mis à jour !

## 🛠️ Commandes utiles

```bash
# Développement local
npm run dev

# Build local (pour tester)
npm run build

# Prévisualiser le build
npm run preview
```

## ⚠️ Notes importantes

1. **Variables d'environnement** : 
   - Les variables d'environnement sensibles doivent être configurées dans **Settings > Secrets and variables > Actions** de votre repository GitHub
   - Ajoutez-les avec le préfixe `VITE_` pour qu'elles soient accessibles dans le build
   - **Variables nécessaires pour votre app** :
     - `VITE_SUPABASE_URL` : URL de votre projet Supabase
     - `VITE_SUPABASE_ANON_KEY` : Clé anonyme de Supabase
     - `VITE_GEMINI_API_KEY` : Clé API Google Gemini (optionnel, si vous utilisez l'IA)
   
   **Comment les ajouter** :
   1. Allez sur votre repository GitHub
   2. **Settings** > **Secrets and variables** > **Actions**
   3. Cliquez sur **New repository secret**
   4. Ajoutez chaque variable avec son nom (ex: `VITE_SUPABASE_URL`)
   5. Collez la valeur et sauvegardez
   
   ⚠️ **Important** : Ces secrets seront automatiquement disponibles lors du build GitHub Actions

2. **Base path** :
   - Si vous changez le nom de votre repository, n'oubliez pas de mettre à jour `vite.config.ts`

3. **Branche principale** :
   - Si votre branche principale s'appelle `master` au lieu de `main`, modifiez `.github/workflows/deploy.yml` ligne 6

4. **Cache du navigateur** :
   - Après un déploiement, faites Ctrl+F5 pour vider le cache et voir les changements

## 🐛 Dépannage

**Le site ne se met pas à jour ?**
- Vérifiez que le workflow GitHub Actions a réussi (onglet Actions)
- Videz le cache de votre navigateur (Ctrl+F5)
- Vérifiez que le base path dans `vite.config.ts` correspond au nom de votre repo

**Erreur 404 ?**
- Vérifiez que le base path est correct dans `vite.config.ts`
- Assurez-vous que GitHub Pages est activé dans Settings > Pages

**Le build échoue ?**
- Vérifiez les logs dans l'onglet Actions
- Assurez-vous que toutes les dépendances sont dans `package.json`

## 📞 Besoin d'aide ?

Consultez la documentation GitHub Pages : https://docs.github.com/en/pages
