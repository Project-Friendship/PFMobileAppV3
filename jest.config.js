module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/app/**/*.test.[jt]s?(x)', '<rootDir>/components/**/*.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native/.*)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'node',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.test.{ts,tsx}',
    '!app/**/*.spec.{ts,tsx}'
  ],
  // CI settings
  ci: true,
  maxWorkers: process.env.CI ? 2 : '50%',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
