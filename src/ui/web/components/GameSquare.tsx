import React from 'react';
import { Position } from '../../../core/Position';
import { Piece } from '../../../pieces/Piece';
import { GamePiece } from './GamePiece';

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
  onClick
}: GameSquareProps): React.JSX.Element {
  const isDark = position.isDarkSquare();

  let className = `game-square ${isDark ? 'dark' : 'light'}`;
  if (isSelected) className += ' selected';
  if (isValidMove) className += ' valid-move';
  if (isMustMove) className += ' must-move';
  if (isHintFrom) className += ' hint-from';
  if (isHintTo) className += ' hint-to';

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
        />
      )}
    </div>
  );
}