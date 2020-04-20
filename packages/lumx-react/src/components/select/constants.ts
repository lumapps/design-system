import { Theme } from '@lumx/react/components';
import { GenericProps } from '@lumx/react/utils';
import { ReactNode, SyntheticEvent } from 'react';

/**
 * The authorized variants.
 */
enum SelectVariant {
    input = 'input',
    chip = 'chip',
}

interface CoreSelectProps extends GenericProps {
    /** Whether the select (input variant) is displayed with error style or not. */
    hasError?: boolean;

    /** The error related to the component */
    error?: string | ReactNode;

    /** The helper to display within the popover (last position). */
    helper?: string;

    /** Whether the select is disabled or not. */
    isDisabled?: boolean;

    /** Whether the select is required or not. */
    isRequired?: boolean;

    /** Whether the select is opened or not. */
    isOpen?: boolean;

    /** Whether the select (input variant) is displayed with valid style or not. */
    isValid?: boolean;

    /** The select label. */
    label?: string;

    /** The select placeholder (input variant). */
    placeholder?: string;

    /** The theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /** The selected choices area style. */
    variant?: SelectVariant;

    /** The callback function called when the clear button is clicked. NB: if not specified, clear buttons won't be displayed. */
    onClear?(event: SyntheticEvent, value?: string): void;

    /** The callback function called when the select field is blurred */
    onBlur?(): void;

    /** The callback function called on integrated search field change (500ms debounce). */
    onFilter?(): void;

    /** The callback function called when the select input is clicked, can be used for dropdown toggle. */
    onInputClick?(): void;

    /** The callback function called when the dropdown is closed. */
    onDropdownClose?(): void;

    /** The callback function called when the bottom of the dropdown is reached. */
    onInfiniteScroll?(): void;

    /** The function called to render the selected value. Default: Renders the value as a string. */
    selectedValueRender?(choice: string): ReactNode | string;
}

export { SelectVariant, CoreSelectProps };
