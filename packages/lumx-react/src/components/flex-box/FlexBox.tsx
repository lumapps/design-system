import { Alignment, Orientation } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import castArray from 'lodash/castArray';
import React, { ReactNode } from 'react';
import { Size } from '..';

export type MarginAutoAlignment = Alignment.top | Alignment.bottom | Alignment.right | Alignment.left;
export type GapSize = Size.regular | Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
interface FlexBoxProps extends GenericProps {
    /**
     * Flex direction.
     */
    orientation?: Orientation;
    /**
     * Enable/Disable flex wrap.
     */
    wrap?: boolean;
    /**
     * Flex vertical alignment.
     */
    vAlign?: Alignment.left | Alignment.center | Alignment.right;
    /**
     * Flex horizontal alignment.
     */
    hAlign?: Alignment.top | Alignment.center | Alignment.bottom;
    /**
     * Enable/Disable content filling space.
     */
    fillSpace?: boolean;
    /**
     * Enable/Disable content shrink.
     */
    noShrink?: boolean;
    /**
     * Enable/Disable auto margin all around.
     */
    marginAuto?: MarginAutoAlignment | MarginAutoAlignment[];
    /**
     * Flex gap.
     */
    gap?: GapSize;
    /**
     * Content on which to apply a flex layout.
     */
    children?: ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}FlexBox`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const DEFAULT_PROPS: Partial<FlexBoxProps> = {};

const FlexBox: React.FC<FlexBoxProps> = ({
    children,
    className,
    orientation,
    wrap,
    vAlign,
    hAlign,
    fillSpace,
    noShrink,
    marginAuto,
    gap,
    ...forwardedProps
}) => (
    <div
        {...forwardedProps}
        className={classNames(
            className,
            handleBasicClasses({
                prefix: CLASSNAME,
                orientation: orientation ?? (wrap || hAlign || vAlign ? Orientation.horizontal : null),
                vAlign,
                hAlign,
                gap,
            }),
            wrap && `${CLASSNAME}--wrap`,
            fillSpace && `${CLASSNAME}--fill-space`,
            noShrink && `${CLASSNAME}--no-shrink`,
            marginAuto && castArray(marginAuto).map((align) => `${CLASSNAME}--margin-auto-${align}`),
        )}
    >
        {children}
    </div>
);
FlexBox.displayName = COMPONENT_NAME;
FlexBox.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, FlexBox, FlexBoxProps };
