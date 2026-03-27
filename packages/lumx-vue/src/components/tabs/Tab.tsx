import { computed, defineComponent, useAttrs } from 'vue';

import {
    Tab as TabUI,
    type TabProps as UIProps,
    type TabPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Tabs/Tab';

import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Icon } from '../icon';
import { Text } from '../text';
import { useTabProviderContext } from './state';

export type TabProps = VueToJSXProps<UIProps, TabPropsToOverride>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Tab = defineComponent(
    (props: TabProps) => {
        const attrs = useAttrs();
        const { isAnyDisabled } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));
        const tabState = useTabProviderContext('tab', props.id as string | undefined);
        const isActive = computed(() => props.isActive || tabState.value?.isActive);

        return () => {
            const { onFocus, onKeypress, onKeyPress, ...restAttrs } = attrs as any;
            return (
                <TabUI
                    {...restAttrs}
                    id={props.id}
                    className={props.class}
                    icon={props.icon}
                    iconProps={props.iconProps}
                    label={props.label}
                    isActive={isActive.value}
                    isAnyDisabled={isAnyDisabled.value}
                    isDisabled={props.isDisabled}
                    shouldActivateOnFocus={tabState.value?.shouldActivateOnFocus}
                    changeToTab={tabState.value?.changeToTab}
                    tabId={tabState.value?.tabId}
                    tabPanelId={tabState.value?.tabPanelId}
                    handleFocus={(event: FocusEvent) => (onFocus as any)?.(event)}
                    handleKeyPress={(event: KeyboardEvent) => ((onKeypress || onKeyPress) as any)?.(event)}
                    keyPressProp="onKeypress"
                    tabIndexProp="tabindex"
                    Icon={Icon}
                    Text={Text}
                />
            );
        };
    },
    {
        name: 'LumxTab',
        inheritAttrs: false,
        props: keysOf<TabProps>()('icon', 'iconProps', 'id', 'isActive', 'isDisabled', 'label', 'class'),
    },
);

export default Tab;
