import { ColorPalette, ColorVariant } from '@lumx/react';

/**
 * Returns the classname associated to the given color and variant.
 * For example, for 'dark' and 'L2' it returns `lumx-color-font-dark-l2`
 */
export const getFontColorClassName = (color: ColorPalette, colorVariant: ColorVariant = ColorVariant.N) => {
    return `lumx-color-font-${color}-${colorVariant}`;
};
