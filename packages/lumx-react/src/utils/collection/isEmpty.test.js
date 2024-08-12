import { isEmpty } from './isEmpty';

describe(isEmpty, () => {
    it('should return true for falsy values', () => {
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(0)).toBe(true);
        expect(isEmpty('')).toBe(true);
    });

    it('should return true for empty object or array', () => {
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
    });

    it('should return false for non empty object or array', () => {
        expect(isEmpty([''])).toBe(false);
        expect(isEmpty({ foo: false })).toBe(false);
    });
});
