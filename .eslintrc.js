module.exports = {
    env: {
        amd: true,
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        jquery: true,
        node: true,
        serviceworker: true,
        'shared-node-browser': true,
        worker: true,
    },
    extends: 'eslint:recommended',
    globals: {
        angular: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        allowImportExportEverywhere: false,
        codeFrame: true,
        ecmaFeatures: {
            globalReturn: false,
            impliedStrict: true,
            jsx: true,
            legacyDecorators: false,
        },
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    plugins: ['angular', 'prettier'],
    rules: {
        'brace-style': [
            'error',
            '1tbs',
            {
                allowSingleLine: false,
            },
        ],
        'space-before-blocks': [
            'error',
            {
                classes: 'always',
                functions: 'always',
                keywords: 'always',
            },
        ],
    },
};
