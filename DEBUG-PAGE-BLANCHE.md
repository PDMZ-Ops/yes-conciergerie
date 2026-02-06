# 🔍 Déboguer la page blanche

## ✅ Vérifications à faire

### 1. Ouvrir la console du navigateur

1. Allez sur : `https://pdmz-ops.github.io/yes-conciergerie/`
2. Appuyez sur **F12** (ou clic droit > Inspecter)
3. Allez dans l'onglet **Console**
4. Regardez les erreurs affichées

### 2. Erreurs courantes et solutions

#### ❌ Erreur : "Missing Supabase env vars"
**Cause** : Les variables d'environnement ne sont pas définies dans les secrets GitHub

**Solution** :
1. Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/settings/secrets/actions`
2. Ajoutez ces secrets :
   - `VITE_SUPABASE_URL` : Votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` : Votre clé anonyme Supabase
3. Relancez le workflow GitHub Actions

#### ❌ Erreur 404 pour les fichiers JS/CSS
**Cause** : Les chemins ne sont pas corrects

**Solution** :
- Vérifiez que le base path est bien `/yes-conciergerie/` dans `vite.config.ts`
- Rebuild et redéployez

#### ❌ Erreur : "Failed to fetch" ou erreurs réseau
**Cause** : Problème de CORS ou de connexion à Supabase

**Solution** :
- Vérifiez que votre projet Supabase autorise les requêtes depuis `https://pdmz-ops.github.io`
- Vérifiez les règles RLS (Row Level Security) dans Supabase

### 3. Vérifier les fichiers déployés

Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/tree/gh-pages`

Vous devriez voir :
- ✅ `index.html`
- ✅ Dossier `assets/` avec les fichiers JS
- ✅ `404.html` (si créé)

### 4. Vérifier le contenu de index.html déployé

1. Allez sur : `https://github.com/PDMZ-Ops/yes-conciergerie/blob/gh-pages/index.html`
2. Vérifiez que les chemins commencent par `/yes-conciergerie/` :
   - ✅ `<script src="/yes-conciergerie/assets/index-xxx.js">`
   - ❌ `<script src="/assets/index-xxx.js">`

### 5. Tester en local avec le build

```bash
# Build
npm run build

# Prévisualiser
npm run preview
```

Puis testez : `http://localhost:4173/yes-conciergerie/`

## 🔧 Actions correctives

### 1. Supprimer la référence à index.css

Le fichier `index.html` référence `/index.css` qui n'existe pas. C'est corrigé dans le code source.

### 2. Vérifier les secrets GitHub

Assurez-vous que ces secrets sont définis :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (optionnel)

### 3. Redéployer

Après avoir corrigé les problèmes :

```bash
git add .
git commit -m "Fix: Correction page blanche"
git push origin main
```

Attendez que le workflow se termine, puis testez à nouveau.

## 📞 Informations à me donner

Pour que je puisse mieux vous aider, dites-moi :

1. **Quelles erreurs voyez-vous dans la console ?** (F12 > Console)
2. **Le fichier index.html déployé a-t-il les bons chemins ?** (vérifiez sur GitHub)
3. **Les secrets GitHub sont-ils configurés ?**
