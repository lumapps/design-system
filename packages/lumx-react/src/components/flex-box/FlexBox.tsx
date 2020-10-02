import { Alignment, Orientation } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import castArray from 'lodash/castArray';
import React, { ReactNode } from 'react';

export type MarginAutoAlignment = Alignment.top | Alignment.bottom | Alignment.right | Alignment.left;

/**
 * Defines the props of the component.
 */
interface FlexBoxProps extends GenericProps {
    /** The flex direction. */
    orientation?: Orientation;
    /** Whether the "flex wrap" is enabled or not. */
    wrap?: boolean;
    /** The flex vertical alignment. */
    vAlign?: Alignment.left | Alignment.center | Alignment.right;
    /** The flex horizontal alignment. */
    hAlign?: Alignment.top | Alignment.center | Alignment.bottom;
    /** Whether the "content filling space" is enabled or not. */
    fillSpace?: boolean;
    /** Whether the "content shrink" is disabled or not. */
    noShrink?: boolean;
    /** Whether the "auto margin" is enabled all around or not. */
    marginAuto?: MarginAutoAlignment | MarginAutoAlignment[];
    /** The children elements to be transcluded into the component. */
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
    fillSpace,
    hAlign,
    marginAuto,
    noShrink,
    orientation,
    vAlign,
    wrap,
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
