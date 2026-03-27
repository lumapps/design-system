import { computed, defineComponent, useAttrs, useSlots } from 'vue';

import {
    TabPanel as TabPanelUI,
    type TabPanelProps as UIProps,
    type TabPanelPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Tabs/TabPanel';
import { type JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useTabProviderContext } from './state';

export type TabPanelProps = VueToJSXProps<UIProps, TabPanelPropsToOverride>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * TabPanel component.
 *
 * Implements WAI-ARIA `tabpanel` role.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const TabPanel = defineComponent(
    (props: TabPanelProps) => {
        const attrs = useAttrs();
        const slots = useSlots();
        const tabState = useTabProviderContext('tabPanel', props.id as string | undefined);
        const isActive = computed(() => props.isActive || tabState.value?.isActive);

        return () => (
            <TabPanelUI
                {...attrs}
                className={props.class}
                isActive={isActive.value}
                id={tabState.value?.tabPanelId}
                isLazy={tabState.value?.isLazy}
                tabId={tabState.value?.tabId}
                children={slots.default?.() as JSXElement}
            />
        );
    },
    {
        name: 'LumxTabPanel',
        inheritAttrs: false,
        props: keysOf<TabPanelProps>()('isActive', 'id', 'class'),
    },
);

export default TabPanel;
