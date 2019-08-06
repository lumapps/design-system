const { convertToSimplePropsByComponent } = require('./convertPropTable');

const typedoc = require('typedoc');

const inputFiles = ['./src'];
const tsconfig = require('../../../tsconfig.json');

const typeDocOptions = {
    ...tsconfig.compilerOptions,
    lib: ['lib.es2017.d.ts', 'lib.dom.d.ts'],
    exclude: ['node_modules', '**/*.test*'],
    ignoreCompilerErrors: true,
    excludeExternals: false,
};

module.exports = function() {
    const doc = new typedoc.Application(typeDocOptions);

    // List .tsx files
    const src = doc.expandInputFiles(inputFiles).filter((file) => file.endsWith('.tsx'));
    // Add then to the dependency for this loader
    src.forEach((file) => this.addDependency(file));

    // Extract doc as JS objects
    const stdout = process.stdout.write;
    process.stdout.write = () => {};
    const project = doc.convert(src);
    process.stdout.write = stdout;
    const typeDocDef = doc.serializer.projectToObject(project);

    // Convert to simple props description
    const propsByComponent = convertToSimplePropsByComponent(typeDocDef);
    const module = { propsByComponent };

    return `module.exports = ${JSON.stringify(module)}`;
};
