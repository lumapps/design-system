import { defineComponent, useAttrs } from 'vue';

import { List as ListUI, type ListProps as UIProps } from '@lumx/core/js/components/List';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ListProps = VueToJSXProps<UIProps>;

/**
 * List component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const List = defineComponent(
    (props: ListProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <ListUI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: 'LumxList',
        inheritAttrs: false,
        props: keysOf<ListProps>()('itemPadding', 'class'),
    },
);

export default List;
