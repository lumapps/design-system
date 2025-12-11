import { getTypographyClassName } from './getTypographyClassName';

describe(getTypographyClassName, () => {
    it('should generate lumx typography class', () => {
        expect(getTypographyClassName('title')).toBe('lumx-typography-title');
    });
});
