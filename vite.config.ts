import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: 'gzip', // Can be 'gzip' or 'brotliCompress'
      ext: '.gz', // Extension of compressed files
      deleteOriginFile: false, // Retain original uncompressed files
      threshold: 10240, // Compress only files larger than 10KB
    }),
    compression({
      algorithm: 'brotliCompress', // Enable Brotli compression as well
      ext: '.br',
      deleteOriginFile: false,
      threshold: 10240,
    }),
  ],
  build: {
    cssCodeSplit: true, // Optimize CSS by generating separate files
    sourcemap: false, // Disable sourcemaps in production
  },
});