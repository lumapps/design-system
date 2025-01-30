import React, { ReactElement, ReactNode } from 'react';

import isInteger from 'lodash/isInteger';
import classNames from 'classnames';

import { Size } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { getRootClassName } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export type GridColumnGapSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface GridColumnProps extends GenericProps {
    /** Customize the root element. */
    as?: React.ElementType;
    /** Children elements. */
    children?: ReactNode;
    /** Space between columns and rows. */
    gap?: GridColumnGapSize;
    /** Ideal number of columns. */
    maxColumns?: number;
    /** Minimum width for each item, reduce the number of column if there is not enough space. */
    itemMinWidth?: number;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'GridColumn';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<GridColumnProps> = {};

/**
 * The GridColumn is a layout component that can display children in a grid
 * with custom display properties. It also comes with a responsive design,
 * with a number of column that reduce when there is not enough space for each item.
 *
 * @param props Component props.
 * @param ref Component ref.
 * @return React element.
 */
export const GridColumn = forwardRef<GridColumnProps>((props, ref): ReactElement => {
    const {
        as: Component = 'div',
        gap,
        maxColumns,
        itemMinWidth,
        children,
        className,
        style = {},
        ...forwardedProps
    } = props;

    return (
        <Component
            {...forwardedProps}
            ref={ref as React.Ref<any>}
            className={classNames(className, CLASSNAME)}
            style={{
                ...style,
                ['--lumx-grid-column-item-min-width' as any]: isInteger(itemMinWidth) && `${itemMinWidth}px`,
                ['--lumx-grid-column-columns' as any]: maxColumns,
                ['--lumx-grid-column-gap' as any]: gap && `var(--lumx-spacing-unit-${gap})`,
            }}
        >
            {children}
        </Component>
    );
});
GridColumn.displayName = COMPONENT_NAME;
GridColumn.className = CLASSNAME;
GridColumn.defaultProps = DEFAULT_PROPS;
