import { ColorVariant, ColorWithVariants } from '../../../constants';
import { resolveColorWithVariants } from './resolveColorWithVariants';

/**
 * Returns the classname associated to the given color and variant.
 * For example, for 'dark' and 'L2' it returns `lumx-color-font-dark-L2`
 */
export function fontColorClass(propColor?: ColorWithVariants, propColorVariant?: ColorVariant) {
    if (!propColor) return undefined;
    const [color, colorVariant = ColorVariant.N] = resolveColorWithVariants(propColor, propColorVariant);
    return `lumx-color-font-${color}-${colorVariant}`;
}
