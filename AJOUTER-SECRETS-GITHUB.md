# 🔐 Ajouter les secrets GitHub pour Supabase

## ⚠️ Problème actuel

L'erreur `Missing Supabase env vars` indique que les variables d'environnement ne sont pas définies dans les secrets GitHub.

## ✅ Solution : Ajouter les secrets GitHub

### Étape 1 : Trouver vos clés Supabase

1. Allez sur votre projet Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** (Paramètres) > **API**
4. Vous verrez :
   - **Project URL** : C'est votre `VITE_SUPABASE_URL`
   - **anon public** key : C'est votre `VITE_SUPABASE_ANON_KEY`

### Étape 2 : Ajouter les secrets sur GitHub

1. **Allez sur votre repository GitHub** :
   - `https://github.com/PDMZ-Ops/yes-conciergerie/settings/secrets/actions`

2. **Cliquez sur "New repository secret"**

3. **Ajoutez le premier secret** :
   - **Name** : `VITE_SUPABASE_URL`
   - **Secret** : Collez votre Project URL de Supabase (ex: `https://xxxxx.supabase.co`)
   - Cliquez sur **Add secret**

4. **Ajoutez le deuxième secret** :
   - Cliquez à nouveau sur **"New repository secret"**
   - **Name** : `VITE_SUPABASE_ANON_KEY`
   - **Secret** : Collez votre clé "anon public" de Supabase
   - Cliquez sur **Add secret**

5. **(Optionnel) Ajoutez la clé Gemini** (si vous utilisez l'IA) :
   - **Name** : `VITE_GEMINI_API_KEY`
   - **Secret** : Votre clé API Google Gemini
   - Cliquez sur **Add secret**

### Étape 3 : Redéployer

Une fois les secrets ajoutés, vous devez relancer le workflow :

1. **Allez dans l'onglet Actions** :
   - `https://github.com/PDMZ-Ops/yes-conciergerie/actions`

2. **Cliquez sur "Deploy to GitHub Pages (Branch)"**

3. **Cliquez sur "Run workflow"** (bouton en haut à droite)

4. **Sélectionnez la branche `main`**

5. **Cliquez sur "Run workflow"**

6. **Attendez 2-3 minutes** que le workflow se termine

7. **Testez votre site** :
   - `https://pdmz-ops.github.io/yes-conciergerie/`

## ✅ Vérification

Après le redéploiement, votre site devrait fonctionner ! Si vous voyez toujours une page blanche :

1. **Ouvrez la console** (F12)
2. **Vérifiez qu'il n'y a plus l'erreur** "Missing Supabase env vars"
3. **Si vous voyez d'autres erreurs**, notez-les et dites-moi

## 📝 Résumé des secrets à ajouter

| Nom du secret | Description | Où le trouver |
|--------------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | Supabase Dashboard > Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Clé publique anonyme Supabase | Supabase Dashboard > Settings > API > anon public key |
| `VITE_GEMINI_API_KEY` | (Optionnel) Clé API Google Gemini | Google AI Studio |

## ⚠️ Important

- Les secrets sont **sensibles** : ne les partagez jamais publiquement
- Une fois ajoutés, ils seront automatiquement disponibles lors du build GitHub Actions
- Vous n'avez pas besoin de les redéfinir à chaque déploiement
