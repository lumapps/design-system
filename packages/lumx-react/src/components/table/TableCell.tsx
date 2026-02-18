import {
    TableCell as UI,
    TableCellProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ThOrder,
    TableCellVariant,
} from '@lumx/core/js/components/Table/TableCell';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export { ThOrder, TableCellVariant };
export type {
    ThOrder as ThOrderType,
    TableCellVariant as TableCellVariantType,
} from '@lumx/core/js/components/Table/TableCell';

/**
 * Defines the props of the component.
 */
export interface TableCellProps extends GenericProps, ReactToJSX<UIProps> {
    /** On header cell click callback. */
    onHeaderClick?: () => void;
}

/**
 * TableCell component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableCell = forwardRef<TableCellProps, HTMLTableCellElement>((props, ref) => {
    const { onHeaderClick, ...otherProps } = props;

    return UI({
        ref,
        ...otherProps,
        handleClick: onHeaderClick,
    });
});

TableCell.displayName = COMPONENT_NAME;
TableCell.className = CLASSNAME;
TableCell.defaultProps = DEFAULT_PROPS;
