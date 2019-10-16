import React, { ReactElement, RefObject, useRef } from 'react';

import classNames from 'classnames';

import { Dropdown, Offset, Placement, TextField, TextFieldType, Theme } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IAutocompleteProps extends IGenericProps {
    /** A ref that will be passed to the input or textarea element. */
    inputRef?: RefObject<HTMLInputElement>;

    /**
     * Vertical and/or horizontal offsets that will be applied to the Dropdown position.
     * @see {@link DropdownProps#offset}
     */
    offset?: Offset;

    /**
     * The preferred Dropdown location against the anchor element.
     * @see {@link DropdownProps#placement}
     */
    placement?: Placement;

    /**
     * Whether the dropdown should fit to the anchor width
     * @see {@link DropdownProps#hasError}
     */
    fitToAnchorWidth?: boolean;

    /**
     * Whether the text field is displayed with error style or not.
     * @see {@link TextFieldProps#hasError}
     */
    hasError?: boolean;

    /**
     * Text field helper message.
     * @see {@link TextFieldProps#helper}
     */
    helper?: string;

    /**
     * Text field icon (SVG path)
     * @see {@link TextFieldProps#icon}
     */
    icon?: string;

    /**
     * Whether the text field is disabled or not.
     * @see {@link TextFieldProps#isDisabled}
     */
    isDisabled?: boolean;

    /**
     * Whether the text field is displayed with valid style or not.
     * @see {@link TextFieldProps#isValid}
     */
    isValid?: boolean;

    /**
     * Text field label displayed in a label tag.
     * @see {@link TextFieldProps#label}
     */
    label?: string;

    /**
     * Text field placeholder message.
     * @see {@link TextFieldProps#placeholder}
     */
    placeholder?: string;

    /** Theme. */
    theme?: Theme;

    /**
     * Text field type (input or textarea).
     * @see {@link TextFieldProps#type}
     */
    type?: TextFieldType;

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
     * The function to be called when the user clicks away or Escape is pressed
     * @see {@link DropdownProps#onClose}
     */
    onClose?: VoidFunction;

    /**
     * The callback function called when the bottom of the dropdown is reached.
     * @see {@link DropdownProps#onInfinite}
     */
    onInfinite?: VoidFunction;

    /**
     * Text field value change handler.
     * @see {@link TextFieldProps#onChange}
     */
    onChange(value: string): void;

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
        isOpen,
        closeOnClick,
        closeOnEscape,
        hasError,
        helper,
        icon,
        isDisabled,
        isValid,
        label,
        placeholder,
        theme,
        type,
        onClose,
        offset,
        placement,
        inputRef = useRef(null),
        fitToAnchorWidth,
        onInfiniteScroll,
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
                inputRef={inputRef}
                onBlur={onBlur}
                onFocus={onFocus}
                hasError={hasError}
                helper={helper}
                icon={icon}
                isDisabled={isDisabled}
                isValid={isValid}
                label={label}
                placeholder={placeholder}
                theme={theme}
                type={type}
            />
            <Dropdown
                anchorRef={textFieldRef as React.RefObject<HTMLElement>}
                showDropdown={isOpen}
                closeOnClick={closeOnClick}
                closeOnEscape={closeOnEscape}
                onClose={onClose}
                offset={offset}
                placement={placement}
                fitToAnchorWidth={fitToAnchorWidth}
                onInfiniteScroll={onInfiniteScroll}
            >
                {children}
            </Dropdown>
        </div>
    );
};
Autocomplete.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Autocomplete, AutocompleteProps };
