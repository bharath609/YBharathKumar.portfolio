import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project site: bharath609/YBharathKumar.portfolio -> https://bharath609.github.io/YBharathKumar.portfolio/
// SINGLE=1 makes a one-file preview build (images inlined); the normal build is what GitHub Pages uses.
export default defineConfig({
  plugins: [react()],
  base: '/YBharathKumar.portfolio/',
  build: { assetsInlineLimit: process.env.SINGLE ? 100000000 : 4096 },
});
