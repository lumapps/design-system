import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Alignment } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface GridItemProps extends GenericProps {
    /** The alignment of the grid item. */
    align?: Alignment;
    /** The order of the grid item. */
    order?: string;
    /** The width of the grid item. */
    width?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}GridItem`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * GridItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const GridItem: Comp<GridItemProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, width, align, order, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, width, order, align }))}
        >
            {children}
        </div>
    );
});
GridItem.displayName = COMPONENT_NAME;
GridItem.className = CLASSNAME;
