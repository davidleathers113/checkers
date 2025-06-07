# Playwright E2E Tests

This directory contains comprehensive end-to-end (E2E) tests for the Extensible Checkers web application using the Playwright framework.

## Overview

The test suite validates the application from a user's perspective, ensuring:
- ✅ Functional correctness across user flows
- ✅ Cross-browser compatibility (Chromium, Firefox, WebKit)
- ✅ Responsive design on desktop, tablet, and mobile
- ✅ Visual regression prevention
- ✅ Accessibility compliance

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
# Run all E2E tests
npm run test:e2e

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
// Example usage
const gamePage = new GamePage(page);
await gamePage.goto();
await gamePage.startNewGame();
await gamePage.movePiece({ row: 2, col: 1 }, { row: 3, col: 0 });
await gamePage.expectCurrentPlayer('Black');
```

Key methods:
- **Navigation**: `goto()`, `openSettings()`, `closeSettings()`
- **Game Actions**: `startNewGame()`, `movePiece()`, `undoMove()`
- **Assertions**: `expectCurrentPlayer()`, `expectPieceToBe()`, `expectGameOver()`

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Configuration

### Browser Matrix
Tests run across multiple browsers and viewports:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome on Pixel 5, Safari on iPhone 12

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
Visual tests automatically generate screenshots on first run. Update baselines:
```bash
# Update all visual baselines
npx playwright test visual --update-snapshots

# Update specific test screenshots
npx playwright test "theme appearance" --update-snapshots
```

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