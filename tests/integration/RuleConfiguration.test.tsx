import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameApp } from '../../src/ui/web/GameApp';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;

describe('Rule Configuration Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear().mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('switching between rule sets works correctly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Open settings
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Game Settings')).toBeInTheDocument();
    });

    // Test switching to Crazy Checkers
    const crazyOption = screen.getByLabelText(/Crazy Checkers/);
    fireEvent.click(crazyOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Should start new game
    await waitFor(() => {
      expect(screen.getByText('Move 1')).toBeInTheDocument();
      expect(screen.queryByText('Game Settings')).not.toBeInTheDocument();
    });

    // Open settings again to test International Draughts
    fireEvent.click(settingsButton);

    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Should create 10x10 board for International Draughts
    await waitFor(() => {
      const squares = screen.getAllByRole('generic').filter(el => 
        el.className.includes('game-square')
      );
      expect(squares).toHaveLength(100); // 10x10 board
    });

    // Switch back to Standard
    fireEvent.click(settingsButton);

    const standardOption = screen.getByLabelText(/Standard Checkers/);
    fireEvent.click(standardOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Should be back to 8x8
    await waitFor(() => {
      const squares = screen.getAllByRole('generic').filter(el => 
        el.className.includes('game-square')
      );
      expect(squares).toHaveLength(64); // 8x8 board
    });
  });

  test('board size restrictions work correctly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Open settings
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    // Select International Draughts (requires 10x10)
    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Open settings again
    fireEvent.click(settingsButton);

    // 8x8 option should be disabled for International Draughts
    await waitFor(() => {
      const board8x8 = screen.getByDisplayValue('8');
      expect(board8x8).toBeDisabled();
    });

    // 10x10 should be selected
    const board10x10 = screen.getByDisplayValue('10');
    expect(board10x10).toBeChecked();
  });

  test('theme changes persist across rule changes', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Open settings and change theme
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);

    // Change rules
    const crazyOption = screen.getByLabelText(/Crazy Checkers/);
    fireEvent.click(crazyOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Open settings again
    fireEvent.click(settingsButton);

    // Theme should still be dark
    await waitFor(() => {
      const darkThemeCheck = screen.getByLabelText('Dark');
      expect(darkThemeCheck).toBeChecked();
    });
  });

  test('animation speed setting applies to all rule sets', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Open settings and change animation speed
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    const fastSpeed = screen.getByLabelText('Fast');
    fireEvent.click(fastSpeed);

    // Change to different rule set
    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Open settings again
    fireEvent.click(settingsButton);

    // Animation speed should still be fast
    await waitFor(() => {
      const fastSpeedCheck = screen.getByLabelText('Fast');
      expect(fastSpeedCheck).toBeChecked();
    });
  });

  test('move hints work consistently across rule sets', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Disable move hints in standard rules
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    const moveHintsCheckbox = screen.getByLabelText('Show move hints') as HTMLInputElement;
    if (moveHintsCheckbox.checked) {
      fireEvent.click(moveHintsCheckbox);
    }

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    // Switch to International Draughts
    fireEvent.click(settingsButton);

    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Select a piece to verify no hints are shown
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );
    
    // Find a piece on the 10x10 board (International Draughts starting positions)
    const pieceSquare = squares.find(square => 
      square.querySelector('.game-piece.red')
    );
    
    if (pieceSquare) {
      fireEvent.click(pieceSquare);
      
      await waitFor(() => {
        expect(pieceSquare).toHaveClass('selected');
      });

      // Should not show move hints
      const validMoveSquares = squares.filter(square => 
        square.className.includes('valid-move')
      );
      expect(validMoveSquares).toHaveLength(0);
    }
  });

  test('configuration resets work properly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Open settings and make multiple changes
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    // Change theme
    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);

    // Change animation speed
    const fastSpeed = screen.getByLabelText('Fast');
    fireEvent.click(fastSpeed);

    // Change to crazy checkers
    const crazyOption = screen.getByLabelText(/Crazy Checkers/);
    fireEvent.click(crazyOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Open settings and reset
    fireEvent.click(settingsButton);

    const resetButton = screen.getByText('Reset to Defaults');
    fireEvent.click(resetButton);

    // Should return to defaults
    await waitFor(() => {
      const classicTheme = screen.getByLabelText('Classic');
      const normalSpeed = screen.getByLabelText('Normal');
      const standardRules = screen.getByLabelText(/Standard Checkers/);

      expect(classicTheme).toBeChecked();
      expect(normalSpeed).toBeChecked();
      expect(standardRules).toBeChecked();
    });
  });
});