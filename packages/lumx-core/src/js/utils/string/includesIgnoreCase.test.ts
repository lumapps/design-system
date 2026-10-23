import { includesIgnoreCase } from './includesIgnoreCase';

describe('includesIgnoreCase', () => {
    it('should match with a different letter case', () => {
        expect(includesIgnoreCase('Lemonade', 'LEMON')).toBe(true);
        expect(includesIgnoreCase('lemonade', 'Ade')).toBe(true);
    });

    it('should not match a text that does not contain the search text', () => {
        expect(includesIgnoreCase('Lemonade', 'lime')).toBe(false);
    });

    it('should match an empty search text', () => {
        expect(includesIgnoreCase('Lemonade', '')).toBe(true);
        expect(includesIgnoreCase('', '')).toBe(true);
    });
});
