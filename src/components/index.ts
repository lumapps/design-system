/**
 * Authorized alignments.
 */
const enum Alignments {
    center = 'center',
    left = 'left',
    right = 'right',
}
type Alignment = Alignments;

/**
 * Defines the type of a complex default prop (which depends on the value of another prop).
 */
interface IComplexPropDefault<T> {
    default: T;
    [key: string]: T;
}
type ComplexPropDefault<T> = IComplexPropDefault<T>;

enum Colors {
    primary = 'primary',
    blue = 'blue',
    dark = 'dark',
    green = 'green',
    yellow = 'yellow',
    red = 'red',
}
type Color = Colors | string;

enum Themes {
    light = 'light',
    dark = 'dark',
}
type Theme = Themes;

enum Sizes {
    xxs = 'xxs',
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
    xxl = 'xxl',
}
type Size = Sizes;

const enum Orientations {
    horizontal = 'horizontal',
    vertical = 'vertical',
}
type Orientation = Orientations;

/////////////////////////////

export {
    Alignment,
    Alignments,
    ComplexPropDefault,
    Color,
    Colors,
    Theme,
    Themes,
    Size,
    Sizes,
    Orientations,
    Orientation,
};
