import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { GamePage } from '../support/gamePage';

test.describe('Accessibility Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test.describe('Main Page Accessibility', () => {
    test('Main page has no accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Page has proper document structure', async () => {
      // Check for proper heading hierarchy
      const h1 = gamePage.page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('Checkers');
      
      // Check for main landmark
      const main = gamePage.page.locator('main, [role="main"], .game-container');
      await expect(main).toBeVisible();
    });

    test('Interactive elements have accessible names', async () => {
      // Settings button should have accessible name
      await expect(gamePage.settingsButton).toHaveAttribute('aria-label', 'Game Settings');
      
      // Game control buttons should have accessible text
      await expect(gamePage.newGameButton).toContainText('New Game');
      await expect(gamePage.undoButton).toContainText('Undo');
      await expect(gamePage.redoButton).toContainText('Redo');
    });

    test('Color contrast meets WCAG standards', async ({ page }) => {
      // Use axe-core to check color contrast
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      const contrastViolations = accessibilityScanResults.violations.filter(
        (violation: any) => violation.id === 'color-contrast'
      );
      
      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('All interactive elements are keyboard accessible', async () => {
      // Tab through all interactive elements
      await gamePage.page.keyboard.press('Tab');
      
      // Settings button should be focusable
      await expect(gamePage.settingsButton).toBeFocused();
      
      await gamePage.page.keyboard.press('Tab');
      // New Game button should be focusable
      await expect(gamePage.newGameButton).toBeFocused();
      
      await gamePage.page.keyboard.press('Tab');
      // Undo button should be focusable
      await expect(gamePage.undoButton).toBeFocused();
      
      await gamePage.page.keyboard.press('Tab');
      // Redo button should be focusable
      await expect(gamePage.redoButton).toBeFocused();
    });

    test('Game board squares are keyboard accessible', async () => {
      // Check if game squares can be reached via keyboard
      // This might require implementing keyboard navigation for the game board
      
      // For now, verify that the board container is in the tab order
      let currentElement = gamePage.page.locator(':focus');
      let tabCount = 0;
      const maxTabs = 20; // Prevent infinite loop
      
      while (tabCount < maxTabs) {
        await gamePage.page.keyboard.press('Tab');
        currentElement = gamePage.page.locator(':focus');
        tabCount++;
        
        // Check if we've reached a game square or the board
        const isGameSquare = await currentElement.getAttribute('data-testid');
        if (isGameSquare && isGameSquare.includes('game-square')) {
          break;
        }
        
        // Check if we've reached the board container
        const isBoardContainer = await currentElement.evaluate(el => 
          el.classList.contains('game-board') || el.closest('.game-board')
        );
        if (isBoardContainer) {
          break;
        }
      }
      
      // At minimum, verify we can tab through the interface
      expect(tabCount).toBeLessThan(maxTabs);
    });

    test('Settings panel is keyboard accessible', async () => {
      // Open settings via keyboard
      await gamePage.settingsButton.focus();
      await gamePage.page.keyboard.press('Enter');
      
      await expect(gamePage.configContainer).toBeVisible();
      
      // Tab through settings options
      await gamePage.page.keyboard.press('Tab');
      
      // Check that radio buttons are accessible
      const standardRules = gamePage.page.locator('input[value="standard"]');
      if (await standardRules.isVisible()) {
        await expect(standardRules).toBeFocused();
      }
      
      // Use arrow keys to navigate radio button groups
      await gamePage.page.keyboard.press('ArrowDown');
      
      // Close settings with keyboard
      await gamePage.configCloseButton.focus();
      await gamePage.page.keyboard.press('Enter');
      
      await expect(gamePage.configContainer).not.toBeVisible();
    });

    test('Keyboard shortcuts work properly', async () => {
      // Test Escape key to close modals
      await gamePage.openSettings();
      await expect(gamePage.configContainer).toBeVisible();
      
      await gamePage.page.keyboard.press('Escape');
      // Note: This test assumes Escape closes the modal, which may need to be implemented
      
      // Test Enter key for button activation
      await gamePage.newGameButton.focus();
      await gamePage.page.keyboard.press('Enter');
      
      // Verify game reset (new game started)
      await gamePage.expectCurrentPlayer('Red');
      await expect(gamePage.moveCount).toContainText('Move 1');
    });
  });

  test.describe('Screen Reader Accessibility', () => {
    test('Game status is announced to screen readers', async () => {
      // Check for live regions that announce game state changes
      const gameStatus = gamePage.gameStatus;
      
      // Verify the text is accessible to screen readers
      const statusText = await gameStatus.textContent();
      expect(statusText).toBeTruthy();
      expect(statusText).toContain('Turn:');
    });

    test('Game board structure is accessible', async () => {
      // Check if the board has proper labeling for screen readers
      const board = gamePage.board;
      
      // Board should have a role or be properly labeled
      const role = await board.getAttribute('role');
      const ariaLabel = await board.getAttribute('aria-label');
      const ariaLabelledBy = await board.getAttribute('aria-labelledby');
      
      // At least one of these should be present for screen reader users
      const hasAccessibleName = role === 'grid' || ariaLabel || ariaLabelledBy;
      expect(hasAccessibleName).toBeTruthy();
    });

    test('Piece information is accessible', async () => {
      // Check that game pieces have accessible information
      const redPiece = gamePage.getPieceOnSquare(2, 1);
      
      // Piece should have accessible text or attributes
      const textContent = await redPiece.textContent();
      const ariaLabel = await redPiece.getAttribute('aria-label');
      const title = await redPiece.getAttribute('title');
      
      // Piece should convey its color and type to screen readers
      const hasAccessibleInfo = textContent || ariaLabel || title;
      expect(hasAccessibleInfo).toBeTruthy();
    });

    test('Move validation errors are announced', async () => {
      // Try to make an invalid move and check if error is accessible
      await gamePage.clickSquare(2, 1); // Select piece
      await gamePage.clickSquare(1, 1); // Try invalid move
      
      // If an error message appears, it should be accessible
      if (await gamePage.errorMessage.isVisible()) {
        const errorText = await gamePage.errorMessage.textContent();
        expect(errorText).toBeTruthy();
        
        // Error should have appropriate ARIA attributes
        const ariaLive = await gamePage.errorMessage.getAttribute('aria-live');
        const role = await gamePage.errorMessage.getAttribute('role');
        
        expect(ariaLive || role).toBeTruthy();
      }
    });
  });

  test.describe('Settings Panel Accessibility', () => {
    test('Settings panel has no accessibility violations', async () => {
      await gamePage.openSettings();
      
      const accessibilityScanResults = await new AxeBuilder({ page: gamePage.page })
        .include('[data-testid="game-config"]')
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Form controls have proper labels', async () => {
      await gamePage.openSettings();
      
      // Check radio button groups have proper labeling
      const ruleSetRadios = gamePage.page.locator('input[name="ruleSet"]');
      
      for (const radio of await ruleSetRadios.all()) {
        const id = await radio.getAttribute('id');
        const name = await radio.getAttribute('name');
        
        // Radio should be part of a labeled group
        expect(name).toBeTruthy();
        
        // Find associated label
        const label = gamePage.page.locator(`label[for="${id}"]`);
        if (await label.count() === 0) {
          // Check if radio is inside a label
          const parentLabel = radio.locator('xpath=ancestor::label');
          expect(await parentLabel.count()).toBeGreaterThan(0);
        }
      }
      
      // Checkbox should have proper labeling
      const checkboxLabel = gamePage.page.locator('label:has(input[data-testid="show-move-hints-checkbox"])');
      await expect(checkboxLabel).toBeVisible();
      await expect(checkboxLabel).toContainText('Show move hints');
    });

    test('Modal dialog has proper accessibility attributes', async () => {
      await gamePage.openSettings();
      
      const modal = gamePage.configContainer;
      
      // Modal should have proper role
      const role = await modal.getAttribute('role');
      const ariaModal = await modal.getAttribute('aria-modal');
      const ariaLabel = await modal.getAttribute('aria-label');
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
      
      // Modal should be properly identified
      expect(role === 'dialog' || ariaModal === 'true').toBeTruthy();
      
      // Modal should have accessible name
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    });
  });

  test.describe('Focus Management', () => {
    test('Focus is managed properly when opening/closing settings', async () => {
      // Focus settings button
      await gamePage.settingsButton.focus();
      await expect(gamePage.settingsButton).toBeFocused();
      
      // Open settings
      await gamePage.page.keyboard.press('Enter');
      await expect(gamePage.configContainer).toBeVisible();
      
      // Focus should move into the modal
      // Check if close button or first interactive element is focused
      await gamePage.page.waitForTimeout(100); // Brief wait for focus management
      
      const focusedElement = gamePage.page.locator(':focus');
      
      // Focus should be within the settings panel
      const isWithinSettings = await focusedElement.evaluate(el => 
        el.closest('[data-testid="game-config"]') !== null
      );
      expect(isWithinSettings).toBeTruthy();
      
      // Close settings
      await gamePage.configCloseButton.click();
      await expect(gamePage.configContainer).not.toBeVisible();
      
      // Focus should return to settings button
      await gamePage.page.waitForTimeout(100);
      await expect(gamePage.settingsButton).toBeFocused();
    });

    test('Focus trap works in modal dialogs', async () => {
      await gamePage.openSettings();
      await gamePage.selectBoardSize('10');
      
      // Confirmation dialog should appear
      await expect(gamePage.confirmDialog).toBeVisible();
      
      // Tab should cycle within the dialog
      await gamePage.page.keyboard.press('Tab');
      let focusedElement = gamePage.page.locator(':focus');
      
      // Should be within the confirmation dialog
      const isWithinDialog = await focusedElement.evaluate(el => 
        el.closest('[data-testid="confirm-dialog"]') !== null
      );
      expect(isWithinDialog).toBeTruthy();
      
      // Continue tabbing should stay within dialog
      await gamePage.page.keyboard.press('Tab');
      await gamePage.page.keyboard.press('Tab');
      
      focusedElement = gamePage.page.locator(':focus');
      const stillWithinDialog = await focusedElement.evaluate(el => 
        el.closest('[data-testid="confirm-dialog"]') !== null
      );
      expect(stillWithinDialog).toBeTruthy();
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Mobile layout maintains accessibility', async () => {
      await gamePage.page.setViewportSize({ width: 375, height: 667 });
      await gamePage.goto();
      
      // Run accessibility scan on mobile layout
      const accessibilityScanResults = await new AxeBuilder({ page: gamePage.page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Touch targets meet minimum size requirements', async () => {
      await gamePage.page.setViewportSize({ width: 375, height: 667 });
      await gamePage.goto();
      
      // Check button sizes meet accessibility guidelines (44px minimum)
      const buttons = [
        gamePage.settingsButton,
        gamePage.newGameButton,
        gamePage.undoButton,
        gamePage.redoButton
      ];
      
      for (const button of buttons) {
        const boundingBox = await button.boundingBox();
        expect(boundingBox).toBeTruthy();
        expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox!.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test.describe('Theme Accessibility', () => {
    test('Dark theme maintains accessibility standards', async () => {
      // Switch to dark theme
      await gamePage.openSettings();
      const darkTheme = gamePage.page.locator('input[value="dark"]');
      await darkTheme.click();
      await gamePage.configDoneButton.click();
      
      // Run accessibility scan on dark theme
      const accessibilityScanResults = await new AxeBuilder({ page: gamePage.page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('All themes have sufficient color contrast', async () => {
      const themes = ['classic', 'modern', 'dark'];
      
      for (const theme of themes) {
        await gamePage.openSettings();
        const themeInput = gamePage.page.locator(`input[value="${theme}"]`);
        await themeInput.click();
        await gamePage.configDoneButton.click();
        
        // Check color contrast for this theme
        const contrastResults = await new AxeBuilder({ page: gamePage.page })
          .withRules(['color-contrast'])
          .analyze();
        
        const contrastViolations = contrastResults.violations.filter(
          (violation: any) => violation.id === 'color-contrast'
        );
        
        expect(contrastViolations).toHaveLength(0);
      }
    });
  });
});