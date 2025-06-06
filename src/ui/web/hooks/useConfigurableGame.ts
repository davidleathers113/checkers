import { useSyncExternalStore, useCallback, useRef, useState, useEffect } from 'react';
import { Game } from '../../../core/Game';
import { Move } from '../../../core/Move';
import { Position } from '../../../core/Position';
import { GameState as CoreGameState } from '../../../types';
import { StandardRules } from '../../../rules/StandardRules';
import { GameObserver } from '../../../core/GameObserver';
import { RuleEngine } from '../../../rules/RuleEngine';
import { useGameConfig } from '../contexts/GameConfigContext';
import { ANIMATION_DURATIONS } from '../types/GameConfig';

// Import custom rule implementations - use relative paths from web directory
import { InternationalDraughtsRules } from '../../../../examples/InternationalDraughts';
import { CrazyCheckersRules } from '../../../../examples/CrazyCheckers';

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
  newGame: (boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy') => void;
}

interface UseConfigurableGameReturn {
  gameState: CombinedGameState;
  actions: GameActions;
  canUndo: boolean;
  canRedo: boolean;
}

function createRuleEngine(ruleSet: 'standard' | 'international' | 'crazy', boardSize: 8 | 10 = 8): RuleEngine {
  switch (ruleSet) {
  case 'international':
    return new InternationalDraughtsRules(boardSize);
  case 'crazy':
    return new CrazyCheckersRules(boardSize);
  default:
    return new StandardRules(boardSize);
  }
}

export function useConfigurableGame(): UseConfigurableGameReturn {
  const { config } = useGameConfig();
  const gameRef = useRef<Game>(new Game({ 
    ruleEngine: createRuleEngine(config.ruleSet, config.boardSize)
  }));
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

  // Get animation duration based on config
  const animationDuration = ANIMATION_DURATIONS[config.animationSpeed];

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
        }, animationDuration / 2); // Delay capture animation
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
      }, animationDuration * 1.5);
    }
  }, [gameState.moveHistory.length, animationDuration]);

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
      }, animationDuration * 2);
    }
  }, [gameState.board, animationDuration]);

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

  const newGame = useCallback((boardSize?: 8 | 10, ruleSet?: 'standard' | 'international' | 'crazy'): void => {
    const rules = ruleSet || config.ruleSet;
    const size = boardSize || config.boardSize;
    
    gameRef.current = new Game({ 
      ruleEngine: createRuleEngine(rules, size)
    });
    
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
  }, [config.ruleSet, config.boardSize]);
  
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