const aliasPropType = require('./aliasPropType');

describe('aliasPropType', () => {
    it('should not changed types that can\'t be aliased', () => {
        const types = ['null', '"string"'];
        expect(aliasPropType(types)).toEqual(['null', '"string"']);
    });

    it('should alias ReactElement', () => {
        const types = [
            aliasPropType.ReactElement,
        ];
        expect(aliasPropType(types)).toEqual([
            'ReactElement',
        ]);
    });

    it('should alias ReactNode', () => {
        const types = [
            'string', 'number', 'boolean', '{}', aliasPropType.ReactElement, 'ReactNodeArray', 'ReactPortal', 'null',
        ];
        expect(aliasPropType(types)).toEqual([
            'ReactNode',
        ]);
    });

    it('should alias boolean', () => {
        const types = [
            'true', 'false'
        ];
        expect(aliasPropType(types)).toEqual([
            'boolean'
        ]);
    });

    it('should alias Ref', () => {
        const types = [
            'null', '(r: HTMLLIElement | null) => void', 'RefObject<HTMLLIElement>'
        ];
        expect(aliasPropType(types)).toEqual([
            'Ref<HTMLLIElement>',
        ]);
    });

});
