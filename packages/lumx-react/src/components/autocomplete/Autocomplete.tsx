import React, { ReactNode, RefObject, useRef } from 'react';

import classNames from 'classnames';

import { Dropdown, Offset, Placement, TextField, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useFocus } from '@lumx/react/hooks/useFocus';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface AutocompleteProps extends GenericProps {
    /**
     * Whether the suggestions list should display anchored to the input
     * If false, it will be anchored to the text field wrapper.
     */
    anchorToInput?: boolean;

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

    /** The error related to the component */
    error?: string | ReactNode;

    /**
     * Whether the text field is displayed with error style or not.
     * @see {@link TextFieldProps#hasError}
     */
    hasError?: boolean;

    /**
     * Whether the text box should be focused upon closing the suggestions
     */
    shouldFocusOnClose?: boolean;

    /**
     * Whether the text field displays a clear button or not.
     * @see {@link TextFieldProps#hasError}
     */
    isClearable?: boolean;

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
     * Children of the Autocomplete. This should be a list of the different
     * suggestions that
     */
    children: React.ReactNode;

    /**
     * List of chips to be displayed before the text field input.
     */
    chips?: React.ReactNode;

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
    anchorToInput: false,
    closeOnClick: true,
    closeOnEscape: true,
    isOpen: undefined,
    shouldFocusOnClose: false,
};

/////////////////////////////

/**
 * This component allows to make the connection between a Text Field and a Dropdown,
 * displaying a list of suggestions from the text entered on the text field.
 *
 * @return The component.
 */
const Autocomplete: React.FC<AutocompleteProps> = (props) => {
    const {
        anchorToInput = DEFAULT_PROPS.anchorToInput,
        className,
        children,
        chips,
        value,
        onBlur,
        onChange,
        onFocus,
        isOpen,
        closeOnClick,
        closeOnEscape,
        error,
        hasError,
        helper,
        icon,
        isDisabled,
        isClearable,
        isValid,
        label,
        placeholder,
        theme,
        onClose,
        offset,
        shouldFocusOnClose = DEFAULT_PROPS.shouldFocusOnClose,
        placement,
        inputRef = useRef(null),
        fitToAnchorWidth,
        onInfiniteScroll,
        ...forwardedProps
    } = props;

    const textFieldRef = useRef(null);
    useFocus(inputRef.current, !isOpen && shouldFocusOnClose);

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
                chips={chips}
                textFieldRef={textFieldRef}
                inputRef={inputRef}
                isClearable={isClearable}
                onBlur={onBlur}
                onFocus={onFocus}
                hasError={hasError}
                error={error}
                helper={helper}
                icon={icon}
                isDisabled={isDisabled}
                isValid={isValid}
                label={label}
                placeholder={placeholder}
                theme={theme}
            />
            <Dropdown
                anchorRef={anchorToInput ? inputRef : textFieldRef}
                showDropdown={isOpen}
                closeOnClick={closeOnClick}
                closeOnEscape={closeOnEscape}
                onClose={onClose}
                offset={offset}
                placement={placement}
                fitToAnchorWidth={fitToAnchorWidth}
                onInfiniteScroll={onInfiniteScroll}
                theme={theme}
                shouldFocusOnOpen={false}
            >
                {children}
            </Dropdown>
        </div>
    );
};
Autocomplete.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Autocomplete, AutocompleteProps };
