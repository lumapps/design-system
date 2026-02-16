import { defineComponent, useAttrs } from 'vue';
import { Table as TableUI, type TableProps as UIProps } from '@lumx/core/js/components/Table';
import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type TableProps = VueToJSXProps<UIProps>;

const Table = defineComponent(
    (props: TableProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <TableUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxTable',
        inheritAttrs: false,
        props: keysOf<TableProps>()('class', 'hasBefore', 'hasDividers', 'theme'),
    },
);

export default Table;
