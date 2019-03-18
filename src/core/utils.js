import classNames from 'classnames';

/////////////////////////////

/**
 * Get the basic CSS class for the given type.
 *
 * @param  {string} prefix The class name prefix for the generated CSS class.
 * @param  {string} type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  {string} value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return {string} The basic CSS class.
 */
function getBasicClass({ prefix, type, value }) {
    return `${prefix}--${type}-${value}`;
}

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
function handleBasicClasses({ prefix, color, emphasis, size, theme, variant }) {
    return classNames(prefix, {
        [getBasicClass({ prefix, type: 'color', value: color })]: color,
        [getBasicClass({ prefix, type: 'emphasis', value: emphasis })]: emphasis,
        [getBasicClass({ prefix, type: 'size', value: size })]: size,
        [getBasicClass({ prefix, type: 'theme', value: theme })]: theme && emphasis === 'high',
        [getBasicClass({ prefix, type: 'variant', value: variant })]: variant,
    });
}

/////////////////////////////

export { getBasicClass, handleBasicClasses };
