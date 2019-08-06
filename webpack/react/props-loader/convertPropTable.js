const lodash = require('lodash');

/**
 * Preprocess typedoc data to flatten it into a id indexed map.
 * Module definitions are filtered out.
 */
function indexDefinitionById(typeDocDef) {
    function flattenDefinitions({children, ...definition}, parentId) {
        return [
            {...definition, parentId, children: children && children.map((child) => child.id)},
            ...lodash.flatMap(children || [], (child) => flattenDefinitions(child, definition.id))
        ];
    }

    return lodash.keyBy(flattenDefinitions(typeDocDef, null), 'id');
}

/**
 * Find prop type interface and component from the typedoc elements.
 */
function findComponentsAndProps(definitionById) {
    return lodash
        .chain(definitionById)
        .values()
        .map((def) => {
            const {id, kindString, signatures, name, sources, children} = def;
            // Component => Something that returns a react element
            if (signatures && signatures.every((s) => s.type.name && s.type.name.endsWith('ReactElement'))) {
                return {
                    name,
                    id,
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
                    children: (children || []).map((id) => definitionById[id]),
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
                    props: props.children.map(child => ({
                        ...child, componentId: component.id
                    })),
                };
            }
        })
        .values()
        .filter(Boolean)
        .keyBy('component')
        .mapValues(({props}) => props || [])
        .value();
}

/**
 * Format definition to string.
 */
function formatDefinition(definitionById, definition) {
    if (!definition) {
        return '';
    }

    // Enumeration.
    if (definition.kindString === 'Enumeration member') {
        const parent = definitionById[definition.parentId];
        return `${parent.name}.${definition.name}`;
    }
    if (definition.kindString === 'Enumeration') {
        return (definition.children || [])
            .map((child) => definitionById[child])
            .map(({name}) => `${definition.name}.${name}`)
            .join(' | ');
    }
    // Function signature.
    if (definition.signatures) {
        return definition.signatures
            .map((signature) => {
                const params = (signature.parameters || [])
                    .map(({name, type}) => `${name}: ${formatType(definitionById, type)}`)
                    .join(', ');

                return `(${params}) => ${formatType(definitionById, signature.type)}`;
            })
            .join(' ');
    }
    // Type literal & Interface.
    if ((definition.kindString === 'Type literal' || definition.kindString === 'Interface') && definition.children) {
        const name = definition.kindString === 'Interface' ? `${definition.name} ` : '';
        const children = (definition.children || [])
            .map((child) => typeof child === 'number' ? definitionById[child] : child)
            .map((child) => `'${child.name}': ${formatType(definitionById, child.type)}`)
            .join('; ');

        return `${name}{${children}}`;
    }
    // Render type
    if (definition.type) {
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
            const {name, typeArguments, id} = typeDef;
            if (id) {
                const definition = definitionById[id];
                if (definition.kindString !== 'Function') {
                    return formatDefinition(definitionById, definition);
                }
            }
            const tArgs = typeArguments ? `<${typeArguments.map(convertChild).join(', ')}>` : '';

            return `${name}${tArgs}`;
        case 'stringLiteral':
            return `'${typeDef.value}'`;
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
 * Convert a typedoc definition of a component prop into a simple prop description.
 */
function convertToSimpleProp(definitionById, prop) {
    let component = definitionById[prop.componentId];
    let defaults = lodash.chain(lodash.get(component, 'signatures.0.parameters'))
        .flatMap(p => p.type.declaration)
        .filter(Boolean)
        .flatMap('children')
        .filter('defaultValue')
        .map(p => [p.name, p.defaultValue])
        .value();
    //console.debug('defaults', JSON.stringify(defaults, null, 2));

    let type = formatDefinition(definitionById, prop);
    if (!type) return;
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
}

/**
 * Format typedoc prop definition into a simple prop
 */
function convertToSimpleProps(definitionById, propsByComponents) {
    return lodash.mapValues(
        propsByComponents,
        props => props.map(prop => convertToSimpleProp(definitionById, prop)).filter(Boolean)
    );
}

/**
 * Convert typedoc JSON to a map of simple props indexed by component names.
 */
function convertToSimplePropsByComponent(typeDocDef) {
    const definitionById = indexDefinitionById(typeDocDef);
    const propsByComponents = getPropsByComponents(definitionById);

    return convertToSimpleProps(definitionById, propsByComponents);
}

module.exports = {convertToSimplePropsByComponent, indexDefinitionById, findComponentsAndProps, convertToSimpleProp};
