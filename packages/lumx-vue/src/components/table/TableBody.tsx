import { defineComponent, useAttrs } from 'vue';
import { TableBody as UI, type TableBodyProps as UIProps } from '@lumx/core/js/components/Table/TableBody';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type TableBodyProps = VueToJSXProps<UIProps>;

const TableBody = defineComponent(
    (props: TableBodyProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            return <UI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />;
        };
    },
    {
        name: 'LumxTableBody',
        inheritAttrs: false,
        props: keysOf<TableBodyProps>()('class'),
    },
);

export default TableBody;
