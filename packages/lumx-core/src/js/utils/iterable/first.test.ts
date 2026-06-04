import { first } from './first';

describe('first', () => {
    it('should return the first item of an array', () => {
        expect(first([1, 2, 3])).toBe(1);
    });

    it('should return null for an empty array', () => {
        expect(first([])).toBeNull();
    });

    it('should return null for an empty string', () => {
        expect(first('')).toBeNull();
    });
});
