/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */
/* eslint-disable no-magic-numbers */
const { indexDefinitionById, findComponentsAndProps, convertToSimpleProp } = require('./convertPropTable');

describe('indexDefinitionById', () => {
    it('should index typedoc definitions by id', () => {
        const typeDocDefs = {
            id: 0,
            name: '@lumx/lumx',
            children: [
                {
                    id: 1650,
                    name: '"components/avatar/react/Avatar"',
                    kindString: 'External module',
                    children: [
                        {
                            id: 1657,
                            name: 'DefaultPropsType',
                            kindString: 'Interface',
                        },
                    ],
                },
                {
                    id: 137,
                    name: '"components/button/react/Button"',
                    kindString: 'External module',
                    children: [
                        {
                            id: 138,
                            name: 'Emphasis',
                            kindString: 'Enumeration',
                            children: [
                                {
                                    id: 141,
                                    name: 'high',
                                    kindString: 'Enumeration member',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const index = indexDefinitionById(typeDocDefs);

        expect(index).toEqual({
            '0': {
                children: [1650, 137],
                id: 0,
                name: '@lumx/lumx',
                parentId: null,
            },
            '137': {
                children: [138],
                id: 137,
                kindString: 'External module',
                name: '"components/button/react/Button"',
                parentId: 0,
            },
            '138': {
                children: [141],
                id: 138,
                kindString: 'Enumeration',
                name: 'Emphasis',
                parentId: 137,
            },
            '141': {
                id: 141,
                kindString: 'Enumeration member',
                name: 'high',
                parentId: 138,
            },
            '1650': {
                children: [1657],
                id: 1650,
                kindString: 'External module',
                name: '"components/avatar/react/Avatar"',
                parentId: 0,
            },
            '1657': {
                id: 1657,
                kindString: 'Interface',
                name: 'DefaultPropsType',
                parentId: 1650,
            },
        });
    });
});

describe('findComponentsAndProps', () => {
    it('should list components and props from definitions index by id', () => {
        const definitionsById = {
            '0': {
                name: 'Comp0',
                signatures: [
                    {
                        type: { name: 'ReactElement' },
                    },
                ],
                sources: [{ fileName: 'Comp0.tsx' }],
            },
            '1': {
                name: 'Comp1',
                signatures: [
                    {
                        type: { name: 'React.ReactElement' },
                    },
                ],
                sources: [{ fileName: 'Comp1.tsx' }],
            },
            '2': {
                signatures: [
                    {
                        type: { name: 'React' },
                    },
                ],
                sources: [{ fileName: 'file2' }],
            },
            '3': {
                kindString: 'Interface',
                name: 'PropI',
                sources: [{ fileName: 'file2' }],
            },
            '4': {
                kindString: 'Interface',
                name: 'Props',
                sources: [{ fileName: 'file1' }],
            },
            '5': {
                kindString: 'Interface',
                name: 'Comp1Props',
                sources: [{ fileName: 'file2' }],
                children: [6, 7],
            },
            '6': 'child1',
            '7': 'child2',
        };
        const propsAndComp = findComponentsAndProps(definitionsById);
        expect(propsAndComp.value()).toEqual([
            {
                fileName: 'Comp0.tsx',
                name: 'Comp0',
                type: 'Component',
            },
            {
                fileName: 'Comp1.tsx',
                name: 'Comp1',
                type: 'Component',
            },
            {
                children: [],
                fileName: 'file1',
                name: 'Props',
                type: 'Props',
            },
            {
                children: ['child1', 'child2'],
                fileName: 'file2',
                name: 'Comp1Props',
                type: 'Props',
            },
        ]);
    });
});

describe('convertToSimpleProp', () => {
    it('should fallback to JSON on unknown type', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'helper',
            },
        );
        expect(simpleProp).toEqual({
            description: '',
            name: 'helper',
            required: true,
            type: '{"name":"helper"}',
        });
    });

    it('should handle simple type', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'helper',
                type: {
                    type: 'intrinsic',
                    name: 'string',
                },
            },
        );
        expect(simpleProp).toEqual({
            description: '',
            name: 'helper',
            required: true,
            type: 'string',
        });
    });

    it('should handle non required type using union with undefined', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'helper',
                type: {
                    type: 'union',
                    types: [
                        {
                            type: 'intrinsic',
                            name: 'undefined',
                        },
                        {
                            type: 'intrinsic',
                            name: 'string',
                        },
                    ],
                },
            },
        );
        expect(simpleProp.required).toBe(false);
    });

    it('should handle non required type via flags', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'helper',
                flags: { isOptional: true },
                type: {
                    type: 'intrinsic',
                    name: 'string',
                },
            },
        );
        expect(simpleProp.required).toBe(false);
    });

    it('should use comment as prop description', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'helper',
                type: {
                    type: 'intrinsic',
                    name: 'string',
                },
                comment: { shortText: 'DESCRIPTION' },
            },
        );
        expect(simpleProp.description).toEqual('DESCRIPTION');
    });

    it('should use signature comment as prop description', () => {
        const simpleProp = convertToSimpleProp(
            {},
            {
                name: 'onClick',
                signatures: [
                    {
                        comment: { shortText: 'DESCRIPTION' },
                    },
                ],
            },
        );
        expect(simpleProp.description).toEqual('DESCRIPTION');
    });
});
