import { typography } from '.';

describe(typography, () => {
    it('should generate lumx typography class', () => {
        expect(typography('title')).toBe('lumx-typography-title');
        expect(typography('custom-body-large')).toBe('lumx-typography-custom-body-large');
    });
});
