const lodash = require('lodash');
const typedoc = require('typedoc');

const { convertToSimplePropsByComponent, convertToSimplePropsByProps } = require('./convertPropTable');

const inputFiles = ['../lumx-react'];
const tsconfig = require('../../tsconfig.json');

const typeDocOptions = {
    ...tsconfig.compilerOptions,
    lib: ['lib.es2017.d.ts', 'lib.dom.d.ts'],
    exclude: ['node_modules', '**/*.test*'],
    ignoreCompilerErrors: true,
    excludeExternals: false,
};

module.exports = function propsLoader() {
    const doc = new typedoc.Application(typeDocOptions);

    // List .tsx files.
    const src = doc.expandInputFiles(inputFiles).filter((file) => file.endsWith('.tsx'));
    // Add then to the dependency for this loader.
    src.forEach((file) => this.addDependency(file));

    // Extract doc as JS objects (temporarily redirecting stdout to prevent the console being spammed).
    const stdout = process.stdout.write;
    process.stdout.write = lodash.noop;
    const project = doc.convert(src);
    process.stdout.write = stdout;
    const typeDocDef = doc.serializer.projectToObject(project);

    // Convert to simple props description.
    const propsByComponent = convertToSimplePropsByComponent(typeDocDef);

    const propsByProps = convertToSimplePropsByProps(typeDocDef);

    return `module.exports = ${JSON.stringify({ propsByComponent, propsByProps })}`;
};
