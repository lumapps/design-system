import type { ValueOf } from '@lumx/react/utils/type';

/**
 * See SCSS variable $lumx-color-palette
 */
export const ColorPalette = {
    primary: 'primary',
    secondary: 'secondary',
    blue: 'blue',
    dark: 'dark',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    light: 'light',
    grey: 'grey',
} as const;
export type ColorPalette = ValueOf<typeof ColorPalette>;
export type Color = ColorPalette | string;

/**
 * See SCSS variable $lumx-color-variants
 */
export const ColorVariant = {
    D1: 'D1',
    D2: 'D2',
    L1: 'L1',
    L2: 'L2',
    L3: 'L3',
    L4: 'L4',
    L5: 'L5',
    L6: 'L6',
    N: 'N',
} as const;
export type ColorVariant = ValueOf<typeof ColorVariant>;

/** ColorPalette with all possible color variant combination */
export type ColorWithVariants =
    | ColorPalette
    | Exclude<
          `${ColorPalette}-${ColorVariant}`,
          // No dark variant for light and dark
          `light-D${number}` | `dark-D${number}`
      >;
