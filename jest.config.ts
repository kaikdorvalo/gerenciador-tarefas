module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolateModules: true
        }
    },
    clearMocks: true,
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testPathIgnorePatterns: ['./dist/*']
};
