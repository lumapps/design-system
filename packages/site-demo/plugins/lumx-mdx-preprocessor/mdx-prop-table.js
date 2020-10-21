const lodash = require('lodash');
const path = require('path');
const glob = require('glob');
const docgen = require('react-docgen-typescript');

const splitUnionType = require('../utils/splitUnionType');
const rewriteJSXComponents = require('../utils/rewriteJSXComponents');
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

const ReactElement = 'ReactElement<any, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)>';

/** Pairs of types that, combined, should all be replaced by an alias. */
const TYPE_ALIASES = [
   [
        ['string', 'number', 'boolean', '{}', ReactElement, 'ReactNodeArray', 'ReactPortal', 'null'],
        'ReactNode',
    ],
    [
        [ReactElement],
        'ReactElement',
    ],
];

/** Format component prop documentation. */
function formatProp(prop) {
    delete prop.parent;

    prop.defaultValue = lodash.get(prop, 'defaultValue.value', prop.defaultValue);
    prop.defaultValue = prop.defaultValue === 'undefined' ? null : prop.defaultValue;

    if (prop.type.name === 'enum') {
        if (!prop.type.raw.includes(' | ') && !prop.type.raw.startsWith('React')) {
            prop.type = prop.type.value.map(t => t.value);
        } else {
            prop.type = splitUnionType(prop.type.raw);
        }
    } else {
        prop.type = [prop.type.name];
    }

    // Replace types by their alias.
    for (const [toAlias, alias] of TYPE_ALIASES) {
        if (toAlias.every(lodash.partial(lodash.includes, prop.type))) {
            lodash.pull(prop.type, ...toAlias);
            prop.type.push(alias);
        }
    }

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
            updatePropTable
        );

        return mdxString;
    } catch (e) {
        debug(e);
    }
};

