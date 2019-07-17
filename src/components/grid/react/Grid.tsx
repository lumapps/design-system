import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Alignment, Orientation } from 'LumX/components';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IGridProps extends IGenericProps {
    orientation?: Orientation;
    /* Should children wrap */
    wrap?: boolean;
    /* How we should vertically align the children */
    vAlign?: Alignment;
    /* How we should horizontally align the children */
    hAlign?: Alignment;
    /* Grid gutters */
    gutter?: string;
}
type GridProps = IGridProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<GridProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {};
/////////////////////////////

/**
 * Grid layout component.
 *
 * @return The component.
 */
const Grid: React.FC<GridProps> = ({
    children,
    className = '',
    gutter,
    hAlign,
    orientation,
    vAlign,
    wrap,
    ...props
}: GridProps): React.ReactElement => {
    const attributes = {
        [`${CLASSNAME}-container`]: orientation === Orientation.horizontal ? 'row' : 'column',
        [`${CLASSNAME}-wrap`]: wrap ? 'true' : false,
        [`${CLASSNAME}-h-align`]: hAlign,
        [`${CLASSNAME}-v-align`]: vAlign,
        [`${CLASSNAME}-gutter`]: gutter,
    };
    return (
        <div className={classNames(className, `${CLASSNAME}-container`)} {...props} {...attributes}>
            {children}
        </div>
    );
};
Grid.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Grid, GridProps };
