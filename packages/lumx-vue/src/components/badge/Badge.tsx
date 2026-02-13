import { defineComponent, useAttrs } from 'vue';

import { Badge as BadgeUI, type BadgeProps as UIProps } from '@lumx/core/js/components/Badge';
import { type JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type BadgeProps = VueToJSXProps<UIProps>;

/**
 * Badge component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Badge = defineComponent(
    (props: BadgeProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <BadgeUI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: 'LumxBadge',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<BadgeProps>()('color', 'class'),
    },
);

export default Badge;
