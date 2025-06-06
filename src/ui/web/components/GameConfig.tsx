import React, { useState } from 'react';
import { useGameConfig } from '../contexts/GameConfigContext';
import { GameConfig as GameConfigType } from '../types/GameConfig';

interface GameConfigProps {
  onClose: () => void;
  onNewGame: (boardSize: 8 | 10, ruleSet: 'standard' | 'international' | 'crazy') => void;
}

export function GameConfig({ onClose, onNewGame }: GameConfigProps): React.JSX.Element {
  const { config, updateConfig, resetConfig } = useGameConfig();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<GameConfigType>>({});

  const handleBoardSizeChange = (size: 8 | 10): void => {
    if (size !== config.boardSize) {
      setPendingChanges({ boardSize: size, ruleSet: size === 10 ? 'international' : 'standard' });
      setShowConfirm(true);
    }
  };

  const handleRuleSetChange = (ruleSet: 'standard' | 'international' | 'crazy'): void => {
    if (ruleSet === 'international' && config.boardSize === 8) {
      setPendingChanges({ boardSize: 10, ruleSet });
      setShowConfirm(true);
    } else if (ruleSet !== config.ruleSet) {
      setPendingChanges({ ruleSet });
      setShowConfirm(true);
    }
  };

  const confirmChanges = (): void => {
    const newBoardSize = pendingChanges.boardSize || config.boardSize;
    const newRuleSet = pendingChanges.ruleSet || config.ruleSet;
    updateConfig(pendingChanges);
    onNewGame(newBoardSize, newRuleSet);
    setShowConfirm(false);
    setPendingChanges({});
  };

  const cancelChanges = (): void => {
    setShowConfirm(false);
    setPendingChanges({});
  };

  return (
    <div className="config-overlay">
      <div className="config-panel">
        <div className="config-header">
          <h2>Game Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="config-section">
          <h3>Game Rules</h3>
          <div className="config-options">
            <label className={`config-option ${config.ruleSet === 'standard' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="ruleSet"
                value="standard"
                checked={config.ruleSet === 'standard'}
                onChange={() => handleRuleSetChange('standard')}
              />
              <span>Standard Checkers</span>
              <small>Classic 8x8 American checkers</small>
            </label>
            <label className={`config-option ${config.ruleSet === 'international' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="ruleSet"
                value="international"
                checked={config.ruleSet === 'international'}
                onChange={() => handleRuleSetChange('international')}
              />
              <span>International Draughts</span>
              <small>10x10 board with flying kings</small>
            </label>
            <label className={`config-option ${config.ruleSet === 'crazy' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="ruleSet"
                value="crazy"
                checked={config.ruleSet === 'crazy'}
                onChange={() => handleRuleSetChange('crazy')}
              />
              <span>Crazy Checkers</span>
              <small>Experimental rules with unique mechanics</small>
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Board Size</h3>
          <div className="config-options horizontal">
            <label className={`config-option ${config.boardSize === 8 ? 'selected' : ''}`}>
              <input
                type="radio"
                name="boardSize"
                value="8"
                checked={config.boardSize === 8}
                onChange={() => handleBoardSizeChange(8)}
                disabled={config.ruleSet === 'international'}
              />
              <span>8×8</span>
            </label>
            <label className={`config-option ${config.boardSize === 10 ? 'selected' : ''}`}>
              <input
                type="radio"
                name="boardSize"
                value="10"
                checked={config.boardSize === 10}
                onChange={() => handleBoardSizeChange(10)}
              />
              <span>10×10</span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Visual Theme</h3>
          <div className="config-options horizontal">
            <label className={`config-option ${config.theme === 'classic' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="theme"
                value="classic"
                checked={config.theme === 'classic'}
                onChange={() => updateConfig({ theme: 'classic' })}
              />
              <span>Classic</span>
            </label>
            <label className={`config-option ${config.theme === 'modern' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="theme"
                value="modern"
                checked={config.theme === 'modern'}
                onChange={() => updateConfig({ theme: 'modern' })}
              />
              <span>Modern</span>
            </label>
            <label className={`config-option ${config.theme === 'dark' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={config.theme === 'dark'}
                onChange={() => updateConfig({ theme: 'dark' })}
              />
              <span>Dark</span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Animation Speed</h3>
          <div className="config-options horizontal">
            <label className={`config-option ${config.animationSpeed === 'slow' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="animationSpeed"
                value="slow"
                checked={config.animationSpeed === 'slow'}
                onChange={() => updateConfig({ animationSpeed: 'slow' })}
              />
              <span>Slow</span>
            </label>
            <label className={`config-option ${config.animationSpeed === 'normal' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="animationSpeed"
                value="normal"
                checked={config.animationSpeed === 'normal'}
                onChange={() => updateConfig({ animationSpeed: 'normal' })}
              />
              <span>Normal</span>
            </label>
            <label className={`config-option ${config.animationSpeed === 'fast' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="animationSpeed"
                value="fast"
                checked={config.animationSpeed === 'fast'}
                onChange={() => updateConfig({ animationSpeed: 'fast' })}
              />
              <span>Fast</span>
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Options</h3>
          <label className="config-checkbox">
            <input
              type="checkbox"
              checked={config.showMoveHints}
              onChange={(e) => updateConfig({ showMoveHints: e.target.checked })}
            />
            <span>Show move hints</span>
          </label>
        </div>

        <div className="config-actions">
          <button className="btn btn-secondary" onClick={resetConfig}>
            Reset to Defaults
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>

        {showConfirm && (
          <div className="confirm-dialog">
            <div className="confirm-content">
              <p>Changing the board size or rules will start a new game. Continue?</p>
              <div className="confirm-actions">
                <button className="btn btn-secondary" onClick={cancelChanges}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmChanges}>New Game</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}