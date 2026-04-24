import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

import {
    ComboboxInput as UI,
    ComboboxInputProps as UIProps,
    ComboboxInputPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxInput';
import { setupComboboxInput } from '@lumx/core/js/components/Combobox/setupComboboxInput';

import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import type { TextFieldProps } from '../text-field/TextField';
import { TextField } from '../text-field';
import { IconButton } from '../button';
import type { IconButtonProps } from '../button/IconButton';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxEvent } from './context/useComboboxEvent';
import { useComboboxOpen } from './context/useComboboxOpen';

/**
 * Props for Combobox.Input component.
 * Note: role, aria-autocomplete, aria-controls, aria-expanded are set internally and cannot be overridden.
 */
export interface ComboboxInputProps extends TextFieldProps, VueToJSXProps<UIProps, ComboboxInputPropsToOverride> {
    /**
     * Props for the toggle button.
     * When provided, a chevron button will be rendered in the text field's afterElement
     * to toggle the listbox visibility.
     */
    toggleButtonProps?: Pick<IconButtonProps, 'label'> & Partial<Omit<IconButtonProps, 'label'>>;
}

/**
 * Combobox.Input component - wraps TextField with combobox ARIA attributes.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxInput = defineComponent(
    (props: ComboboxInputProps, { emit, attrs }) => {
        const className = useClassName(() => props.class);
        const { listboxId, anchorRef, setHandle, handle } = useComboboxContext();
        const { isOpen, setIsOpen } = useComboboxOpen();

        const inputEl = ref<HTMLInputElement | null>(null);

        // Get the input element from the TextField component after mount
        onMounted(() => {
            const input = inputEl.value;
            if (!input) return;

            setHandle(
                setupComboboxInput(input, {
                    onSelect(option) {
                        // Update controlled value through Vue's emit flow.
                        emit('change', option.value);
                        props.onSelect?.(option);
                        emit('select', option);
                    },
                    filter: props.filter,
                    openOnFocus: props.openOnFocus,
                }),
            );
        });

        onUnmounted(() => {
            handle.value?.destroy();
            setHandle(null);
        });

        // Track whether the option list is empty to disable the toggle button.
        const optionsState = useComboboxEvent('optionsChange', undefined);

        const handleToggle = () => {
            if (optionsState.value?.optionsLength === 0) return;
            setIsOpen(!isOpen.value);
            inputEl.value?.focus();
        };

        return () => {
            const {
                toggleButtonProps,
                onSelect: _onSelect,
                filter,
                openOnFocus: _oof,
                class: _class,
                ...forwardedProps
            } = props;

            // Event handlers are framework-specific and forwarded through the core template's
            // spread to the TextField adapter. They are not in the core ComboboxInputProps type.
            const eventHandlers = {
                onChange: (value: string, name?: string, event?: Event) => emit('change', value, name, event),
                onInput: (value: string) => emit('change', value),
                onFocus: (event?: FocusEvent) => emit('focus', event),
                onBlur: (event?: FocusEvent) => emit('blur', event),
                onClear: (event?: MouseEvent) => emit('clear', event),
            };

            // Vue normalizes 'aria-disabled' prop to camelCase 'ariaDisabled'.
            // Re-map it to kebab-case for the core template which expects 'aria-disabled'.
            const { ariaDisabled: fwdAriaDisabled, ...restForwardedProps } = forwardedProps as any;

            return UI(
                {
                    ...attrs,
                    ...restForwardedProps,
                    'aria-disabled': fwdAriaDisabled ?? (attrs as any).ariaDisabled,
                    ...eventHandlers,
                    listboxId,
                    isOpen: isOpen.value,
                    filter,
                    textFieldRef: (el: HTMLElement | null) => {
                        anchorRef.value = el;
                        props.textFieldRef?.(el);
                    },
                    inputRef: (el: HTMLInputElement | null) => {
                        inputEl.value = el;
                        props.inputRef?.(el);
                    },
                    toggleButtonProps,
                    handleToggle,
                    className: className.value,
                },
                { TextField, IconButton },
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
            'inputRef',
            'textFieldRef',
            'toggleButtonProps',
            'onSelect',
            'filter',
            'openOnFocus',
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
