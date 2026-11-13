import type { CommonRef, GenericProps } from '../../types';
import { FIELD_COMPONENT_NAME } from './constants';

/**
 * Props of the core `DatePickerField` template (the field shell: the combobox input and the dialog).
 * The other props are forwarded to the `TextField` (label, helper, placeholder, clear button, disabled state…).
 */
export interface DatePickerFieldProps extends GenericProps {
    /** Text of the input (the formatted value, or the text being typed). */
    inputValue: string;
    /** Whether the dialog is open. */
    isOpen: boolean;
    /** Stable ID of the dialog (`aria-controls` of the input). */
    dialogId: string;
    /** Field label (also the dialog name). */
    label?: string;
    /** Field `aria-label` (the dialog name when there is no `label`). */
    'aria-label'?: string;
    /** Input text change (typing). */
    handleInputChange(text: string): void;
    /** Dialog close (Escape, click outside). */
    handleClose(): void;
    /**
     * Props of the injected `DatePicker` component rendered in the dialog (locale, value, range, month buttons, day
     * pick handler…).
     */
    datePickerProps: Record<string, any>;
    /** Ref of the root element (the text field). */
    ref?: CommonRef;
    /** Ref of the text field wrapper (the dialog anchor). */
    anchorRef?: CommonRef;
    /** Ref of the input element (see `createDatePickerFieldState`). */
    inputRef?: CommonRef;
    /** Element to focus when the dialog opens (the roving day button). */
    focusElement?: CommonRef;
}

/** Framework components injected by the React and Vue wrappers. */
export interface DatePickerFieldComponents {
    /** Field input. */
    TextField: any;
    /** Modal dialog. */
    PopoverDialog: any;
    /** Calendar (framework `DatePicker` wrapper). */
    DatePicker: any;
}

/**
 * DatePickerField core template (SPEC 4.1): an editable `role="combobox"` input (`TextField`) that opens a modal
 * `PopoverDialog` holding the `DatePicker`.
 *
 * The input behavior (open keys, click, commit) is set up by `createDatePickerFieldState` on the input element
 * (`inputRef`). The input is an editable combobox with a dialog popup: no `aria-autocomplete` and no
 * `aria-activedescendant` (the dialog owns the focus while it is open). The input is never read-only (a disabled
 * field stays read-only through the `TextField`).
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const DatePickerField = (props: DatePickerFieldProps, components: DatePickerFieldComponents) => {
    const { TextField, PopoverDialog, DatePicker } = components;
    const {
        inputValue,
        isOpen,
        dialogId,
        label,
        'aria-label': ariaLabel,
        handleInputChange,
        handleClose,
        datePickerProps,
        ref,
        anchorRef,
        inputRef,
        focusElement,
        ...forwardedProps
    } = props;

    return (
        <>
            <TextField
                {...forwardedProps}
                ref={ref}
                label={label}
                aria-label={ariaLabel}
                value={inputValue}
                onChange={handleInputChange}
                role="combobox"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={dialogId}
                readOnly={false}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                inputRef={inputRef}
            />
            {isOpen && (
                <PopoverDialog
                    id={dialogId}
                    aria-label={label || ariaLabel}
                    anchorRef={anchorRef}
                    placement="bottom-start"
                    isOpen={isOpen}
                    onClose={handleClose}
                    focusElement={focusElement}
                >
                    <DatePicker {...datePickerProps} />
                </PopoverDialog>
            )}
        </>
    );
};

DatePickerField.displayName = FIELD_COMPONENT_NAME;
