const merge = require('webpack-merge');

const { SRC_PATH, TECH_PREFIX } = require('../constants');

const baseConfig = require('../webpack.config');

const angularJSConfig = {
    entry: {
        'lumx.angularjs': `${SRC_PATH}/${TECH_PREFIX.angularjs}.index.js`,
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
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
        ],
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, angularJSConfig);
