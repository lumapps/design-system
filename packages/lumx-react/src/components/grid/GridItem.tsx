import React from 'react';

import classNames from 'classnames';

import { Alignment } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface GridItemProps extends GenericProps {
    /** The alignment of the grid item. */
    align?: Alignment;
    /** The order of the grid item. */
    order?: string;
    /** The width of the grid item. */
    width?: string;
}

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
const DEFAULT_PROPS: Partial<GridItemProps> = {};

const GridItem: React.FC<GridItemProps> = ({ children, className, width, align, order, ...forwardedProps }) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, width, order, align }))}
        >
            {children}
        </div>
    );
};
GridItem.displayName = COMPONENT_NAME;
GridItem.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, GridItem, GridItemProps };
