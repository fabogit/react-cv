import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      compression({
        algorithm: 'gzip', // Può essere 'gzip' o 'brotliCompress'
        ext: '.gz', // Estensione dei file compressi
        deleteOriginFile: false, // Mantiene anche i file originali
        threshold: 10240, // Comprimi solo file più grandi di 10KB
      }),
      compression({
        algorithm: 'brotliCompress', // Abilita anche Brotli
        ext: '.br',
        deleteOriginFile: false,
        threshold: 10240,
      }),
    ],
    esbuild: {
      // Rimuove i console.log e debugger solo in produzione
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      minify: 'esbuild', // Usa esbuild per la minificazione
      cssCodeSplit: true, // Ottimizza i CSS generando file separati
      sourcemap: false, // Disabilita le sourcemap in produzione
    },
  };
});
