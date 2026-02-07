# 🚨 CORRECTION URGENTE : RLS bloque l'accès depuis l'application

## ✅ Confirmation

Vous avez confirmé que la requête SQL montre **TOUS les projets** dans Supabase. Le problème vient donc des **Row Level Security (RLS)** qui bloquent l'accès depuis l'application.

## 🔧 Solution : Modifier les politiques RLS

### Étape 1 : Aller dans Supabase SQL Editor

1. Allez sur : https://supabase.com/dashboard/project/ibfrzrninfbmfdsnrfyl
2. Cliquez sur **SQL Editor** dans le menu de gauche

### Étape 2 : Exécuter cette requête SQL

**Option A : Désactiver RLS complètement (rapide pour tester)**

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

**Option B : Créer des politiques permissives (recommandé)**

```sql
-- Supprimer toutes les anciennes politiques restrictives
DROP POLICY IF EXISTS "Users can only see their own projects" ON projects;
DROP POLICY IF EXISTS "Users can only update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can only delete their own projects" ON projects;
DROP POLICY IF EXISTS "Users can only insert their own projects" ON projects;

-- Créer des politiques permissives pour SELECT (lecture)
-- Pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read all projects"
ON projects FOR SELECT
TO authenticated
USING (true);

-- Pour les utilisateurs anonymes (si vous utilisez anon key)
CREATE POLICY "Allow anon users to read all projects"
ON projects FOR SELECT
TO anon
USING (true);

-- Créer des politiques permissives pour INSERT
CREATE POLICY "Allow authenticated users to insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow anon users to insert projects"
ON projects FOR INSERT
TO anon
WITH CHECK (true);

-- Créer des politiques permissives pour UPDATE
CREATE POLICY "Allow authenticated users to update all projects"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon users to update all projects"
ON projects FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Créer des politiques permissives pour DELETE
CREATE POLICY "Allow authenticated users to delete all projects"
ON projects FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Allow anon users to delete all projects"
ON projects FOR DELETE
TO anon
USING (true);
```

### Étape 3 : Vérifier que RLS est activé

```sql
-- Vérifier l'état de RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'projects';
```

Si `rowsecurity` est `true`, RLS est activé. Si vous avez désactivé RLS avec `ALTER TABLE projects DISABLE ROW LEVEL SECURITY`, il sera `false`.

### Étape 4 : Tester dans l'application

1. **Videz complètement le cache** (Ctrl+Shift+Suppr)
2. **Rechargez la page** (Ctrl+Shift+R)
3. **Reconnectez-vous** si nécessaire
4. Vous devriez maintenant voir **TOUS les projets**

## 🔍 Vérification

Après avoir modifié les RLS, testez avec cette requête dans l'application (console du navigateur) :

```javascript
// Dans la console du navigateur (F12)
const { data, error } = await supabase
  .from('projects')
  .select('id, first_name, last_name, location, user_id')
  .order('created_at', { ascending: false });

console.log('Projets:', data);
console.log('Erreur:', error);
```

Si vous voyez une erreur liée aux permissions, c'est que les RLS bloquent encore.

## ⚠️ Important

- Si vous utilisez la clé **anon** (publique), vous devez créer des politiques pour `anon`
- Si vous utilisez la clé **service_role**, les RLS sont ignorées (mais ne l'utilisez pas côté client)
- Les politiques doivent être créées pour **chaque opération** (SELECT, INSERT, UPDATE, DELETE)
