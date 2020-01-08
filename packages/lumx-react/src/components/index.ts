/**
 * Authorized alignments.
 */
enum Alignment {
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

/**
 * Defines the type of a complex default prop (which depends on the value of another prop).
 */
interface IComplexPropDefault<T> {
    default: T;
    [key: string]: T;
}
type ComplexPropDefault<T> = IComplexPropDefault<T>;

/**
 * See SCSS variable $lumx-theme-color-palette
 */
enum ColorPalette {
    primary = 'primary',
    secondary = 'secondary',
    blue = 'blue',
    dark = 'dark',
    green = 'green',
    yellow = 'yellow',
    red = 'red',
    light = 'light',
}
type Color = ColorPalette | string;

/**
 * See SCSS variable $lumx-theme-color-variants
 */
enum ColorVariant {
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
    tiny = 'tiny',
    regular = 'regular',
    big = 'big',
    huge = 'huge',
}

enum Orientation {
    horizontal = 'horizontal',
    vertical = 'vertical',
}

enum Emphasis {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

/**
 * All available aspect ratios.
 */
enum AspectRatio {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
    square = 'square',
}

/**
 * Semantic info about the purpose of the component
 */
enum Kind {
    info = 'info',
    valid = 'success',
    warning = 'warning',
    error = 'error',
}

/////////////////////////////

export {
    Alignment,
    AspectRatio,
    ComplexPropDefault,
    Color,
    ColorPalette,
    ColorVariant,
    Theme,
    Size,
    Orientation,
    Emphasis,
    Kind,
};
