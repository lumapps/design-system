import { computed, defineComponent, ref, useAttrs, watch } from 'vue';

import {
    Checkbox as CheckboxUI,
    type CheckboxProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    INTERMEDIATE_STATE,
} from '@lumx/core/js/components/Checkbox';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useId } from '../../composables/useId';

export type CheckboxProps = VueToJSXProps<UIProps, 'inputId' | 'inputRef'>;

export const emitSchema = {
    change: (isChecked: boolean, value?: string, name?: string, event?: Event) =>
        typeof isChecked === 'boolean' && event instanceof Event,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS, INTERMEDIATE_STATE };

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Checkbox = defineComponent(
    (props: CheckboxProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const generatedInputId = useId();
        const inputId = computed(() => props.id || generatedInputId);
        const localInputRef = ref<HTMLInputElement | null>(null);

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const intermediateState = computed(() => props.isChecked === INTERMEDIATE_STATE);

        // Handle indeterminate property on the native input element
        watch(
            intermediateState,
            (isIntermediate) => {
                if (localInputRef.value) {
                    localInputRef.value.indeterminate = isIntermediate;
                }
            },
            { immediate: true },
        );

        const handleChange = (isChecked: boolean, value?: string, name?: string, event?: any) => {
            if (isAnyDisabled.value) {
                return;
            }

            // IMPORTANT: Prevent double event emission when using JSX syntax.
            // Vue's JSX transform treats props starting with 'on' (e.g., onChange) as both:
            // 1. A prop passed to the component
            // 2. An automatic event listener for matching emitted events
            // Without stopImmediatePropagation, the 'change' event would be emitted twice:
            // - Once when the core component calls the onChange prop
            // - Again when Vue's event system catches the emitted 'change' event
            event?.stopImmediatePropagation?.();
            emit('change', isChecked, value, name, event);
        };

        return () => {
            return (
                <CheckboxUI
                    {...otherProps.value}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    inputId={inputId.value}
                    inputRef={localInputRef}
                    isDisabled={isAnyDisabled.value}
                    onChange={handleChange}
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
        name: 'Checkbox',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<CheckboxProps>()(
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

export default Checkbox;
