# Playwright E2E Tests

This directory contains comprehensive end-to-end (E2E) tests for the Extensible Checkers web application using the Playwright framework.

## Overview

The test suite validates the application from a user's perspective, ensuring:
- ✅ Functional correctness across user flows
- ✅ Cross-browser compatibility (Chromium + Mobile Chrome by default; Firefox,
  WebKit, and Mobile Safari behind `E2E_ALL_BROWSERS=1`)
- ✅ Responsive design on desktop, tablet, and mobile
- ✅ Visual regression prevention (chromium baselines)
- ✅ Accessibility compliance

> **Determinism:** every run builds the app and serves the **production preview**
> on a fixed port (`reuseExistingServer: false`), so a stray Vite dev server can
> never serve stale code or CSS into a run.

## Directory Structure

```
playwright/
├── config/
│   └── playwright.config.ts    # Main configuration file
├── tests/
│   ├── smoke.spec.ts           # Critical path tests
│   ├── gameplay.spec.ts        # Core game mechanics
│   ├── config.spec.ts          # Settings and configuration
│   ├── responsiveness.spec.ts  # Multi-device layout tests
│   ├── visual.spec.ts          # Screenshot regression tests
│   └── accessibility.spec.ts   # A11y compliance tests
├── support/
│   ├── gamePage.ts            # Page Object Model
│   └── testData.ts            # Test data and constants
└── README.md                   # This file
```

## Running Tests

### Prerequisites
```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npx playwright install
```

### Available Commands

```bash
# Run all functional/a11y/PWA E2E tests (excludes the serial visual suite)
npm run test:e2e

# Run the visual regression suite (serial; see "Screenshot Comparison" below)
npm run test:e2e:visual

# Run with interactive UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with debugging
npm run test:e2e:debug

# Run specific test suites
npm run test:e2e:smoke           # Just smoke tests
npm run test:e2e:visual          # Visual regression tests
npm run test:e2e:accessibility   # Accessibility tests

# The CI gate: chromium only, excluding the (macOS-baselined) visual suite
npm run test:e2e:ci

# View test report
npm run test:e2e:report
```

## Test Suites

### 1. Smoke Tests (`smoke.spec.ts`)
Critical functionality verification:
- Application loads without errors
- Main UI elements are visible
- Basic game interactions work
- Settings panel opens/closes

### 2. Gameplay Tests (`gameplay.spec.ts`)
Comprehensive game mechanics testing:
- **Initial State & Basic Moves**: Turn-based movement, valid move restrictions
- **Capture Mechanics**: Single and multi-jump captures
- **King Promotion**: Piece advancement and king behavior
- **Game End Conditions**: Win/lose scenarios, game reset
- **Undo/Redo**: Move history management

### 3. Configuration Tests (`config.spec.ts`)
Settings and customization validation:
- **Board Size**: 8x8 vs 10x10 configurations
- **Rule Sets**: Standard, International, Crazy Checkers
- **Visual Options**: Theme selection, animation speed
- **Game Options**: Move hints, configuration persistence

### 4. Responsiveness Tests (`responsiveness.spec.ts`)
Multi-device compatibility:
- **Desktop Layout**: Full-featured interface
- **Tablet Layout**: Adapted touch interactions
- **Mobile Layout**: Optimized for small screens
- **Touch Targets**: Minimum size requirements
- **Orientation**: Portrait and landscape support

### 5. Visual Regression Tests (`visual.spec.ts`)
Screenshot-based change detection:
- Initial game states
- Piece selection and movement
- Theme variations
- Settings panels
- Animation states
- Cross-browser consistency

### 6. Accessibility Tests (`accessibility.spec.ts`)
WCAG compliance verification:
- **Color Contrast**: AA level standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels and live regions
- **Focus Management**: Modal dialogs and focus traps
- **Touch Accessibility**: Mobile interaction support

## Page Object Model

The tests use the Page Object Model (POM) pattern for maintainability:

```typescript
// Example usage. Red is at the bottom (rows 5-7) and moves first; Black is at
// the top (rows 0-2). A move is a tap on the source square then the target.
const gamePage = new GamePage(page);
await gamePage.goto();
await gamePage.startNewGame();
await gamePage.movePiece({ row: 5, col: 0 }, { row: 4, col: 1 });
await gamePage.expectCurrentPlayer('Black');
```

Key methods:
- **Navigation**: `goto()`, `openSettings()`, `closeSettings()`
- **Game Actions**: `startNewGame()`, `movePiece()`, `undoMove()`
- **Assertions**: `expectCurrentPlayer()`, `expectPieceToBe()`, `expectGameOver()`

