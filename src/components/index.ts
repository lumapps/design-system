/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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

/////////////////////////////

export { ComplexPropDefault, Color, Colors, Theme, Themes, Size, Sizes };
