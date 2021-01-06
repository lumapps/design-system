const transformGroup = require('./utils/_css-transform-group');

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/css/core/generated/`;
    return {
        source: [`${baseDir}/properties/**/base.json`],
        platforms: {
            css: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format: 'css/variables',
                        destination: 'variables.css',
                        mapName: 'lumx-core',
                    },
                ],
            },
        },
    };
};
