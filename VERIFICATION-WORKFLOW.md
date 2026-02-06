# ✅ Vérification du workflow "Deploy to GitHub Pages (Branch)"

## 📍 Où trouver le workflow

1. **Allez sur votre repository GitHub** :
   - `https://github.com/PDMZ-Ops/yes-conciergerie`

2. **Cliquez sur l'onglet "Actions"** (en haut de la page)

3. **Vous devriez voir** :
   - Dans la liste à gauche : "Deploy to GitHub Pages (Branch)"
   - Au centre : Les exécutions du workflow (runs)

## 🔍 État du workflow

### ✅ Si le workflow est en cours (jaune/orange)
- Attendez qu'il se termine (2-3 minutes)
- Une fois terminé, il passera en vert ✅

### ✅ Si le workflow est vert (succès)
- La branche `gh-pages` a été créée automatiquement
- Vous pouvez maintenant configurer GitHub Pages

### ❌ Si le workflow est rouge (échec)
- Cliquez dessus pour voir les erreurs
- Vérifiez les logs pour identifier le problème

## 🚀 Prochaines étapes selon l'état

### Si le workflow est ✅ VERT (succès) :

1. **Vérifiez que la branche `gh-pages` existe** :
   - Allez dans l'onglet **Code**
   - Cliquez sur le menu déroulant des branches (en haut à gauche)
   - Vous devriez voir `gh-pages` dans la liste

2. **Configurez GitHub Pages** :
   - Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/settings/pages`
   - **Source** : `Deploy from a branch`
   - **Branch** : `gh-pages`
   - **Folder** : `/ (root)`
   - Cliquez sur **Save**

3. **Attendez 1-2 minutes**, puis testez :
   - `https://pdmz-ops.github.io/yes-conciergerie/`

### Si le workflow est ❌ ROUGE (échec) :

1. **Cliquez sur le workflow qui a échoué**
2. **Regardez les logs** pour identifier l'erreur
3. **Erreurs courantes** :
   - **"Missing secrets"** : Ajoutez les secrets dans Settings > Secrets and variables > Actions
   - **"Build failed"** : Vérifiez les logs du build pour voir l'erreur exacte
   - **"Permission denied"** : Vérifiez les permissions du workflow

### Si le workflow n'apparaît toujours pas :

1. **Vérifiez que le fichier existe sur GitHub** :
   - Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/tree/main/.github/workflows`
   - Vous devriez voir `deploy.yml`

2. **Si le fichier n'existe pas** :
   - Le push n'a peut-être pas fonctionné
   - Essayez de pousser à nouveau :
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages workflow"
   git push origin main
   ```

## 🔄 Déclencher le workflow manuellement

Si le workflow ne s'est pas déclenché automatiquement :

1. Allez dans l'onglet **Actions**
2. Cliquez sur **"Deploy to GitHub Pages (Branch)"** dans la liste de gauche
3. Cliquez sur **"Run workflow"** (bouton en haut à droite)
4. Sélectionnez la branche `main`
5. Cliquez sur **"Run workflow"**

## 📞 Besoin d'aide ?

Dites-moi :
- ✅ Le workflow est-il visible dans l'onglet Actions ?
- ✅ Quel est son état (vert, rouge, ou en cours) ?
- ❌ Y a-t-il des erreurs dans les logs ?
