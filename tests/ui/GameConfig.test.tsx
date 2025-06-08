import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameConfig } from '../../src/ui/web/components/GameConfig';
import { GameConfigProvider } from '../../src/ui/web/contexts/GameConfigContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('GameConfig Component', () => {
  const mockOnClose = jest.fn();
  const mockOnNewGame = jest.fn();

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <GameConfigProvider>
        {ui}
      </GameConfigProvider>
    );
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnNewGame.mockClear();
    localStorageMock.getItem.mockClear().mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('renders all configuration sections', () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    expect(screen.getByText('Game Settings')).toBeInTheDocument();
    expect(screen.getByText('Game Rules')).toBeInTheDocument();
    expect(screen.getByText('Board Size')).toBeInTheDocument();
    expect(screen.getByText('Visual Theme')).toBeInTheDocument();
    expect(screen.getByText('Animation Speed')).toBeInTheDocument();
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  test('closes config panel when close button is clicked', () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('closes config panel when Done button is clicked', () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('shows confirmation dialog when changing rules', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      expect(screen.getByText(/Changing the board size or rules will start a new game/)).toBeInTheDocument();
    });
  });

  test('calls onNewGame with correct parameters when confirming rule change', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const crazyOption = screen.getByLabelText(/Crazy Checkers/);
    fireEvent.click(crazyOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    expect(mockOnNewGame).toHaveBeenCalledWith(8, 'crazy');
  });

  test('cancels rule change when Cancel is clicked', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    expect(mockOnNewGame).not.toHaveBeenCalled();
    expect(screen.queryByText(/Changing the board size or rules/)).not.toBeInTheDocument();
  });

  test('updates theme without confirmation', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);

    expect(screen.queryByText(/Changing the board size or rules/)).not.toBeInTheDocument();
    
    await waitFor(() => {
      expect(darkTheme).toBeChecked();
      // Verify localStorage was called at least for the update
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'checkers-game-config',
        expect.stringContaining('"theme":"dark"')
      );
    });
  });

  test('updates animation speed without confirmation', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const fastSpeed = screen.getByLabelText('Fast');
    fireEvent.click(fastSpeed);

    expect(screen.queryByText(/Changing the board size or rules/)).not.toBeInTheDocument();
    
    await waitFor(() => {
      expect(fastSpeed).toBeChecked();
      // Verify localStorage was called at least for the update
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'checkers-game-config',
        expect.stringContaining('"animationSpeed":"fast"')
      );
    });
  });

  test('toggles move hints checkbox', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const moveHints = screen.getByLabelText('Show move hints') as HTMLInputElement;
    const initialState = moveHints.checked;
    
    fireEvent.click(moveHints);

    await waitFor(() => {
      expect(moveHints.checked).toBe(!initialState);
      // Verify localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  test('resets to default configuration', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    // First change something
    const darkTheme = screen.getByLabelText('Dark');
    fireEvent.click(darkTheme);
    
    await waitFor(() => {
      expect(darkTheme).toBeChecked();
    });

    const resetButton = screen.getByText('Reset to Defaults');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('checkers-game-config');
      const classicTheme = screen.getByLabelText('Classic');
      expect(classicTheme).toBeChecked();
    });
  });

  test('disables 8x8 board size when International Draughts is selected', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    // First select International Draughts
    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    // Confirm the change
    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    // Check that 8x8 is disabled when international is selected
    await waitFor(() => {
      const board8x8 = screen.getByDisplayValue('8');
      expect(board8x8).toBeDisabled();
    });
  });

  test('automatically switches to 10x10 when selecting International Draughts', async () => {
    renderWithProvider(
      <GameConfig onClose={mockOnClose} onNewGame={mockOnNewGame} />
    );

    const internationalOption = screen.getByLabelText(/International Draughts/);
    fireEvent.click(internationalOption);

    await waitFor(() => {
      const confirmButton = screen.getByText('New Game');
      fireEvent.click(confirmButton);
    });

    expect(mockOnNewGame).toHaveBeenCalledWith(10, 'international');
  });
});