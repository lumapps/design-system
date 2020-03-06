import React, { useCallback, useEffect, useRef, useState } from 'react';

import moment from 'moment';

import { Placement, Popover, TextField } from '@lumx/react';
import { useClickAway } from '@lumx/react/hooks/useClickAway';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { onEscapePressed, GenericProps } from '@lumx/react/utils';
import { COMPONENT_PREFIX, ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { useFocus } from '@lumx/react/hooks/useFocus';

import { DatePicker } from './DatePicker';

/**
 * Defines the props of the component.
 */
export interface DatePickerFieldProps extends GenericProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Value. */
    value: moment.Moment | undefined;

    /** On change. */
    onChange(value: moment.Moment | undefined): void;
}

/**
 * The display name of the component.
 */
export const COMPONENT_NAME = `${COMPONENT_PREFIX}DatePickerField`;

/**
 * Simple component used to pick a date (ready-to-use wrapped implementation).
 *
 * @return The component.
 */
export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    value,
    locale,
    minDate,
    maxDate,
    onChange,
    ...textFieldProps
}) => {
    const wrapperRef = useRef(null);
    const popoverRef = useRef(null);
    const anchorRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSimpleMenu = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const closeSimpleMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.BOTTOM_START,
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
            return undefined;
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
                value={value ? value.format('LL') : ''}
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
                        />
                    </div>
                </Popover>
            ) : null}
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;
