import React, { useEffect, useRef, useState } from 'react';

import { Placement, Popover, TextField, TextFieldProps, Theme } from '@lumx/react';
import { useClickAway } from '@lumx/react/hooks/useClickAway';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { onEscapePressed } from '@lumx/react/utils';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { CLASSNAME, COMPONENT_NAME as COMPONENT_PREFIX, DatePicker, DatePickerProps } from './DatePicker';

import { useFocus } from '@lumx/react/hooks/useFocus';

/////////////////////////////

/**
 * Defines the props of the component.
 */

type DatePickerFieldProps = DatePickerProps & {
    /** Whether the text field is clearable. */
    isClearable?: TextFieldProps['isClearable'];

    /** Input label. */
    label?: TextFieldProps['label'];

    /** Theme. */
    theme?: Theme;
};

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Field`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DatePickerFieldProps> = {
    isClearable: true,
};

/////////////////////////////

/**
 * Simple component used to pick a date (ready-to-use wrapped implementation).
 *
 * @return The component.
 */
const DatePickerField = ({
    isClearable = DEFAULT_PROPS.isClearable,
    label,
    theme,
    value,
    ...props
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
    const handleKeyboardNav = (evt: React.KeyboardEvent<HTMLElement>): void => {
        if ((evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE) && toggleSimpleMenu) {
            toggleSimpleMenu();
        }
    };

    useEffect(() => {
        if (!onEscapeHandler || !wrapperRef.current) {
            return undefined;
        }
        if (isOpen && wrapperRef.current) {
            window.addEventListener('keydown', onEscapeHandler);
        }
        return (): void => {
            window.removeEventListener('keydown', onEscapeHandler);
        };
    }, [isOpen, closeSimpleMenu]);

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

    const onChange = (textFieldValue: string) => {
        if (!textFieldValue) {
            props.onChange(undefined);
        }
    };

    return (
        <>
            <TextField
                isClearable={isClearable}
                textFieldRef={anchorRef}
                label={label}
                value={value ? value.format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={onChange}
                onKeyPress={handleKeyboardNav}
                theme={theme}
                readOnly={true}
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
                        <DatePicker value={value} todayOrSelectedDateRef={todayOrSelectedDateRef} {...props} />
                    </div>
                </Popover>
            ) : null}
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS, DatePickerField, DatePickerFieldProps };
