import { defineComponent, ref, useAttrs, useSlots } from 'vue';

import {
    TabList as TabListUI,
    type TabListProps as UIProps,
    TabListLayout,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Tabs/TabList';
import { TABS_CLASSNAME as CLASSNAME } from '@lumx/core/js/components/Tabs/constants';
import { type JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { useRovingTabIndexContainer } from '../../composables/useRovingTabIndexContainer';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

// aria-label is excluded from declared Vue props — Vue treats aria-* as attrs,
// so it flows through the {..attrs} spread to the core component.
type InternalProps = VueToJSXProps<UIProps, 'aria-label'>;

/** Public props type (includes aria-label for TypeScript consumers). */
export type TabListProps = InternalProps & { 'aria-label': string };

export { TabListLayout, CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * TabList component.
 *
 * Implements WAI-ARIA `tablist` role.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const TabList = defineComponent(
    (props: InternalProps) => {
        const attrs = useAttrs();
        const slots = useSlots();
        const defaultTheme = useTheme();
        const containerRef = ref<HTMLElement | null>(null);

        useRovingTabIndexContainer({
            containerRef,
            itemSelector: '[role="tab"]',
        });

        return () => (
            <TabListUI
                {...attrs}
                ref={containerRef}
                aria-label={attrs['aria-label'] as string}
                className={props.class}
                theme={props.theme || defaultTheme.value}
                layout={props.layout}
                position={props.position}
                children={slots.default?.() as JSXElement}
            />
        );
    },
    {
        name: 'LumxTabList',
        inheritAttrs: false,
        props: keysOf<InternalProps>()('layout', 'position', 'theme', 'class'),
    },
);

export default TabList;
