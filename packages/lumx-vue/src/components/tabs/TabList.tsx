import { defineComponent, inject, ref, useAttrs, useSlots } from 'vue';

import {
    TabList as TabListUI,
    type TabListProps as UIProps,
    type TabListPropsToOverride,
    TabListLayout,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Tabs/TabList';
import { TABS_CLASSNAME as CLASSNAME } from '@lumx/core/js/components/Tabs/constants';
import { type JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { useRovingTabIndexContainer } from '../../composables/useRovingTabIndexContainer';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { TAB_PROVIDER_INJECT_KEY } from './state';

// aria-label is excluded from declared Vue props — Vue treats aria-* as attrs,
// so it flows through the {..attrs} spread to the core component.
type InternalProps = VueToJSXProps<UIProps, 'aria-label' | TabListPropsToOverride>;

/** Public props type (includes aria-label for TypeScript consumers). */
export type TabListProps = InternalProps & { 'aria-label': string };

export { TabListLayout, CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * TabList component.
 *
 * Implements WAI-ARIA `tablist` role, or a `role="navigation"` landmark when used outside a
 * `TabProvider` (nav-link mode).
 *
 * @param  props Component props.
 * @return Vue element.
 */
const TabList = defineComponent(
    (props: InternalProps) => {
        const attrs = useAttrs();
        const slots = useSlots();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);
        const containerRef = ref<HTMLElement | null>(null);
        const role = inject(TAB_PROVIDER_INJECT_KEY, undefined) === undefined ? 'navigation' : 'tablist';

        // Classic mode: roving tabindex over `role="tab"` items — naturally inert in nav-link mode
        // since nav links carry no `role="tab"` and keep their native per-link Tab stops.
        useRovingTabIndexContainer({
            containerRef: role === 'navigation' ? ref<HTMLElement | null>(null) : containerRef,
            itemSelector: '[role="tab"]',
        });

        return () => {
            const children = slots.default?.();

            return (
                <TabListUI
                    {...attrs}
                    ref={containerRef}
                    aria-label={attrs['aria-label'] as string}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    layout={props.layout}
                    position={props.position}
                    role={role}
                    children={children as JSXElement}
                />
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<InternalProps>()('layout', 'position', 'theme', 'class'),
    },
);

export default TabList;
