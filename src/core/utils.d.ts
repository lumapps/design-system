import { Color, Size, Theme } from 'LumX/components';

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
    emphasis?: string;
    size?: Size;
    theme?: Theme;
    variant?: string;
    prefix: string;
}): string;

/////////////////////////////

export { getBasicClass, handleBasicClasses };
