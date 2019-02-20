import classNames from 'classnames';

/**
 * Return all default lumX which are available for every components.
 *
 * @param  {Object} props The component props.
 * @return {string} All lumX basic classes.
 */
export const handleBasicClasses = ({ color, size, theme, variant, prefix }) =>
    classNames(prefix, {
        [`${prefix}--color-${color}`]: color,
        [`${prefix}--size-${size}`]: size,
        [`${prefix}--theme-${theme}`]: theme,
        [`${prefix}--type-${variant}`]: variant,
    });
