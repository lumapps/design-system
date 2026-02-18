import { computed, defineComponent, useAttrs } from 'vue';

import {
    Switch as SwitchUI,
    type SwitchProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Switch';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useId } from '../../composables/useId';
import { JSXElement } from '@lumx/core/js/types';

export type SwitchProps = VueToJSXProps<UIProps, 'inputId' | 'inputRef'>;

export const emitSchema = {
    change: (isChecked: boolean, value?: string, name?: string, event?: Event) =>
        typeof isChecked === 'boolean' && event instanceof Event,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Switch component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Switch = defineComponent(
    (props: SwitchProps, { emit, slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const generatedInputId = useId();
        const inputId = computed(() => props.id || generatedInputId);

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleChange = (isChecked: boolean, value?: string, name?: string, event?: any) => {
            if (isAnyDisabled.value) {
                return;
            }

            event.stopImmediatePropagation();
            emit('change', isChecked, value, name, event);
        };

        return () => {
            return (
                <SwitchUI
                    {...otherProps.value}
                    {...{ onChange: handleChange }}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    inputId={inputId.value}
                    isDisabled={isAnyDisabled.value}
                    label={(props.label || slots.default?.()) as JSXElement}
                    inputProps={{
                        ...props.inputProps,
                        ...disabledStateProps.value,
                        readOnly: isAnyDisabled.value,
                    }}
                />
            );
        };
    },
    {
        name: 'LumxSwitch',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<SwitchProps>()(
            'checked',
            'class',
            'disabled',
            'helper',
            'id',
            'inputProps',
            'isChecked',
            'isDisabled',
            'label',
            'name',
            'position',
            'theme',
            'value',
            'aria-disabled',
        ),
        emits: emitSchema,
    },
);

export default Switch;
