import { Color, Emphasis, Size, Theme, Variant } from 'components';

export function handleBasicClasses({
    color,
    emphasis,
    size,
    theme,
    variant,
    prefix,
}: {
    color?: Color;
    emphasis?: Emphasis;
    size?: Size;
    theme?: Theme;
    variant?: Variant;
    prefix: string;
}): string;
