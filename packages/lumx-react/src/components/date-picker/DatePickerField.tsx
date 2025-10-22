import React, { SyntheticEvent, useCallback, useRef } from 'react';

import { DatePicker, IconButtonProps, Placement, PopoverDialog, TextField, TextFieldProps } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { getCurrentLocale } from '@lumx/react/utils/locale/getCurrentLocale';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

/**
 * Defines the props of the component.
 */
export interface DatePickerFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'>, GenericProps {
    /** Default month. */
    defaultMonth?: Date;
    /** Locale (language or region) to use. */
    locale?: string;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Props to pass to the next month button (minus those already set by the DatePickerControlled props). */
    nextButtonProps: Pick<IconButtonProps, 'label'> & Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Props to pass to the previous month button (minus those already set by the DatePickerControlled props). */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Currently selected date. */
    value: Date | undefined;
    /** On change callback. */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DatePickerField';

/**
 * DatePickerField component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerField = forwardRef<DatePickerFieldProps, HTMLDivElement>((props, ref) => {
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        defaultMonth,
        locale = getCurrentLocale(),
        maxDate,
        minDate,
        name,
        nextButtonProps,
        onChange,
        previousButtonProps,
        value,
        ...forwardedProps
    } = otherProps;
    const anchorRef = useRef(null);

    const [isOpen, close, , toggleOpen] = useBooleanState(false);

    const handleKeyboardNav = useCallback(
        (evt: React.KeyboardEvent) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                toggleOpen();
            }
        },
        [toggleOpen],
    );
    const onTextFieldChange = useCallback(
        (textFieldValue: string, textFieldName?: string, event?: SyntheticEvent) => {
            if (!textFieldValue) {
                onChange(undefined, textFieldName, event);
            }
        },
        [onChange],
    );
    const onDatePickerChange = useCallback(
        (newDate?: Date) => {
            onChange(newDate, name);
            close();
        },
        [name, onChange, close],
    );

    // Format date for text field
    const textFieldValue = value?.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) || '';

    const todayOrSelectedDateRef = React.useRef(null);

    return (
        <>
            <TextField
                ref={ref}
                {...forwardedProps}
                name={name}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={textFieldValue}
                onClick={toggleOpen}
                onChange={onTextFieldChange}
                onKeyPress={handleKeyboardNav}
                {...disabledStateProps}
                readOnly
                aria-haspopup="dialog"
            />
            {isOpen ? (
                <PopoverDialog
                    // Can't use `aria-labelledby` targeting the text field label element (not correctly read on some screen readers)
                    aria-label={forwardedProps.label}
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM_START}
                    isOpen={isOpen}
                    onClose={close}
                    // On open, focus the selected day or today
                    focusElement={todayOrSelectedDateRef}
                >
                    <DatePicker
                        locale={locale}
                        maxDate={maxDate}
                        minDate={minDate}
                        value={value}
                        todayOrSelectedDateRef={todayOrSelectedDateRef}
                        onChange={onDatePickerChange}
                        defaultMonth={defaultMonth}
                        nextButtonProps={nextButtonProps}
                        previousButtonProps={previousButtonProps}
                    />
                </PopoverDialog>
            ) : null}
        </>
    );
});
DatePickerField.displayName = COMPONENT_NAME;
