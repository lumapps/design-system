import React, { ReactElement, useRef } from 'react';

import classNames from 'classnames';

import { Dropdown, TextField } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IAutocompleteProps extends IGenericProps {
    /**
     * Children of the Autocomplete. This should be a list of the different
     * suggestions that
     */
    children: React.ReactNode;

    /**
     * Text field value.
     * @see {@link TextFieldProps#onChange}
     */
    value: string;

    /**
     * Whether the suggestions from the autocomplete should be displayed or not.
     * Useful to control when the suggestions are displayed from outside the component
     */
    isOpen: boolean;

    /**
     * Whether a click anywhere out of the Autocomplete would close it
     * @see {@link DropdownProps#closeOnClick}
     */
    closeOnClick?: boolean;

    /**
     * Whether an escape key press would close the Autocomplete.
     * @see {@link DropdownProps#closeOnEscape}
     */
    closeOnEscape?: boolean;

    /**
     * Text field value change handler.
     * @see {@link TextFieldProps#onChange}
     */
    onChange(value: string): void;

    /**
     * Text field on key down handler.
     */
    onKeyDown(value: string): void;

    /**
     * Text field focus change handler.
     * @see {@link TextFieldProps#onFocus}
     */
    onFocus?(event: React.FocusEvent): void;

    /**
     * Text field blur change handler.
     * @see {@link TextFieldProps#onBlur}
     */
    onBlur?(event: React.FocusEvent): void;
}
type AutocompleteProps = IAutocompleteProps;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Autocomplete`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<AutocompleteProps> = {
    closeOnClick: true,
    closeOnEscape: true,
    isOpen: undefined,
};

/////////////////////////////

/**
 * This component allows to make the connection between a Text Field and a Dropdown,
 * displaying a list of suggestions from the text entered on the text field.
 *
 * @return The component.
 */
const Autocomplete: React.FC<AutocompleteProps> = (props: AutocompleteProps): ReactElement => {
    const {
        className,
        children,
        value,
        onBlur,
        onChange,
        onFocus,
        onKeyDown,
        isOpen,
        closeOnClick,
        closeOnEscape,
        ...forwardedProps
    } = props;
    const textFieldRef = useRef(null);

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            {...forwardedProps}
        >
            <TextField
                value={value}
                onChange={onChange}
                textFieldRef={textFieldRef}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onFocus={onFocus}
                {...forwardedProps}
            />
            <Dropdown
                anchorRef={textFieldRef}
                showDropdown={isOpen}
                closeOnClick={closeOnClick}
                closeOnEscape={closeOnEscape}
                {...forwardedProps}
            >
                {children}
            </Dropdown>
        </div>
    );
};
Autocomplete.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Autocomplete, AutocompleteProps };
