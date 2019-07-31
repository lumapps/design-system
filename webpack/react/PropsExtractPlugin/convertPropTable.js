const lodash = require('lodash');

/**
 * Preprocess typedoc data to flatten it into a id indexed map.
 * Module definitions are filtered out.
 */
function indexDefinitionById(typeDocDef) {
    function flattenDoc({ children, ...definition }, parentId) {
        const res = lodash.flatMap(children || [], (child) => flattenDoc(child, definition.id));
        if (definition.kind > 1) {
            // Keeps only non module definitions
            res.push({ ...definition, parentId, children: children && children.map((child) => child.id) });
        }

        return res;
    }

    return lodash.keyBy(flattenDoc(typeDocDef, null), 'id');
}

/**
 * Find prop type interface and component from the typedoc elements.
 */
function findComponentsAndProps(definitionById) {
    return lodash
        .chain(definitionById)
        .values()
        .map((def) => {
            const { kindString, signatures, name, sources, children } = def;
            // Component => Something that returns a react element
            if (signatures && signatures.every((s) => s.type.name && s.type.name.endsWith('ReactElement'))) {
                return {
                    name,
                    type: 'Component',
                    fileName: sources[0].fileName,
                };
            }

            // Prop type => Interface ending with 'Props'
            if (kindString === 'Interface' && name.endsWith('Props')) {
                return {
                    name,
                    type: 'Props',
                    fileName: sources[0].fileName,
                    children: children && children.map((id) => definitionById[id]),
                };
            }
        })
        .filter(Boolean);
}

function getPropsByComponents(definitionById) {
    return findComponentsAndProps(definitionById)
        .groupBy('fileName')
        .mapValues((elements) => {
            const component = elements.find((e) => e.type === 'Component');
            const props = elements.find((e) => e.type === 'Props');
            if (component && props) {
                return {
                    component: component.name,
                    props: props.children,
                };
            }
        })
        .values()
        .filter(Boolean)
        .keyBy('component')
        .mapValues(({ props }) => props || [])
        .value();
}

/**
 * Format definition to string.
 */
function formatDefinition(definitionById, definition) {
    if (!definition) {
        return '';
    }
    if (definition.kindString === 'Enumeration') {
        return (definition.children || [])
            .map((child) => definitionById[child])
            .map(({ name }) => `${definition.name}.${name}`)
            .join(' | ');
    }
    if (definition.signatures) {
        // Function signature.
        return definition.signatures
            .map((signature) => {
                const params = (signature.parameters || [])
                    .map(({ name, type }) => `${name}: ${formatType(definitionById, type)}`)
                    .join(', ');

                return `(${params}) => ${formatType(definitionById, signature.type)}`;
            })
            .join(' ');
    }
    if (definition.kindString === 'Type literal' && definition.children) {
        // Type literal.
        const children = (definition.children || [])
            .map((child) => `'${child.name}': ${formatType(definitionById, child.type)}`)
            .join('; ');

        return `{${children}}`;
    }
    if (definition.type) {
        // Render type
        return formatType(definitionById, definition.type);
    }

    // Fallback.
    return JSON.stringify(definition);
}

/**
 * Render type definition to string.
 */
function formatType(definitionById, typeDef) {
    if (!typeDef) {
        return '';
    }
    const convertChild = lodash.partial(formatType, definitionById);
    switch (typeDef.type) {
        case 'intrinsic':
            return typeDef.name;
        case 'reference':
            const { name, typeArguments, id } = typeDef;
            if (id) {
                const definition = definitionById[id];
                if (definition.kindString === 'Enumeration') {
                    return formatDefinition(definitionById, definition);
                }
            }
            const tArgs = typeArguments ? `<${typeArguments.map(convertChild).join(', ')}>` : '';

            return `${name}${tArgs}`;
        case 'stringLiteral':
            return typeDef.value;
        case 'array':
            return `${convertChild(typeDef.elementType)}[]`;
        case 'intersection':
            return (typeDef.types || []).map(convertChild).join(' & ');
        case 'union':
            return (typeDef.types || []).map(convertChild).join(' | ');
        case 'reflection':
            return formatDefinition(definitionById, typeDef.declaration);

        default:
            return JSON.stringify(typeDef);
    }
}

/**
 * Render prop description text using the comment shortText for the prop
 * or for function prop, render the signatures comment.
 */
function formatDescription(definition) {
    if (definition.comment && definition.comment.shortText) {
        return definition.comment.shortText;
    }
    if (definition.signatures) {
        return definition.signatures.map((signature) => signature.comment && signature.comment.shortText).join('. ');
    }

    return '';
}

/**
 * Format typedoc prop definition into a simple prop
 */
function convertToSimpleProp(definitionById, propsByComponents) {
    return lodash.mapValues(propsByComponents, (props) =>
        props
            .map((prop) => {
                let type = formatDefinition(definitionById, prop);
                if (!type) {
                    return;
                }
                let required = !lodash.get(prop, 'flags.isOptional', false);

                if (type.includes('undefined')) {
                    required = false;
                    type = type.replace(/(\s+\|?\s+)?undefined(\s+\|?\s+)?/, '');
                }
                type = type.replace('false | true', 'boolean');

                return {
                    id: prop.id,
                    name: prop.name,
                    required,
                    type,
                    description: formatDescription(prop),
                };
            })
            .filter(Boolean),
    );
}

/**
 * Convert typedoc JSON to a map of simple props indexed by component names.
 */
function convertToSimplePropsByComponent(typeDocDef) {
    const definitionById = indexDefinitionById(typeDocDef);
    const propsByComponents = getPropsByComponents(definitionById);

    return convertToSimpleProp(definitionById, propsByComponents);
}

module.exports = { convertToSimplePropsByComponent };
