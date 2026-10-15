import { defineComponent, useAttrs } from 'vue';

import {
    ScrollBox as UI,
    type ScrollBoxProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/ScrollBox';
import type { JSXElement } from '@lumx/core/js/types';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

/** The inline `style` and the `tabIndex` flow through the attrs. */
export type ScrollBoxProps = VueToJSXProps<UIProps, 'style' | 'tabIndex'>;

export { CLASSNAME, COMPONENT_NAME };

/**
 * ScrollBox component (internal, not exported from the package): a vertical flex box whose content scrolls on the y axis.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ScrollBox = defineComponent(
    (props: ScrollBoxProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () =>
            UI({
                ...attrs,
                ...props,
                className: className.value,
                children: slots.default?.() as JSXElement,
            });
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ScrollBoxProps>()('fillSpace', 'scrollSnap', 'class'),
    },
);

export default ScrollBox;
