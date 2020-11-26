import { Placement, Popover, TextField } from '@lumx/react';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';

import moment from 'moment';

import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { CLASSNAME, DatePicker } from './DatePicker';

import { useFocus } from '@lumx/react/hooks/useFocus';
import { GenericProps } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DatePickerFieldProps extends GenericProps {
    /** The month to display by default. */
    defaultMonth?: Date;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The locale (language or region) to use. */
    locale: string;
    /** The date after which no date can be selected. */
    maxDate?: Date;
    /** The date before which no date can be selected. */
    minDate?: Date;
    /** The native input name property. */
    name?: string;
    /** The current value of the text field. */
    value: Date | undefined;
    /** The function called on change. */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = 'DatePickerField';

const DatePickerField = ({
    defaultMonth,
    disabled,
    isDisabled = disabled,
    locale,
    maxDate,
    minDate,
    name,
    onChange,
    value,
    ...textFieldProps
}: DatePickerFieldProps) => {
    const wrapperRef = useRef(null);
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
        if ((evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE) && toggleSimpleMenu) {
            toggleSimpleMenu();
        }
    };

    // Handle focus trap.
    const todayOrSelectedDateRef = useRef<HTMLButtonElement>(null);
    useFocusTrap(todayOrSelectedDateRef.current && wrapperRef.current, todayOrSelectedDateRef.current);

    const onTextFieldChange = (textFieldValue: string, textFieldName?: string, event?: SyntheticEvent) => {
        if (!textFieldValue) {
            onChange(undefined, textFieldName, event);
        }
    };

    const onDatePickerChange = (newDate?: Date) => {
        onChange(newDate, name);
        onClose();
    };

    return (
        <>
            <TextField
                {...textFieldProps}
                name={name}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={
                    value
                        ? moment(value)
                              .locale(locale)
                              .format('LL')
                        : ''
                }
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
                    <div ref={wrapperRef}>
                        <DatePicker
                            locale={locale}
                            maxDate={maxDate}
                            minDate={minDate}
                            value={value}
                            onChange={onDatePickerChange}
                            todayOrSelectedDateRef={todayOrSelectedDateRef}
                            defaultMonth={defaultMonth}
                        />
                    </div>
                </Popover>
            ) : null}
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, DatePickerField, DatePickerFieldProps };
