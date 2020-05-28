const resolveStructureAlias = require('./utils/_resolve-structure-alias');
const StyleDictionary = require('style-dictionary');

const [config, theme] = process.argv.slice(2);
if (config && theme) {
    // Load style dictionary config.
    const dictionary = StyleDictionary.extend(require(`./${config}`)({ theme }));
    resolveStructureAlias(dictionary.properties);

    // Build.
    dictionary.buildAllPlatforms();
}
