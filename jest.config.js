/**
 * Jest configuration
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};