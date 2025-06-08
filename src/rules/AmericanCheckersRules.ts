import { RuleEngine } from './RuleEngine';
import { Board } from '../core/Board';
import { Move } from '../core/Move';
import { Position } from '../core/Position';
import { Player, PieceType, Direction } from '../types';
import { Piece, RegularPiece, KingPiece } from '../pieces';
import { MoveValidator } from '../strategies/MoveValidator';
import { BasicMoveValidator } from '../strategies/BasicMoveValidator';
import { DiagonalMoveValidator } from '../strategies/DiagonalMoveValidator';
import { CaptureValidator } from '../strategies/CaptureValidator';
import { MandatoryCaptureValidator } from '../strategies/MandatoryCaptureValidator';

/**
 * American Checkers (English Draughts) rules implementation.
 * - Regular pieces move forward diagonally
 * - Kings move in any diagonal direction
 * - Captures are mandatory
 * - Multiple captures must be taken
 * - Pieces promote to kings on the back row
 */
export class AmericanCheckersRules implements RuleEngine {
  private readonly boardSize: number;

  constructor(boardSize: number = 8) {
    this.boardSize = boardSize;
  }

  /**
   * Validates if a move is legal according to American Checkers rules.
   */
  validateMove(board: Board, move: Move): boolean {
    const piece = board.getPiece(move.from);
    if (!piece) {
      return false; // No piece to move
    }

    // Note: Piece ownership (is it player's turn?) should be checked by Game or ValidationEngine before calling this.
    // This method validates if the move is legal for THIS piece according to rules.

    const mandatoryPlayerMoves = this.getMandatoryMoves(board, piece.player);

    if (mandatoryPlayerMoves.length > 0) {
      // If mandatory moves exist, the given move must be one of them.
      return mandatoryPlayerMoves.some(mandatoryMove => mandatoryMove.equals(move));
    } else {
      // No mandatory moves for the player.
      if (move.isCapture()) {
        // If the move is a capture, it must be a valid capture for this piece.
        const pieceCaptures = this.getCaptureMovesForPiece(piece, move.from, board);
        return pieceCaptures.some(captureMove => captureMove.equals(move));
      } else {
        // If the move is not a capture, it must be a valid non-capture move for this piece.
        const pieceNonCaptures = this.getNonCaptureMovesForPiece(piece, move.from, board);
        return pieceNonCaptures.some(nonCaptureMove => nonCaptureMove.equals(move));
      }
    }
  }

  /**
   * Gets all possible moves from a given position FOR THE PIECE AT THAT POSITION.
   * This method is primarily for internal use by getAllPossibleMoves(player) or for specific piece queries.
   * It does not enforce mandatory captures at this level; that's handled by getAllPossibleMoves(player).
   */
  getPossibleMoves(board: Board, position: Position): Move[] {
    const piece = board.getPiece(position);
    if (!piece) return [];

    const nonCaptureMoves = this.getNonCaptureMovesForPiece(piece, position, board);
    const captureMoves = this.getCaptureMovesForPiece(piece, position, board);

    // Combine and let the caller (like getAllPossibleMoves for player) decide on mandatory captures.
    // Promotion intent should be set here based on the landing spot.
    const allMoves = [...nonCaptureMoves, ...captureMoves];

    return allMoves.map(m => {
      if (this.shouldPromotePiece(piece, m.to, board)) {
        return m.withPromotion();
      }
      return m;
    });
  }

