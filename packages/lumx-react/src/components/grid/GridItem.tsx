import React from 'react';

import classNames from 'classnames';

import { Alignment } from '@lumx/react';
import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

type Columns = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

/**
 * Defines the props of the component.
 */
export interface GridItemProps extends GenericProps {
    /** Alignment. */
    align?: Alignment;
    /** Order. */
    order?: Columns;
    /** Width. */
    width?: Columns;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'GridItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-grid-item';

/**
 * GridItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const GridItem = forwardRef<GridItemProps, HTMLDivElement>((props, ref) => {
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
