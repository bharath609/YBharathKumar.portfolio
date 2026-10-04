import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo is named bharath609.github.io, so the site lives at the domain root.
// SINGLE=1 makes a one-file preview build (images inlined); the normal build is what GitHub Pages uses.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { assetsInlineLimit: process.env.SINGLE ? 100000000 : 4096 },
});
