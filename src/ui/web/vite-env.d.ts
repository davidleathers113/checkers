/// <reference types="vite/client" />

// Compile-time constants injected by Vite's `define` (see vite.config.ts).
// __PROD__ is true only in production builds (gates service-worker registration);
// __BASE__ is the public base path (e.g. '/' or '/checkers/'), used to build the
// service-worker URL so it resolves correctly under a subpath deployment.
declare const __PROD__: boolean;
declare const __BASE__: string;
