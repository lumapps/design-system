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
import { useClassName } from '../../composables/useClassName';
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
export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keypress: (_event?: KeyboardEvent) => true,
};

const Tab = defineComponent(
    (props: TabProps, { emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { isAnyDisabled } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));
        const tabState = useTabProviderContext('tab', props.id as string | undefined);
        const isActive = computed(() => props.isActive || tabState.value?.isActive);

        const handleFocus = (event: FocusEvent) => emit('focus', event);
        const handleKeyPress = (event: KeyboardEvent) => emit('keypress', event);

        return () => {
            return (
                <TabUI
                    {...attrs}
                    id={props.id}
                    className={className.value}
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
                    handleFocus={handleFocus}
                    handleKeyPress={handleKeyPress}
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
        emits: emitSchema,
    },
);

export default Tab;
