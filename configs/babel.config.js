module.exports = {
    cacheDirectory: true,
    plugins: [
        ['angularjs-annotate', { explicitOnly: true }],
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-proposal-private-property-in-object', { 'loose': false }],
        ['@babel/plugin-proposal-private-methods', { 'loose': false }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
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
        ['@babel/react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
    ],
};
