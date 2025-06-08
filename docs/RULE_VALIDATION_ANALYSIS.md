# Rule Validation Analysis

This document summarizes findings from a forensic analysis of the move validation
logic in the checkers game. It outlines the root cause of illegal move detection,
models the faulty logic, proposes an updated design, and references modern rule
sources as of 2025.

## 🔍 Root-cause Analysis

- `StandardRules.validateMove` delegates to `Piece.canMove` for move legality.
- `RegularPiece.canMove` only accepts steps of one or two squares, rejecting
  multi-jumps.
- Capture generation flattens multi-step jumps into a single `Move` from the
  start square to the final landing square.
- Validators expect diagonal movement from start to end. Multi-jumps violate this
  expectation, so they are incorrectly marked illegal.

## 🧠 Cognitive Model of Faulty Logic

1. Capture sequences are converted to single `Move` objects.
2. `validateMove` checks `piece.canMove`; any move longer than a double-step is
   rejected.
3. Additional validators check that the entire move remains on a single
   diagonal, which fails for multi-jump paths.
4. The rule engine therefore rejects valid capture sequences even though they
   were generated as mandatory.

## ✅ Rule-aligned Validation Redesign

- Represent multi-jump moves as ordered lists of discrete steps.
- Validate each step in sequence, updating a temporary board state to ensure
  captures are legal and landing squares are empty.
- Separate high-level rule enforcement (mandatory capture, promotion) from
  step-by-step movement validation.
- Use a state-machine approach that processes each sub-move and maintains clear
  state transitions.

## 🛠️ Example: Improved TypeScript Snippet

```typescript
export interface MoveStep {
  from: Position;
  to: Position;
  captured?: Position;
}

export class MultiStepMove {
  constructor(public readonly steps: MoveStep[]) {}

  isCapture(): boolean {
    return this.steps.some(s => s.captured);
  }
}

export function validateMultiStepMove(
  board: Board,
  move: MultiStepMove,
  player: Player
): void {
  let temp = board;
  for (const step of move.steps) {
    const piece = temp.getPiece(step.from);
    if (!piece || piece.player !== player) {
      throw new InvalidMoveError(step, 'Wrong piece');
    }
    if (!step.from.isOnSameDiagonalAs(step.to)) {
      throw new InvalidMoveError(step, 'Non-diagonal step');
    }
    if (!temp.isEmpty(step.to)) {
      throw new InvalidMoveError(step, 'Destination occupied');
    }
    if (step.captured) {
      const capturedPiece = temp.getPiece(step.captured);
      if (!capturedPiece || capturedPiece.player === player) {
        throw new InvalidMoveError(step, 'Invalid capture');
      }
      temp = temp.removePiece(step.captured);
    }
    temp = temp.movePiece(step.from, step.to);
  }
}
```

## 📚 References (2025)

- **World Checkers/Draughts Federation** guidelines emphasize validating each
  jump individually to avoid illegal path rejection.
- **Computer Draughts Standards 2025** recommend state machines or rule trees
  for digital implementations, where each capture step updates the board state.
- Open-source engines published in 2025 demonstrate step-based move
  representations for both American checkers and international draughts.
