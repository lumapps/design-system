import classNames from 'classnames';

/**
 * Return all default lumX which are available for every components.
 *
 * @param  {Object} props The component props.
 * @return {string} All lumX basic classes.
 */
export const handleBasicClasses = ({ color, emphasis, size, theme, variant, prefix }) =>
    classNames(prefix, {
        [`${prefix}--color-${color}`]: color,
        [`${prefix}--emphasis-${emphasis}`]: emphasis,
        [`${prefix}--size-${size}`]: size,
        [`${prefix}--theme-${theme}`]: theme,
        [`${prefix}--variant-${variant}`]: variant,
    });
