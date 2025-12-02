/**
 * Converts a string to kebab-case.
 *
 * @param str The string to convert
 * @returns The kebab-cased string
 *
 * @example
 * kebabCase('fooBar') // 'foo-bar'
 * kebabCase('FooBar') // 'foo-bar'
 * kebabCase('foo_bar') // 'foo-bar'
 * kebabCase('foo bar') // 'foo-bar'
 * kebabCase('FOO_BAR') // 'foo-bar'
 */
export function kebabCase(str: string): string {
    return (
        str
            // Insert a hyphen before any uppercase letter that follows a lowercase letter or number
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            // Insert a hyphen before any uppercase letter that is followed by a lowercase letter and preceded by an uppercase letter
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            // Replace spaces and underscores with hyphens
            .replace(/[\s_]+/g, '-')
            // Convert to lowercase
            .toLowerCase()
            // Remove leading/trailing hyphens
            .replace(/^-+|-+$/g, '')
    );
}
