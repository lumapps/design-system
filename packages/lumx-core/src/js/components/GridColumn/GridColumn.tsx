import isInteger from 'lodash/isInteger';
import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';

export type GridColumnGapSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface GridColumnProps extends HasClassName {
    /** Customize the root element. */
    as?: any;
    /** Children elements. */
    children?: JSXElement;
    /** Space between columns and rows. */
    gap?: GridColumnGapSize;
    /** Ideal number of columns. */
    maxColumns?: number;
    /** Minimum width for each item, reduce the number of column if there is not enough space. */
    itemMinWidth?: number;
    /** Custom styles. */
    style?: any;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'GridColumn';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-grid-column';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<GridColumnProps> = {};

/**
 * The GridColumn is a layout component that can display children in a grid
 * with custom display properties. It also comes with a responsive design,
 * with a number of column that reduce when there is not enough space for each item.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const GridColumn = (props: GridColumnProps) => {
    const {
        as: Component = 'div',
        gap,
        maxColumns,
        itemMinWidth,
        children,
        className,
        style = {},
        ref,
        ...forwardedProps
    } = props;

    return (
        <Component
            {...forwardedProps}
            ref={ref}
            className={classNames.join(className, CLASSNAME)}
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
};

GridColumn.displayName = COMPONENT_NAME;
GridColumn.className = CLASSNAME;
GridColumn.defaultProps = DEFAULT_PROPS;
