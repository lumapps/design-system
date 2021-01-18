const transformGroup = require('./utils/_css-transform-group');

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/css/`;

    return {
        source: [`${baseDir}/properties/**/*.json`],
        platforms: {
            css: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format: 'css/variables',
                        destination: 'design-tokens.css',
                        mapName: 'lumx-design-tokens',
                    },
                ],
            },
        },
    };
};
