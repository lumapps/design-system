const merge = require('webpack-merge');

const { SRC_PATH } = require('../constants');

const baseConfig = require('../webpack.config');

const angularJSConfig = {
    entry: {
        'lumx.angularjs': `${SRC_PATH}/angularjs.index.js`,
    },

    module: {
        rules: [
            {
                exclude: /index.html/,
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, angularJSConfig);
