import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Pour GitHub Pages, utilisez le nom de votre repository
    // Exemple: si votre repo est "username/yes-conciergerie", base sera "/yes-conciergerie/"
    // Pour un repo nommé exactement "username.github.io", base sera "/"
    // Vous pouvez aussi définir VITE_BASE_PATH dans un fichier .env
    const getBasePath = () => {
      // 1. Vérifier si VITE_BASE_PATH est défini dans .env
      if (env.VITE_BASE_PATH) return env.VITE_BASE_PATH;
      
      // 2. En production sur GitHub Actions, utiliser GITHUB_REPOSITORY
      if (process.env.GITHUB_REPOSITORY) {
        const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
        // Si le repo s'appelle "username.github.io", base = "/"
        if (repoName.endsWith('.github.io')) return '/';
        return `/${repoName}/`;
      }
      
      // 3. En production locale, utiliser le nom du repo par défaut
      if (process.env.NODE_ENV === 'production') {
        return '/yes-conciergerie/';
      }
      
      // 4. En développement, base = "/"
      return '/';
    };
    
    const base = getBasePath();
    
    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