  /**
   * Gets all possible moves for a player.
   */
  getAllPossibleMoves(board: Board, player: Player): Move[] {
    const mandatoryMoves = this.getMandatoryMoves(board, player);
    if (mandatoryMoves.length > 0) {
      return mandatoryMoves; // If captures are mandatory, only they are possible.
    }

    // No mandatory captures, so collect all non-capture moves.
    let allNonCaptureMoves: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);
    for (const { piece, position } of playerPieces) {
      if (piece) { // Should always be true from getPlayerPieces
        const nonCaptures = this.getNonCaptureMovesForPiece(piece, position, board);
        nonCaptures.forEach(move => {
          if (this.shouldPromotePiece(piece, move.to, board)) {
            allNonCaptureMoves.push(move.withPromotion());
          } else {
            allNonCaptureMoves.push(move);
          }
        });
      }
    }
    return allNonCaptureMoves;
  }

  /**
   * Checks if the game has ended.
   */
  isGameOver(board: Board, currentPlayer: Player): boolean {
    // Game is over if either player has no pieces
    const redCount = board.getPieceCount(Player.RED);
    const blackCount = board.getPieceCount(Player.BLACK);

    if (redCount === 0 || blackCount === 0) {
      return true;
    }

    // Game is over if current player has no valid moves
    const possibleMoves = this.getAllPossibleMoves(board, currentPlayer);

    return possibleMoves.length === 0;
  }

  /**
   * Determines the winner of the game.
   */
  getWinner(board: Board, currentPlayer: Player): Player | null {
    const redCount = board.getPieceCount(Player.RED);
    const blackCount = board.getPieceCount(Player.BLACK);

    // Winner by elimination
    if (redCount === 0) return Player.BLACK;
    if (blackCount === 0) return Player.RED;

    // If current player has no moves, they lose.
    const possibleMoves = this.getAllPossibleMoves(board, currentPlayer);
    if (possibleMoves.length === 0) {
      return currentPlayer === Player.RED ? Player.BLACK : Player.RED;
    }

    // This part of the original logic for stalemate when both have no moves
    // might be complex if only one player's turn is considered.
    // The standard is: if current player cannot move, they lose.
    // If game rules lead to a state where neither can move (e.g. all pieces blocked, not typical in checkers)
    // that would be a draw or specific rule outcome.
    // For now, the "no moves for current player" is the primary condition.

    // The original logic also had:
    // const redMoves = this.getAllPossibleMoves(board, Player.RED);
    // const blackMoves = this.getAllPossibleMoves(board, Player.BLACK);
    // if (redMoves.length === 0 && blackMoves.length === 0) { ... }
    // This scenario should ideally be caught by the current player having no moves.

    return null; // Game not over, or no decisive winner based on this state alone without turn context.
  }

  /**
   * Gets mandatory moves (forced captures).
   */
  getMandatoryMoves(board: Board, player: Player): Move[] {
    let allPlayerCaptureSequences: Move[] = [];
    const playerPieces = board.getPlayerPieces(player);

    for (const { piece, position } of playerPieces) {
      if (piece) { // Should always be true
        const pieceCaptures = this.getCaptureMovesForPiece(piece, position, board);
        // Add promotion intent to capture moves
        const pieceCapturesWithPromotion = pieceCaptures.map(m => {
          if (this.shouldPromotePiece(piece, m.to, board)) {
            return m.withPromotion();
          }
          return m;
        });
        allPlayerCaptureSequences.push(...pieceCapturesWithPromotion);
      }
    }

    if (allPlayerCaptureSequences.length === 0) {
      return [];
    }

    // Apply maximal capture rule for American Checkers
    const maxCaptures = Math.max(...allPlayerCaptureSequences.map(m => m.getCaptureCount()));
    return allPlayerCaptureSequences.filter(m => m.getCaptureCount() === maxCaptures);
  }

  // --- New RuleEngine Interface Methods Implementation ---

  getNonCaptureMovesForPiece(piece: Piece, position: Position, board: Board): Move[] {
    const moves: Move[] = [];
    const pieceType = piece.type;

    if (pieceType === PieceType.REGULAR) {
      const directions = this._getRegularPieceMoveDirections(piece.player);
      for (const direction of directions) {
        const nextPos = this._getNextPosition(position, direction);
        if (nextPos && board.isValidPosition(nextPos) && board.isEmpty(nextPos)) {
          moves.push(new Move(position, nextPos));
        }
      }
    } else if (pieceType === PieceType.KING) {
      const directions = this._getKingMoveDirections();
      for (const direction of directions) {
        let currentPos = position;
        while (true) {
          const nextPos = this._getNextPosition(currentPos, direction);
          if (nextPos && board.isValidPosition(nextPos) && board.isEmpty(nextPos)) {
            moves.push(new Move(position, nextPos)); // King moves are from original start
            currentPos = nextPos;
          } else {
            break; // Blocked or off board
          }
        }
      }
    }
    return moves;
  }

  getCaptureMovesForPiece(piece: Piece, position: Position, board: Board): Move[] {
    const allSequences: Move[] = [];
    if (piece.type === PieceType.REGULAR) {
      this._findRegularCaptureSequences(piece, position, board, [], new Set(), allSequences);
    } else if (piece.type === PieceType.KING) {
      this._findKingCaptureSequences(piece, position, board, [], new Set(), allSequences);
    }
    return allSequences;
  }

  shouldPromotePiece(piece: Piece, landingPosition: Position, board: Board): boolean {
    if (piece.type === PieceType.KING) return false;

    if (piece.player === Player.RED && landingPosition.row === 0) {
      return true;
    }
    if (piece.player === Player.BLACK && landingPosition.row === board.size - 1) {
      return true;
    }
    return false;
  }

  getPromotedPiece(piece: Piece, landingPosition: Position, board: Board): Piece {
    if (this.shouldPromotePiece(piece, landingPosition, board)) {
      if (piece.type === PieceType.REGULAR) { // Ensure it's a regular piece promoting
        return new KingPiece(piece.player, piece.getId());
      }
    }
    return piece; // Return original piece if no promotion
  }

  // --- Helper Methods --- (some might be new or adapted from old piece classes)

  private _isForwardDirection(player: Player, from: Position, to: Position): boolean {
    if (player === Player.RED) {
      return to.row < from.row;
    } else {
      return to.row > from.row;
    }
  }

  private _getRegularPieceMoveDirections(player: Player): Direction[] {
    return player === Player.RED
      ? [Direction.NORTH_WEST, Direction.NORTH_EAST]
      : [Direction.SOUTH_WEST, Direction.SOUTH_EAST];
  }

  private _getKingMoveDirections(): Direction[] {
    return [Direction.NORTH_WEST, Direction.NORTH_EAST, Direction.SOUTH_WEST, Direction.SOUTH_EAST];
  }

  private _getNextPosition(position: Position, direction: Direction): Position | null {
    let { row, col } = position;
    switch (direction) {
      case Direction.NORTH_WEST: row--; col--; break;
      case Direction.NORTH_EAST: row--; col++; break;
      case Direction.SOUTH_WEST: row++; col--; break;
      case Direction.SOUTH_EAST: row++; col++; break;
    }
    // Assuming Position.isValid will be checked by caller using board.isValidPosition
    return new Position(row, col);
  }

  private _hasOpponent(piece: Piece, position: Position, board: Board): boolean {
    const targetPiece = board.getPiece(position);
    return targetPiece !== null && targetPiece.player !== piece.player;
  }

  // Recursive helper for regular piece captures
  private _findRegularCaptureSequences(
    piece: Piece,
    currentPos: Position,
    board: Board,
    currentPath: Move[],
    capturedOnThisPath: Set<string>,
    allSequences: Move[]
  ): void {
    const directions = this._getKingMoveDirections(); // Regular pieces can capture in any diagonal direction

    for (const direction of directions) {
      const opponentPos = this._getNextPosition(currentPos, direction);
      if (!opponentPos || !board.isValidPosition(opponentPos)) continue;

      const landingPos = this._getNextPosition(opponentPos, direction);
      if (!landingPos || !board.isValidPosition(landingPos)) continue;

      const opponentKey = opponentPos.hash();
      if (this._hasOpponent(piece, opponentPos, board) && board.isEmpty(landingPos) && !capturedOnThisPath.has(opponentKey)) {
        const singleJump = new Move(currentPos, landingPos, [opponentPos]);
        const newPath = [...currentPath, singleJump];
        const newCapturedOnPath = new Set(capturedOnThisPath).add(opponentKey);

        // Add this sequence (even if it's just one jump)
        const startPos = newPath[0].from;
        const finalLandingPos = newPath[newPath.length - 1].to;
        const allCapturedInSequence = newPath.flatMap(p => p.captures);
        allSequences.push(new Move(startPos, finalLandingPos, allCapturedInSequence, false, newPath.map(p => ({from: p.from, to: p.to, captured: p.captures[0]}))));

        // Explore further jumps
        this._findRegularCaptureSequences(piece, landingPos, board, newPath, newCapturedOnPath, allSequences);
      }
    }
    // Recursive calls modify allSequences directly.
  }

  // Recursive helper for king piece captures (American Checkers: king stops on square after capture)
  private _findKingCaptureSequences(
    piece: Piece,
    currentPos: Position,
    board: Board,
    currentPath: Move[],
    capturedOnThisPath: Set<string>,
    allSequences: Move[]
  ): void {
    const directions = this._getKingMoveDirections();

    for (const direction of directions) {
      const opponentPos = this._getNextPosition(currentPos, direction);
      if (!opponentPos || !board.isValidPosition(opponentPos)) continue;

      const landingPos = this._getNextPosition(opponentPos, direction);
      if (!landingPos || !board.isValidPosition(landingPos)) continue;

      const opponentKey = opponentPos.hash();
      if (this._hasOpponent(piece, opponentPos, board) && board.isEmpty(landingPos) && !capturedOnThisPath.has(opponentKey)) {
        const singleJump = new Move(currentPos, landingPos, [opponentPos]);
        const newPath = [...currentPath, singleJump];
        const newCapturedOnPath = new Set(capturedOnThisPath).add(opponentKey);

        const startPos = newPath[0].from;
        const finalLandingPos = newPath[newPath.length-1].to;
        const allCapturedInSequence = newPath.flatMap(p => p.captures);
        allSequences.push(new Move(startPos, finalLandingPos, allCapturedInSequence, false, newPath.map(p => ({from: p.from, to: p.to, captured: p.captures[0]}))));

        this._findKingCaptureSequences(piece, landingPos, board, newPath, newCapturedOnPath, allSequences);
      }
    }
    // Recursive calls modify allSequences directly.
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
   * Validates a multi-step move by checking each step.
   */
  // Removed validateMultiStepMove, isValidRegularMove, isValidCaptureMove as their logic is
  // now integrated into validateMove or covered by move generation methods.
  // Removed deprecated getCurrentPlayer.

  public getRequiredValidators(): MoveValidator[] {
    return [
      new BasicMoveValidator(),
      new DiagonalMoveValidator(),
      new CaptureValidator(),
      new MandatoryCaptureValidator(this) // Pass the RuleEngine instance
    ];
  }

  public areCapturesMandatory(board: Board, player: Player): boolean {
    const mandatoryMoves = this.getMandatoryMoves(board, player);
    return mandatoryMoves.length > 0;
  }
}