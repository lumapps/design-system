const { babelSetup } = require('./utils');

const webpackBaseConfig = {
    module: {
        rules: [
            {
                exclude: /(instance-scripts|node_modules)/u,
                test: /\.js$/u,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelSetup(),
                    },
                ],
            },
        ],
    },

    output: {
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules'],
    },
    target: 'web',
};

module.exports = webpackBaseConfig;
