import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';

interface AnimationState {
  movingPieces: Map<string, { from: Position; to: Position }>;
  capturedPieces: Set<string>;
  promotedPieces: Set<string>;
}

interface UIState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}

interface CombinedGameState extends CoreGameState {
  selectedPosition: Position | null;
  validMoves: Move[];
  errorMessage: string | null;
  animationState: AnimationState;
}

interface GameActions {
  selectPosition: (position: Position) => void;
  undoMove: () => void;
  redoMove: () => void;
  newGame: () => void;
}

interface UseAnimatedGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}

export function useAnimatedGame(): UseAnimatedGameReturn {
  const gameRef = useRef(new Game({ ruleEngine: new StandardRules() }));
  const lastMoveRef = useRef<Move | null>(null);
  const lastPromotedRef = useRef<Position | null>(null);

  const getSnapshot = useCallback((): CoreGameState => gameRef.current.getGameState(), []);

  const subscribe = useCallback((callback: () => void): (() => void) => {
    const game = gameRef.current;
    
    const observer: Partial<GameObserver> = {
      onMove: (move: Move) => {
        lastMoveRef.current = move;
        callback();
      },
      onGameEnd: callback,
      onTurnChange: callback,
      onInvalidMove: callback,
      onBoardUpdate: callback,
      onPiecePromoted: (position: Position) => {
        lastPromotedRef.current = position;
        callback();
      }
    };
    
    game.addObserver(observer as GameObserver);
    return () => game.removeObserver(observer as GameObserver);
  }, []);

  const gameState = useSyncExternalStore(subscribe, getSnapshot);
  
  const [uiState, setUiState] = useState<UIState>({
    selectedPosition: null,
    validMoves: [],
    errorMessage: null,
    animationState: {
      movingPieces: new Map(),
      capturedPieces: new Set(),
      promotedPieces: new Set()
    }
  });

  // Handle move animations
  useEffect(() => {
    if (lastMoveRef.current) {
      const move = lastMoveRef.current;
      const key = move.from.hash();
      
      // Add moving piece
      setUiState(prev => ({
        ...prev,
        animationState: {
          ...prev.animationState,
          movingPieces: new Map([[key, { from: move.from, to: move.to }]])
        }
      }));

      // Handle captures
      if (move.captures.length > 0) {
        setTimeout(() => {
          const capturedKeys = move.captures.map(c => c.hash());
          setUiState(prev => ({
            ...prev,
            animationState: {
              ...prev.animationState,
              capturedPieces: new Set(capturedKeys)
            }
          }));
        }, 150); // Delay capture animation
      }

      // Clear animations after delay
      setTimeout(() => {
        setUiState(prev => ({
          ...prev,
          animationState: {
            movingPieces: new Map(),
            capturedPieces: new Set(),
            promotedPieces: prev.animationState.promotedPieces
          }
        }));
        lastMoveRef.current = null;
      }, 500);
    }
  }, [gameState.moveHistory.length]);

  // Handle promotion animations
  useEffect(() => {
    if (lastPromotedRef.current) {
      const pos = lastPromotedRef.current;
      setUiState(prev => ({
        ...prev,
        animationState: {
          ...prev.animationState,
          promotedPieces: new Set([...prev.animationState.promotedPieces, pos.hash()])
        }
      }));

      setTimeout(() => {
        setUiState(prev => ({
          ...prev,
          animationState: {
            ...prev.animationState,
            promotedPieces: new Set()
          }
        }));
        lastPromotedRef.current = null;
      }, 600);
    }
  }, [gameState.board]);

  const selectPosition = useCallback((position: Position): void => {
    const game = gameRef.current;
    if (game.isGameOver()) return;

    const piece = game.getBoard().getPiece(position);

    if (piece && piece.player === game.getCurrentPlayer()) {
      const validMoves = game.getPossibleMoves(position);
      setUiState(prev => ({
        ...prev,
        selectedPosition: position,
        validMoves,
        errorMessage: null,
      }));
    } else if (uiState.selectedPosition) {
      const move = uiState.validMoves.find(m => m.to.equals(position));
      if (move) {
        try {
          game.makeMove(move);
          setUiState(prev => ({ 
            ...prev,
            selectedPosition: null, 
            validMoves: [], 
            errorMessage: null 
          }));
        } catch (error) {
          setUiState(prev => ({ 
            ...prev, 
            errorMessage: error instanceof Error ? error.message : String(error) 
          }));
        }
      } else {
        setUiState(prev => ({ 
          ...prev,
          selectedPosition: null, 
          validMoves: [], 
          errorMessage: null 
        }));
      }
    }
  }, [uiState.selectedPosition, uiState.validMoves]);

  const newGame = useCallback((): void => {
    gameRef.current.reset();
    setUiState({
      selectedPosition: null,
      validMoves: [],
      errorMessage: null,
      animationState: {
        movingPieces: new Map(),
        capturedPieces: new Set(),
        promotedPieces: new Set()
      }
    });
  }, []);
  
  const undoMove = useCallback((): void => {
    if (gameRef.current.undoMove()) {
      setUiState(prev => ({
        ...prev,
        selectedPosition: null,
        validMoves: [],
        errorMessage: null
      }));
    }
  }, []);
  
  const redoMove = useCallback((): void => {
    // Note: redoMove not yet implemented in Game class
  }, []);

  return {
    gameState: { ...gameState, ...uiState },
    actions: { selectPosition, undoMove, redoMove, newGame },
    canUndo: gameState.moveHistory.length > 0,
    canRedo: false,
  };
}