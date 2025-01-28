import { handleBasicClasses } from '@lumx/core/js/utils';

describe(handleBasicClasses, () => {
    it('should return correct combined CSS classes based on props', () => {
        const className = handleBasicClasses({
            prefix: 'test',
            // Undefined
            undefined,
            // Null
            null: null,
            // Empty string
            emptyString: '',
            // Empty array
            emptyArray: [],
            // Empty object
            emptyObject: {},
            // String
            color: 'red',
            // False property
            isDisabled: false,
            // Boolean without a prefix (is or has)
            visible: true,
            // Has prefix
            hasButton: true,
        });
        expect(className).toBe('test test--color-red test--is-visible test--has-button');
    });
});
