import React from 'react';
import { Board } from '../../../core/Board';
import { Position } from '../../../core/Position';
import { Move } from '../../../core/Move';
import { GameSquare } from './GameSquare';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}

type MoveTargetType = 'slide' | 'capture' | 'hop';

interface GameBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Move[];
  animationState: AnimationState;
  onSquareClick: (position: Position) => void;
  showMoveHints: boolean;
  mandatorySources?: Set<string>;
  hintMove?: Move | null;
}

/**
 * Classifies a (non-capture) move so its landing square can show the right
 * affordance: a "hop" leaps over one of your own pieces (Jump Your Own Man),
 * whereas a "slide" travels over empty squares.
 */
function classifyMove(move: Move, board: Board): MoveTargetType {
  if (move.isCapture()) return 'capture';
  if (move.getDistance() >= 2) {
    const between = move.from.getPositionsBetween(move.to);
    if (between.some(pos => !board.isEmpty(pos))) return 'hop';
  }
  return 'slide';
}

export function GameBoard({
  board,
  selectedPosition,
  validMoves,
  animationState,
  onSquareClick,
  showMoveHints,
  mandatorySources,
  hintMove
}: GameBoardProps): React.JSX.Element {
  const squares = [];

  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const position = new Position(row, col);
      const piece = board.getPiece(position);
      const isSelected = selectedPosition?.equals(position) ?? false;

      const matchingMove = validMoves.find(move => move.to.equals(position));
      const isValidMove = showMoveHints && matchingMove !== undefined;
      const validMoveType = matchingMove ? classifyMove(matchingMove, board) : undefined;

      const posKey = position.hash();
      const movingEntry = animationState.movingPieces.get(posKey);
      const isMoving = movingEntry !== undefined;
      const moveDelta = movingEntry
        ? { dx: movingEntry.from.col - movingEntry.to.col, dy: movingEntry.from.row - movingEntry.to.row }
        : undefined;
      const isCaptureBurst = animationState.capturedPieces.has(posKey);
      const isPromoted = animationState.promotedPieces.has(posKey);

      const isMustMove = showMoveHints && (mandatorySources?.has(posKey) ?? false);
      const isHintFrom = hintMove?.from.equals(position) ?? false;
      const isHintTo = hintMove?.to.equals(position) ?? false;

      squares.push(
        <GameSquare
          key={`${row}-${col}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
          isValidMove={isValidMove}
          validMoveType={validMoveType}
          isMoving={isMoving}
          moveDelta={moveDelta}
          isCaptured={false}
          isCaptureBurst={isCaptureBurst}
          isPromoted={isPromoted}
          isMustMove={isMustMove}
          isHintFrom={isHintFrom}
          isHintTo={isHintTo}
          onClick={() => onSquareClick(position)}
        />
      );
    }
  }

  const boardStyle = {
    gridTemplateColumns: `repeat(${board.size}, 1fr)`,
    gridTemplateRows: `repeat(${board.size}, 1fr)`,
    ['--board-size' as string]: board.size
  } as React.CSSProperties;

  return (
    <div className="game-board" data-testid="game-board" style={boardStyle}>
      {squares}
    </div>
  );
}
