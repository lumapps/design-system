import React, { ReactNode, RefObject, SyntheticEvent, useRef } from 'react';

import classNames from 'classnames';

import { Dropdown, Offset, Placement, TextField, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useFocus } from '@lumx/react/hooks/useFocus';

/**
 * Defines the props of the component.
 */
interface AutocompleteProps extends GenericProps {
    /**
     * Whether the suggestions list should display anchored to the input or to the wrapper.
     * @see {@link DropdownProps#anchorToInput}
     */
    anchorToInput?: boolean;
    /**
     * The reference passed to the <input> or <textarea> element.
     * @see {@link TextFieldProps#inputRef}
     */
    inputRef?: RefObject<HTMLInputElement>;
    /**
     * The offset that will be applied to the Dropdown position.
     * @see {@link DropdownProps#offset}
     */
    offset?: Offset;
    /**
     * The preferred Dropdown location against the anchor element.
     * @see {@link DropdownProps#placement}
     */
    placement?: Placement;
    /**
     * Whether the dropdown should fit to the anchor width or not.
     * @see {@link DropdownProps#fitToAnchorWidth}
     */
    fitToAnchorWidth?: boolean;
    /**
     * The error related to the component.
     * @see {@link TextFieldProps#error}
     */
    error?: string | ReactNode;
    /**
     * Whether the text field is displayed with error style or not.
     * @see {@link TextFieldProps#hasError}
     */
    hasError?: boolean;
    /**
     * Whether the text box should be focused upon closing the suggestions or not.
     */
    shouldFocusOnClose?: boolean;
    /**
     * Whether the text field displays a clear button or not.
     * @see {@link TextFieldProps#isClearable}
     */
    isClearable?: boolean;
    /**
     * The helper message of the text field.
     * @see {@link TextFieldProps#helper}
     */
    helper?: string;
    /**
     * The icon of the text field (SVG path).
     * @see {@link TextFieldProps#icon}
     */
    icon?: string;
    /**
     * Whether the component is disabled or not.
     * @see {@link TextFieldProps#isDisabled}
     */
    isDisabled?: boolean;
    /**
     * Whether the text field is displayed with valid style or not.
     * @see {@link TextFieldProps#isValid}
     */
    isValid?: boolean;
    /**
     * The label of the text field displayed in a label tag.
     * @see {@link TextFieldProps#label}
     */
    label?: string;
    /**
     * The placeholder message of the text field.
     * @see {@link TextFieldProps#placeholder}
     */
    placeholder?: string;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The children elements to be transcluded into the component. Should be a list of suggestions. */
    children: React.ReactNode;
    /**
     * The list of chips to be displayed before the text field input.
     */
    chips?: React.ReactNode;
    /**
     * The value of the text field.
     * @see {@link TextFieldProps#value}
     */
    value: string;
    /**
     * Whether the suggestions from the autocomplete should be displayed or not.
     * @see {@link DropdownProps#isOpen}
     */
    isOpen: boolean;
    /**
     * The native input name property.
     * @see {@link TextFieldProps#name}
     */
    name?: string;
    /**
     * Whether a click in the Autocomplete dropdown would close it or not.
     * @see {@link DropdownProps#closeOnClick}
     */
    closeOnClick?: boolean;
    /**
     * Whether a click anywhere out of the Autocomplete would close it or not.
     * @see {@link DropdownProps#closeOnClickAway}
     */
    closeOnClickAway?: boolean;
    /**
     * Whether an escape key press would close the Autocomplete or not.
     * @see {@link DropdownProps#closeOnEscape}
     */
    closeOnEscape?: boolean;
    /**
     * The function called on blur.
     * @see {@link TextFieldProps#onBlur}
     */
    onBlur?(event: React.FocusEvent): void;
    /**
     * The function called on change.
     * @see {@link TextFieldProps#onChange}
     */
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    /**
     * The function called on close.
     * @see {@link DropdownProps#onClose}
     */
    onClose?(): void;
    /**
     * The function called on focus.
     * @see {@link TextFieldProps#onFocus}
     */
    onFocus?(event: React.FocusEvent): void;
    /**
     * The function called when the bottom of the dropdown is reached.
     * @see {@link DropdownProps#onInfiniteScroll}
     */
    onInfiniteScroll?(): void;
}

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
    closeOnClick: false,
    closeOnClickAway: true,
    closeOnEscape: true,
    shouldFocusOnClose: false,
};

const Autocomplete: React.FC<AutocompleteProps> = ({
    anchorToInput,
    children,
    chips,
    className,
    closeOnClick,
    closeOnClickAway,
    closeOnEscape,
    disabled,
    error,
    fitToAnchorWidth,
    hasError,
    helper,
    icon,
    inputRef = useRef(null),
    isClearable,
    isDisabled = disabled,
    isOpen,
    isValid,
    label,
    name,
    offset,
    onBlur,
    onChange,
    onClose,
    onFocus,
    onInfiniteScroll,
    placeholder,
    placement,
    shouldFocusOnClose,
    theme,
    value,
    ...forwardedProps
}) => {
    const textFieldRef = useRef(null);
    useFocus(inputRef.current, !isOpen && shouldFocusOnClose);

    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
        >
            <TextField
                chips={chips}
                error={error}
                hasError={hasError}
                helper={helper}
                icon={icon}
                inputRef={inputRef}
                isClearable={isClearable}
                isDisabled={isDisabled}
                isValid={isValid}
                label={label}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={placeholder}
                textFieldRef={textFieldRef}
                theme={theme}
                value={value}
            />
            <Dropdown
                anchorRef={anchorToInput ? inputRef : textFieldRef}
                closeOnClick={closeOnClick}
                closeOnClickAway={closeOnClickAway}
                closeOnEscape={closeOnEscape}
                fitToAnchorWidth={fitToAnchorWidth}
                isOpen={isOpen}
                offset={offset}
                onClose={onClose}
                onInfiniteScroll={onInfiniteScroll}
                placement={placement}
                shouldFocusOnOpen={false}
                theme={theme}
            >
                {children}
            </Dropdown>
        </div>
    );
};
Autocomplete.displayName = COMPONENT_NAME;
Autocomplete.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Autocomplete, AutocompleteProps };
