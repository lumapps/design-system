import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/core/react/constants';

import { IGenericProps, getRootClassName } from '@lumx/core/react/utils';
import { handleBasicClasses } from '@lumx/core/utils';

import { Alignment } from 'LumX/components';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IGridItemProps extends IGenericProps {
    /* How the item should self align */
    align?: Alignment;
    /* Order */
    order?: string;
    /* Weight of the item in the grid*/
    width?: string;
}
type GridItemProps = IGridItemProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<GridItemProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}GridItem`;

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
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const GridItem: React.FC<GridItemProps> = ({
    children,
    className = '',
    width,
    align,
    order,
    ...props
}: GridItemProps): React.ReactElement => {
    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, width, order, align }))}
            {...props}
        >
            {children}
        </div>
    );
};
GridItem.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, GridItem, GridItemProps };
