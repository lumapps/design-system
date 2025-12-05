const _ = require("lodash");
const RGX = /^{([^}]+)}$/;

// Returns the string path matching the regexp or null if invalid.
const asAliasPath = (maybePath) => _.get(_.isString(maybePath) && maybePath.match(RGX), [1], null);

function getNested(tree, path) {
    function recur(node, path) {
        if (!path || !node) return undefined;
        const [first, ...rest] = path.split(".");
        const value = node[first];
        if (rest.length === 0 || !value) return value;
        const aliasPath = asAliasPath(value);
        if (aliasPath) return recur(recur(tree, aliasPath), rest.join("."));
        if (_.isPlainObject(value)) return recur(value, rest.join("."));
        return value;
    }

    return recur(tree, path);
}

function copyPropsRecursively(node, props) {
    if (_.isPlainObject(node)) {
        if ('value' in node) {
            Object.assign(node, props);
        } else {
            for (let value of Object.values(node)) {
                copyPropsRecursively(value, props)
            }
        }
    }
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
            let aliasPath = asAliasPath(value);
            let aliasValue = getNested(tree, aliasPath);
            if (typeof aliasValue === "object" && "value" in aliasValue) {
                aliasValue = Object.fromEntries(Object.entries(aliasValue).filter(([key]) => !key.startsWith('$config') && key !== "version" && key !== "comment"));
            }
            if (key === "$extend") {
                if (typeof aliasValue !== "object") {
                    throw new Error("Can't $extend a value that is not an object.");
                }
                delete node["$extend"];
                const baseProps = _.cloneDeep(node);
                Object.assign(node, _.cloneDeep(aliasValue));
                copyPropsRecursively(node, baseProps);
            } else if (aliasValue) {
                node[key] = aliasValue;
                if (typeof aliasValue === "object" && "value" in aliasValue) {
                    node[key]["$aliasedFrom"] = aliasPath;
                }
            } else if (_.isPlainObject(value)) {
                resolveAliasInNode(value);
            }
        }
    }

    resolveAliasInNode(tree);
    resolveAliasInNode(tree);
};
