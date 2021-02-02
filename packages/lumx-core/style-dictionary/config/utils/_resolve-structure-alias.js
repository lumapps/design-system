const _ = require('lodash');
const RGX = /^{([^}]+)}$/;

// Returns the string path matching the regexp or null if invalid.
const asAliasPath = (maybePath) => _.get(_.isString(maybePath) && maybePath.match(RGX), [1], null);

function getNested(tree, path) {
    function recur(node, path) {
        if (!path || !node) return undefined;
        const [first, ...rest] = path.split('.');
        const value = node[first];
        if (rest.length === 0 || !value) return value;
        const aliasPath = asAliasPath(value);
        if (aliasPath) return recur(recur(tree, aliasPath), rest.join('.'));
        if (_.isPlainObject(value)) return recur(value, rest.join('.'));
        return value;
    }
    return recur(tree, path);
}

/**
 * Style dictionary does not resolve alias in the property tree, only in property object (= object with a value key).
 *
 * By default
 * This works : `{ "color": { "value": "{theme.baseColor}", "attr": "{foo.bar}" }}`
 * This does not : `{ "color": "{foo.bar}" }`
 *
 * This function resolve the second use case.
 */
module.exports = function(tree) {
    function resolveAliasInNode(node) {
        // Skip if not object.
        if (!_.isPlainObject(node)) return;

        // Resolve alias (if any).
        for (const [key, value] of Object.entries(node)) {
            const aliasValue = getNested(tree, asAliasPath(value));
            if (aliasValue) {
                node[key] = aliasValue;
            } else if (_.isPlainObject(value)) {
                resolveAliasInNode(value);
            }
        }
    }

    resolveAliasInNode(tree);
};
