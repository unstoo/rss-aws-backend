// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {},
  testMatch: [
    "**/src/*.test.mjs"
  ],
  // collectCoverageFrom: [
  //   'product-service/src/*.mjs',
  //   '!product-service/index.mjs',
  //   '!product-service/src/store.mjs',
  //   '!product-service/src/products.mjs',
  //   '!product-service/src/*.test.mjs',
  //   '!swagger/**',
  //   '!serverle/**',
  // ],
  // coveragePathIgnorePatterns: [
  //   '/node_modules/',
  //   '/config/',
  //   '/coverage/',
  //   '/android/',
  //   '/ios/',
  //   '/src/ApolloProviderWithPersistence',
  //   '/ApolloMocks',
  //   '/src/constants',
  //   'src/types',
  //   '.consts.ts',
  //   '.types.tsx',
  //   '.queries.ts',
  //   '.styles.ts',
  //   'theme.ts',
  //   'types.ts',
  // ],
  // coverageReporters: ['html', 'text', 'lcov', 'text-summary'],
  // coverageThreshold: {
  //   global: {
  //     branches: 50,
  //     functions: 50,
  //     lines: 50,
  //     statements: 50,
  //   },
  // },
  // preset: 'react-native',
  // setupFiles: ['<rootDir>jest.setup.js'],
  // setupFilesAfterEnv: ['<rootDir>/src/__mocks__/globalMock.js'],
};
