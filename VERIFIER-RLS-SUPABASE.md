# 🔍 Vérifier les Row Level Security (RLS) dans Supabase

## ⚠️ Problème possible

Même si le code ne filtre plus par `user_id`, les **Row Level Security (RLS)** dans Supabase peuvent bloquer l'accès aux projets créés par d'autres utilisateurs.

## ✅ Solution : Vérifier et modifier les politiques RLS

### 1. Vérifier les politiques actuelles

1. Allez sur : https://supabase.com/dashboard/project/ibfrzrninfbmfdsnrfyl
2. Allez dans **Authentication** > **Policies**
3. Sélectionnez la table **projects**
4. Regardez les politiques existantes

### 2. Modifier les politiques pour permettre l'accès à tous

Vous devez avoir des politiques qui permettent :
- **SELECT** : Tous les utilisateurs peuvent lire tous les projets
- **INSERT** : Tous les utilisateurs peuvent créer des projets
- **UPDATE** : Tous les utilisateurs peuvent modifier tous les projets
- **DELETE** : Tous les utilisateurs peuvent supprimer tous les projets

### 3. Créer/modifier les politiques (SQL)

Allez dans **SQL Editor** et exécutez :

```sql
-- Désactiver RLS temporairement pour tester (NON RECOMMANDÉ EN PRODUCTION)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- OU créer des politiques permissives :

-- Politique pour SELECT (lecture)
DROP POLICY IF EXISTS "Allow all users to read all projects" ON projects;
CREATE POLICY "Allow all users to read all projects"
ON projects FOR SELECT
USING (true);

-- Politique pour INSERT (création)
DROP POLICY IF EXISTS "Allow all users to insert projects" ON projects;
CREATE POLICY "Allow all users to insert projects"
ON projects FOR INSERT
WITH CHECK (true);

-- Politique pour UPDATE (modification)
DROP POLICY IF EXISTS "Allow all users to update all projects" ON projects;
CREATE POLICY "Allow all users to update all projects"
ON projects FOR UPDATE
USING (true)
WITH CHECK (true);

-- Politique pour DELETE (suppression)
DROP POLICY IF EXISTS "Allow all users to delete all projects" ON projects;
CREATE POLICY "Allow all users to delete all projects"
ON projects FOR DELETE
USING (true);
```

### 4. Alternative : Désactiver RLS (pour développement uniquement)

Si vous voulez désactiver complètement RLS pour tester :

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATTENTION** : Cela permet à n'importe qui d'accéder à tous les projets. Utilisez uniquement pour le développement.

## 🔍 Vérifier que les projets existent

Exécutez cette requête SQL pour voir tous les projets :

```sql
SELECT id, first_name, last_name, location, user_id, created_at 
FROM projects 
ORDER BY created_at DESC;
```

Si vous voyez les projets créés par votre automation, alors le problème vient des RLS policies.

## 📝 Après modification

1. Rafraîchissez votre application
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Vous devriez maintenant voir tous les projets
