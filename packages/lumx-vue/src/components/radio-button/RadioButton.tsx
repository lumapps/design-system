import { computed, defineComponent, useAttrs } from 'vue';

import {
    RadioButton as RadioButtonUI,
    type RadioButtonProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/RadioButton';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useId } from '../../composables/useId';

export type RadioButtonProps = VueToJSXProps<UIProps, 'inputId' | 'inputRef'>;

export const emitSchema = {
    change: (value?: string, name?: string, event?: Event) => event instanceof Event,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * RadioButton component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const RadioButton = defineComponent(
    (props: RadioButtonProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const generatedInputId = useId();
        const inputId = computed(() => props.id || generatedInputId);

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleChange = (value?: string, name?: string, event?: any) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('change', value, name, event);
        };

        return () => {
            return (
                <RadioButtonUI
                    {...otherProps.value}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    inputId={inputId.value}
                    isDisabled={isAnyDisabled.value}
                    handleChange={handleChange}
                    label={props.label}
                    inputProps={{
                        ...props.inputProps,
                        ...disabledStateProps.value,
                        readOnly: disabledStateProps.value['aria-disabled'],
                    }}
                />
            );
        };
    },
    {
        name: 'RadioButton',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<RadioButtonProps>()(
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
            'theme',
            'value',
            'aria-disabled',
        ),
        emits: emitSchema,
    },
);

export default RadioButton;
