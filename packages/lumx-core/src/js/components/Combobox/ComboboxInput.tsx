import { mdiChevronUp, mdiChevronDown } from '@lumx/icons';
import type { CommonRef, HasClassName, HasTheme, LumxClassName } from '../../types';
import { getDisabledState } from '../../utils/disabledState';

/**
 * Defines the props for the core ComboboxInput template.
 */
export interface ComboboxInputProps extends HasClassName, HasTheme {
    /** The ID of the listbox element (for aria-controls). */
    listboxId?: string;
    /** Whether the combobox is open. */
    isOpen?: boolean;
    /** ref to the root element. */
    ref?: CommonRef;
    /** Reference to the input element. */
    inputRef?: CommonRef;
    /** Reference to the text field wrapper element. */
    textFieldRef?: CommonRef;
    /** Props for the toggle button (when provided, a chevron button is rendered). */
    toggleButtonProps?: Record<string, any>;
    /** Toggle callback for the chevron button. */
    handleToggle?(): void;
    /**
     * Controls how the combobox filters options as the user types.
     * When `'off'`, the input is rendered as `readOnly`.
     */
    filter?: 'auto' | 'manual' | 'off';
}

/**
 * Injected framework-specific components for ComboboxInput rendering.
 */
export interface ComboboxInputComponents {
    /** TextField component (framework-specific, e.g. React TextField with controlled input). */
    TextField: any;
    /** IconButton component (framework-specific, e.g. React IconButton with theme/disabled). */
    IconButton: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxInput';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-input';

/**
 * ComboboxInput core template.
 * Renders a TextField with combobox ARIA attributes and an optional toggle button.
 *
 * Framework-specific components (TextField, IconButton) are passed as a second argument
 * by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const ComboboxInput = (props: ComboboxInputProps, { TextField, IconButton }: ComboboxInputComponents) => {
    const {
        listboxId,
        isOpen,
        ref,
        inputRef,
        textFieldRef,
        toggleButtonProps,
        handleToggle,
        filter,
        theme,
        ...forwardedProps
    } = props;

    // Compute whether the combobox is disabled (native or aria-disabled).
    const disabledState = getDisabledState(undefined, props);
    const isAnyDisabled = disabledState.disabled || disabledState['aria-disabled'] || undefined;

    return (
        <TextField
            autoComplete="off"
            readOnly={filter === 'off' || undefined}
            {...forwardedProps}
            ref={ref}
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={isOpen}
            inputRef={inputRef}
            textFieldRef={textFieldRef}
            theme={theme}
            afterElement={
                toggleButtonProps ? (
                    <IconButton
                        {...toggleButtonProps}
                        theme={theme}
                        isDisabled={isAnyDisabled}
                        emphasis="low"
                        size="s"
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        tabIndex={-1}
                        aria-controls={listboxId}
                        aria-expanded={isOpen}
                        onClick={handleToggle}
                    />
                ) : undefined
            }
        />
    );
};
