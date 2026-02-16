import { ReactElement } from 'react';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    GridColumn as UI,
    type GridColumnProps as UIProps,
    type GridColumnGapSize,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/GridColumn';

/**
 * Defines the props of the component.
 */
export interface GridColumnProps extends GenericProps, UIProps {
    /** Customize the root element. */
    as?: React.ElementType;
    /** Children elements. */
    children?: React.ReactNode;
}

// Re-export types for backward compatibility
export type { GridColumnGapSize };

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
    return UI({
        ref,
        ...props,
    }) as ReactElement;
});
GridColumn.displayName = COMPONENT_NAME;
GridColumn.className = CLASSNAME;
GridColumn.defaultProps = DEFAULT_PROPS;
