/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/apps/web/jest.config.js',
    '<rootDir>/apps/api/jest.config.js',
    '<rootDir>/packages/*/jest.config.js'
  ],
  collectCoverageFrom: [
    'apps/**/src/**/*.{ts,tsx}',
    'packages/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/generated/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
    '/generated/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@ai-sales-agent/(.*)$': '<rootDir>/packages/$1/src'
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  clearMocks: true,
  restoreMocks: true
};
