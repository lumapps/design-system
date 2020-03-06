import { Alignment, Orientation, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React from 'react';

type GridGutterSize = Size.regular | Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
export interface GridProps extends GenericProps {
    /** Grid orientation */
    orientation?: Orientation;
    /** Should children wrap */
    wrap?: string;
    /** How we should vertically align the children */
    vAlign?: Alignment;
    /** How we should horizontally align the children */
    hAlign?: Alignment;
    /** Grid gutters */
    gutter?: GridGutterSize;
}

/**
 * The display name of the component.
 *
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Grid`;

/**
 * The default class name and classes prefix for this component.
 *
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 */
export const DEFAULT_PROPS: Partial<GridProps> = {
    orientation: Orientation.horizontal,
    wrap: 'nowrap',
};

/**
 * Grid layout component.
 *
 * @return The component.
 */
export const Grid: React.FC<GridProps> = ({
    children,
    className,
    gutter,
    hAlign,
    orientation = DEFAULT_PROPS.orientation,
    vAlign,
    wrap = DEFAULT_PROPS.wrap,
    ...props
}) => {
    return (
        <div
            className={classNames(
                className,
                `${CLASSNAME}-container`,
                { [`${CLASSNAME}--h-align-${hAlign}`]: hAlign },
                { [`${CLASSNAME}--v-align-${vAlign}`]: vAlign },
                handleBasicClasses({ prefix: CLASSNAME, orientation, wrap, gutter }),
            )}
            {...props}
        >
            {children}
        </div>
    );
};
Grid.displayName = COMPONENT_NAME;
