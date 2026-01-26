const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.(tsx|vue)?$/,
                    include: path.resolve(__dirname, '../../content'),
                    use: [path.resolve(__dirname, 'source-loader')],
                    enforce: 'pre',
                },
            ],
        },
    });
};
