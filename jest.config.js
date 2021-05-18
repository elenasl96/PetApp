module.exports = {
    preset: 'react-native',
    testEnvironment: 'node',  //not to repeat --env=node every time
    globals: { 'ts-jest': { diagnostics: false } },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
        'jest-transform-stub',
      '^.+\\.(js|jsx)?$': 'babel-jest'
      //"node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    snapshotSerializers: ['jest-serializer-vue'],
    testMatch: [
        '**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'
    ],
    transformIgnorePatterns: ['node_modules/(?!@react-native|react-native)']


  };