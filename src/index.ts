/**
 * Public API for the extensible checkers engine.
 *
 * This package ships the game engine as a library; the playable interface is
 * the React web app under `src/ui/web` (run with `npm run dev`). Consumers
 * import the engine primitives, rules, validators, and extension-point
 * interfaces from here.
 */
export * from './core';
export * from './pieces';
export * from './rules';
export * from './strategies';
export * from './ui';
export * from './commands';
export * from './types';
export * from './errors';
