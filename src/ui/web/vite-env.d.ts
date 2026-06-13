/// <reference types="vite/client" />

// Compile-time constant injected by Vite's `define` (see vite.config.ts).
// True only in production builds; used to gate service-worker registration.
declare const __PROD__: boolean;
