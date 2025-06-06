import { RuleEngine } from './RuleEngine';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player } from '../types';
import { Piece, RegularPiece } from '../pieces';

/**
 * Standard checkers rules implementation.
 * - Regular pieces move forward diagonally
 * - Kings move in any diagonal direction
 * - Captures are mandatory
 * - Multiple captures must be taken
 * - Pieces promote to kings on the back row
 */
export class StandardRules implements RuleEngine {
  private readonly boardSize: number;

  constructor(boardSize: number = 8) {
    this.boardSize = boardSize;
  }

  /**
   * Validates if a move is legal according to standard rules.
   */
  validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) return false;

    // Check basic move validity
    if (!piece.canMove(move.from, move.to, board)) {
      return false;
    }

    // Get mandatory moves for the current player
    const mandatoryMoves = this.getMandatoryMoves(board, piece.player);
    
    // If there are mandatory moves, the move must be one of them
    if (mandatoryMoves.length > 0) {
      return mandatoryMoves.some(mandatory => mandatory.equals(move));
    }

    // Check if this is a valid non-capture move
    if (!move.isCapture()) {
      return this.isValidRegularMove(board, move, piece);
    }

    // Validate capture move
    return this.isValidCaptureMove(board, move, piece);
  }

  /**
   * Gets all possible moves from a given position.
   */
  getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    const moves: Move[] = [];

    // Check for capture moves first (they're mandatory)
    const captureMoves = piece.getCaptureMoves(position, board);
    if (captureMoves.length > 0) {
      // Check for promotion on each capture move
      return captureMoves.map(move => {
        if (this.shouldPromote(move.to, piece)) {
          return move.withPromotion();
        }
        return move;
      });
    }

    // Get regular moves
    const regularMoves = piece.getPossibleMoves(position, board);
    for (const to of regularMoves) {
      let move = new Move(position, to);
      
      // Check for promotion
      if (this.shouldPromote(to, piece)) {
        move = move.withPromotion();
      }
      
      moves.push(move);
    }

    return moves;
  }

  /**
   * Gets all possible moves for a player.
   */
  getAllPossibleMoves(board: Board, player: Player): Move[] {
    const allMoves: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    // First check if there are any mandatory captures
    const mandatoryMoves = this.getMandatoryMoves(board, player);
    if (mandatoryMoves.length > 0) {
      return mandatoryMoves;
    }

    // Otherwise, get all possible moves
    for (const { position } of playerPieces) {
      const moves = this.getPossibleMoves(board, position);
      allMoves.push(...moves);
    }

    return allMoves;
  }

  /**
   * Checks if the game has ended.
   */
  isGameOver(board: Board): boolean {
    // Game is over if either player has no pieces
    const redCount = board.getPieceCount(Player.RED);
    const blackCount = board.getPieceCount(Player.BLACK);
    
    if (redCount === 0 || blackCount === 0) {
      return true;
    }

    // Game is over if current player has no valid moves
    const currentPlayer = this.getCurrentPlayer(board);
    const possibleMoves = this.getAllPossibleMoves(board, currentPlayer);
    
    return possibleMoves.length === 0;
  }

  /**
   * Determines the winner of the game.
   */
  getWinner(board: Board): Player | null {
    const redCount = board.getPieceCount(Player.RED);
    const blackCount = board.getPieceCount(Player.BLACK);

    // Winner by elimination
    if (redCount === 0) return Player.BLACK;
    if (blackCount === 0) return Player.RED;

    // Check if a player has no moves
    const redMoves = this.getAllPossibleMoves(board, Player.RED);
    const blackMoves = this.getAllPossibleMoves(board, Player.BLACK);

    if (redMoves.length === 0 && blackMoves.length === 0) {
      // Stalemate - winner is player with more pieces
      return redCount > blackCount ? Player.RED : Player.BLACK;
    }

    if (redMoves.length === 0) return Player.BLACK;
    if (blackMoves.length === 0) return Player.RED;

    return null; // Game not over
  }

  /**
   * Gets mandatory moves (forced captures).
   */
  getMandatoryMoves(board: Board, player: Player): Move[] {
    const captures: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    // Find all capture moves
    for (const { position } of playerPieces) {
      const piece = board.getPiece(position);
      if (piece) {
        const captureMoves = piece.getCaptureMoves(position, board);
        captures.push(...captureMoves);
      }
    }

    // If there are captures, find the ones with maximum captures
    if (captures.length > 0) {
      const maxCaptures = Math.max(...captures.map(move => move.getCaptureCount()));
      return captures.filter(move => move.getCaptureCount() === maxCaptures);
    }

    return [];
  }

  /**
   * Checks if a piece should be promoted.
   */
  shouldPromote(position: Position, piece: Piece): boolean {
    if (piece.isKing()) return false;

    // Red pieces promote on row 0 (top) - they move from bottom to top
    if (piece.player === Player.RED && position.row === 0) {
      return true;
    }

    // Black pieces promote on last row (bottom) - they move from top to bottom
    if (piece.player === Player.BLACK && position.row === this.boardSize - 1) {
      return true;
    }

    return false;
  }

  /**
   * Gets the initial board setup.
   */
  getInitialBoard(): Board {
    let board = new Board(this.boardSize);

    // Place black pieces (top of board)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.BLACK));
        }
      }
    }

    // Place red pieces (bottom of board)
    for (let row = this.boardSize - 3; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const pos = new Position(row, col);
        if (pos.isDarkSquare()) {
          board = board.setPiece(pos, new RegularPiece(Player.RED));
        }
      }
    }

    return board;
  }

  /**
   * Validates if a board state is legal.
   */
  isValidBoardState(board: Board): boolean {
    // Check board size
    if (board.size !== this.boardSize) return false;

    // Check that all pieces are on dark squares
    const occupiedPositions = board.getOccupiedPositions();
    for (const pos of occupiedPositions) {
      if (!pos.isDarkSquare()) return false;
    }

    // Check piece counts don't exceed starting amounts
    const redCount = board.getPieceCount(Player.RED);
    const blackCount = board.getPieceCount(Player.BLACK);
    const maxPieces = (this.boardSize / 2) * 3;

    if (redCount > maxPieces || blackCount > maxPieces) {
      return false;
    }

    return true;
  }

  /**
   * Validates a regular (non-capture) move.
   */
  private isValidRegularMove(board: Board, move: Move, piece: Piece): boolean {
    // Regular moves must be exactly one square
    const distance = move.getDistance();
    if (distance !== 1) return false;

    // Must move to empty square
    if (!board.isEmpty(move.to)) return false;

    // Must be diagonal
    if (!move.isDiagonal()) return false;

    // Regular pieces can only move forward
    if (!piece.isKing()) {
      const isForward = piece.player === Player.RED
        ? move.to.row < move.from.row
        : move.to.row > move.from.row;
      
      if (!isForward) return false;
    }

    return true;
  }

  /**
   * Validates a capture move.
   */
  private isValidCaptureMove(board: Board, move: Move, piece: Piece): boolean {
    if (!move.isCapture()) return false;

    // All captured pieces must be opponents
    for (const capturePos of move.captures) {
      const capturedPiece = board.getPiece(capturePos);
      if (!capturedPiece || capturedPiece.player === piece.player) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines current player based on move count.
   * This is a simplified approach - in practice, Game class tracks this.
   */
  private getCurrentPlayer(board: Board): Player {
    // Count total pieces to estimate turn
    const totalPieces = board.getPieceCount(Player.RED) + board.getPieceCount(Player.BLACK);
    const startingPieces = (this.boardSize / 2) * 3 * 2;
    const movesMade = startingPieces - totalPieces;
    
    return movesMade % 2 === 0 ? Player.RED : Player.BLACK;
  }
}