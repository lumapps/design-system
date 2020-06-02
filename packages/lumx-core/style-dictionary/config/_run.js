const resolveStructureAlias = require('./utils/_resolve-structure-alias');
const StyleDictionary = require('style-dictionary');

const [config, globalTheme] = process.argv.slice(2);
if (config && globalTheme) {
    // Load style dictionary config.
    const dictionary = StyleDictionary.extend(require(`./${config}`)({ globalTheme }));
    resolveStructureAlias(dictionary.properties);

    // Build.
    dictionary.buildAllPlatforms();
}
