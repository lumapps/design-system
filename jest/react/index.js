const { COMPONENTS_PATH, CORE_PATH, ICONS_PATH, SRC_PATH } = require('../../webpack/constants');

module.exports = {
    moduleDirectories: ['<rootDir>node_modules'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '^.*\\.scss$': '<rootDir>jest/react/__mocks__/styleMock.js',
        '^LumX$': `${SRC_PATH}/react.index.ts`,
        '^LumX/icons(.*)$': `${ICONS_PATH}$1`,
        '^LumX/angularjs(.*)$': `${CORE_PATH}/angularjs$1`,
        '^LumX/react(.*)$': `${CORE_PATH}/react$1`,
        '^LumX/core(.*)$': `${CORE_PATH}$1`,
        '^LumX/components$': `${COMPONENTS_PATH}/index.ts`,
        '^LumX/components(.*)$': `${COMPONENTS_PATH}$1`,
    },
    preset: 'ts-jest',
    reporters: ['default'],
    rootDir: '../../',
    setupFilesAfterEnv: ['<rootDir>jest/react/configure.js'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testEnvironment: 'node',
    testMatch: ['<rootDir>src/components/**/?(*.)test?(s).(j|t)s?(x)'],
    transform: {
        '^.+\\.(js|jsx)?$': '<rootDir>jest/react/transform.js',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
};
