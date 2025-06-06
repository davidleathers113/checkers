import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../../src/ui/web/components/GameBoard';
import { Board } from '../../src/core/Board';
import { Position } from '../../src/core/Position';
import { Move } from '../../src/core/Move';
import { RegularPiece } from '../../src/pieces/RegularPiece';
import { Player } from '../../src/types';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}

describe('GameBoard Component', () => {
  const mockOnSquareClick = jest.fn();
  const defaultAnimationState: AnimationState = {
    movingPieces: new Map<string, { from: Position; to: Position }>(),
    capturedPieces: new Set<string>(),
    promotedPieces: new Set<string>()
  };

  beforeEach(() => {
    mockOnSquareClick.mockClear();
  });

  test('renders 64 squares for 8x8 board', () => {
    const board = new Board(8);
    
    render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const squares = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-square')
    );
    expect(squares).toHaveLength(64);
  });

  test('renders pieces in correct positions', () => {
    const board = new Board(8);
    const piece = new RegularPiece(Player.RED, 'r1');
    const position = new Position(2, 3);
    const boardWithPiece = board.setPiece(position, piece);

    render(
      <GameBoard
        board={boardWithPiece}
        selectedPosition={null}
        validMoves={[]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const pieces = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-piece')
    );
    expect(pieces).toHaveLength(1);
    expect(pieces[0]).toHaveClass('red');
  });

  test('highlights selected square', () => {
    const board = new Board(8);
    const selectedPos = new Position(3, 3);

    const { container } = render(
      <GameBoard
        board={board}
        selectedPosition={selectedPos}
        validMoves={[]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const squares = container.querySelectorAll('.game-square');
    const selectedSquare = squares[3 * 8 + 3];
    expect(selectedSquare).toHaveClass('selected');
  });

  test('highlights valid move squares', () => {
    const board = new Board(8);
    const from = new Position(2, 2);
    const to = new Position(3, 3);
    const validMove = new Move(from, to);

    const { container } = render(
      <GameBoard
        board={board}
        selectedPosition={from}
        validMoves={[validMove]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const squares = container.querySelectorAll('.game-square');
    const validMoveSquare = squares[3 * 8 + 3];
    expect(validMoveSquare).toHaveClass('valid-move');
  });

  test('calls onSquareClick when square is clicked', () => {
    const board = new Board(8);

    const { container } = render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const squares = container.querySelectorAll('.game-square');
    fireEvent.click(squares[10]!);

    expect(mockOnSquareClick).toHaveBeenCalledTimes(1);
    expect(mockOnSquareClick).toHaveBeenCalledWith(
      expect.objectContaining({
        row: 1,
        col: 2
      })
    );
  });

  test('applies animation classes to pieces', () => {
    const board = new Board(8);
    const piece = new RegularPiece(Player.BLACK, 'b1');
    const position = new Position(4, 4);
    const boardWithPiece = board.setPiece(position, piece);

    const animationState = {
      movingPieces: new Map([[position.hash(), { from: position, to: new Position(5, 5) }]]),
      capturedPieces: new Set<string>(),
      promotedPieces: new Set<string>()
    };

    render(
      <GameBoard
        board={boardWithPiece}
        selectedPosition={null}
        validMoves={[]}
        animationState={animationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const pieces = screen.getAllByRole('generic').filter(el => 
      el.className.includes('game-piece')
    );
    expect(pieces[0]).toHaveClass('moving');
  });

  test('renders dark and light squares correctly', () => {
    const board = new Board(8);

    const { container } = render(
      <GameBoard
        board={board}
        selectedPosition={null}
        validMoves={[]}
        animationState={defaultAnimationState}
        onSquareClick={mockOnSquareClick}
        showMoveHints={true}
      />
    );

    const squares = container.querySelectorAll('.game-square');
    
    // Check first row pattern (light, dark, light, dark...)
    expect(squares[0]).toHaveClass('light');
    expect(squares[1]).toHaveClass('dark');
    expect(squares[2]).toHaveClass('light');
    expect(squares[3]).toHaveClass('dark');
    
    // Check second row pattern (dark, light, dark, light...)
    expect(squares[8]).toHaveClass('dark');
    expect(squares[9]).toHaveClass('light');
    expect(squares[10]).toHaveClass('dark');
    expect(squares[11]).toHaveClass('light');
  });
});