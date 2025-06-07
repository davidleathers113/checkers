export const INITIAL_GAME_STATE = {
  board: {
    size8x8: 8,
    size10x10: 10,
  },
  pieces: {
    red: {
      // Initial positions for red pieces on 8x8 board
      initialPositions8x8: [
        { row: 0, col: 1 }, { row: 0, col: 3 }, { row: 0, col: 5 }, { row: 0, col: 7 },
        { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 1, col: 4 }, { row: 1, col: 6 },
        { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 2, col: 5 }, { row: 2, col: 7 }
      ],
      // Initial positions for red pieces on 10x10 board
      initialPositions10x10: [
        { row: 0, col: 1 }, { row: 0, col: 3 }, { row: 0, col: 5 }, { row: 0, col: 7 }, { row: 0, col: 9 },
        { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 1, col: 4 }, { row: 1, col: 6 }, { row: 1, col: 8 },
        { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 2, col: 5 }, { row: 2, col: 7 }, { row: 2, col: 9 },
        { row: 3, col: 0 }, { row: 3, col: 2 }, { row: 3, col: 4 }, { row: 3, col: 6 }, { row: 3, col: 8 }
      ]
    },
    black: {
      // Initial positions for black pieces on 8x8 board
      initialPositions8x8: [
        { row: 5, col: 0 }, { row: 5, col: 2 }, { row: 5, col: 4 }, { row: 5, col: 6 },
        { row: 6, col: 1 }, { row: 6, col: 3 }, { row: 6, col: 5 }, { row: 6, col: 7 },
        { row: 7, col: 0 }, { row: 7, col: 2 }, { row: 7, col: 4 }, { row: 7, col: 6 }
      ],
      // Initial positions for black pieces on 10x10 board
      initialPositions10x10: [
        { row: 6, col: 1 }, { row: 6, col: 3 }, { row: 6, col: 5 }, { row: 6, col: 7 }, { row: 6, col: 9 },
        { row: 7, col: 0 }, { row: 7, col: 2 }, { row: 7, col: 4 }, { row: 7, col: 6 }, { row: 7, col: 8 },
        { row: 8, col: 1 }, { row: 8, col: 3 }, { row: 8, col: 5 }, { row: 8, col: 7 }, { row: 8, col: 9 },
        { row: 9, col: 0 }, { row: 9, col: 2 }, { row: 9, col: 4 }, { row: 9, col: 6 }, { row: 9, col: 8 }
      ]
    }
  }
};

export const COMMON_MOVES = {
  // Standard opening moves for 8x8 board
  redOpening8x8: [
    { from: { row: 2, col: 1 }, to: { row: 3, col: 0 } },
    { from: { row: 2, col: 1 }, to: { row: 3, col: 2 } },
    { from: { row: 2, col: 3 }, to: { row: 3, col: 2 } },
    { from: { row: 2, col: 3 }, to: { row: 3, col: 4 } }
  ],
  blackOpening8x8: [
    { from: { row: 5, col: 0 }, to: { row: 4, col: 1 } },
    { from: { row: 5, col: 2 }, to: { row: 4, col: 1 } },
    { from: { row: 5, col: 2 }, to: { row: 4, col: 3 } },
    { from: { row: 5, col: 4 }, to: { row: 4, col: 3 } }
  ]
};

export const TEST_SCENARIOS = {
  simpleCapture: {
    description: 'Setup for a simple capture scenario',
    setup: [
      { action: 'place', piece: 'red', position: { row: 3, col: 2 } },
      { action: 'place', piece: 'black', position: { row: 4, col: 3 } },
      { action: 'clear', position: { row: 5, col: 4 } }
    ],
    expectedCapture: { from: { row: 3, col: 2 }, to: { row: 5, col: 4 }, captured: { row: 4, col: 3 } }
  },
  kingPromotion: {
    description: 'Setup for king promotion',
    setup: [
      { action: 'place', piece: 'red', position: { row: 6, col: 1 } },
      { action: 'clear', position: { row: 7, col: 0 } }
    ],
    expectedPromotion: { from: { row: 6, col: 1 }, to: { row: 7, col: 0 } }
  }
};

export const VIEWPORT_SIZES = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

export const ANIMATION_TIMEOUTS = {
  short: 250,
  medium: 500,
  long: 1000
};