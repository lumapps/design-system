import { modifier } from './modifier';

describe(modifier, () => {
    it('should return empty string with empty modifier object', () => {
        expect(modifier('block', {})).toBe('');
    });

    it('should generate class with single modifier', () => {
        expect(modifier('block', { active: true })).toBe('block--active');
    });

    it('should generate classes with multiple modifiers', () => {
        const result = modifier('block', { active: true, disabled: true });
        expect(result).toContain('block--active');
        expect(result).toContain('block--disabled');
    });

    it('should ignore falsy modifiers', () => {
        expect(modifier('block', { active: false, disabled: null, selected: undefined })).toBe('');
    });
});
