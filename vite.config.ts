import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Public base path. Defaults to '/' (root) for local dev/preview, the Playwright
// E2E build, and the Render deployment. The GitHub Pages workflow sets
// PAGES_BASE=/<repo>/ so the same code also serves correctly from a project-page
// subpath (e.g. /checkers/). Leaving PAGES_BASE unset reproduces today's output
// exactly.
const base = process.env['PAGES_BASE'] ?? '/';

// Compile-time constants exposed to app code (the project's CommonJS `tsc`
// config can't parse `import.meta.env`, so we inject these via `define`):
//   __PROD__ — true only for `vite build` (gates service-worker registration)
//   __BASE__ — the resolved public base path (used to register the SW)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  root: 'src/ui/web',
  base,
  define: {
    __PROD__: JSON.stringify(command === 'build'),
    __BASE__: JSON.stringify(base),
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