import { Placement, Popover, TextField } from '@lumx/react';
import { useClickAway } from '@lumx/react/hooks/useClickAway';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { onEscapePressed } from '@lumx/react/utils';

import moment from 'moment';

import React, { useEffect, useRef, useState } from 'react';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { CLASSNAME, DatePicker } from './DatePicker';

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
    value: Date | moment.Moment | undefined;

    /** Month to display by default */
    defaultMonth?: moment.Moment;

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
    const popoverRef = useRef(null);
    const anchorRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSimpleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeSimpleMenu = () => {
        setIsOpen(false);
    };

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.BOTTOM_START!,
        anchorRef,
        popoverRef,
        isOpen,
        undefined,
        false,
        false,
    );

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

    useClickAway(
        wrapperRef,
        () => {
            if (!isOpen) {
                return;
            }

            closeSimpleMenu();
        },
        [anchorRef],
    );

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

    return (
        <>
            <TextField
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={value ? moment(value).format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={onTextFieldChange}
                onKeyPress={handleKeyboardNav}
                readOnly
                {...textFieldProps}
            />
            {isOpen ? (
                <Popover
                    popoverRect={computedPosition}
                    popoverRef={popoverRef}
                    isVisible={isVisible}
                    placement={Placement.BOTTOM_START}
                >
                    <div
                        ref={wrapperRef}
                        style={{
                            maxHeight: computedPosition.maxHeight,
                            minWidth: 0,
                        }}
                    >
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
