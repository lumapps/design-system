import type { ColorPalette, ColorVariant, ColorWithVariants } from '@lumx/core/js/constants';

/** Resolve color & color variant from a `ColorWithVariants` and optionally a `ColorVariant`. */
export function resolveColorWithVariants(
    colorWithVariants?: ColorWithVariants,
    colorVariant?: ColorVariant,
): [color?: ColorPalette, colorVariant?: ColorVariant] {
    if (!colorWithVariants) return [undefined, colorVariant];
    const [color, baseColorVariant] = colorWithVariants.split('-');
    return [color as ColorPalette, (colorVariant || baseColorVariant) as ColorVariant];
}
