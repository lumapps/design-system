import React, { forwardRef, SyntheticEvent, useCallback, useRef, useState } from 'react';

import { DatePicker, IconButtonProps, Placement, Popover, TextField } from '@lumx/react';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { Comp, GenericProps } from '@lumx/react/utils/type';
import { getCurrentLocale } from '@lumx/react/utils/locale/getCurrentLocale';

/**
 * Defines the props of the component.
 */
export interface DatePickerFieldProps extends GenericProps {
    /** Default month. */
    defaultMonth?: Date;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Locale (language or region) to use. */
    locale?: string;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Native input name property. */
    name?: string;
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
export const DatePickerField: Comp<DatePickerFieldProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        defaultMonth,
        disabled,
        isDisabled = disabled,
        locale = getCurrentLocale(),
        maxDate,
        minDate,
        name,
        nextButtonProps,
        onChange,
        previousButtonProps,
        value,
        ...forwardedProps
    } = props;
    const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(null);
    const anchorRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSimpleMenu = () => {
        setIsOpen(!isOpen);
    };

    const onClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    useFocus(anchorRef.current, isOpen);
    const handleKeyboardNav = (evt: React.KeyboardEvent) => {
        if ((evt.key === 'Enter' || evt.key === ' ') && toggleSimpleMenu) {
            toggleSimpleMenu();
        }
    };

    // Handle focus trap.
    const [todayOrSelectedDate, setTodayOrSelectedDate] = useState<HTMLButtonElement | null>(null);
    useFocusTrap(isOpen && wrapperElement, todayOrSelectedDate);

    const onTextFieldChange = (textFieldValue: string, textFieldName?: string, event?: SyntheticEvent) => {
        if (!textFieldValue) {
            onChange(undefined, textFieldName, event);
        }
    };

    const onDatePickerChange = (newDate?: Date) => {
        onChange(newDate, name);
        onClose();
    };

    // Format date for text field
    const textFieldValue = value?.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) || '';

    return (
        <>
            <TextField
                ref={ref}
                {...forwardedProps}
                name={name}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={textFieldValue}
                onClick={toggleSimpleMenu}
                onChange={onTextFieldChange}
                onKeyPress={handleKeyboardNav}
                isDisabled={isDisabled}
                readOnly
            />
            {isOpen ? (
                <Popover
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM_START}
                    isOpen={isOpen}
                    onClose={onClose}
                    closeOnClickAway
                    closeOnEscape
                >
                    <DatePicker
                        ref={setWrapperElement}
                        locale={locale}
                        maxDate={maxDate}
                        minDate={minDate}
                        value={value}
                        onChange={onDatePickerChange}
                        todayOrSelectedDateRef={setTodayOrSelectedDate}
                        defaultMonth={defaultMonth}
                        nextButtonProps={nextButtonProps}
                        previousButtonProps={previousButtonProps}
                    />
                </Popover>
            ) : null}
        </>
    );
});
DatePickerField.displayName = COMPONENT_NAME;
