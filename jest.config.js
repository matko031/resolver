/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@self/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
 //setupFiles: ['<rootDir>/tests/setup.ts'],
 testMatch: ["<rootDir>/tests/**/*.test.ts"]
};
