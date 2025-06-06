import React from 'react';
import { Board } from '../../../core/Board';
import { Position } from '../../../core/Position';
import { Move } from '../../../core/Move';
import { GameSquare } from './GameSquare';

interface GameBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Move[];
  onSquareClick: (position: Position) => void;
}

export function GameBoard({ 
  board, 
  selectedPosition, 
  validMoves, 
  onSquareClick 
}: GameBoardProps) {
  const squares = [];
  
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const position = new Position(row, col);
      const piece = board.getPiece(position);
      const isSelected = selectedPosition?.equals(position) ?? false;
      const isValidMove = validMoves.some(move => move.to.equals(position));
      
      squares.push(
        <GameSquare
          key={`${row}-${col}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
          isValidMove={isValidMove}
          onClick={() => onSquareClick(position)}
        />
      );
    }
  }

  return (
    <div className="game-board">
      {squares}
    </div>
  );
}