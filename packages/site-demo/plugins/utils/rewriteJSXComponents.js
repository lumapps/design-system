const lodash = require('lodash');
const PROPS_REGEXP = `(\\w+)(?:=(?:{([^}]+)}|("[^"]+")))?`;
let buildJSXComponent = require('./buildJSXComponent');

/**
 * Parse and rebuild JSX component in any string.
 */
module.exports = async (componentName, string, transformFunction) => {
    const componentRX = new RegExp(`<${componentName}([^>]*?)(?:/>|>((?:\n|.)*?)(?:</\s*${componentName}>))`, 'gm');
    const deferred = [];

    // Run replace just to run the transformation function.
    string.replace(componentRX, (...match) => {
        const [_, propsString, children] = match;
        const props = propsString.trim()
            ? lodash.fromPairs(propsString.match(new RegExp(PROPS_REGEXP, 'g')).map((prop) => {
                const [_, key, value, stringValue] = prop.match(new RegExp(PROPS_REGEXP));
                return !value && !stringValue ? [key, 'true'] : [key, value || stringValue];
            }))
            : {};
        if (children) {
            props.children = children;
        }
        // The transformation function might be async.
        deferred.push(transformFunction(props));
    })

    const values = await Promise.all(deferred);

    // Run replace after all transformations got resolved.
    return string.replace(componentRX, () => buildJSXComponent(componentName, values.shift()));
};
