/* eslint-disable */
const tsconfig = require('../../../tsconfig');
const CONFIGS = require('../../../configs');

const fromPairs = (pairs) => pairs.reduce((res, [key, value]) => ({ ...res, [key]: value }), {});

const moduleNameMapper = fromPairs(
    Object.entries(tsconfig.compilerOptions.paths).map(([k, [v]]) => [
        `^${k.replace(/\/\*/, '(.*)')}$`,
        `${CONFIGS.path.ROOT_PATH}/packages/${v.replace(/\/\*/, '$1')}`,
    ]),
);

module.exports = {
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.stories.tsx'],
    coverageDirectory: '<rootDir>jest/reports/coverage',
    coverageReporters: ['json', 'lcov', 'html', 'text'],
    moduleDirectories: [`${CONFIGS.path.ROOT_PATH}/node_modules`],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.scss$': '<rootDir>jest/__mocks__/emptyModuleMock.js',
        ...moduleNameMapper,
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
    rootDir: '../',
    setupFilesAfterEnv: [
        require.resolve('jest-chain'),
        require.resolve('expect-more-jest'),
        require.resolve('jest-enzyme'),
        '<rootDir>jest/configure.js',
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testEnvironment: 'enzyme',
    testEnvironmentOptions: {
        enzymeAdapter: 'react16',
    },
    testMatch: ['<rootDir>src/**/?(*.)+(spec|test).[jt]s?(x)'],
    transform: {
        '\\.(t|j)sx?$': '<rootDir>jest/transform.js',
        // Mock file import returning their file path.
        '\\.(jpg|jpeg|png|gif)$': '<rootDir>jest/__mocks__/emptyFileMockTransformer.js',
    },
    watchPlugins: [
        'jest-watch-master',
        'jest-watch-suspend',
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};
