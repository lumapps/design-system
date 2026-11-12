import type { CommonRef, GenericProps } from '../../types';
import { FIELD_COMPONENT_NAME } from './constants';
import type { DatePickerMonthButtonProps } from './DatePicker';

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
    /** Locale (language or region) of the calendar. */
    locale?: string;
    /** Selected date (the calendar `value`). */
    value?: Date;
    /** Date before which days are out of range. */
    minDate?: Date;
    /** Date after which days are out of range. */
    maxDate?: Date;
    /** Month shown first when there is no `value`. */
    defaultMonth?: Date;
    /** Props of the previous month button (`label` required). */
    previousButtonProps: DatePickerMonthButtonProps;
    /** Props of the next month button (`label` required). */
    nextButtonProps: DatePickerMonthButtonProps;
    /** Input text change (typing). */
    handleInputChange(text: string): void;
    /** Dialog close (Escape, click outside). */
    handleClose(): void;
    /** Day pick in the calendar. */
    handleDayPick(date?: Date): void;
    /** Ref callback of the roving day button of the calendar. */
    setRovingDayElement(element: HTMLElement | null): void;
    /** Input `keydown` (see `createDatePickerFieldState`). */
    handleKeyDown(event: any): void;
    /** Input `click`. */
    handleClick(event: any): void;
    /** Input `blur`, before the `onBlur` of the consumer. */
    handleBlur(event: any): void;
    /** Name of the `keydown` handler prop of the framework `TextField` (Vue: `onKeydown`). */
    keyDownProp?: string;
    /** Ref of the root element (the text field). */
    ref?: CommonRef;
    /** Ref of the text field wrapper (the dialog anchor). */
    anchorRef?: CommonRef;
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
 * The input handlers (open keys, click, commit) come from `createDatePickerFieldState`, chained before the
 * `onKeyDown`, `onClick` and `onBlur` of the consumer. The input is an editable combobox with a dialog popup: no `aria-autocomplete` and no
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
        locale,
        value,
        minDate,
        maxDate,
        defaultMonth,
        previousButtonProps,
        nextButtonProps,
        handleInputChange,
        handleClose,
        handleDayPick,
        setRovingDayElement,
        handleKeyDown,
        handleClick,
        handleBlur,
        keyDownProp = 'onKeyDown',
        ref,
        anchorRef,
        focusElement,
        ...forwardedProps
    } = props;
    const { [keyDownProp]: onKeyDown, onClick, onBlur, ...textFieldProps } = forwardedProps;

    return (
        <>
            <TextField
                {...textFieldProps}
                {...{
                    [keyDownProp](event: any) {
                        handleKeyDown(event);
                        onKeyDown?.(event);
                    },
                }}
                onClick={(event: any) => {
                    handleClick(event);
                    onClick?.(event);
                }}
                onBlur={(event: any) => {
                    handleBlur(event);
                    onBlur?.(event);
                }}
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
                    <DatePicker
                        locale={locale}
                        value={value}
                        minDate={minDate}
                        maxDate={maxDate}
                        defaultMonth={defaultMonth}
                        previousButtonProps={previousButtonProps}
                        nextButtonProps={nextButtonProps}
                        todayOrSelectedDateRef={setRovingDayElement}
                        onChange={handleDayPick}
                    />
                </PopoverDialog>
            )}
        </>
    );
};

DatePickerField.displayName = FIELD_COMPONENT_NAME;
