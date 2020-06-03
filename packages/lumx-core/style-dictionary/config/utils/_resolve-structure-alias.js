const _ = require('lodash');
const RGX = /^{([^}]+)}$/;

/**
 * Style dictionary does not resolve alias in the property tree, only in property object (= object with a value key).
 *
 * By default
 * This works : `{ "color": { "value": "{theme.baseColor}", "attr": "{foo.bar}" }}`
 * This does not : `{ "color": "{foo.bar}" }`
 *
 * This function resolve the second use case.
 */
module.exports = function (tree) {
    function resolveAliasInNode(node) {
        // Skip if not object.
        if (!_.isPlainObject(node)) return;

        // Resolve alias (if any).
        for (const [key, value] of Object.entries(node)) {
            const aliasPath = _.get(_.isString(value) && value.match(RGX), [1], null);
            if (aliasPath) {
                node[key] = _.get(tree, aliasPath);
            } else if (_.isPlainObject(value)) {
                resolveAliasInNode(value);
            }
        }
    }

    resolveAliasInNode(tree);
};
