import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameConfig, defaultConfig } from '../types/GameConfig';

interface GameConfigContextType {
  config: GameConfig;
  updateConfig: (updates: Partial<GameConfig>) => void;
  resetConfig: () => void;
}

const GameConfigContext = createContext<GameConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'checkers-game-config';

export function GameConfigProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [config, setConfig] = useState<GameConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load game config:', error);
    }
    return defaultConfig;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save game config:', error);
    }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<GameConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }, []);

  return (
    <GameConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </GameConfigContext.Provider>
  );
}

export function useGameConfig(): GameConfigContextType {
  const context = useContext(GameConfigContext);
  if (!context) {
    throw new Error('useGameConfig must be used within a GameConfigProvider');
  }
  return context;
}