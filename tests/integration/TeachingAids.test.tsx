import { render, screen, fireEvent } from '@testing-library/react';
import { GameApp } from '../../src/ui/web/GameApp';

const CONFIG_KEY = 'checkers-game-config';

describe('Teaching aids', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('shows a hint highlight when the Hint button is pressed', () => {
    const { container } = render(<GameApp />);
    fireEvent.click(screen.getByTestId('hint-button'));
    // The AI suggests a move; its origin square is highlighted.
    expect(container.querySelector('.hint-from')).not.toBeNull();
    expect(container.querySelector('.hint-to')).not.toBeNull();
  });

  it('opens a How-to-Play panel describing the active variant', () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ ruleSet: 'jumpOwn' }));
    render(<GameApp />);

    fireEvent.click(screen.getByTestId('help-button'));
    expect(screen.getByTestId('help-panel')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
    expect(screen.getByText(/Jump Your Own Man/)).toBeInTheDocument();
    expect(screen.getByText(/hop over one of your OWN pieces/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('help-done-button'));
    expect(screen.queryByTestId('help-panel')).not.toBeInTheDocument();
  });
});
