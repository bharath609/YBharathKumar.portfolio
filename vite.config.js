import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project site: bharath609/bharath.portfolio -> https://bharath609.github.io/bharath.portfolio/
// SINGLE=1 makes a one-file preview build (images inlined); the normal build is what GitHub Pages uses.
export default defineConfig({
  plugins: [react()],
  base: '/bharath.portfolio/',
  build: { assetsInlineLimit: process.env.SINGLE ? 100000000 : 4096 },
});
