/**
 * Defines the type of a complex default prop (which depends on the value of another prop).
 */
interface IComplexPropDefault<T> {
    default: T;
    [key: string]: T;
}
type ComplexPropDefault<T> = IComplexPropDefault<T>;

type Color = 'primary' | 'blue' | 'green' | 'yellow' | 'red' | string;
type Emphasis = 'high' | 'medium' | 'low';
type Theme = 'light' | 'dark';
type Variant = 'button' | 'icon';
type Size = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

/////////////////////////////

export { Color, ComplexPropDefault, Emphasis, Theme, Variant, Size };
