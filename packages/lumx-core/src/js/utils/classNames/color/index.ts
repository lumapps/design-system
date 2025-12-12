import { ColorVariant, ColorWithVariants } from '@lumx/core/js/constants';
import { resolveColorWithVariants } from '@lumx/core/js/utils/_internal/color';

/**
 * Generates a Lumx color class name for the given type, color and variant.
 * This is the base function used by font() and background() utilities.
 *
 * @param type - The color class type ('font' or 'background')
 * @param propColor - The color palette name (e.g., 'primary', 'dark') with optional variant suffix (e.g., 'primary-L2')
 * @param propColorVariant - Optional color variant override (e.g., 'L1', 'L2', 'D1', 'N')
 * @returns The Lumx color class name or undefined if no color is provided
 *
 * @example
 * color('font', 'dark', 'L2'); // 'lumx-color-font-dark-L2'
 * color('background', 'primary'); // 'lumx-color-background-primary-N'
 * color('font', 'primary-L2'); // 'lumx-color-font-primary-L2'
 * color('font', undefined); // undefined
 */
export function color(
    type: 'font' | 'background',
    propColor: ColorWithVariants,
    propColorVariant?: ColorVariant,
): string {
    const [cColor, cColorVariant = ColorVariant.N] = resolveColorWithVariants(propColor, propColorVariant);
    return `lumx-color-${type}-${cColor}-${cColorVariant}`;
}

/**
 * Generates a Lumx background color class name for the given color and variant.
 *
 * @param propColor - The color palette name (e.g., 'primary', 'dark', 'light')
 * @param propColorVariant - The color variant (e.g., 'L1', 'L2', 'D1', 'N')
 * @returns The Lumx background color class name
 *
 * @example
 * background('dark', 'L2'); // 'lumx-color-background-dark-L2'
 * background('primary', 'N'); // 'lumx-color-background-primary-N'
 */
export const background = (propColor: ColorWithVariants, propColorVariant?: ColorVariant) =>
    color('background', propColor, propColorVariant);

/**
 * Generates a Lumx font color class name for the given color and variant.
 *
 * @param propColor - The color palette name (e.g., 'primary', 'dark') with optional variant suffix (e.g., 'primary-L2')
 * @param propColorVariant - Optional color variant override (e.g., 'L1', 'L2', 'D1', 'N')
 * @returns The Lumx font color class name or undefined if no color is provided
 *
 * @example
 * font('dark', 'L2'); // 'lumx-color-font-dark-L2'
 * font('primary-L2'); // 'lumx-color-font-primary-L2'
 * font('primary'); // 'lumx-color-font-primary-N'
 * font(undefined); // undefined
 */
export const font = (propColor: ColorWithVariants, propColorVariant?: ColorVariant) =>
    color('font', propColor, propColorVariant);
