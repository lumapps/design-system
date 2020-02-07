const { shouldPrintComment } = require('babel-plugin-smart-webpack-import');

module.exports = {
    cacheDirectory: true,
    plugins: [
        ['angularjs-annotate', { explicitOnly: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-syntax-dynamic-import',
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: '3',
                loose: true,
                modules: false,
                targets: ['last 2 versions', 'ie >= 11'],
                useBuiltIns: 'usage',
            },
        ],
        '@babel/react',
        '@babel/preset-typescript',
    ],
    shouldPrintComment,
};
