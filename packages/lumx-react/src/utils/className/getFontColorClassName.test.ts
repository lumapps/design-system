import { getFontColorClassName } from '@lumx/react/utils/className/getFontColorClassName';

describe(getFontColorClassName, () => {
    it('should get lumx class for font color', () => {
        expect(getFontColorClassName('dark')).toBe('lumx-color-font-dark-N');
    });

    it('should get lumx class for font color with variant', () => {
        expect(getFontColorClassName('red', 'L2')).toBe('lumx-color-font-red-L2');
    });
});
