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

describe('Web Gameplay Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear().mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('complete game workflow: start, play, undo, settings', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Verify initial game state
    expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
    expect(screen.getByText('Move 1')).toBeInTheDocument();

    // Get game squares
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );

    // Make a move
    const redPieceSquare = squares[40]; // Starting position
    const targetSquare = squares[33]; // Valid move

    fireEvent.click(redPieceSquare!);
    await waitFor(() => {
      expect(redPieceSquare).toHaveClass('selected');
    });

    fireEvent.click(targetSquare!);
    await waitFor(() => {
      expect(screen.getByText(/Current Turn: Black/)).toBeInTheDocument();
    });

    // Test undo
    const undoButton = screen.getByText('Undo');
    fireEvent.click(undoButton);
    await waitFor(() => {
      expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
    });

    // Open settings
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Game Settings')).toBeInTheDocument();
    });

    // Change theme
    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);

    // Close settings
    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(screen.queryByText('Game Settings')).not.toBeInTheDocument();
    });

    // Start new game
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);

    await waitFor(() => {
      expect(screen.getByText('Move 1')).toBeInTheDocument();
      expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
    });
  });

  test('move hints toggle functionality', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Select a piece first to see default behavior (hints should be on by default)
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );
    const redPieceSquare = squares[40];
    
    fireEvent.click(redPieceSquare!);
    
    await waitFor(() => {
      expect(redPieceSquare).toHaveClass('selected');
    });

    // Should show move hints by default
    let validMoveSquares = squares.filter(square => 
      square.className.includes('valid-move')
    );
    expect(validMoveSquares.length).toBeGreaterThan(0);
    
    // Deselect the piece
    fireEvent.click(squares[0]!);

    // Open settings and disable move hints
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Game Settings')).toBeInTheDocument();
    });

    const moveHintsCheckbox = screen.getByLabelText('Show move hints') as HTMLInputElement;
    expect(moveHintsCheckbox.checked).toBe(true); // Should be on by default
    
    fireEvent.click(moveHintsCheckbox);
    await waitFor(() => {
      expect(moveHintsCheckbox.checked).toBe(false);
    });

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    // Give time for settings to close
    await new Promise(resolve => setTimeout(resolve, 100));

    // Select a piece again - should not show move hints
    fireEvent.click(redPieceSquare!);
    
    await waitFor(() => {
      expect(redPieceSquare).toHaveClass('selected');
    });

    // Check that no valid move indicators are shown
    validMoveSquares = squares.filter(square => 
      square.className.includes('valid-move')
    );
    expect(validMoveSquares).toHaveLength(0);
  });

  test('error handling for invalid moves', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );

    // Try to select opponent's piece
    const blackPieceSquare = squares[17]; // Black piece position
    fireEvent.click(blackPieceSquare!);

    // Should not select (no error message expected for this case)
    expect(blackPieceSquare).not.toHaveClass('selected');

    // Select own piece first
    const redPieceSquare = squares[40];
    fireEvent.click(redPieceSquare!);
    
    await waitFor(() => {
      expect(redPieceSquare).toHaveClass('selected');
    });

    // Try to move to invalid square (occupied by own piece)
    const invalidTargetSquare = squares[48]; // Another red piece
    fireEvent.click(invalidTargetSquare!);

    // Should deselect current piece
    await waitFor(() => {
      expect(redPieceSquare).not.toHaveClass('selected');
    });
  });

  test('board size and rule changes work correctly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Count initial squares (should be 8x8 = 64)
    let squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );
    expect(squares).toHaveLength(64);

    // Open settings
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Game Settings')).toBeInTheDocument();
    });

    // First select 10x10 board size
    const board10x10 = screen.getByTestId('board-size-10');
    fireEvent.click(board10x10);

    // This should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByText(/Changing the board size or rules will start a new game/)).toBeInTheDocument();
    });
    
    const confirmButton = screen.getByTestId('confirm-new-game-button');
    fireEvent.click(confirmButton);

    // Should now have 10x10 = 100 squares
    await waitFor(() => {
      squares = screen.getAllByRole('generic').filter(el => 
        el.className.includes('game-square')
      );
      expect(squares).toHaveLength(100);
    });

    // Verify game restarted
    expect(screen.getByText('Move 1')).toBeInTheDocument();
    expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
  });
});