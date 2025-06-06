import { useState, useEffect, useCallback, useRef } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { Board } from '../../../core/Board';
import { Player } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  moveCount: number;
}

export function useGame() {
  const gameRef = useRef<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize the game
    const game = new Game({
      ruleEngine: new StandardRules(),
      startingPlayer: Player.RED
    });
    gameRef.current = game;
    
    return {
      board: game.getBoard(),
      currentPlayer: game.getCurrentPlayer(),
      gameOver: game.isGameOver(),
      winner: game.getWinner(),
      selectedPosition: null,
      validMoves: [],
      errorMessage: null,
      moveCount: game.getMoveCount()
    };
  });

  // Update game state from Game instance
  const updateGameState = useCallback((updates: Partial<GameState> = {}) => {
    if (!gameRef.current) return;
    
    const game = gameRef.current;
    setGameState(prev => ({
      ...prev,
      board: game.getBoard(),
      currentPlayer: game.getCurrentPlayer(),
      gameOver: game.isGameOver(),
      winner: game.getWinner(),
      moveCount: game.getMoveCount(),
      ...updates
    }));
  }, []);

  // Game observer that updates React state
  const gameObserver = useCallback(() => ({
    onMove: () => {
      updateGameState({ 
        selectedPosition: null, 
        validMoves: [], 
        errorMessage: null 
      });
    },
    onGameEnd: () => {
      updateGameState({ 
        selectedPosition: null, 
        validMoves: [], 
        errorMessage: null 
      });
    },
    onTurnChange: () => {
      updateGameState({ 
        selectedPosition: null, 
        validMoves: [], 
        errorMessage: null 
      });
    },
    onInvalidMove: (_move: Move, reason: string) => {
      updateGameState({ 
        errorMessage: `Invalid move: ${reason}` 
      });
    },
    onBoardUpdate: () => {
      updateGameState();
    }
  }), [updateGameState]);

  // Register observer on mount
  useEffect(() => {
    if (gameRef.current) {
      const observer = gameObserver();
      gameRef.current.addObserver(observer);
      return () => {
        if (gameRef.current) {
          gameRef.current.removeObserver(observer);
        }
      };
    }
  }, [gameObserver]);

  // Clear error message after a delay
  useEffect(() => {
    if (gameState.errorMessage) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, errorMessage: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.errorMessage]);

  // Game actions
  const selectPosition = useCallback((position: Position) => {
    if (!gameRef.current || gameState.gameOver) return;
    
    const game = gameRef.current;
    const piece = game.getBoard().getPiece(position);
    
    // If clicking on current player's piece, select it
    if (piece && piece.player === game.getCurrentPlayer()) {
      const validMoves = game.getPossibleMoves(position);
      setGameState(prev => ({
        ...prev,
        selectedPosition: position,
        validMoves,
        errorMessage: null
      }));
    }
    // If a position is selected and clicking on valid move destination
    else if (gameState.selectedPosition) {
      const move = gameState.validMoves.find(m => m.to.equals(position));
      if (move) {
        try {
          game.makeMove(move);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          setGameState(prev => ({ ...prev, errorMessage: message }));
        }
      } else {
        // Invalid destination, clear selection
        setGameState(prev => ({
          ...prev,
          selectedPosition: null,
          validMoves: [],
          errorMessage: null
        }));
      }
    }
  }, [gameState.selectedPosition, gameState.validMoves, gameState.gameOver]);

  const makeMove = useCallback((move: Move) => {
    if (!gameRef.current || gameState.gameOver) return;
    
    try {
      gameRef.current.makeMove(move);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setGameState(prev => ({ ...prev, errorMessage: message }));
    }
  }, [gameState.gameOver]);

  const undoMove = useCallback(() => {
    if (!gameRef.current) return;
    const success = gameRef.current.undoMove();
    if (success) {
      updateGameState({ 
        selectedPosition: null, 
        validMoves: [], 
        errorMessage: null 
      });
    }
  }, [updateGameState]);

  const redoMove = useCallback(() => {
    if (!gameRef.current) return;
    const success = gameRef.current.redoMove();
    if (success) {
      updateGameState({ 
        selectedPosition: null, 
        validMoves: [], 
        errorMessage: null 
      });
    }
  }, [updateGameState]);

  const newGame = useCallback(() => {
    if (!gameRef.current) return;
    gameRef.current.reset();
    updateGameState({ 
      selectedPosition: null, 
      validMoves: [], 
      errorMessage: null 
    });
  }, [updateGameState]);

  const canUndo = gameRef.current ? gameRef.current.getHistory().length > 0 : false;
  const canRedo = false; // Would need to track redo stack

  return {
    gameState,
    actions: {
      selectPosition,
      makeMove,
      undoMove,
      redoMove,
      newGame
    },
    canUndo,
    canRedo
  };
}