## CI/CD Integration

CI is defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- **On every push to `main` and every pull request:**
  - `quality` job — `lint`, `typecheck`, `npm test` (jsdom unit tests), and both
    builds (`build`, `build:web`).
  - `e2e` job — `npm run test:e2e:ci` (chromium, functional + accessibility).
    The `playwright-report/` is uploaded as an artifact.
- **Nightly (07:00 UTC):** the `e2e-all-browsers` job runs the full matrix with
  `E2E_ALL_BROWSERS=1` (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).

The **visual-regression suite is intentionally excluded from CI**. Its baselines
are pixel-for-pixel captures rendered on macOS (`*-chromium-darwin.png`) and a
Linux CI runner renders text and anti-aliasing differently, so they would never
match. Run and update visual baselines locally on macOS (see below).

## Configuration

### Browser Matrix
By default tests run on two projects: **Chromium** (Desktop Chrome) and
**Mobile Chrome** (Pixel 5). Set `E2E_ALL_BROWSERS=1` to add **Firefox**,
**WebKit** (Desktop Safari), and **Mobile Safari** (iPhone 12) for the nightly
cross-browser run.

### Test Data
Centralized test data in `testData.ts`:
- Initial piece positions
- Common move sequences
- Viewport dimensions
- Animation timeouts

## Debugging Tests

### Visual Debugging
```bash
# Run with browser visible
npm run test:e2e:headed

# Interactive debugging
npm run test:e2e:debug

# UI mode for test development
npm run test:e2e:ui
```

### Screenshot Comparison
Visual baselines are captured on a single canonical project (**chromium**) and
committed under `tests/visual.spec.ts-snapshots/`. For determinism the suite:

- **runs serially** (`--workers=1`, baked into `test:e2e:visual`). The app is a
  vertically-centred layout, so under parallel CPU load the page's exact pixel
  position jitters by a pixel or two and re-centres the whole frame — a large
  full-page diff. Serial execution removes that contention. (Because of this,
  `npm run test:e2e` excludes the visual suite, just like CI; always run it via
  `test:e2e:visual`.)
- **blocks Google Fonts** so the UI renders in deterministic system fonts. A
  late web-font swap would otherwise change text metrics and re-centre the page.
  The shipped app still uses its real web fonts — only these fixtures don't.
- **parks the mouse** at the corner before each capture, so no element is left
  in a `:hover` state.
- freezes CSS animations/transitions to their end state, hides the caret, and
  allows a small `maxDiffPixelRatio` (0.01) for anti-aliasing jitter.

Regenerate baselines locally on macOS after an intentional UI change:
```bash
# Update all visual baselines (serial, chromium)
npm run test:e2e:visual -- --update-snapshots

# Then verify they are byte-stable on a clean re-run
npm run test:e2e:visual
```
Commit the regenerated `*-chromium-darwin.png` files alongside the UI change.

## Best Practices

### Test Isolation
- Each test starts with a fresh page load
- No dependencies between tests
- Clean state management

### Reliable Selectors
- Uses `data-testid` attributes for stable element selection
- Avoids CSS class-based selectors that may change
- Semantic locators when appropriate

### Async Handling
- Proper `await` usage for all async operations
- Animation timing considerations
- Network request handling

### Cross-Browser Compatibility
- Tests designed to work across all supported browsers
- Browser-specific workarounds when necessary
- Consistent assertions across platforms

## Maintenance

### Adding New Tests
1. Identify the test category (smoke, gameplay, etc.)
2. Add to appropriate spec file
3. Use existing Page Object methods when possible
4. Follow established naming conventions

### Updating Selectors
1. Update `data-testid` attributes in components
2. Update corresponding Page Object methods
3. Verify all affected tests still pass

### Performance Considerations
- Keep test execution time reasonable
- Use `test.describe.serial()` for dependent tests
- Parallel execution where possible

## Troubleshooting

### Common Issues

**Flaky Tests**: Usually caused by timing issues
- Add appropriate waits for animations
- Use `waitForLoadState()` for page transitions
- Verify element visibility before interaction

**Screenshot Differences**: OS/browser rendering variations
- Use `threshold` option for minor differences
- Platform-specific baselines if necessary
- Consider visual testing alternatives for flaky elements

**Slow Tests**: Network or animation delays
- Configure timeouts appropriately
- Use `--headed` mode to observe behavior
- Profile with `--trace on` for detailed timing

### Getting Help
- Check Playwright documentation: https://playwright.dev
- Review test output and screenshots in `test-results/`
- Use `--debug` mode for step-by-step execution