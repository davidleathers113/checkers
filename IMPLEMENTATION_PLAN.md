# Project Status & Roadmap

> This file previously held a planning document that had drifted out of sync with
> the code (it described completed work as upcoming and cited outdated test
> counts). It has been replaced with an accurate snapshot.

## Current Status

The extensible checkers engine is functional and the web UI is the primary
interface. As of the latest cleanup pass:

- **Tests**: 292 passing (Jest), with the coverage gate (80% global) enforced
  and met (~92% statements / ~82% branches / ~90% functions / ~94% lines).
- **Type checking**: clean (`tsc --noEmit`).
- **Lint**: clean (ESLint 9, flat config).
- **Builds**: both the Node library build (`tsc`) and the web build (Vite) succeed.
- **Security**: `npm audit` reports 0 vulnerabilities.

### Architecture highlights

- **Core** (`src/core/`): immutable `Board` (flat copy-on-write array),
  `Position`, `Move` (supports multi-step capture sequences), and the `Game`
  controller (Observer pattern, undo/redo, captured-piece tracking).
- **Pieces** (`src/pieces/`): `RegularPiece` (forward moves, any-direction
  captures) and `KingPiece` (flying moves and captures). Capture search is
  stateless — no intermediate `Board` allocation.
- **Rules** (`src/rules/`): `StandardRules` implements `RuleEngine` and delegates
  move legality to the `ValidationEngine`. `CustomRulesBase` is the base for
  variants (see `examples/`).
- **Strategies** (`src/strategies/`): `ValidationEngine` runs priority-ordered
  validators — `BasicMoveValidator` → `DiagonalMoveValidator` → `CaptureValidator`
  → `MultiStepMoveValidator` → `MandatoryCaptureValidator`.
- **Web UI** (`src/ui/web/`): React app driven by the `useConfigurableGame` hook
  using `useSyncExternalStore`; supports rule/board configuration and animations.

## Completed work

- Web UI with click-to-move, valid-move highlighting, undo/redo, animations,
  and configurable rules/board size.
- Performance refactor (see `PERFORMANCE_IMPROVEMENTS.md`): copy-on-write board,
  stateless capture search, `useSyncExternalStore`, board-size-parameterized
  `Position`.
- Validation unified onto a single path (`ValidationEngine`), eliminating the
  previously duplicated inline rule logic.
- Captured-piece tracking and redo wired through to the web UI.

## Possible next steps (not scheduled)

- **AI opponent**: a minimax player built on `Game.getAllPossibleMoves()`,
  integrated through the existing turn system with selectable difficulty.
- **Persistence**: save/restore games and user preferences (local storage).
- **Additional variants**: more `CustomRulesBase` examples and UI toggles.
