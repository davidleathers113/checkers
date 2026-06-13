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
  validMoveType?: MoveTargetType;
  isCaptureBurst?: boolean;
  isDragSource?: boolean;
  isDropHover?: boolean;
  isCursor?: boolean;
  moveDelta?: { dx: number; dy: number };
  onClick: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
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
  isDragSource = false,
  isDropHover = false,
  isCursor = false,
  moveDelta,
  onClick,
  onPointerDown
}: GameSquareProps): React.JSX.Element {
  const isDark = position.isDarkSquare();

  let className = `game-square ${isDark ? 'dark' : 'light'}`;
  if (isSelected) className += ' selected';
  if (isValidMove) className += ` valid-move target-${validMoveType ?? 'slide'}`;
  if (isMustMove) className += ' must-move';
  if (isHintFrom) className += ' hint-from';
  if (isHintTo) className += ' hint-to';
  if (isCaptureBurst) className += ' capture-burst';
  if (isDropHover) className += ' drop-hover';
  if (isCursor) className += ' kb-cursor';

  return (
    <div
      className={className}
      data-testid={`game-square-${position.row}-${position.col}`}
      role="gridcell"
      onClick={onClick}
      onPointerDown={onPointerDown}
    >
      {piece && (
        <GamePiece
          piece={piece}
          position={position}
          isMoving={isMoving}
          isCaptured={isCaptured}
          isPromoted={isPromoted}
          isDragSource={isDragSource}
          moveDelta={moveDelta}
        />
      )}
    </div>
  );
}
