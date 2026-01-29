const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');

const PROPS_LOADER = path.resolve(__dirname, './props-loader.js');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        plugins: [
            new NormalModuleReplacementPlugin(/^lumx-docs:/, (resource) => {
                const componentPath = resource.request.replace(/^lumx-docs:/, '');
                resource.request = `${PROPS_LOADER}!${componentPath}`;
            }),
        ],
    });
};
