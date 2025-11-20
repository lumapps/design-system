import { ReactNode, SyntheticEvent, useRef } from 'react';

import classNames from 'classnames';

import { Dropdown, DropdownProps, IconButtonProps, Offset, Placement, TextField, TextFieldProps } from '@lumx/react';

import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName } from '@lumx/core/js/utils/className';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

/**
 * Defines the props of the component.
 */
export interface AutocompleteProps extends GenericProps, HasTheme {
    /**
     * Whether the suggestions list should display anchored to the input or to the wrapper.
     * @see {@link DropdownProps#anchorToInput}
     */
    anchorToInput?: boolean;
    /**
     * Props to pass to the clear button (minus those already set by the TextField props).
     * If not specified, the button won't be displayed.
     * @see {@link TextFieldProps#clearButtonProps}
     */
    clearButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /**
     * Reference to the <input> or <textarea> element.
     * @see {@link TextFieldProps#inputRef}
     */
    inputRef?: TextFieldProps['inputRef'];
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
     * Manage dropdown width:
     *   - `maxWidth`: dropdown not bigger than anchor
     *   - `minWidth` or `true`: dropdown not smaller than anchor
     *   - `width`: dropdown equal to the anchor.
     * @see {@link DropdownProps#fitToAnchorWidth}
     */
    fitToAnchorWidth?: DropdownProps['fitToAnchorWidth'];
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
     * Whether the component is required or not.
     * @see {@link TextFieldProps#isRequired}
     */
    isRequired?: boolean;
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
    /** List of suggestions to display during autocomplete. */
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
     * Whether the focus should go back on the anchor when dropdown closes and focus is within.
     * @see {@link DropdownProps#focusAnchorOnClose}
     */
    focusAnchorOnClose?: DropdownProps['focusAnchorOnClose'];
    /**
     * The function called on blur.
     * @see {@link TextFieldProps#onBlur}
     */
    onBlur?(event: React.FocusEvent): void;
    /**
     * On change callback.
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
    /**
     * Props forwarded to the underlying TextField component.
     * Only the props not managed by the Autocomplete can be set.
     * @see {@link TextFieldProps}
     */
    textFieldProps?: Partial<TextFieldProps>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Autocomplete';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<AutocompleteProps> = {
    anchorToInput: false,
    closeOnClick: false,
    closeOnClickAway: true,
    closeOnEscape: true,
    shouldFocusOnClose: false,
};

/**
 * Autocomplete component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Autocomplete = forwardRef<AutocompleteProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme();
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        anchorToInput = DEFAULT_PROPS.anchorToInput,
        children,
        chips,
        className,
        closeOnClick = DEFAULT_PROPS.closeOnClick,
        closeOnClickAway = DEFAULT_PROPS.closeOnClickAway,
        closeOnEscape = DEFAULT_PROPS.closeOnEscape,
        error,
        fitToAnchorWidth,
        hasError,
        helper,
        icon,
        inputRef,
        clearButtonProps,
        isRequired,
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
        shouldFocusOnClose = DEFAULT_PROPS.shouldFocusOnClose,
        theme = defaultTheme,
        value,
        textFieldProps = {},
        focusAnchorOnClose,
        ...forwardedProps
    } = otherProps;
    const inputAnchorRef = useRef<HTMLElement>(null);
    const textFieldRef = useRef(null);
    useFocus(inputAnchorRef.current, !isOpen && shouldFocusOnClose);

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            <TextField
                {...textFieldProps}
                chips={chips}
                error={error}
                hasError={hasError}
                helper={helper}
                icon={icon}
                inputRef={mergeRefs(inputAnchorRef as React.RefObject<HTMLInputElement>, inputRef)}
                clearButtonProps={clearButtonProps}
                {...disabledStateProps}
                isRequired={isRequired}
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
                anchorRef={anchorToInput ? inputAnchorRef : textFieldRef}
                closeOnClick={closeOnClick}
                closeOnClickAway={closeOnClickAway}
                closeOnEscape={closeOnEscape}
                focusAnchorOnClose={focusAnchorOnClose}
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
});
Autocomplete.displayName = COMPONENT_NAME;
Autocomplete.className = CLASSNAME;
Autocomplete.defaultProps = DEFAULT_PROPS;
