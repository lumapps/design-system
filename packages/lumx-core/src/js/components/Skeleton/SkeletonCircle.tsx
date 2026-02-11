import type { LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import type { GlobalSize, ColorPalette } from '../../constants';

/**
 * Defines the props of the component.
 */
export interface SkeletonCircleProps extends HasTheme, HasClassName {
    /** Size variant. */
    size: GlobalSize;
    /** The color of the skeleton. */
    color?: ColorPalette;
    /** Reference to the root element. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SkeletonCircle';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-skeleton-circle';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<SkeletonCircleProps> = {};

/**
 * SkeletonCircle component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const SkeletonCircle = (props: SkeletonCircleProps) => {
    const { className, size, color, theme, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`size-${size}`]: Boolean(size),
                    [`color-${color}`]: Boolean(color),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        />
    );
};
