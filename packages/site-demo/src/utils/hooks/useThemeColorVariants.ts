import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import { useContext, useMemo } from 'react';

import { CORE } from '@lumx/core/js/constants';
import { GlobalTheme } from '@lumx/core/js/types';
import { GlobalThemeContext } from '@lumx/demo/global-theme';

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

function formatColorDescription(globalTheme: GlobalTheme, colorName: string): ColorVariants {
    const colorWithVariants = get(CORE, [globalTheme, 'color', colorName]);

    return mapValues(
        colorWithVariants,
        (variant): ColorDocumentation => {
            const { attributes } = variant;
            const { item: colorVariant, hex, rgb } = attributes;
            return {
                colorName,
                colorVariant,
                hex,
                rgb,
                fontColor: getFontColor(colorName, colorVariant),
                comment: variant.comment,
                version: variant.version,
            };
        },
    );
}

export const useThemeColorVariants = (colorName: string) => {
    const { globalTheme } = useContext(GlobalThemeContext);
    return useMemo(() => formatColorDescription(globalTheme, colorName), [globalTheme, colorName]);
};
