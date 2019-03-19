import { Color, Emphasis, Size, Theme, Variant } from 'LumX/components';

/////////////////////////////

declare function getBasicClass({ prefix, type, value }: { prefix: string; type: string; value: string }): string;

declare function handleBasicClasses({
    prefix,
    color,
    emphasis,
    size,
    theme,
    variant,
}: {
    color?: Color;
    emphasis?: Emphasis;
    size?: Size;
    theme?: Theme;
    variant?: Variant;
    prefix: string;
}): string;

/////////////////////////////

export { getBasicClass, handleBasicClasses };
