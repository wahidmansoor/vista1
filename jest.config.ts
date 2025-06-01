import type { Config } from "jest";

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/?(*.)+(test|spec).(ts|tsx)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|@tanstack|msw|@mswjs|supertest|@google/generative-ai)/)'
  ],
  setupFiles: ['<rootDir>/jest.env.ts'],
};

export default config;
