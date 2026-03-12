import { defineComponent, useAttrs } from 'vue';

import { InlineList as InlineListUI, type InlineListProps as UIProps } from '@lumx/core/js/components/InlineList';
import { type JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type InlineListProps = VueToJSXProps<UIProps, 'items'>;

/**
 * InlineList component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const InlineList = defineComponent(
    (props: InlineListProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <InlineListUI {...props} {...attrs} className={props.class} items={slots.default?.() as JSXElement[]} />
        );
    },
    {
        name: 'LumxInlineList',
        inheritAttrs: false,
        props: keysOf<InlineListProps>()('color', 'colorVariant', 'typography', 'wrap', 'class'),
    },
);

export default InlineList;
