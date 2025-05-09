import { ValueOf } from '@lumx/react/utils/type';

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
    spaceEvenly: 'space-evenly',
    start: 'start',
    top: 'top',
} as const;
export type Alignment = ValueOf<typeof Alignment>;
export type VerticalAlignment = Extract<Alignment, 'top' | 'center' | 'bottom'>;
export type HorizontalAlignment = Extract<Alignment, 'right' | 'center' | 'left'>;

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
    medium: 'medium',
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
 * List of typographies that can't be customized.
 */
export const TypographyInterface = {
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
export type TypographyInterface = ValueOf<typeof TypographyInterface>;

/**
 * List of title typographies that can be customized (via CSS variables).
 */
export const TypographyTitleCustom = {
    title1: 'custom-title1',
    title2: 'custom-title2',
    title3: 'custom-title3',
    title4: 'custom-title4',
    title5: 'custom-title5',
    title6: 'custom-title6',
} as const;
export type TypographyTitleCustom = ValueOf<typeof TypographyTitleCustom>;

/**
 * List of typographies that can be customized (via CSS variables).
 */
export const TypographyCustom = {
    ...TypographyTitleCustom,
    intro: 'custom-intro',
    'body-large': 'custom-body-large',
    body: 'custom-body',
    quote: 'custom-quote',
    'publish-info': 'custom-publish-info',
    button: 'custom-button',
} as const;
export type TypographyCustom = ValueOf<typeof TypographyCustom>;

/**
 * List of all typographies.
 */
export const Typography = {
    ...TypographyInterface,
    custom: TypographyCustom,
} as const;
export type Typography = TypographyInterface | TypographyCustom;

/**
 * All available aspect ratios.
 */
export const AspectRatio = {
    /** Intrinsic content ratio. */
    original: 'original',
    /** Ratio 3:1 */
    panoramic: 'panoramic',
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

/**
 * All available white-space values
 * */
export const WhiteSpace = {
    normal: 'normal',
    nowrap: 'nowrap',
    pre: 'pre',
    'pre-wrap': 'pre-wrap',
    'pre-line': 'pre-line',
    'break-spaces': 'break-spaces',
};
export type WhiteSpace = ValueOf<typeof WhiteSpace>;

/**
 * Re-exporting some utils types.
 */
export type { HeadingElement, TextElement, GenericProps, Callback } from '../utils/type';

export * from '../utils/type/color';
