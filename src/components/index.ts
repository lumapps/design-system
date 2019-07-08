/**
 * Authorized alignments.
 */
enum Alignment {
    center = 'center',
    left = 'left',
    right = 'right',
}

/**
 * Defines the type of a complex default prop (which depends on the value of another prop).
 */
interface IComplexPropDefault<T> {
    default: T;
    [key: string]: T;
}
type ComplexPropDefault<T> = IComplexPropDefault<T>;

enum ColorPalette {
    primary = 'primary',
    blue = 'blue',
    dark = 'dark',
    green = 'green',
    yellow = 'yellow',
    red = 'red',
    light = 'light',
}
type Color = ColorPalette | string;

enum Theme {
    light = 'light',
    dark = 'dark',
}

enum Size {
    xxs = 'xxs',
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
    xxl = 'xxl',
}

enum Orientation {
    horizontal = 'horizontal',
    vertical = 'vertical',
}

/////////////////////////////

export { Alignment, ComplexPropDefault, Color, ColorPalette, Theme, Size, Orientation };
