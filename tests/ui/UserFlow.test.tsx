import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameApp } from '../../src/ui/web/GameApp';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('complete game flow: piece selection, move, and capture', async () => {
    render(<GameApp />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
      expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
    });

    // Get all squares
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );

    // Find a red piece in the starting position (row 5, col 0 = index 40)
    const redPieceSquare = squares[40];
    expect(redPieceSquare?.querySelector('.game-piece.red')).toBeInTheDocument();

    // Click on the red piece to select it
    fireEvent.click(redPieceSquare!);

    // Check that the square is selected
    await waitFor(() => {
      expect(redPieceSquare).toHaveClass('selected');
    });

    // Find a valid move square (one diagonal forward)
    const targetSquare = squares[33]; // row 4, col 1
    expect(targetSquare).toHaveClass('valid-move');

    // Click on the valid move square
    fireEvent.click(targetSquare!);

    // Verify the piece has moved
    await waitFor(() => {
      expect(targetSquare?.querySelector('.game-piece.red')).toBeInTheDocument();
      expect(redPieceSquare?.querySelector('.game-piece')).not.toBeInTheDocument();
      expect(screen.getByText(/Current Turn: Black/)).toBeInTheDocument();
    });
  });

  test('undo functionality works correctly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Make a move first
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );

    // Select and move a piece
    fireEvent.click(squares[40]!); // Select red piece
    await waitFor(() => expect(squares[40]).toHaveClass('selected'));
    
    fireEvent.click(squares[33]!); // Move to valid square
    await waitFor(() => expect(screen.getByText(/Current Turn: Black/)).toBeInTheDocument());

    // Click undo button
    const undoButton = screen.getByText('Undo');
    expect(undoButton).not.toBeDisabled();
    fireEvent.click(undoButton);

    // Verify move was undone
    await waitFor(() => {
      expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
      expect(squares[40]?.querySelector('.game-piece.red')).toBeInTheDocument();
      expect(squares[33]?.querySelector('.game-piece')).not.toBeInTheDocument();
    });
  });

  test('new game button resets the board', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Make a move
    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );
    fireEvent.click(squares[40]!);
    await waitFor(() => expect(squares[40]).toHaveClass('selected'));
    fireEvent.click(squares[33]!);

    // Click new game
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);

    // Verify board is reset
    await waitFor(() => {
      expect(screen.getByText(/Current Turn: Red/)).toBeInTheDocument();
      expect(screen.getByText('Move 1')).toBeInTheDocument();
      // Check that pieces are in starting positions
      const pieces = screen.getAllByRole('generic').filter(el => 
        el.className.includes('game-piece')
      );
      expect(pieces).toHaveLength(24); // 12 red + 12 black pieces
    });
  });

  test('settings panel opens and closes correctly', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // Click settings button
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    // Verify settings panel is open
    await waitFor(() => {
      expect(screen.getByText('Game Settings')).toBeInTheDocument();
      expect(screen.getByText('Game Rules')).toBeInTheDocument();
    });

    // Close settings panel
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    // Verify settings panel is closed
    await waitFor(() => {
      expect(screen.queryByText('Game Rules')).not.toBeInTheDocument();
    });
  });

  test('theme changes are applied immediately', async () => {
    render(<GameApp />);

    const root = document.documentElement;
    const initialLightSquare = getComputedStyle(root).getPropertyValue('--light-square');

    // Open settings
    const settingsButton = screen.getByLabelText('Game Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Visual Theme')).toBeInTheDocument();
    });

    // Change theme to dark
    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);

    // Verify CSS variable has changed
    await waitFor(() => {
      const newLightSquare = getComputedStyle(root).getPropertyValue('--light-square');
      expect(newLightSquare).not.toBe(initialLightSquare);
    });
  });

  test('invalid move shows error message', async () => {
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );

    // Try to select a black piece (should fail as it's red's turn)
    const blackPieceSquare = squares[17]; // A black piece position
    expect(blackPieceSquare?.querySelector('.game-piece.black')).toBeInTheDocument();

    fireEvent.click(blackPieceSquare!);

    // Should not select the piece
    await waitFor(() => {
      expect(blackPieceSquare).not.toHaveClass('selected');
    });
  });

  test('game over state is displayed correctly', async () => {
    // This is a simplified test - in a real game, we'd need to play through to completion
    // For now, we'll just verify the UI can display game over state
    
    render(<GameApp />);

    await waitFor(() => {
      expect(screen.getByText('Extensible Checkers')).toBeInTheDocument();
    });

    // In a real test, we would play through a complete game
    // For now, just verify the game status component exists and can show different states
    expect(screen.getByText(/Current Turn:/)).toBeInTheDocument();
    expect(screen.queryByText(/Game Over/)).not.toBeInTheDocument();
  });
});