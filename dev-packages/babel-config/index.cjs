module.exports = {
    get({ platform, framework } = {}) {
        const plugins = [];
        const presets = [];

        if (framework === 'angularjs') {
            plugins.push(['angularjs-annotate', { explicitOnly: true }]);
        }

        if (platform === 'node') {
            presets.push(['@babel/preset-env', { targets: { node: 'current' } }]);
        } else if (platform === 'web') {
            presets.push([
                '@babel/preset-env',
                {
                    corejs: '3',
                    loose: true,
                    modules: false,
                    targets: ['last 2 versions', 'ie >= 11'],
                    useBuiltIns: 'usage',
                },
            ]);
        } else {
            presets.push(['@babel/preset-env', { targets: 'defaults' }]);
        }

        if (framework === 'react') {
            presets.push('@babel/preset-react');
        }

        presets.push('@babel/preset-typescript');
        plugins.push(
            '@babel/plugin-proposal-class-properties',
            ['@babel/plugin-proposal-private-property-in-object', { 'loose': false }],
            ['@babel/plugin-proposal-private-methods', { 'loose': false }],
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
        );

        return { plugins, presets };
    },
};
