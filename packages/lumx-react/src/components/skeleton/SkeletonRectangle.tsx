import classNames from 'classnames';
import React from 'react';

import { AspectRatio, GlobalSize, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized variants.
 */
enum SkeletonRectangleVariant {
    squared = 'squared',
    rounded = 'rounded',
    pill = 'pill',
}

/**
 * Defines the props of the component.
 */
interface SkeletonRectangleProps extends GenericProps {
    /** The skeleton aspect ratio (use with width prop only). */
    aspectRatio?: AspectRatio.square | AspectRatio.horizontal | AspectRatio.vertical;
    /** The height of the component from Size enum. */
    height?: GlobalSize;
    /** Theme. */
    theme?: Theme;
    /** The variant of the component. */
    variant?: SkeletonRectangleVariant;
    /** The width of the component from Size enum. */
    width?: GlobalSize;
}

const DEFAULT_PROPS: Partial<SkeletonRectangleProps> = {
    variant: SkeletonRectangleVariant.squared,
};

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonRectangle`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const SkeletonRectangle: React.FC<SkeletonRectangleProps> = ({
    aspectRatio,
    className,
    height,
    theme,
    variant,
    width,
    ...forwardedProps
}) => {
    return (
        <div
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
};
SkeletonRectangle.displayName = COMPONENT_NAME;
SkeletonRectangle.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, COMPONENT_NAME, SkeletonRectangle, SkeletonRectangleProps, SkeletonRectangleVariant };
