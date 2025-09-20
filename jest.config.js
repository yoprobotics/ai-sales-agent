module.exports = {
  projects: [
    {
      displayName: 'web',
      testMatch: ['<rootDir>/apps/web/**/*.test.{ts,tsx}'],
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/web/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
    {
      displayName: 'api',
      testMatch: ['<rootDir>/apps/api/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/api/src/$1',
      },
      globalSetup: '<rootDir>/apps/api/src/__tests__/setup.ts',
      globalTeardown: '<rootDir>/apps/api/src/__tests__/teardown.ts',
    },
    {
      displayName: 'core',
      testMatch: ['<rootDir>/packages/core/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  testTimeout: 20000,
  verbose: true,
};
