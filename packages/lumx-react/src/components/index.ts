/**
 * Alignments.
 */
export enum Alignment {
    bottom = 'bottom',
    center = 'center',
    end = 'end',
    left = 'left',
    right = 'right',
    spaceAround = 'space-around',
    spaceBetween = 'space-between',
    start = 'start',
    top = 'top',
}
export type VerticalAlignment = Alignment.top | Alignment.center | Alignment.bottom;
export type HorizontalAlignment = Alignment.right | Alignment.center | Alignment.left;

/**
 * See SCSS variable $lumx-color-palette
 */
export enum ColorPalette {
    primary = 'primary',
    secondary = 'secondary',
    blue = 'blue',
    dark = 'dark',
    green = 'green',
    yellow = 'yellow',
    red = 'red',
    light = 'light',
}
export type Color = ColorPalette | string;

/**
 * See SCSS variable $lumx-color-variants
 */
export enum ColorVariant {
    D1 = 'D1',
    D2 = 'D2',
    L1 = 'L1',
    L2 = 'L2',
    L3 = 'L3',
    L4 = 'L4',
    L5 = 'L5',
    L6 = 'L6',
    N = 'N',
}

export enum Theme {
    light = 'light',
    dark = 'dark',
}

export enum Size {
    xxs = 'xxs',
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
    xxl = 'xxl',
    tiny = 'tiny',
    regular = 'regular',
    big = 'big',
    huge = 'huge',
}
export type GlobalSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

export enum Orientation {
    horizontal = 'horizontal',
    vertical = 'vertical',
}

export enum Emphasis {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

/**
 * List of typographies.
 */
export enum Typography {
    overline = 'overline',
    caption = 'caption',
    body1 = 'body1',
    body2 = 'body2',
    subtitle1 = 'subtitle1',
    subtitle2 = 'subtitle2',
    title = 'title',
    headline = 'headline',
    display1 = 'display1',
}

/**
 * All available aspect ratios.
 */
export enum AspectRatio {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
    square = 'square',
    free = 'free',
}

/**
 * Semantic info about the purpose of the component
 */
export enum Kind {
    info = 'info',
    valid = 'success',
    warning = 'warning',
    error = 'error',
}
