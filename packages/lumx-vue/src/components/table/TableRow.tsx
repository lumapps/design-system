import { computed, defineComponent, useAttrs } from 'vue';
import { TableRow as UI, type TableRowProps as UIProps } from '@lumx/core/js/components/Table/TableRow';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type TableRowProps = VueToJSXProps<UIProps, 'tabIndex' | 'aria-disabled'> & {
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
};

const TableRow = defineComponent(
    (props: TableRowProps, { slots }) => {
        const attrs = useAttrs();

        const { isAnyDisabled, otherProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));

        return () => {
            return (
                <UI
                    {...otherProps.value}
                    className={props.class}
                    tabIndex={props.isClickable && !isAnyDisabled.value ? 0 : -1}
                    aria-disabled={isAnyDisabled.value}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxTableRow',
        inheritAttrs: false,
        props: keysOf<TableRowProps>()('class', 'isClickable', 'isDisabled', 'isSelected'),
    },
);

export default TableRow;
