import { defineComponent, useAttrs } from 'vue';
import {
    TableBody as UI,
    type TableBodyProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Table/TableBody';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type TableBodyProps = VueToJSXProps<UIProps>;

const TableBody = defineComponent(
    (props: TableBodyProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () => {
            return <UI {...props} {...attrs} className={className.value} children={slots.default?.() as JSXElement} />;
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TableBodyProps>()('class'),
    },
);

export default TableBody;
