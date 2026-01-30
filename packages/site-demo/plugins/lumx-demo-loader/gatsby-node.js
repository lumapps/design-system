const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: path.resolve(__dirname, '../../content'),
                    use: [path.resolve(__dirname, 'source-loader')],
                    enforce: 'pre',
                },
                // Load .vue files as raw text
                {
                    test: /\.vue$/,
                    use: 'raw-loader',
                },
            ],
        },
    });
};
