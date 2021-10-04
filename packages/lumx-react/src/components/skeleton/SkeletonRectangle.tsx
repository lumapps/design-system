import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { AspectRatio, GlobalSize, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, ValueOf } from '@lumx/react/utils';

/**
 * Skeleton variants.
 */
export const SkeletonRectangleVariant = { squared: 'squared', rounded: 'rounded', pill: 'pill' } as const;
export type SkeletonRectangleVariant = ValueOf<typeof SkeletonRectangleVariant>;

/**
 * Defines the props of the component.
 */
export interface SkeletonRectangleProps extends GenericProps {
    /** Aspect ratio (use with width and not height). */
    aspectRatio?: Extract<AspectRatio, 'square' | 'horizontal' | 'vertical' | 'wide'>;
    /** Height size. */
    height?: GlobalSize;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Border variant. */
    variant?: SkeletonRectangleVariant;
    /** Width size. */
    width?: GlobalSize;
}

const DEFAULT_PROPS: Partial<SkeletonRectangleProps> = {
    theme: Theme.light,
    variant: SkeletonRectangleVariant.squared,
};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SkeletonRectangle';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SkeletonRectangle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonRectangle: Comp<SkeletonRectangleProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { aspectRatio, className, height, theme, variant, width, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    aspectRatio,
                    height: aspectRatio ? undefined : height,
                    theme,
                    variant,
                    width,
                }),
            )}
        >
            <div className={`${CLASSNAME}__inner`} />
        </div>
    );
});
SkeletonRectangle.displayName = COMPONENT_NAME;
SkeletonRectangle.className = CLASSNAME;
SkeletonRectangle.defaultProps = DEFAULT_PROPS;
