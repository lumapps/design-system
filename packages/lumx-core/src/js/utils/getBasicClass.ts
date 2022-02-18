import isBoolean from 'lodash/isBoolean';
import kebabCase from 'lodash/kebabCase';

/**
 * Get the basic CSS class for the given type.
 *
 * @param  prefix The class name prefix for the generated CSS class.
 * @param  type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return The basic CSS class.
 */
export function getBasicClass({
    prefix,
    type,
    value,
}: {
    prefix: string;
    type: string;
    value: string | number | boolean | undefined;
}): string {
    if (isBoolean(value)) {
        if (!value) {
            // False value should not return a class.
            return '';
        }
        const booleanPrefixes = ['has', 'is'];

        if (booleanPrefixes.some((booleanPrefix) => type.toString().startsWith(booleanPrefix))) {
            return `${prefix}--${kebabCase(type)}`;
        }

        return `${prefix}--is-${kebabCase(type)}`;
    }

    return `${prefix}--${kebabCase(type)}-${value}`;
}
