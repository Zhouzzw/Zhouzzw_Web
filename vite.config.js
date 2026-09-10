import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/Zhouzzw_Web/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
