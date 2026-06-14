import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `__PROD__` is a compile-time constant (true only for `vite build`). It lets
// app code gate production-only behaviour — e.g. service-worker registration —
// without `import.meta.env`, which the project's CommonJS `tsc` config can't parse.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  root: 'src/ui/web',
  define: {
    __PROD__: JSON.stringify(command === 'build'),
  },
  build: {
    outDir: '../../../dist/web',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}));