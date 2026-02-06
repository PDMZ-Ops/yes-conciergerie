# 🔧 Dépannage - Erreur 404 sur GitHub Pages

## Problème : Erreur 404 sur `https://pdmz-ops.github.io/yes-conciergerie/`

### ✅ Vérifications à faire

#### 1. **Vérifier que GitHub Pages est activé**

1. Allez sur votre repository : `https://github.com/pdmz-ops/yes-conciergerie`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Vérifiez que :
   - **Source** est défini sur **GitHub Actions** (pas "Deploy from a branch")
   - Si ce n'est pas le cas, changez-le et sauvegardez

#### 2. **Vérifier que le workflow a été exécuté**

1. Allez dans l'onglet **Actions** de votre repository
2. Vérifiez qu'il y a au moins un workflow "Deploy to GitHub Pages"
3. Vérifiez qu'il est marqué en **vert** (✅) et non en rouge (❌)
4. Si le workflow n'existe pas ou a échoué :
   - Faites un push de votre code
   - Ou déclenchez-le manuellement : **Actions** > **Deploy to GitHub Pages** > **Run workflow**

#### 3. **Vérifier le base path dans le build**

Le base path doit être `/yes-conciergerie/` pour que l'URL fonctionne.

**Comment vérifier** :
1. Allez dans **Actions** > cliquez sur le dernier workflow
2. Cliquez sur le job **build**
3. Regardez les logs du build
4. Cherchez le base path utilisé

**Si le base path est incorrect**, le problème vient de `vite.config.ts`. La configuration a été corrigée pour détecter automatiquement le nom du repository.

#### 4. **Forcer un nouveau déploiement**

Si tout semble correct mais que ça ne fonctionne toujours pas :

```bash
# En local, faites :
git add .
git commit -m "Fix: Correction du base path pour GitHub Pages"
git push origin main
```

Puis attendez 2-3 minutes et vérifiez à nouveau.

#### 5. **Vérifier l'URL exacte**

L'URL doit être exactement :
- ✅ `https://pdmz-ops.github.io/yes-conciergerie/` (avec le slash à la fin)
- ❌ `https://pdmz-ops.github.io/yes-conciergerie` (sans slash)

#### 6. **Vider le cache du navigateur**

Parfois le navigateur cache l'ancienne version :
- **Chrome/Edge** : `Ctrl + Shift + R` ou `Ctrl + F5`
- **Firefox** : `Ctrl + Shift + R`
- Ou ouvrez en navigation privée

### 🐛 Problèmes courants

#### Le workflow échoue avec une erreur

**Erreur : "Missing Supabase env vars"**
→ Ajoutez les secrets dans **Settings** > **Secrets and variables** > **Actions** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (optionnel)

**Erreur : "Build failed"**
→ Vérifiez les logs dans l'onglet Actions pour voir l'erreur exacte

#### Le workflow réussit mais le site ne charge pas

1. Vérifiez que GitHub Pages est bien activé (étape 1)
2. Attendez 5-10 minutes (parfois il y a un délai)
3. Vérifiez l'URL dans **Settings** > **Pages** (elle devrait être affichée)

#### Le site charge mais toutes les pages donnent 404

C'est un problème de base path. Vérifiez que :
- Le base path dans `vite.config.ts` correspond au nom de votre repo
- Le workflow utilise bien `GITHUB_REPOSITORY` (c'est maintenant automatique)

### 📝 Checklist rapide

- [ ] GitHub Pages activé avec source "GitHub Actions"
- [ ] Workflow "Deploy to GitHub Pages" existe et a réussi (✅)
- [ ] Base path = `/yes-conciergerie/` (détecté automatiquement)
- [ ] URL testée avec le slash final : `https://pdmz-ops.github.io/yes-conciergerie/`
- [ ] Cache du navigateur vidé
- [ ] Secrets GitHub configurés (si nécessaire)

### 🆘 Si rien ne fonctionne

1. Vérifiez que votre repository s'appelle bien `yes-conciergerie` (pas `yes-conciergerie-main` ou autre)
2. Vérifiez que votre branche principale s'appelle `main` (sinon modifiez `.github/workflows/deploy.yml` ligne 6)
3. Créez un fichier `.env` local avec `VITE_BASE_PATH=/yes-conciergerie/` pour forcer le base path
