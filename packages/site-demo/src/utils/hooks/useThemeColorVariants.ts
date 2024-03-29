import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import { useMemo } from 'react';

import { DESIGN_TOKENS } from '@lumx/core/js/constants/design-tokens';

interface ColorDocumentation {
    colorName: string;
    colorVariant: string;
    hex: string;
    rgb: { r: number; g: number; b: number; a: number };
    fontColor: string;
    comment: string;
    version: string;
}
export type ColorVariants = Record<string, ColorDocumentation>;

function getFontColor(colorName: string, colorVariant: string): 'dark' | 'light' {
    const [variant, level] = colorVariant.split('');
    if (colorName === 'dark') {
        if (variant === 'L' && parseInt(level, 10) > 2) {
            return 'dark';
        }
        return 'light';
    }
    if (colorName === 'light') {
        if (variant === 'L' && parseInt(level, 10) > 4) {
            return 'light';
        }
        return 'dark';
    }
    return variant === 'L' ? 'dark' : 'light';
}

function formatColorDescription(colorName: string): ColorVariants {
    const colorWithVariants = get(DESIGN_TOKENS, ['color', colorName]);

    return mapValues(colorWithVariants, (variant, name): ColorDocumentation => {
        // Last segment of the name
        const colorVariant = name.replace(/.*-([^-]+)$/, '$1');
        const { attributes } = variant;
        const { hex, rgb } = attributes;
        return {
            colorName,
            colorVariant,
            hex,
            rgb,
            fontColor: getFontColor(colorName, colorVariant),
            comment: variant.comment,
            version: variant.version,
        };
    });
}

export const useThemeColorVariants = (colorName: string) => {
    return useMemo(() => formatColorDescription(colorName), [colorName]);
};
