# 🔍 Vérifier si le projet a été créé

## Méthode 1 : Vérifier dans Supabase Dashboard

1. Allez sur : https://supabase.com/dashboard/project/ibfrzrninfbmfdsnrfyl
2. Allez dans **Table Editor** > **projects**
3. Regardez la dernière ligne - vous devriez voir votre nouveau projet
4. Notez le `user_id` de ce projet

## Méthode 2 : Vérifier avec SQL

Dans Supabase Dashboard > **SQL Editor**, exécutez :

```sql
SELECT id, first_name, last_name, location, user_id, created_at 
FROM projects 
ORDER BY created_at DESC 
LIMIT 5;
```

Cela vous montrera les 5 derniers projets créés avec leur `user_id`.

## 🔧 Solution : Utiliser votre user_id dans n8n

Le projet a probablement été créé avec un `user_id` système différent du vôtre. Pour que le projet apparaisse dans votre dashboard, vous devez :

### Option 1 : Passer votre user_id dans le payload n8n

Ajoutez `userId` dans votre payload n8n :

```json
[
  {
    "firstName": "Thomas",
    "lastName": "N/D",
    "location": "La Rochelle",
    "userId": "[VOTRE_USER_ID]",
    "info": { ... }
  }
]
```

**Comment trouver votre user_id** :
1. Allez sur Supabase Dashboard > **Authentication** > **Users**
2. Trouvez votre utilisateur (celui avec lequel vous vous connectez)
3. Copiez son **UUID** (c'est votre `user_id`)

### Option 2 : Modifier la fonction pour utiliser un user_id par défaut

Configurez `DEFAULT_USER_ID` dans les secrets Supabase avec votre `user_id` personnel.

## 🎯 Solution rapide

1. **Trouvez votre user_id** (voir Option 1 ci-dessus)
2. **Ajoutez-le dans votre payload n8n** :
   - Ajoutez un champ `userId` avec votre UUID
3. **Testez à nouveau** - le projet devrait apparaître dans votre dashboard
