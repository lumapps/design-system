const { COMPONENTS_PATH, CORE_PATH, DEMO_PATH, ICONS_PATH, SRC_PATH } = require('../../webpack/constants');

module.exports = {
    collectCoverageFrom: ['**/src/components/**/*.{ts,tsx}', '!**/node_modules/**'],
    coverageDirectory: 'jest/reports/coverage',
    coverageReporters: ['json', 'lcov', 'html', 'text'],
    moduleDirectories: ['<rootDir>node_modules'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
        '^.*\\.scss$': '<rootDir>jest/react/__mocks__/styleMock.js',
        '^LumX$': `${SRC_PATH}/react.index.ts`,
        '^LumX/components$': `${COMPONENTS_PATH}/index.ts`,
        '^LumX/components(.*)$': `${COMPONENTS_PATH}$1`,
        '^LumX/core(.*)$': `${CORE_PATH}$1`,
        '^LumX/demo(.*)$': `${DEMO_PATH}$1`,
        '^LumX/icons(.*)$': `${ICONS_PATH}$1`,
        '^LumX/react(.*)$': `${CORE_PATH}/react$1`,
    },
    preset: 'ts-jest',
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                publicPath: 'jest/reports',
                filename: 'jest_report_summary.html',
            },
        ],
    ],
    rootDir: '../../',
    setupFilesAfterEnv: [
        'jest-chain',
        'expect-more-jest',
        'jest-enzyme',
        'jest-expect-message',
        'jest-mock-console/dist/setupTestFramework.js',
        '<rootDir>jest/react/configure.js',
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testEnvironment: 'enzyme',
    testEnvironmentOptions: {
        enzymeAdapter: 'react16',
    },
    testMatch: ['<rootDir>(src/components|webpack)/**/?(*.)(test|spec)?(s).(j|t)s?(x)'],
    transform: {
        '^.+\\.(js|jsx)?$': '<rootDir>jest/react/transform.js',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    watchPlugins: [
        'jest-watch-master',
        'jest-watch-suspend',
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};
