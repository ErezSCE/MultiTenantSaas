/**
 * Jest configuration
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};