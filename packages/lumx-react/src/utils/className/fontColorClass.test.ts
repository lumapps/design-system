import { fontColorClass } from '@lumx/react/utils/className/fontColorClass';

describe(fontColorClass, () => {
    it('should get lumx class for font color', () => {
        expect(fontColorClass('dark')).toBe('lumx-color-font-dark-N');
    });

    it('should get lumx class for font color with variant', () => {
        expect(fontColorClass('red', 'L2')).toBe('lumx-color-font-red-L2');
    });

    it('should get lumx class for font color with variant with override', () => {
        expect(fontColorClass('red-N', 'L2')).toBe('lumx-color-font-red-L2');
    });
});
