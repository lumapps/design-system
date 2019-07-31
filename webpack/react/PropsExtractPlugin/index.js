const typedoc = require('typedoc');
const lodash = require('lodash');
const path = require('path');
const fs = require('fs');

const { convertToSimplePropsByComponent } = require('./convertPropTable');

/**
 * Plugin extracting component props type definitions using typedoc
 *
 * Produces a JSON file of props metadata in `./dist/props-metadata.json`.
 * Adds this JSON file to the webpack resolve aliases with the name 'propsMetadata'.
 * @constructor
 */
function PropsExtractPlugin() {
    this.inputFiles = ['./src'];
    this.startTime = Date.now();
    this.prevTimestamps = {};
    this.typeDocOptions = {
        ...require('../../../tsconfig.json').compilerOptions,
        exclude: ['node_modules', '**/*.test*'],
        ignoreCompilerErrors: true,
        excludeExternals: true,
    };
}

/**
 * Use typedoc to extract props metadata
 */
PropsExtractPlugin.prototype.extractPropsMetadata = function() {
    const options = lodash.clone(this.typeDocOptions);

    const typedocApp = new typedoc.Application(options);
    const src = typedocApp.expandInputFiles(this.inputFiles);
    const project = typedocApp.convert(src);

    const typeDocDef = typedocApp.serializer.projectToObject(project);

    const propsByComponent = convertToSimplePropsByComponent(typeDocDef);

    return { propsByComponent };
};

PropsExtractPlugin.prototype.apply = function(compiler) {
    compiler.hooks.entryOption.tap('PropsExtractPlugin', () => {
        const propsMetadata = this.extractPropsMetadata();

        // Output to JSON file.
        const propsMetadataFile = path.join(compiler.options.output.path, 'props-metadata.json');
        fs.writeFileSync(propsMetadataFile, JSON.stringify(propsMetadata, null, 2));

        // Add to the webpack resolve aliases
        compiler.options.resolve.alias.propsMetadata = propsMetadataFile;

        // This.prevTimestamps = compilation.fileTimestamps;
    });

    compiler.plugin('done', (stats) => {
        console.log('PropsExtractPlugin finished generating');
    });
};

module.exports = PropsExtractPlugin;
