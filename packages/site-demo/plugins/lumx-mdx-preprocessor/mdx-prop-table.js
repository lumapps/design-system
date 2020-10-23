const lodash = require('lodash');
const path = require('path');
const glob = require('glob');
const docgen = require('react-docgen-typescript');

const rewriteJSXComponents = require('../utils/rewriteJSXComponents');
const aliasPropType = require('../utils/aliasPropType');
const debug = require('../utils/debug');

/** Init `react-docgen-typescript` with ts config. */
const tsConfigParser = docgen.withCustomConfig(path.resolve('../../tsconfig.json'), {
    savePropValueAsString: true,
    shouldExtractValuesFromUnion: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
});

/** Find Lumx react component path by component name. */
const getComponentPath = (component) => new Promise((resolve, reject) => {
    const dir = path.resolve(`../lumx-react/src/components/`);
    glob(path.join(dir, '**', `${component}.tsx`), (err, files) => {
        if (err) {
            reject(err);
        } else {
            if (files.length === 0) {
                console.warn(`Could not found component ${component} in ${dir} for <PropTable> generation.`);
            }
            resolve(files[0]);
        }
    });
});

/** Format component prop documentation. */
function formatProp(prop) {
    delete prop.parent;

    prop.defaultValue = lodash.get(prop, 'defaultValue.value', prop.defaultValue);
    prop.defaultValue = prop.defaultValue === 'undefined' ? null : prop.defaultValue;

    if (prop.type.name === 'enum') {
        const isReactType = !prop.type.raw.includes(' | ') && prop.type.raw.startsWith('React');
        if (isReactType) {
            // Use raw react type.
            prop.type = [prop.type.raw];
        } else {
            // Use enum values.
            prop.type = prop.type.value.map(t => t.value);
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

async function updatePropTable(props) {
    const component = JSON.parse(props.component);
    const componentPath = await getComponentPath(component);
    const doc = tsConfigParser.parse(componentPath);

    if (component === 'List') console.debug('doc', doc);

    const componentDoc = doc.find(d => d.displayName === component);
    if (componentDoc) {
        const formattedProps = Object.values(componentDoc.props).map(formatProp);
        props.props = `${JSON.stringify(formattedProps)}`;
    }

    return props;
}

/**
 * Inject `react-docgen-typescript` prop documentation in <PropTable> MDX.
 */
module.exports = async (mdxString) => {
    try {
        // Rewrite prop table.
        mdxString = await rewriteJSXComponents(
            'PropTable',
            mdxString,
            updatePropTable,
        );

        return mdxString;
    } catch (e) {
        debug(e);
    }
};

