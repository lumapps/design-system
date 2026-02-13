import {
    TableCell as TableCellUI,
    TableCellProps as TableCellUIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ThOrder,
    TableCellVariant,
} from '@lumx/core/js/components/Table/TableCell';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export { ThOrder, TableCellVariant };
export type {
    ThOrder as ThOrderType,
    TableCellVariant as TableCellVariantType,
} from '@lumx/core/js/components/Table/TableCell';

/**
 * Defines the props of the component.
 */
export interface TableCellProps extends GenericProps, Omit<TableCellUIProps, 'ref'> {
    /** Children */
    children?: React.ReactNode;
}

/**
 * TableCell component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableCell = forwardRef<TableCellProps, HTMLTableCellElement>((props, ref) => {
    const { children, ...otherProps } = props;

    return TableCellUI({
        ref,
        children,
        ...otherProps,
    });
});

TableCell.displayName = COMPONENT_NAME;
TableCell.className = CLASSNAME;
TableCell.defaultProps = DEFAULT_PROPS;
