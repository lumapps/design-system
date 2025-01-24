import { CSS_PREFIX } from '@lumx/react/constants';

import kebabCase from 'lodash/kebabCase';
import { ColorPalette, ColorVariant, ColorWithVariants, Typography } from '@lumx/react/components';

// See https://regex101.com/r/YjS1uI/3
const LAST_PART_CLASSNAME = /^(.*)-(.+)$/gi;

export { getBasicClass, handleBasicClasses } from '@lumx/core/js/utils';

/**
 * Get the name of the root CSS class of a component based on its name.
 *
 * @param  componentName The name of the component. This name should contains the component prefix and be
 *                       written in PascalCase.
 * @param  subComponent Whether the current component is a sub component, if true, define the class according
 *                      to BEM standards.
 * @return The name of the root CSS class. This classname include the CSS classname prefix and is written in
 *         lower-snake-case.
 */
export function getRootClassName(componentName: string, subComponent?: boolean): string {
    const formattedClassName = `${CSS_PREFIX}-${kebabCase(componentName)}`;

    if (subComponent) {
        return formattedClassName.replace(LAST_PART_CLASSNAME, '$1__$2');
    }
    return formattedClassName;
}

export function parseColorWithVariants(
    colorWithVariants: ColorWithVariants | undefined,
    colorVariant: ColorVariant = ColorVariant.N,
): [color?: ColorPalette, colorVariant?: ColorVariant] {
    if (!colorWithVariants) return [undefined, colorVariant];
    const [color, baseColorVariant] = colorWithVariants.split('-');
    return [color as ColorPalette, (baseColorVariant || colorVariant) as ColorVariant];
}

/**
 * Returns the classname associated to the given color and variant.
 * For example, for 'dark' and 'L2' it returns `lumx-color-font-dark-l2`
 */
export const getFontColorClassName = (
    colorWithVariants?: ColorWithVariants,
    colorVariant: ColorVariant = ColorVariant.N,
): string | undefined => {
    const [color, baseColorVariant] = parseColorWithVariants(colorWithVariants, colorVariant);
    if (!color) return undefined;
    return `lumx-color-font-${color}-${baseColorVariant || colorVariant}`;
};

/**
 * Returns the classname associated to the given typography.
 * For example, for `Typography.title` it returns `lumx-typography-title`
 */
export const getTypographyClassName = (typography: Typography) => {
    return `lumx-typography-${typography}`;
};
