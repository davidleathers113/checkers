# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🛠 Quick Commands
- **Build**: `npm run build` (TypeScript compilation to dist/)
- **Test**: `npm test` (Jest test suite) | `npm test -- -t "<name>"` (single test)
- **Dev**: `npm run dev` (Run game via ts-node)
- **Watch Tests**: `npm test:watch` (Jest in watch mode)
- **Lint**: `npm run lint` (ESLint)
- **Type Check**: `npm run typecheck` (tsc --noEmit)

## 🎨 Code Style (MUST-FOLLOW)
1. **Formatting**: Prettier • 2-space indent • 100 col wrap
2. **Imports**: External → Internal, alphabetized within blocks
3. **Types**: No implicit any; favor `interface` > `type` aliases
4. **Naming**: camelCase vars/fns • PascalCase components/classes
5. **Errors**: Wrap async/await in try/catch; surface with Result<>
6. **Comments**: Explain *why*, not *what*; omit obvious boilerplate

## 🔄 Preferred Workflow
> **think → plan → code → verify → commit**
- Start every task with `think hard` for extra reasoning time
- Run `npm run lint && npm test && npm run typecheck` before commits

## 🌳 Git Conventions
- Branch: `feat/<short-desc>` | `fix/<issue#>` | `chore/<topic>`
- Commits: Conventional Commits (`feat: add OAuth flow`), no scope emoji

## Architecture Overview

This is an extensible checkers game built with clean architecture principles. The codebase follows a layered approach:

**Core Game Flow**: User Input → Game Controller → Rule Engine → Validators → Board State → Observers → UI Update

**Key Layers**:
- `src/core/`: Foundation entities (Game, Board, Position, Move) with no dependencies
- `src/pieces/`: Piece hierarchy (Piece abstract → RegularPiece/KingPiece)
- `src/rules/`: Pluggable rule system via RuleEngine interface
- `src/strategies/`: Validation algorithms (MoveValidator, CaptureValidator)
- `src/ui/`: UI implementations (currently Console)

**Design Patterns Used**:
- **Strategy**: RuleEngine allows different game rules (StandardRules, custom variants)
- **Observer**: Game notifies observers (UI, analytics) of state changes
- **Command**: Moves are encapsulated for history/undo (partial implementation)
- **Factory**: Future piece creation flexibility

## Extension Points

**Custom Rules**: Implement `RuleEngine` interface with methods like `validateMove()`, `getPossibleMoves()`, `isGameOver()`

**Custom Pieces**: Extend `Piece` abstract class with `canMove()`, `getPossibleMoves()`, `copy()` methods

**Custom UI**: Implement `GameUI` interface for different presentation layers

## Code Conventions

- **Immutability**: All game state operations return new instances
- **Type Safety**: Strict TypeScript with no implicit any
- **Error Handling**: Custom exceptions (InvalidMoveError, GameOverError)
- **Testing**: Jest with 80% coverage thresholds across branches/functions/lines

## Project Structure

Key files to understand the architecture:
- `src/core/Game.ts`: Main orchestrator implementing Observer pattern
- `src/rules/RuleEngine.ts`: Core interface for game rule implementations  
- `src/strategies/ValidationEngine.ts`: Pluggable move validation system
- `examples/`: Sample custom rule implementations (International Draughts, Flying Kings)

## ✅ Quality Gates
- **IMPORTANT:** keep tests green and typecheck clean before requesting PR merge
- Run full test suite: `npm run lint && npm test && npm run typecheck`

## 📌 Reminders
- Always create feature branches before making changes
- Use conventional commit format for all commits
- Test coverage must maintain 80% thresholds across branches/functions/lines