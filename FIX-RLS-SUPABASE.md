# 🔧 Corriger les Row Level Security (RLS) dans Supabase

## ⚠️ Problème

Même si le code ne filtre plus par `user_id`, les **Row Level Security (RLS)** dans Supabase peuvent bloquer l'accès aux projets créés par d'autres utilisateurs ou par votre automation.

## ✅ Solution : Modifier les politiques RLS

### Option 1 : Désactiver RLS (pour développement/test)

1. Allez sur : https://supabase.com/dashboard/project/ibfrzrninfbmfdsnrfyl
2. Allez dans **Table Editor** > **projects**
3. Cliquez sur l'onglet **Policies** (ou **RLS**)
4. Désactivez RLS pour la table `projects`

Ou via SQL :

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

### Option 2 : Créer des politiques permissives (recommandé)

Allez dans **SQL Editor** et exécutez :

```sql
-- Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Users can only see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can only update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can only delete their own projects" ON projects;

-- Créer des politiques permissives pour SELECT (lecture)
CREATE POLICY "Allow all authenticated users to read all projects"
ON projects FOR SELECT
TO authenticated
USING (true);

-- Créer des politiques permissives pour INSERT (création)
CREATE POLICY "Allow all authenticated users to insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Créer des politiques permissives pour UPDATE (modification)
CREATE POLICY "Allow all authenticated users to update all projects"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Créer des politiques permissives pour DELETE (suppression)
CREATE POLICY "Allow all authenticated users to delete all projects"
ON projects FOR DELETE
TO authenticated
USING (true);
```

### Option 3 : Permettre l'accès public (si vous utilisez anon key)

Si votre application utilise la clé `anon` (publique), créez des politiques pour `anon` :

```sql
-- Politiques pour les utilisateurs anonymes (anon key)
CREATE POLICY "Allow anon to read all projects"
ON projects FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anon to insert projects"
ON projects FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anon to update all projects"
ON projects FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon to delete all projects"
ON projects FOR DELETE
TO anon
USING (true);
```

## 🔍 Vérifier que les projets existent

Exécutez cette requête SQL pour voir tous les projets :

```sql
SELECT id, first_name, last_name, location, user_id, created_at 
FROM projects 
ORDER BY created_at DESC;
```

Si vous voyez les projets créés par votre automation, alors le problème vient des RLS policies.

## 📝 Après modification

1. **Rafraîchissez votre application** (Ctrl+Shift+R)
2. **Videz le cache du navigateur** complètement
3. **Reconnectez-vous** si nécessaire
4. Vous devriez maintenant voir **tous les projets**

## ⚠️ Sécurité

Ces politiques permettent à **tous les utilisateurs authentifiés** (ou anonymes) d'accéder à **tous les projets**. Si vous avez besoin de restrictions plus fines plus tard, vous devrez créer des politiques plus spécifiques.
