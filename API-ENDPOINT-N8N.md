# 🔗 Endpoint API pour créer un projet depuis n8n

## 📍 URL de l'endpoint

**URL** : `https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project`

**Méthode** : `POST`

## 🔐 Authentification

**Header requis** :
```
Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]
```

Ou utilisez la clé service role pour un accès admin (recommandé pour les webhooks).

## 📦 Format du payload

Votre payload n8n est déjà au bon format ! Vous pouvez l'envoyer tel quel :

### Format attendu (array avec un objet)

```json
[
  {
    "firstName": "Thomas",
    "lastName": "N/D",
    "location": "La Rochelle",
    "info": {
      "email": "N/D",
      "phone": "N/D",
      "profession": "responsable d'agence immobilière",
      "conciergeCommission": "N/D",
      "exchangeDate": "N/D",
      "strengths": [
        "expérience terrain",
        "rigueur",
        "sens du service"
      ],
      "biography": "41 ans, habite à La Rochelle...",
      "goals": [
        "structurer une activité de conciergerie",
        "construire un vrai business local"
      ],
      "targetRevenueY1": "N/D",
      "targetRevenueY2": "N/D",
      "targetRevenueY3": "N/D",
      "targetGrossMargin": "N/D"
    },
    "userId": "[UUID_UTILISATEUR]" // Optionnel si DEFAULT_USER_ID est configuré
  }
]
```

### Format alternatif (objet simple)

```json
{
  "firstName": "Thomas",
  "lastName": "N/D",
  "location": "La Rochelle",
  "info": { ... },
  "userId": "[UUID_UTILISATEUR]"
}
```

## 🚀 Configuration dans n8n

### 1. Node HTTP Request

- **Method** : `POST`
- **URL** : `https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project`
- **Authentication** : `Generic Credential Type`
  - **Name** : `Authorization`
  - **Value** : `Bearer [VOTRE_SUPABASE_ANON_KEY]`
- **Body** : Votre payload JSON (tel quel depuis votre workflow)

### 2. Exemple de configuration n8n

```json
{
  "method": "POST",
  "url": "https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project",
  "authentication": "genericCredentialType",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer [VOTRE_SUPABASE_ANON_KEY]"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": []
  },
  "specifyBody": "json",
  "jsonBody": "={{ $json }}"
}
```

## 📝 Champs requis

- `firstName` : **Requis**
- `lastName` : **Requis**
- `location` : **Requis**
- `info` : Optionnel (objet avec les informations du projet)
- `userId` : **Optionnel** - Si non fourni, un utilisateur système sera créé automatiquement

## ✅ Réponse de succès

```json
{
  "success": true,
  "project": {
    "id": "uuid-du-projet",
    "firstName": "Thomas",
    "lastName": "N/D",
    "location": "La Rochelle",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "info": { ... }
  }
}
```

## ❌ Réponse d'erreur

```json
{
  "error": "Missing required fields: firstName, lastName, location",
  "details": "..."
}
```

## 🔧 Déploiement de la fonction Supabase

### 1. Installer Supabase CLI

```bash
npm install -g supabase
```

### 2. Se connecter à Supabase

```bash
supabase login
```

### 3. Lier le projet

```bash
supabase link --project-ref ibfrzrninfbmfdsnrfyl
```

### 4. Déployer la fonction

```bash
supabase functions deploy create-project
```

### 5. Configurer les variables d'environnement

Dans le dashboard Supabase :
1. Allez dans **Project Settings** > **Edge Functions**
2. Ajoutez les secrets :
   - `DEFAULT_USER_ID` : UUID de l'utilisateur par défaut (optionnel)
   - `SUPABASE_URL` : Déjà configuré automatiquement
   - `SUPABASE_SERVICE_ROLE_KEY` : Déjà configuré automatiquement

## 📌 Notes importantes

1. **Arrays dans info** : Les tableaux (`strengths`, `goals`) sont automatiquement convertis en chaînes séparées par des virgules pour le stockage en base de données.

2. **userId** : Si vous ne fournissez pas de `userId` dans le payload, la fonction créera automatiquement un utilisateur système (`system@yes-conciergerie.local`) et l'utilisera. Cet utilisateur sera réutilisé pour toutes les créations futures. Vous pouvez aussi configurer `DEFAULT_USER_ID` dans les secrets Supabase pour utiliser un utilisateur spécifique.

3. **CORS** : La fonction accepte les requêtes depuis n'importe quelle origine (configuré pour n8n).

4. **Format "N/D"** : Les valeurs "N/D" sont acceptées et stockées telles quelles dans la base de données.

## 🧪 Test de l'endpoint

Vous pouvez tester avec curl :

```bash
curl -X POST \
  https://ibfrzrninfbmfdsnrfyl.supabase.co/functions/v1/create-project \
  -H "Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "firstName": "Thomas",
      "lastName": "N/D",
      "location": "La Rochelle",
      "info": {
        "profession": "responsable d'\''agence immobilière",
        "strengths": ["expérience terrain", "rigueur"],
        "goals": ["structurer une activité"]
      }
    }
  ]'
```
