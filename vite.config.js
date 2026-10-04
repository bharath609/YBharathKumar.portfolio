import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project site: bharath609/Bharath.Portfolio -> https://bharath609.github.io/Bharath.Portfolio/
// SINGLE=1 makes a one-file preview build (images inlined); the normal build is what GitHub Pages uses.
export default defineConfig({
  plugins: [react()],
  base: '/Bharath.Portfolio/',
  build: { assetsInlineLimit: process.env.SINGLE ? 100000000 : 4096 },
});
