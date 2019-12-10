import React from 'react';

import noop from 'lodash/noop';

import { Dropdown, Placement, TextField, Theme } from '@lumx/react';

import { COMPONENT_NAME as COMPONENT_PREFIX, DatePicker, DatePickerProps } from './DatePicker';

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
    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);

    const toggleSimpleMenu = () => {
        setSimpleIsOpen(!isSimpleOpen);
    };

    const closeSimpleMenu = () => {
        setSimpleIsOpen(false);
    };

    return (
        <>
            <TextField
                textFieldRef={anchorSimpleRef}
                label={label}
                value={value ? value.format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={noop}
                theme={theme}
                readOnly={true}
            />

            <Dropdown
                showDropdown={isSimpleOpen}
                closeOnClick={true}
                closeOnEscape={true}
                onClose={closeSimpleMenu}
                placement={Placement.BOTTOM_START}
                anchorRef={anchorSimpleRef}
                fitToAnchorWidth={false}
            >
                <DatePicker value={value} {...props} />
            </Dropdown>
        </>
    );
};
DatePickerField.displayName = COMPONENT_NAME;

/////////////////////////////

export { COMPONENT_NAME, DatePickerField, DatePickerFieldProps };
