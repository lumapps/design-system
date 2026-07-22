import { type SlotsType, computed, defineComponent, useAttrs } from 'vue';

import {
    Tab as TabUI,
    type TabProps as UIProps,
    type TabPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Tabs/Tab';
import { classNames } from '@lumx/core/js/utils';

import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useClassName } from '../../composables/useClassName';
import { getName, type HyphenatedAriaProps, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Icon } from '../icon';
import { Text } from '../text';
import { useTabProviderContext } from './state';

export type TabProps = Omit<VueToJSXProps<UIProps, TabPropsToOverride>, HyphenatedAriaProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Tab component.
 *
 * Implements the WAI-ARIA `tab` role inside a `TabProvider`; renders a plain nav-link
 * (`aria-current`, no tab role) outside one.
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
    (props: TabProps, { emit, slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { isAnyDisabled } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));
        const tabState = useTabProviderContext('tab', props.id as string | undefined);
        const isActive = computed(() => props.isActive || tabState.value?.isActive);

        const handleFocus = (event: FocusEvent) => emit('focus', event);
        const handleKeyPress = (event: KeyboardEvent) => emit('keypress', event);

        return () => {
            const { tabId, ...state } = tabState.value || {};
            // Element props
            let elementProps: Record<string, any> = {
                className: className.value,
            };

            // Custom render
            const rendered = slots.action?.();
            const action = Array.isArray(rendered) ? rendered[0] : rendered;
            if (action) {
                const { class: actionClass, ...rest } = action.props || {};
                Object.assign(elementProps, rest);
                elementProps = rest;
                elementProps.as = action.type;
                // merge `class`
                elementProps.className = classNames.join(elementProps.className, actionClass);
            }

            // Invoke core as a function (not JSX) so Vue doesn't also forward `onClick` to the root.
            return TabUI({
                ...attrs,
                ...state,
                ...elementProps,
                // role=tab driven by presence of the TabProvider
                role: tabState.value ? 'tab' : undefined,
                id: tabId || props.id,
                icon: props.icon,
                iconProps: props.iconProps,
                label: props.label,
                isActive: isActive.value,
                isAnyDisabled: isAnyDisabled.value,
                isDisabled: props.isDisabled,
                handleFocus,
                handleKeyPress,
                keyPressProp: 'onKeypress',
                tabIndexProp: 'tabindex',
                Icon,
                Text,
            });
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TabProps>()('icon', 'iconProps', 'id', 'isActive', 'isDisabled', 'label', 'class'),
        emits: emitSchema,
        slots: Object as SlotsType<{
            action: void;
        }>,
    },
);

export default Tab;
