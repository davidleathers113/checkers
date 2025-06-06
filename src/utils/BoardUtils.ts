import { Board } from '../core/Board';
import { Position } from '../core/Position';
import { Player } from '../types';
import { RegularPiece } from '../pieces/RegularPiece';

/**
 * Utility functions for board operations.
 */
export class BoardUtils {
  /**
   * Creates a standard 8x8 checkers board setup.
   */
  static createStandardBoard(size: number = 8): Board {
    let board = new Board(size);

    // Place red pieces (top of board)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < size; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.RED));
        }
      }
    }

    // Place black pieces (bottom of board)
    for (let row = size - 3; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.BLACK));
        }
      }
    }

    return board;
  }

  /**
   * Creates an empty board with only dark squares marked.
   */
  static createEmptyBoard(size: number = 8): Board {
    return new Board(size);
  }

  /**
   * Checks if a position is a dark square (playable).
   */
  static isDarkSquare(position: Position): boolean {
    return position.isDarkSquare();
  }

  /**
   * Gets all positions between two diagonal positions.
   */
  static getPositionsBetween(from: Position, to: Position): Position[] {
    return from.getPositionsBetween(to);
  }

  /**
   * Checks if two positions are diagonal to each other.
   */
  static areDiagonal(from: Position, to: Position): boolean {
    return from.isOnSameDiagonalAs(to);
  }

  /**
   * Gets all dark squares on the board.
   */
  static getAllDarkSquares(size: number = 8): Position[] {
    const darkSquares: Position[] = [];
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          darkSquares.push(pos);
        }
      }
    }
    
    return darkSquares;
  }

  /**
   * Converts board to simple string representation for debugging.
   */
  static boardToString(board: Board): string {
    return board.toString();
  }

  /**
   * Creates a board from a simple string representation.
   * Format: 'r' = red regular, 'R' = red king, 'b' = black regular, 'B' = black king, '.' = empty
   */
  static boardFromString(boardString: string, size: number = 8): Board {
    const lines = boardString.trim().split('\n');
    let board = new Board(size);
    
    for (let row = 0; row < size && row < lines.length; row++) {
      const line = lines[row]!.replace(/\s/g, '');
      for (let col = 0; col < size && col < line.length; col++) {
        const char = line[col];
        const pos = new Position(row, col);
        
        if (char === 'r') {
          board = board.setPiece(pos, new RegularPiece(Player.RED));
        } else if (char === 'R') {
          const piece = new RegularPiece(Player.RED);
          board = board.setPiece(pos, piece.promote());
        } else if (char === 'b') {
          board = board.setPiece(pos, new RegularPiece(Player.BLACK));
        } else if (char === 'B') {
          const piece = new RegularPiece(Player.BLACK);
          board = board.setPiece(pos, piece.promote());
        }
      }
    }
    
    return board;
  }

  /**
   * Counts total pieces on the board.
   */
  static countPieces(board: Board): { red: number; black: number; total: number } {
    const red = board.getPieceCount(Player.RED);
    const black = board.getPieceCount(Player.BLACK);
    return { red, black, total: red + black };
  }

  /**
   * Gets the center positions of the board.
   */
  static getCenterPositions(size: number = 8): Position[] {
    const center = Math.floor(size / 2);
    return [
      new Position(center - 1, center - 1),
      new Position(center - 1, center),
      new Position(center, center - 1),
      new Position(center, center)
    ].filter(pos => pos.isValid(size));
  }

  /**
   * Gets corner positions of the board.
   */
  static getCornerPositions(size: number = 8): Position[] {
    return [
      new Position(0, 0),
      new Position(0, size - 1),
      new Position(size - 1, 0),
      new Position(size - 1, size - 1)
    ];
  }

  /**
   * Gets edge positions of the board.
   */
  static getEdgePositions(size: number = 8): Position[] {
    const edges: Position[] = [];
    
    for (let i = 0; i < size; i++) {
      edges.push(new Position(0, i)); // Top row
      edges.push(new Position(size - 1, i)); // Bottom row
      edges.push(new Position(i, 0)); // Left column
      edges.push(new Position(i, size - 1)); // Right column
    }
    
    // Remove duplicates
    return edges.filter((pos, index, array) => 
      index === array.findIndex(p => p.equals(pos))
    );
  }
}