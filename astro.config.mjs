import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'node:path';

export default defineConfig({
  srcDir: './astro',
  output: 'static',
  outDir: './dist',
  site: process.env.PUBLIC_SITE_URL || 'https://zaantaxischiphol.nl',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY ?? ''),
      'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(
        process.env.GOOGLE_MAPS_API_KEY ?? process.env.PUBLIC_GOOGLE_MAPS_API_KEY ?? process.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve('.', '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  },
});
