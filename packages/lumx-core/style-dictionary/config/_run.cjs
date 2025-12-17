const resolveStructureAlias = require('./utils/_resolve-structure-alias.cjs');
const StyleDictionary = require('style-dictionary');

const [config] = process.argv.slice(2);
if (config) {
    // Load style dictionary config.
    const dictionary = StyleDictionary.extend(require(`./${config}.cjs`)());
    resolveStructureAlias(dictionary.properties);

    // Build.
    dictionary.buildAllPlatforms();
}
