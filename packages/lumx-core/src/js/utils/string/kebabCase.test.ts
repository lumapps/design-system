import { kebabCase } from '@lumx/core/js/utils/string/kebabCase';

describe(kebabCase, () => {
    it('should convert camelCase to kebab-case', () => {
        expect(kebabCase('fooBar')).toBe('foo-bar');
        expect(kebabCase('fooBarBaz')).toBe('foo-bar-baz');
    });

    it('should convert PascalCase to kebab-case', () => {
        expect(kebabCase('FooBar')).toBe('foo-bar');
        expect(kebabCase('FooBarBaz')).toBe('foo-bar-baz');
    });

    it('should convert snake_case to kebab-case', () => {
        expect(kebabCase('foo_bar')).toBe('foo-bar');
        expect(kebabCase('foo_bar_baz')).toBe('foo-bar-baz');
    });

    it('should convert spaces to hyphens', () => {
        expect(kebabCase('foo bar')).toBe('foo-bar');
        expect(kebabCase('foo bar baz')).toBe('foo-bar-baz');
    });

    it('should handle UPPERCASE strings', () => {
        expect(kebabCase('FOO_BAR')).toBe('foo-bar');
        expect(kebabCase('FOOBAR')).toBe('foobar');
    });

    it('should handle mixed formats', () => {
        expect(kebabCase('fooBar_baz qux')).toBe('foo-bar-baz-qux');
    });

    it('should handle strings that are already kebab-case', () => {
        expect(kebabCase('foo-bar')).toBe('foo-bar');
    });

    it('should handle empty strings', () => {
        expect(kebabCase('')).toBe('');
    });

    it('should handle single words', () => {
        expect(kebabCase('foo')).toBe('foo');
        expect(kebabCase('Foo')).toBe('foo');
    });

    it('should remove leading and trailing hyphens', () => {
        expect(kebabCase('_foo_bar_')).toBe('foo-bar');
        expect(kebabCase(' foo bar ')).toBe('foo-bar');
    });
});
