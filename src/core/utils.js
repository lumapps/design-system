import classNames from 'classnames';

/**
 * Return all default lumX which are available for every components.
 *
 * @param  {Object} props The component props.
 * @return {string} All lumX basic classes.
 */
export const handleBasicLxClasses = ({
    lxColor = 'primary',
    lxSize = 'm',
    lxTheme = 'light',
    lxType = 'primary',
    prefix,
}) =>
    classNames(prefix, {
        [`${prefix}--color-${lxColor}`]: lxColor,
        [`${prefix}--size-${lxSize}`]: lxSize,
        [`${prefix}--theme-${lxTheme}`]: lxTheme,
        [`${prefix}--type-${lxType}`]: lxType,
    });
