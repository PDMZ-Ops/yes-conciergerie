# 🚀 Déployer l'Edge Function Supabase (Windows)

## 📋 Méthode 1 : Installation via Scoop (Recommandé)

### 1. Installer Scoop (si pas déjà installé)

Ouvrez PowerShell en tant qu'administrateur et exécutez :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### 2. Installer Supabase CLI via Scoop

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 3. Vérifier l'installation

```powershell
supabase --version
```

## 📋 Méthode 2 : Téléchargement direct (Alternative)

### 1. Télécharger Supabase CLI

1. Allez sur : https://github.com/supabase/cli/releases
2. Téléchargez `supabase_windows_amd64.zip` (ou la version appropriée pour votre système)
3. Extrayez le fichier `supabase.exe`
4. Placez-le dans un dossier accessible (ex: `C:\tools\supabase\`)
5. Ajoutez ce dossier à votre PATH Windows

### 2. Vérifier l'installation

Ouvrez un nouveau terminal et exécutez :

```powershell
supabase --version
```

## 🔧 Étapes de déploiement (après installation)

### 1. Se connecter à Supabase

```powershell
supabase login
```

Cela ouvrira votre navigateur pour vous connecter avec votre compte GitHub/Supabase.

### 2. Lier votre projet Supabase

```powershell
cd "C:\Users\pierr\Desktop\Yes Conciergie"
supabase link --project-ref ibfrzrninfbmfdsnrfyl
```

Vous devrez entrer votre **Database Password** (trouvable dans Supabase Dashboard > Settings > Database).

### 3. Déployer la fonction

```powershell
supabase functions deploy create-project
```

### 4. Vérifier le déploiement

Une fois déployé, vous devriez voir un message de succès. Testez l'endpoint :

```powershell
curl -X POST https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project -H "Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]" -H "Content-Type: application/json" -d '[{"firstName":"Test","lastName":"User","location":"Paris"}]'
```

## 🆘 Dépannage

### Erreur : "command not found"

- Vérifiez que Supabase CLI est bien installé : `supabase --version`
- Si installé via téléchargement direct, vérifiez que le dossier est dans votre PATH

### Erreur : "project not found"

- Vérifiez que votre project ref est correct : `ibfrzrninfbmfdsnrfyl`
- Vous pouvez le trouver dans l'URL de votre projet Supabase : `https://supabase.com/dashboard/project/[PROJECT_REF]`

### Erreur : "authentication failed"

- Réessayez `supabase login`
- Vérifiez que vous êtes connecté au bon compte Supabase

## ✅ Une fois déployé

Votre endpoint sera disponible à :
`https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project`

Vous pouvez maintenant l'utiliser dans n8n !
