import { Theme } from '@lumx/react/components';
import { Comp, GenericProps } from '@lumx/react/utils';
import { ReactNode, SyntheticEvent } from 'react';

/**
 * The authorized variants.
 */
export enum SelectVariant {
    input = 'input',
    chip = 'chip',
}

export interface CoreSelectProps extends GenericProps {
    /** Whether the select (input variant) is displayed with error style or not. */
    hasError?: boolean;
    /** The error related to the component. */
    error?: string | ReactNode;
    /** The helper to display within the popover (last position). */
    helper?: string;
    /** Whether the select should close on click. */
    closeOnClick?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the select (input variant) is displayed with valid style or not. */
    isValid?: boolean;
    /** The select label. */
    label?: string;
    /** The select placeholder (input variant). */
    placeholder?: string;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The selected choices area style. */
    variant?: SelectVariant;
    /** The function called when the clear button is clicked. NB: if not specified, clear buttons won't be displayed. */
    onClear?(event: SyntheticEvent, value?: string): void;
    /** The function called when the select field is blurred. */
    onBlur?(): void;
    /** The function called on integrated search field change (500ms debounce). */
    onFilter?(): void;
    /** The function called when the select input is clicked, can be used for dropdown toggle. */
    onInputClick?(): void;
    /** The function called when the dropdown is closed. */
    onDropdownClose?(): void;
    /** The function called when the bottom of the dropdown is reached. */
    onInfiniteScroll?(): void;
    /** The function called to render the selected value. Default: Renders the value as a string. */
    selectedValueRender?(choice: string): ReactNode | string;
}
