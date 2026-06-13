import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config.
 *
 * Determinism first: tests run against the *production preview build* (not the
 * Vite dev server with HMR), and the server is never reused — so a stray dev
 * server can never serve stale code/CSS into a run.
 *
 * Browser matrix: Chromium + Mobile Chrome by default (the binaries we install
 * on PRs). Set E2E_ALL_BROWSERS=1 to add Firefox, WebKit, and Mobile Safari for
 * the nightly cross-browser run.
 */
const allBrowsers = !!process.env['E2E_ALL_BROWSERS'];
const isCI = !!process.env['CI'];

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
];

if (allBrowsers) {
  projects.push(
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  );
}

export default defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html', { open: 'never' }], ['line']] : 'line',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Screenshot comparison: freeze CSS animations/transitions to their end state
  // and hide the caret so baselines are deterministic, with a small pixel-ratio
  // tolerance to absorb sub-pixel anti-aliasing differences across machines.
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    },
  },

  // Build the app and serve the static preview on a fixed port. Never reuse a
  // server, so every run exercises a freshly built artifact.
  webServer: {
    command: 'npm run build:web && npm run preview -- --port 5173 --strictPort',
    port: 5173,
    reuseExistingServer: false,
    timeout: 180_000,
  },

  projects,
});
