import { getTypographyClassName } from '@lumx/react/utils/className/getTypographyClassName';

describe(getTypographyClassName, () => {
    it('should generate lumx typography class', () => {
        expect(getTypographyClassName('title')).toBe('lumx-typography-title');
    });
});
