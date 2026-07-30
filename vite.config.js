import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
        techstack: 'techstack.html',
        about: 'about.html',
      },
    },
  },
});
