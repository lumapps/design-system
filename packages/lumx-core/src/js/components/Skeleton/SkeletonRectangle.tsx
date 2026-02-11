import type { LumxClassName, HasTheme, HasClassName, CommonRef, ValueOf } from '../../types';
import { classNames } from '../../utils';
import type { GlobalSize, ColorPalette, AspectRatio } from '../../constants';

/**
 * Skeleton variants.
 */
export const SkeletonRectangleVariant = { squared: 'squared', rounded: 'rounded', pill: 'pill' } as const;
export type SkeletonRectangleVariant = ValueOf<typeof SkeletonRectangleVariant>;

/**
 * Defines the props of the component.
 */
export interface SkeletonRectangleProps extends HasTheme, HasClassName {
    /** Aspect ratio (use with width and not height). */
    aspectRatio?: Extract<AspectRatio, 'square' | 'horizontal' | 'vertical' | 'wide'>;
    /** Height size. */
    height?: GlobalSize;
    /** Border variant. */
    variant?: SkeletonRectangleVariant;
    /** Width size. */
    width?: GlobalSize;
    /** The color of the skeleton. */
    color?: ColorPalette;
    /** Reference to the root element. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SkeletonRectangle';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-skeleton-rectangle';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<SkeletonRectangleProps> = {
    variant: SkeletonRectangleVariant.squared,
};

/**
 * SkeletonRectangle component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const SkeletonRectangle = (props: SkeletonRectangleProps) => {
    const {
        aspectRatio,
        className,
        height,
        theme,
        variant = DEFAULT_PROPS.variant,
        width,
        color,
        ref,
        ...forwardedProps
    } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`aspect-ratio-${aspectRatio}`]: Boolean(aspectRatio),
                    [`height-${height}`]: Boolean(aspectRatio ? undefined : height),
                    [`theme-${theme}`]: Boolean(theme),
                    [`variant-${variant}`]: Boolean(variant),
                    [`width-${width}`]: Boolean(width),
                    [`color-${color}`]: Boolean(color),
                }),
            )}
        >
            <div className={element('inner')} />
        </div>
    );
};
