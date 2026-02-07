# 🚀 Déployer l'Edge Function Supabase

## 📋 Prérequis

1. **Supabase CLI installé** :
```bash
npm install -g supabase
```

2. **Compte Supabase** avec accès au projet

## 🔧 Étapes de déploiement

### 1. Installer Supabase CLI (si pas déjà fait)

```bash
npm install -g supabase
```

### 2. Se connecter à Supabase

```bash
supabase login
```

Suivez les instructions pour vous connecter avec votre compte GitHub.

### 3. Lier votre projet Supabase

```bash
supabase link --project-ref ibfrzrninfbmfdsnrfyl
```

Remplacez `ibfrzrninfbmfdsnrfyl` par votre project ref si différent.

### 4. Déployer la fonction

```bash
supabase functions deploy create-project
```

### 5. Configurer les secrets (optionnel mais recommandé)

Si vous voulez utiliser un `user_id` par défaut (pour éviter de le passer à chaque fois) :

1. Allez sur : https://supabase.com/dashboard/project/ibfrzrninfbmfdsnrfyl/settings/functions
2. Cliquez sur **"Secrets"**
3. Ajoutez :
   - **Name** : `DEFAULT_USER_ID`
   - **Value** : L'UUID de l'utilisateur par défaut (vous pouvez le trouver dans la table `auth.users` de Supabase)

**Note** : Les secrets `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement disponibles, pas besoin de les ajouter.

## ✅ Vérification

Une fois déployé, testez l'endpoint :

```bash
curl -X POST \
  https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project \
  -H "Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '[{
    "firstName": "Test",
    "lastName": "User",
    "location": "Paris",
    "info": {
      "profession": "Test"
    }
  }]'
```

## 🔍 Trouver votre user_id

Si vous avez besoin du `user_id` par défaut :

1. Allez sur Supabase Dashboard > **Authentication** > **Users**
2. Trouvez votre utilisateur
3. Copiez son **UUID** (c'est le `user_id`)

Ou utilisez cette requête SQL dans l'éditeur SQL de Supabase :

```sql
SELECT id, email FROM auth.users;
```
