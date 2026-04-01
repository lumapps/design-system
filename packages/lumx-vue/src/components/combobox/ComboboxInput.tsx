import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

import { ComboboxInput as UI, COMPONENT_NAME, CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxInput';
import { setupComboboxInput } from '@lumx/core/js/components/Combobox/setupComboboxInput';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import type { TextFieldProps } from '../text-field/TextField';
import { TextField } from '../text-field';
import { IconButton } from '../button';
import type { IconButtonProps } from '../button/IconButton';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';

/**
 * Adapter: maps core's `className` prop to Vue's `class` prop for the TextField.
 */
const TextFieldAdapter = (p: any) => {
    const { className, ...rest } = p;
    return <TextField class={className} {...rest} />;
};

/**
 * Adapter: maps core's `className` prop to Vue's `class` prop for the IconButton.
 * Also maps `tabIndex` to lowercase `tabindex` for Vue compatibility.
 */
const IconButtonAdapter = (p: any) => {
    const { className, tabIndex, ...rest } = p;
    return <IconButton class={className} tabindex={tabIndex} {...rest} />;
};

/**
 * Props for Combobox.Input component.
 * Note: role, aria-autocomplete, aria-controls, aria-expanded are set internally and cannot be overridden.
 */
export type ComboboxInputProps = VueToJSXProps<TextFieldProps, 'inputRef' | 'textFieldRef'> & {
    /**
     * Props for the toggle button.
     * When provided, a chevron button will be rendered in the text field's afterElement
     * to toggle the listbox visibility.
     */
    toggleButtonProps?: Pick<IconButtonProps, 'label'> & Partial<Omit<IconButtonProps, 'label'>>;
    /** Called when an option is selected. */
    onSelect?: (option: { value: string }) => void;
    /**
     * When true (default), the combobox automatically filters options as the user types.
     * Set to false when you handle filtering yourself (e.g. async search).
     */
    autoFilter?: boolean;
};

/**
 * Combobox.Input component - wraps TextField with combobox ARIA attributes.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxInput = defineComponent(
    (props: ComboboxInputProps, { emit, attrs }) => {
        const { listboxId, anchorRef, setHandle, handle } = useComboboxContext();
        const { isOpen, setIsOpen } = useComboboxOpen();

        const inputEl = ref<HTMLInputElement | null>(null);
        const textFieldEl = ref<HTMLElement | null>(null);

        // Sync the anchor ref when the text field element is set (via the adapter ref callback).
        watch(
            textFieldEl,
            (el) => {
                anchorRef.value = el;
            },
            { flush: 'sync' },
        );

        // Native input event handler (stored for cleanup)
        let nativeInputCleanup: (() => void) | undefined;

        // Get the input element from the TextField component after mount
        onMounted(() => {
            const input = inputEl.value;
            if (!input) return;

            // In Vue, the native <input onChange> fires on DOM 'change' (blur), not per-keystroke.
            // We add a native 'input' listener to emit 'change' on each real user keystroke,
            // keeping the controlled value prop up to date.
            const handleNativeInput = (event: Event) => {
                if (event instanceof InputEvent) {
                    emit('change', (event.target as HTMLInputElement).value);
                }
            };
            input.addEventListener('input', handleNativeInput);
            nativeInputCleanup = () => input.removeEventListener('input', handleNativeInput);

            setHandle(
                setupComboboxInput(input, {
                    onSelect(option) {
                        // Update controlled value through Vue's emit flow.
                        emit('change', option.value);
                        props.onSelect?.(option);
                        emit('select', option);
                    },
                    autoFilter: props.autoFilter,
                }),
            );
        });

        onUnmounted(() => {
            nativeInputCleanup?.();
            handle.value?.destroy();
            setHandle(null);
        });

        const handleToggle = () => {
            setIsOpen(!isOpen.value);
            inputEl.value?.focus();
        };

        return () => {
            const {
                toggleButtonProps,
                onSelect: _onSelect,
                autoFilter: _af,
                class: className,
                ...forwardedProps
            } = props;

            // Event handlers are framework-specific and forwarded through the core template's
            // spread to the TextField adapter. They are not in the core ComboboxInputProps type.
            const eventHandlers = {
                onChange: (value: string, name?: string, event?: Event) => emit('change', value, name, event),
                onFocus: (event?: FocusEvent) => emit('focus', event),
                onBlur: (event?: FocusEvent) => emit('blur', event),
                onClear: (event?: MouseEvent) => emit('clear', event),
            };

            return UI(
                {
                    ...attrs,
                    ...forwardedProps,
                    ...eventHandlers,
                    listboxId,
                    isOpen: isOpen.value,
                    textFieldRef: (el: HTMLElement | null) => {
                        textFieldEl.value = el;
                    },
                    inputRef: (el: HTMLInputElement | null) => {
                        inputEl.value = el;
                    },
                    toggleButtonProps,
                    handleToggle,
                    className,
                },
                { TextField: TextFieldAdapter, IconButton: IconButtonAdapter },
            );
        };
    },
    {
        name: 'LumxComboboxInput',
        inheritAttrs: false,
        props: keysOf<ComboboxInputProps>()(
            'class',
            'theme',
            'value',
            'error',
            'forceFocusStyle',
            'hasError',
            'afterElement',
            'helper',
            'icon',
            'isRequired',
            'isValid',
            'label',
            'labelProps',
            'maxLength',
            'isDisabled',
            'disabled',
            'aria-disabled',
            'multiline',
            'placeholder',
            'id',
            'clearButtonProps',
            'name',
            'type',
            'minimumRows',
            'toggleButtonProps',
            'onSelect',
            'autoFilter',
        ),
        emits: {
            select: (option: { value: string }) => !!option,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            change: (value: string, _name?: string, _event?: Event) => typeof value === 'string',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            focus: (_event?: FocusEvent) => true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            blur: (_event?: FocusEvent) => true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            clear: (_event?: MouseEvent) => true,
        },
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxInput;
