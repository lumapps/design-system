module.exports = {
    moduleDirectories: ['<rootDir>node_modules'],
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
        '^.*\\.scss$': '<rootDir>jest/react/__mocks__/styleMock.js',
    },
    reporters: ['default'],
    rootDir: '../../',
    setupFilesAfterEnv: ['<rootDir>jest/react/configure.js'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: ['<rootDir>src/components/**/?(*.)tests.js?(x)'],
    transform: {
        '^.+\\.(js|jsx)?$': '<rootDir>jest/react/transform.js',
    },
};
