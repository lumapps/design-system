const splitUnionType = require('./splitUnionType');

describe('splitUniType', () => {
    it('should split empty', () => {
        const input = '';
        const actual = splitUnionType(input);
        expect(actual).toEqual([]);
    });

    it('should split simple type (not union)', () => {
        const input = 'null';
        const actual = splitUnionType(input);
        expect(actual).toEqual([input]);
    });

    it('should split', () => {
        const input = `
            string | {} | (() => void) | Array<5 | 7> | "bar" |
            Foo<any, string | ((props: any | null) => void)>
        `;
        const actual = splitUnionType(input);
        const expected = [
            'string',
            '{}',
            '(() => void)',
            'Array<5 | 7>',
            '"bar"',
            'Foo<any, string | ((props: any | null) => void)>',
        ];
        expect(actual).toEqual(expected);
    });
});
