import { ValueOf } from '@lumx/react/utils';

/**
 * Alignments.
 */
export const Alignment = {
    bottom: 'bottom',
    center: 'center',
    end: 'end',
    left: 'left',
    right: 'right',
    spaceAround: 'space-around',
    spaceBetween: 'space-between',
    start: 'start',
    top: 'top',
} as const;
export type Alignment = ValueOf<typeof Alignment>;
export type VerticalAlignment = Extract<Alignment, 'top' | 'center' | 'bottom'>;
export type HorizontalAlignment = Extract<Alignment, 'right' | 'center' | 'left'>;

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

export const Theme = {
    light: 'light',
    dark: 'dark',
} as const;
export type Theme = ValueOf<typeof Theme>;

export const Size = {
    xxs: 'xxs',
    xs: 'xs',
    s: 's',
    m: 'm',
    l: 'l',
    xl: 'xl',
    xxl: 'xxl',
    tiny: 'tiny',
    regular: 'regular',
    big: 'big',
    huge: 'huge',
} as const;
export type Size = ValueOf<typeof Size>;
export type GlobalSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

export const Orientation = {
    horizontal: 'horizontal',
    vertical: 'vertical',
} as const;
export type Orientation = ValueOf<typeof Orientation>;

export const Emphasis = {
    low: 'low',
    medium: 'medium',
    high: 'high',
} as const;
export type Emphasis = ValueOf<typeof Emphasis>;

/**
 * List of typographies.
 */
export const Typography = {
    overline: 'overline',
    caption: 'caption',
    body1: 'body1',
    body2: 'body2',
    subtitle1: 'subtitle1',
    subtitle2: 'subtitle2',
    title: 'title',
    headline: 'headline',
    display1: 'display1',
} as const;
export type Typography = ValueOf<typeof Typography>;

/**
 * All available aspect ratios.
 */
export const AspectRatio = {
    /** Intrinsic content ratio. */
    original: 'original',
    /** Ratio 16:9 */
    wide: 'wide',
    /** Ratio 3:2 */
    horizontal: 'horizontal',
    /** Ratio 3:2 */
    vertical: 'vertical',
    /** Ratio 1:1 */
    square: 'square',
    /** Ratio constrained by the parent. */
    free: 'free',
} as const;
export type AspectRatio = ValueOf<typeof AspectRatio>;

/**
 * Semantic info about the purpose of the component
 */
export const Kind = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
} as const;
export type Kind = ValueOf<typeof Kind>;
