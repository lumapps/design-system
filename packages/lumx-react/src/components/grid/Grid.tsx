import React from 'react';

import classNames from 'classnames';

import { Alignment, Orientation, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
type GridGutterSize = Size.regular | Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
interface GridProps extends GenericProps {
    /** The grid orientation. */
    orientation?: Orientation;
    /** Whether the children are wrapped or not. */
    wrap?: string;
    /** The grid vertical alignment. */
    vAlign?: Alignment;
    /** The grid horizontal alignment. */
    hAlign?: Alignment;
    /** The grid gutter size. */
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 */
const DEFAULT_PROPS: Partial<GridProps> = {
    orientation: Orientation.horizontal,
    wrap: 'nowrap',
};

const Grid: React.FC<GridProps> = ({
    children,
    className,
    gutter,
    hAlign,
    orientation,
    vAlign,
    wrap,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                `${CLASSNAME}-container`,
                { [`${CLASSNAME}--h-align-${hAlign}`]: hAlign },
                { [`${CLASSNAME}--v-align-${vAlign}`]: vAlign },
                handleBasicClasses({ prefix: CLASSNAME, orientation, wrap, gutter }),
            )}
        >
            {children}
        </div>
    );
};
Grid.displayName = COMPONENT_NAME;
Grid.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Grid, GridProps };
