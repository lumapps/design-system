import classNames from 'classnames';

/////////////////////////////

/**
 * Return all default LumX classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  {string}   prefix   The class name prefix for the generated CSS class.
 * @param  {Color}    color    The color of the component.
 * @param  {Emphasis} emphasis The emphasis of the component.
 * @param  {Theme}    theme    The theme of the component.
 * @param  {Variant}  variant  The variant of the component.
 * @param  {Size}     size     The size of the component.
 * @return {string}   All LumX basic classes.
 */
function handleBasicClasses({ prefix, color, emphasis, theme, variant, size }) {
    return classNames(prefix, {
        [`${prefix}--color-${color}`]: color,
        [`${prefix}--emphasis-${emphasis}`]: emphasis,
        [`${prefix}--theme-${theme}`]: theme && emphasis === 'high',
        [`${prefix}--variant-${variant}`]: variant,
        [`${prefix}--size-${size}`]: size,
    });
}

/////////////////////////////

export { handleBasicClasses };
