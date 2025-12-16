import { getBasicClass } from './getBasicClass';

describe(getBasicClass, () => {
    it('should return correct basic CSS class for different types and values', () => {
        // Test cases with different inputs
        expect(getBasicClass({ prefix: 'test', type: 'color', value: 'primary' })).toBe('test--color-primary');
        expect(getBasicClass({ prefix: 'test', type: 'variant', value: 'button' })).toBe('test--variant-button');
        expect(getBasicClass({ prefix: 'test', type: 'isDark', value: true })).toBe('test--is-dark');
        expect(getBasicClass({ prefix: 'test', type: 'dark', value: true })).toBe('test--is-dark');
        expect(getBasicClass({ prefix: 'test', type: 'hasDark', value: true })).toBe('test--has-dark');
        expect(getBasicClass({ prefix: 'test', type: 'isActive', value: false })).toBe('');

        // Additional tests for boolean types
        expect(getBasicClass({ prefix: 'test', type: 'hasBorder', value: true })).toBe('test--has-border');
        expect(getBasicClass({ prefix: 'test', type: 'isVisible', value: false })).toBe('');

        // Tests for undefined
        expect(getBasicClass({ prefix: 'test', type: 'variant', value: undefined })).toBe('test--variant-undefined');
    });
});
