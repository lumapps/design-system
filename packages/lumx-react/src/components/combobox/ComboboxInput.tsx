import { type Ref, useCallback, useEffect, useRef } from 'react';

import { setupComboboxInput } from '@lumx/core/js/components/Combobox/setupComboboxInput';
import { ComboboxInput as UI, COMPONENT_NAME, CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxInput';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { IconButton, IconButtonProps } from '../button';
import { TextField, TextFieldProps } from '../text-field';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';

/**
 * Props for Combobox.Input component.
 * Note: role, aria-autocomplete, aria-controls, aria-expanded are set internally and cannot be overridden.
 */
export interface ComboboxInputProps extends TextFieldProps {
    /** Reference to the input element. */
    inputRef?: Ref<HTMLInputElement>;
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
     * Each `Combobox.Option` registers itself and hides when it doesn't match the input value.
     *
     * Set to false when you handle filtering yourself (e.g. async search, consumer-side
     * pre-filtering). Options will not be auto-filtered.
     */
    autoFilter?: boolean;
}

/**
 * Combobox.Input component - wraps TextField with combobox ARIA attributes
 * and optionally includes a toggle button.
 *
 * @param props Component props.
 * @param ref   Component ref (will be forwarded to the anchor ref for popover positioning).
 * @return React element.
 */
export const ComboboxInput = forwardRef<ComboboxInputProps, HTMLDivElement>((props, ref) => {
    const { listboxId, anchorRef, setHandle } = useComboboxContext();
    const [isOpen, setIsOpen] = useComboboxOpen();
    const { inputRef: externalInputRef, toggleButtonProps, onSelect, autoFilter, ...otherProps } = props;
    const internalInputRef = useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergeRefs(externalInputRef, internalInputRef);

    // Keep callbacks in refs to avoid re-creating the handle on every render
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    const onChangeRef = useRef(otherProps.onChange);
    onChangeRef.current = otherProps.onChange;

    // Create the combobox handle with input-mode controller on mount
    useEffect(() => {
        const input = internalInputRef.current;
        if (!input) return undefined;
        const handle = setupComboboxInput(input, {
            onSelect(option) {
                // Update controlled value through React's normal onChange flow.
                onChangeRef.current?.(option.value);
                onSelectRef.current?.(option);
            },
            autoFilter,
        });
        setHandle(handle);
        return () => {
            handle.destroy();
            setHandle(null);
        };
    }, [autoFilter, setHandle]);

    const handleToggle = useCallback(() => {
        setIsOpen(!isOpen);
        internalInputRef.current?.focus();
    }, [internalInputRef, isOpen, setIsOpen]);

    return UI(
        {
            ...otherProps,
            ref,
            listboxId,
            isOpen,
            inputRef: mergedInputRef,
            textFieldRef: anchorRef as Ref<HTMLDivElement>,
            toggleButtonProps,
            handleToggle,
        },
        { TextField, IconButton },
    );
});

ComboboxInput.displayName = COMPONENT_NAME;
ComboboxInput.className = CLASSNAME;
