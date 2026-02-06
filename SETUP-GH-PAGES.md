# 🚀 Créer la branche gh-pages - Guide étape par étape

## ⚠️ Important : La branche `gh-pages` sera créée automatiquement

La branche `gh-pages` n'existe pas encore, c'est **normal** ! Elle sera créée automatiquement par le workflow GitHub Actions lors du premier déploiement.

## 📋 Étapes pour créer la branche `gh-pages`

### Option 1 : Automatique (Recommandé) ✅

1. **Poussez votre code sur GitHub** (si ce n'est pas déjà fait) :
```bash
git add .
git commit -m "Configuration pour GitHub Pages"
git push origin main
```

2. **Vérifiez que le workflow s'exécute** :
   - Allez sur : `https://github.com/pdmz-ops/yes-conciergerie/actions`
   - Vous devriez voir le workflow "Deploy to GitHub Pages (Branch)" en cours
   - Attendez qu'il se termine (2-3 minutes)

3. **Une fois le workflow terminé** :
   - La branche `gh-pages` sera créée automatiquement
   - Vous pouvez la voir dans l'onglet **Code** > menu déroulant des branches

4. **Configurez GitHub Pages** :
   - Allez sur : `https://github.com/pdmz-ops/yes-conciergerie/settings/pages`
   - **Source** : `Deploy from a branch`
   - **Branch** : `gh-pages`
   - **Folder** : `/ (root)`
   - Cliquez sur **Save**

### Option 2 : Créer la branche manuellement (si le workflow ne fonctionne pas)

Si le workflow ne crée pas la branche, vous pouvez la créer manuellement :

1. **Build votre application en local** :
```bash
npm run build
```

2. **Créez et poussez la branche gh-pages** :
```bash
# Créer une branche orpheline (sans historique)
git checkout --orphan gh-pages

# Supprimer tous les fichiers (sauf ceux dans dist)
git rm -rf .

# Copier les fichiers buildés
cp -r dist/* .

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial gh-pages commit"

# Pousser la branche
git push origin gh-pages

# Revenir sur main
git checkout main
```

3. **Configurez GitHub Pages** (comme dans l'Option 1, étape 4)

## 🔍 Vérifier que tout fonctionne

1. **Vérifiez que la branche existe** :
   - Allez sur votre repository GitHub
   - Cliquez sur le menu déroulant des branches (en haut à gauche)
   - Vous devriez voir `gh-pages` dans la liste

2. **Vérifiez GitHub Pages** :
   - Allez dans **Settings** > **Pages**
   - Vous devriez voir : "Your site is live at `https://pdmz-ops.github.io/yes-conciergerie/`"

3. **Testez l'URL** :
   - Attendez 1-2 minutes après la configuration
   - Visitez : `https://pdmz-ops.github.io/yes-conciergerie/`

## 🐛 Problèmes courants

### Le workflow ne se déclenche pas

**Solution** :
1. Vérifiez que votre branche principale s'appelle bien `main` (pas `master`)
2. Vérifiez que le fichier `.github/workflows/deploy.yml` existe et est poussé sur GitHub
3. Déclenchez le workflow manuellement : **Actions** > **Deploy to GitHub Pages (Branch)** > **Run workflow**

### Le workflow échoue

**Vérifiez les logs** :
1. Allez dans **Actions**
2. Cliquez sur le workflow qui a échoué
3. Regardez les erreurs dans les logs

**Erreurs courantes** :
- **"Missing secrets"** : Ajoutez les secrets dans **Settings** > **Secrets and variables** > **Actions**
- **"Build failed"** : Vérifiez que toutes les dépendances sont dans `package.json`

### La branche gh-pages n'apparaît pas après le workflow

**Solution** :
1. Attendez 1-2 minutes (parfois il y a un délai)
2. Rafraîchissez la page GitHub
3. Utilisez l'Option 2 pour créer la branche manuellement

## ✅ Checklist

- [ ] Code poussé sur GitHub (branche `main`)
- [ ] Workflow GitHub Actions exécuté avec succès
- [ ] Branche `gh-pages` visible dans le repository
- [ ] GitHub Pages configuré avec source "Deploy from a branch"
- [ ] Site accessible à `https://pdmz-ops.github.io/yes-conciergerie/`
