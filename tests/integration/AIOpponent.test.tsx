import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameApp } from '../../src/ui/web/GameApp';

const CONFIG_KEY = 'checkers-game-config';

/** Seed persisted config so the app boots straight into a vs-Computer game. */
function seedConfig(overrides: Record<string, unknown>): void {
  localStorage.setItem(
    CONFIG_KEY,
    JSON.stringify({ mode: 'ai', aiSide: 'black', difficulty: 'easy', animationSpeed: 'fast', ...overrides })
  );
}

/** Run the pending AI "think" timer (and animation timers) inside act. */
function flushTimers(ms = 800): void {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

function clickSquare(row: number, col: number): void {
  fireEvent.click(screen.getByTestId(`game-square-${row}-${col}`));
}

describe('AI opponent integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    localStorage.clear();
  });

  it('lets the computer make the opening move when it plays first', () => {
    seedConfig({ aiSide: 'red' }); // computer is RED and moves first
    render(<GameApp />);

    // The status labels the upcoming move, so 0 moves made reads "Move 1".
    expect(screen.getByText('Move 1')).toBeInTheDocument();
    flushTimers();
    expect(screen.getByText('Move 2')).toBeInTheDocument();
  });

  it('responds with a move after the human plays', () => {
    seedConfig({ aiSide: 'black' }); // human is RED and moves first
    render(<GameApp />);

    clickSquare(5, 0); // select a red man
    clickSquare(4, 1); // move it forward (1 move made -> "Move 2")
    expect(screen.getByText('Move 2')).toBeInTheDocument();

    flushTimers(); // computer (BLACK) responds (2 moves made -> "Move 3")
    expect(screen.getByText('Move 3')).toBeInTheDocument();
  });

  it('locks the board and shows a thinking indicator during the computer turn', () => {
    seedConfig({ aiSide: 'red' });
    render(<GameApp />);

    // It is the computer's (RED) turn; the human must not be able to act.
    expect(screen.getByTestId('thinking-indicator')).toBeInTheDocument();
    clickSquare(2, 1); // try to grab a black piece out of turn
    expect(screen.getByTestId('game-square-2-1')).not.toHaveClass('selected');

    flushTimers();
    expect(screen.getByText('Move 2')).toBeInTheDocument(); // computer moved
  });

  it('undo returns to the human turn instead of letting the computer replay', () => {
    seedConfig({ aiSide: 'black' });
    render(<GameApp />);

    clickSquare(5, 0);
    clickSquare(4, 1);
    flushTimers(); // computer responds -> 2 moves made ("Move 3"), human's turn
    expect(screen.getByText('Move 3')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('undo-button'));
    // Undo unwinds both the computer's reply and the human's move ("Move 1").
    expect(screen.getByText('Move 1')).toBeInTheDocument();

    // The computer must not auto-move on the human's restored turn.
    flushTimers();
    expect(screen.getByText('Move 1')).toBeInTheDocument();
  });
});
