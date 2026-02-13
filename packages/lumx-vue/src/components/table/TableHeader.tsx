import { defineComponent, useAttrs } from 'vue';
import {
    TableHeader as TableHeaderUI,
    type TableHeaderProps as UIProps,
} from '@lumx/core/js/components/Table/TableHeader';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type TableHeaderProps = VueToJSXProps<UIProps>;

const TableHeader = defineComponent(
    (props: TableHeaderProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            return (
                <TableHeaderUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxTableHeader',
        inheritAttrs: false,
        props: keysOf<TableHeaderProps>()('class'),
    },
);

export default TableHeader;
