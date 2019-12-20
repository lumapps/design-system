import React, { useEffect, useRef, useState } from 'react';

import noop from 'lodash/noop';

import { Placement, Popover, TextField, Theme } from '@lumx/react';
import { useClickAway } from '@lumx/react/hooks/useClickAway';
import { onEscapePressed } from '@lumx/react/utils';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { CLASSNAME, COMPONENT_NAME as COMPONENT_PREFIX, DatePicker, DatePickerProps } from './DatePicker';

import { useFocusOnClose } from '@lumx/react/hooks/useFocusOnClose';

/////////////////////////////

/**
 * Defines the props of the component.
 */

type DatePickerFieldProps = DatePickerProps & {
    /** Input label. */
    label: string;

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

/////////////////////////////

/**
 * Simple component used to pick a date (ready-to-use wrapped implementation).
 *
 * @return The component.
 */
const DatePickerField = ({ label, theme, value, ...props }: DatePickerFieldProps) => {
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

    useFocusOnClose(anchorRef.current, isOpen);
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

    return (
        <>
            <TextField
                textFieldRef={anchorRef}
                label={label}
                value={value ? value.format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={noop}
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
                        <DatePicker value={value} {...props} />
                    </div>
                </Popover>
            ) : null}
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, COMPONENT_NAME, DatePickerField, DatePickerFieldProps };
