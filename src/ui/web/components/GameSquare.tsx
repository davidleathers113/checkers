import React from 'react';
import { Position } from '../../../core/Position';
import { Piece } from '../../../pieces/Piece';
import { GamePiece } from './GamePiece';

type MoveTargetType = 'slide' | 'capture' | 'hop';

interface GameSquareProps {
  position: Position;
  piece: Piece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isMoving: boolean;
  isCaptured: boolean;
  isPromoted: boolean;
  isMustMove?: boolean;
  isHintFrom?: boolean;
  isHintTo?: boolean;
  /** Kind of move that lands here, used to vary the target affordance. */
  validMoveType?: MoveTargetType;
  /** Show a capture burst (a piece was just taken from this square). */
  isCaptureBurst?: boolean;
  /** Cell offset for a gliding piece. */
  moveDelta?: { dx: number; dy: number };
  onClick: () => void;
}

export function GameSquare({
  position,
  piece,
  isSelected,
  isValidMove,
  isMoving,
  isCaptured,
  isPromoted,
  isMustMove = false,
  isHintFrom = false,
  isHintTo = false,
  validMoveType,
  isCaptureBurst = false,
  moveDelta,
  onClick
}: GameSquareProps): React.JSX.Element {
  const isDark = position.isDarkSquare();

  let className = `game-square ${isDark ? 'dark' : 'light'}`;
  if (isSelected) className += ' selected';
  if (isValidMove) className += ` valid-move target-${validMoveType ?? 'slide'}`;
  if (isMustMove) className += ' must-move';
  if (isHintFrom) className += ' hint-from';
  if (isHintTo) className += ' hint-to';
  if (isCaptureBurst) className += ' capture-burst';

  return (
    <div
      className={className}
      data-testid={`game-square-${position.row}-${position.col}`}
      onClick={onClick}
    >
      {piece && (
        <GamePiece
          piece={piece}
          position={position}
          isMoving={isMoving}
          isCaptured={isCaptured}
          isPromoted={isPromoted}
          moveDelta={moveDelta}
        />
      )}
    </div>
  );
}
