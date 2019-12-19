import React, { useEffect, useRef, useState } from 'react';

import noop from 'lodash/noop';

import { Placement, Popover, TextField, Theme } from '@lumx/react';
import { useClickAway } from '@lumx/react/hooks/useClickAway';
import { onEscapePressed } from '@lumx/react/utils';

import { CLASSNAME, COMPONENT_NAME as COMPONENT_PREFIX, DatePicker, DatePickerProps } from './DatePicker';

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

    const [isSimpleOpen, setSimpleIsOpen] = useState(false);

    const toggleSimpleMenu = () => {
        setSimpleIsOpen(!isSimpleOpen);
    };

    const closeSimpleMenu = () => {
        setSimpleIsOpen(false);
    };

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.BOTTOM_START!,
        anchorRef,
        popoverRef,
        isSimpleOpen,
        undefined,
        false,
        false,
    );

    const onEscapeHandler = isSimpleOpen && onEscapePressed(closeSimpleMenu);

    useEffect(() => {
        if (!onEscapeHandler || !wrapperRef.current) {
            return undefined;
        }
        if (isSimpleOpen && wrapperRef.current) {
            window.addEventListener('keydown', onEscapeHandler);
        }
        return (): void => {
            window.removeEventListener('keydown', onEscapeHandler);
        };
    }, [isSimpleOpen, closeSimpleMenu]);

    useClickAway(
        wrapperRef,
        () => {
            if (!isSimpleOpen) {
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
                theme={theme}
                readOnly={true}
            />
            {isSimpleOpen ? (
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
