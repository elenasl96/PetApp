module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'node',  //not to repeat --env=node every time
    //globals: { 'ts-jest': { diagnostics: false } },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };