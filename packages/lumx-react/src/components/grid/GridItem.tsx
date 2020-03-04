import React from 'react';

import classNames from 'classnames';

import { Alignment } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface GridItemProps extends GenericProps {
    /* How the item should self align */
    align?: Alignment;
    /* Order */
    order?: string;
    /* Weight of the item in the grid*/
    width?: string;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<GridItemProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {};
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
