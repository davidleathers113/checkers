// Test setup and configuration
// This file runs before all tests

// Add any global test configuration here
import '@testing-library/jest-dom';

// Mock console methods to reduce noise during testing
const originalConsole = { ...console };

beforeAll(() => {
  // Optionally suppress console output during tests
  if (process.env['NODE_ENV'] === 'test') {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  }
});

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole);
});