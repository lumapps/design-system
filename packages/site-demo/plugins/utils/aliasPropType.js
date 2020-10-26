const lodash = require('lodash');


const ReactElement = 'ReactElement<any, string | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)>';

/** Pairs of types that, combined, should all be replaced by an alias. */
const TYPE_ALIASES = [
    [
        ['true', 'false'],
        'boolean',
    ],
    [
        ['string', 'number', 'boolean', '{}', ReactElement, 'ReactNodeArray', 'ReactPortal', 'null'],
        'ReactNode',
    ],
    [
        [ReactElement],
        'ReactElement',
    ],
    [
        ['null', /\(.*?: (.*?) \| null\) => void/, /RefObject<(.*?)>/],
        'Ref<$1>',
    ],
];

function matchTypeAlias(types, typeSearchTerms, add) {
    const remove = [];
    let matchGroups;

    const ok = typeSearchTerms.every(searchTerm => {
        if (lodash.isString(searchTerm) && types.includes(searchTerm)) {
            remove.push(searchTerm);
            return true;
        } else {
            return types.some(type => {
                const typeMatch = type.match(searchTerm);
                if (typeMatch) {
                    const currentMatchGroups = lodash.tail(typeMatch);
                    remove.push(type);
                    if (!matchGroups) {
                        matchGroups = currentMatchGroups;
                        matchGroups.forEach((group, index) => {
                            add = add.replace(`$${index + 1}`, group);
                        });
                    }
                    return lodash.isEqual(currentMatchGroups, matchGroups);
                }
                return false;
            });
        }
    });

    return ok ? { remove, add } : null;
}


/**
 * Replace types by their alias when possible.
 */
module.exports = function (types) {
    const matchList = [];

    // Find types to alias.
    for (const [typeSearchTerms, typeAlias] of TYPE_ALIASES) {
        const match = matchTypeAlias(types, typeSearchTerms, typeAlias);
        if (match) {
            // Remove what matched.
            lodash.pull(types, ...match.remove);
            // Replace with alias.
            types.push(match.add);
        }
        match && matchList.push(match);
    }

    return types;
};

module.exports.ReactElement = ReactElement;
