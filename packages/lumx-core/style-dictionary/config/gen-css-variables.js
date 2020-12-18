const transformGroup = require('./utils/_css-transform-group');

module.exports = ({ globalTheme }) => {
    const baseDir = `${__dirname}/../`;

    const buildPath = `${baseDir}/../src/css/core/generated/${globalTheme}/`;
    return {
        source: [
            `${baseDir}/properties/**/base.json`,
            `${baseDir}/properties/**/${globalTheme}.json`,
        ],
        platforms: {
            css: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format: 'css/variables',
                        destination: 'variables.css',
                        mapName: 'lumx-core'
                    }
                ]
            }
        },
    };
};
