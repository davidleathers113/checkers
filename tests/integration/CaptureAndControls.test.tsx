import { render, screen, fireEvent } from '@testing-library/react';
import { GameApp } from '../../src/ui/web/GameApp';

function clickSquare(row: number, col: number): void {
  fireEvent.click(screen.getByTestId(`game-square-${row}-${col}`));
}

describe('captures and controls', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('captures an opponent piece through the UI and flags the mandatory jump', () => {
    render(<GameApp />);

    clickSquare(5, 2); // select red
    clickSquare(4, 3); // red advances
    clickSquare(2, 5); // select black
    clickSquare(3, 4); // black advances next to the red piece

    // A capture is now forced for Red.
    expect(screen.getByTestId('capture-alert')).toBeInTheDocument();

    clickSquare(4, 3); // select the forced piece
    clickSquare(2, 5); // jump → captures the black piece at (3,4)

    expect(document.querySelector('[data-testid="game-square-3-4"] .game-piece')).toBeNull();
    expect(document.querySelector('[data-testid="game-square-2-5"] .game-piece.red')).not.toBeNull();
  });

  it('toggles sound from the header button', () => {
    render(<GameApp />);
    const button = screen.getByTestId('sound-button');
    expect(button).toHaveTextContent('🔊');
    fireEvent.click(button);
    expect(button).toHaveTextContent('🔇');
    expect(button).toHaveAttribute('aria-label', 'Unmute sound');
  });
});
