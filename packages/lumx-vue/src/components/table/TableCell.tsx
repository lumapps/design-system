import { defineComponent } from 'vue';
import {
    TableCell as TableCellUI,
    type TableCellProps as UIProps,
    ThOrder,
    TableCellVariant,
} from '@lumx/core/js/components/Table/TableCell';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export { ThOrder, TableCellVariant };
export type {
    ThOrder as ThOrderType,
    TableCellVariant as TableCellVariantType,
} from '@lumx/core/js/components/Table/TableCell';

export type TableCellProps = VueToJSXProps<UIProps, 'onHeaderClick'>;

export const emitSchema = {
    headerClick: () => true,
};

const TableCell = defineComponent(
    (props: TableCellProps, { emit, slots, attrs }) => {
        const handleHeaderClick = () => {
            event?.stopImmediatePropagation();
            emit('headerClick');
        };

        return () => {
            // Check if there's a listener for headerClick event
            // In Vue 3 with JSX, event listeners in attrs have 'on' prefix
            const hasHeaderClickListener = 'onHeaderClick' in attrs;

            return (
                <TableCellUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    // Pass handler if there's a listener, so core component creates button wrapper
                    onHeaderClick={hasHeaderClickListener ? handleHeaderClick : undefined}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxTableCell',
        inheritAttrs: false,
        props: keysOf<TableCellProps>()('class', 'icon', 'isSortable', 'sortOrder', 'variant'),
        emits: emitSchema,
    },
);

export default TableCell;
