export interface GameConfig {
  boardSize: 8 | 10;
  ruleSet: 'standard' | 'international' | 'crazy';
  theme: 'classic' | 'modern' | 'dark';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showMoveHints: boolean;
}

export const defaultConfig: GameConfig = {
  boardSize: 8,
  ruleSet: 'standard',
  theme: 'classic',
  animationSpeed: 'normal',
  showMoveHints: true
};

export const ANIMATION_DURATIONS = {
  slow: 600,
  normal: 300,
  fast: 150
} as const;

export const THEME_COLORS = {
  classic: {
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    redPiece: { start: '#ef4444', mid: '#dc2626', end: '#b91c1c' },
    blackPiece: { start: '#374151', mid: '#1f2937', end: '#111827' }
  },
  modern: {
    lightSquare: '#e5e7eb',
    darkSquare: '#6b7280',
    redPiece: { start: '#f59e0b', mid: '#d97706', end: '#b45309' },
    blackPiece: { start: '#8b5cf6', mid: '#7c3aed', end: '#6d28d9' }
  },
  dark: {
    lightSquare: '#4b5563',
    darkSquare: '#1f2937',
    redPiece: { start: '#ef4444', mid: '#dc2626', end: '#b91c1c' },
    blackPiece: { start: '#60a5fa', mid: '#3b82f6', end: '#2563eb' }
  }
} as const;