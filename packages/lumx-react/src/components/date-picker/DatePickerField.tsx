import { Placement, Popover, TextField } from '@lumx/react';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { onEscapePressed } from '@lumx/react/utils';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

import moment from 'moment';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { CLASSNAME, DatePicker } from './DatePicker';
import DatePickerValueProp from './DatePickerValueProp';

import { useFocus } from '@lumx/react/hooks/useFocus';
import { GenericProps } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */

interface DatePickerFieldProps extends GenericProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Value. */
    value: DatePickerValueProp;

    /** Month to display by default */
    defaultMonth?: DatePickerValueProp;

    /** On change. */
    onChange(value: moment.Moment | undefined): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = 'DatePickerField';

/**
 * Simple component used to pick a date (ready-to-use wrapped implementation).
 *
 * @return The component.
 */
const DatePickerField = ({
    value,
    locale,
    minDate,
    maxDate,
    defaultMonth,
    onChange,
    ...textFieldProps
}: DatePickerFieldProps) => {
    const wrapperRef = useRef(null);
    const anchorRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSimpleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeSimpleMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const onEscapeHandler = isOpen && onEscapePressed(closeSimpleMenu);

    useFocus(anchorRef.current, isOpen);
    const handleKeyboardNav = (evt: React.KeyboardEvent) => {
        if ((evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE) && toggleSimpleMenu) {
            toggleSimpleMenu();
        }
    };

    useEffect(() => {
        if (!isOpen || !onEscapeHandler || !wrapperRef.current) {
            return;
        }

        window.addEventListener('keydown', onEscapeHandler);
        return () => {
            window.removeEventListener('keydown', onEscapeHandler);
        };
    }, [isOpen, closeSimpleMenu, onEscapeHandler]);

    // Handle focus trap.
    const todayOrSelectedDateRef = useRef<HTMLButtonElement>(null);
    useFocusTrap(todayOrSelectedDateRef.current && wrapperRef.current, todayOrSelectedDateRef.current);

    const onTextFieldChange = (textFieldValue: string) => {
        if (!textFieldValue) {
            onChange(undefined);
        }
    };

    const onDatePickerChange = (newDate: moment.Moment | undefined) => {
        onChange(newDate);
        closeSimpleMenu();
    };

    const castedValue = value && moment(value).isValid() ? moment(value) : undefined;
    const castedDefaultMonth = defaultMonth && moment(defaultMonth).isValid() ? moment(defaultMonth) : undefined;
    if ((value && !moment(value).isValid()) || (defaultMonth && !moment(defaultMonth).isValid())) {
        console.warn(`[@lumx/react/DatePickerField] Invalid date provided '${value}'`);
    }
    return (
        <>
            <TextField
                {...textFieldProps}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={castedValue ? castedValue.format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={onTextFieldChange}
                onKeyPress={handleKeyboardNav}
                readOnly
            />
            {isOpen ? (
                <ClickAwayProvider callback={closeSimpleMenu} refs={[wrapperRef, anchorRef]}>
                    <Popover
                        anchorRef={anchorRef}
                        placement={Placement.BOTTOM_START}
                    >
                        <div
                            ref={wrapperRef}
                        >
                            <DatePicker
                                locale={locale}
                                maxDate={maxDate}
                                minDate={minDate}
                                value={castedValue}
                                onChange={onDatePickerChange}
                                todayOrSelectedDateRef={todayOrSelectedDateRef}
                                defaultMonth={castedDefaultMonth}
                            />
                        </div>
                    </Popover>
                </ClickAwayProvider>
            ) : null}
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, DatePickerField, DatePickerFieldProps };
