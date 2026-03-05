import { defineComponent, useAttrs } from 'vue';

import {
    ListDivider as ListDividerUI,
    type ListDividerProps as UIProps,
} from '@lumx/core/js/components/List/ListDivider';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ListDividerProps = VueToJSXProps<UIProps>;

/**
 * ListDivider component.
 * Purely decorative, consider a `ListSection` with label for a better list structure.
 *
 * @return Vue element.
 */
const ListDivider = defineComponent(
    (props: ListDividerProps) => {
        const attrs = useAttrs();

        return () => <ListDividerUI {...attrs} className={props.class} />;
    },
    {
        name: 'LumxListDivider',
        inheritAttrs: false,
        props: keysOf<ListDividerProps>()('class'),
    },
);

export default ListDivider;
