import { defineComponent } from 'vue';
import {
    TableCell as UI,
    type TableCellProps as UIProps,
    ThOrder,
    TableCellVariant,
} from '@lumx/core/js/components/Table/TableCell';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';
import { useHasEventListener } from '@lumx/vue/composables/useHasEventListener';

export { ThOrder, TableCellVariant };
export type {
    ThOrder as ThOrderType,
    TableCellVariant as TableCellVariantType,
} from '@lumx/core/js/components/Table/TableCell';

export type TableCellProps = VueToJSXProps<UIProps>;

export const emitSchema = {
    headerClick: () => true,
};

const TableCell = defineComponent(
    (props: TableCellProps, { emit, slots, attrs }) => {
        const handleHeaderClick = () => {
            emit('headerClick');
        };

        const hasClickListener = useHasEventListener('onHeaderClick');

        return () => {
            return (
                <UI
                    {...props}
                    {...attrs}
                    className={props.class}
                    // Pass handler if sortable or if there's a listener
                    handleClick={hasClickListener ? handleHeaderClick : undefined}
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
