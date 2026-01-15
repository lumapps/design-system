const lodash = require('lodash');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ts = require('typescript');
const docgen = require('react-docgen-typescript');

const rewriteJSXComponents = require('../utils/rewriteJSXComponents');
const aliasPropType = require('../utils/aliasPropType');
const debug = require('../utils/debug');
const ROOT_PATH = path.resolve(__dirname, '../../../..');

const globPromise = (globString) =>
    new Promise((resolve, reject) =>
        glob(globString, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        }),
    );

let parserConfig;
const getDocgenParser = async () => {
    if (!parserConfig) {
        const tsconfigPath = path.resolve(ROOT_PATH, 'tsconfig.json');
        const basePath = path.dirname(tsconfigPath);
        const { config, error } = ts.readConfigFile(tsconfigPath, (filename) => fs.readFileSync(filename, 'utf8'));
        if (error) debug(error);
        const { options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath);
        if (errors && errors.length) debug(errors);

        /** Init `react-docgen-typescript` with ts config. */
        const tsDocParser = docgen.withCompilerOptions(options, {
            savePropValueAsString: true,
            shouldExtractValuesFromUnion: true,
            shouldExtractLiteralValuesFromEnum: true,
            shouldRemoveUndefinedFromOptional: true,
        });
        parserConfig = { tsDocParser, options };
    }

    return (path) => parserConfig.tsDocParser.parse(path);
};

/** Find LumX react component path by component name. */
const getComponentPath = async (component) => {
    const dir = path.resolve(ROOT_PATH, `packages/lumx-react/src/components/`);
    const files = await globPromise(path.join(dir, '**', `${component}.tsx`));
    if (files.length === 0) {
        console.warn(`Could not found component ${component} in ${dir} for <PropTable> generation.`);
    }
    return files[0];
};

function isReactType(type) {
    if (type.name === 'enum' && type.raw === 'ReactNode') return true;
    if (type.name === 'enum' && type.raw.match(/ElementType<.*>/)) return true;
    if (type.name === 'enum' && type.raw.match(/Ref<.*>/)) return true;
    return !type.raw.includes(' | ') && type.raw.startsWith('React');
}

/** Format component prop documentation. */
function formatProp(prop) {
    delete prop.parent;

    prop.defaultValue = lodash.get(prop, 'defaultValue.value', prop.defaultValue);
    prop.defaultValue = prop.defaultValue === 'undefined' ? null : prop.defaultValue;

    if (prop.type.name === 'enum') {
        if (isReactType(prop.type)) {
            // Use raw react type.
            prop.type = [prop.type.raw];
        } else {
            // Use enum values.
            prop.type = prop.type.value.map((t) => t.value);
        }
    } else {
        prop.type = [prop.type.name];
    }

    // Replace types by their alias.
    prop.type = aliasPropType(prop.type);

    if (prop.type.includes('undefined')) {
        lodash.pull(prop.type, 'undefined');
        prop.required = false;
    }

    prop.type = prop.type.length === 1 ? prop.type[0] : prop.type;

    return prop;
}

async function updatePropTable(docgenParser, props) {
    const component = JSON.parse(props.component);
    const componentPath = await getComponentPath(component);
    const doc = docgenParser(componentPath);

    const componentDoc = doc.find((d) => d.displayName === component);
    if (componentDoc) {
        const formattedProps = Object.values(componentDoc.props).map(formatProp);
        props.props = `${JSON.stringify(formattedProps)}`;
    }

    return props;
}

/**
 * Inject `react-docgen-typescript` prop documentation in <PropTable> MDX.
 */
module.exports = async (node, mdxString) => {
    try {
        const docgenParser = await getDocgenParser();

        // Rewrite prop table.
        mdxString = await rewriteJSXComponents('PropTable', mdxString, lodash.partial(updatePropTable, docgenParser));

        return mdxString;
    } catch (e) {
        debug(e);
        return mdxString;
    }
};
