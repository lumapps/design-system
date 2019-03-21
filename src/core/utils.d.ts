import { Color, Size, Theme } from 'LumX/components';

/////////////////////////////

/**
 * Get the basic CSS class for the given type.
 *
 * @param  {string} prefix The class name prefix for the generated CSS class.
 * @param  {string} type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  {string} value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return {string} The basic CSS class.
 */
declare function getBasicClass({ prefix, type, value }: { prefix: string; type: string; value: string }): string;

/**
 * Return all basic LumX CSS classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  {string}   prefix   The class name prefix for the generated CSS class.
 * @param  {Color}    color    The color of the component.
 * @param  {Emphasis} emphasis The emphasis of the component.
 * @param  {Size}     size     The size of the component.
 * @param  {Theme}    theme    The theme of the component.
 * @param  {Variant}  variant  The variant of the component.
 * @return {string}   All LumX basic CSS classes.
 */
declare function handleBasicClasses({
    prefix,
    color,
    emphasis,
    size,
    theme,
    variant,
}: {
    color?: Color;
    emphasis?: string;
    size?: Size;
    theme?: Theme;
    variant?: string;
    prefix: string;
}): string;

/////////////////////////////

export { getBasicClass, handleBasicClasses };
