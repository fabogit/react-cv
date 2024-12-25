import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), compression({
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
  build: {
    minify: 'esbuild', // Puoi usare 'terser' o 'esbuild' (opzione predefinita)
    terserOptions: {
      compress: {
        drop_console: true, // Rimuove i console.log per una build più pulita
        drop_debugger: true, // Rimuove i debugger
      },
    },
    cssCodeSplit: true, // Ottimizza i CSS generando file separati
    sourcemap: false, // Disabilita le sourcemap in produzione
  },
});