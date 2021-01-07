import { IconButtonProps } from '@lumx/react';
import { Theme } from '@lumx/react/components';
import { GenericProps, ValueOf } from '@lumx/react/utils';
import { ReactNode, SyntheticEvent } from 'react';

/**
 * Select variants.
 */
export const SelectVariant = { input: 'input', chip: 'chip' } as const;
export type SelectVariant = ValueOf<typeof SelectVariant>;

export interface CoreSelectProps extends GenericProps {
    /** Props to pass to the clear button (minus those already set by the Select props). If not specified, the button won't be displayed. */
    clearButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Whether the select (input variant) is displayed with error style or not. */
    hasError?: boolean;
    /** Error message. */
    error?: string | ReactNode;
    /** Helper text. */
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
    /** Label text. */
    label?: string;
    /** Placeholder input text. */
    placeholder?: string;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Select variant. */
    variant?: SelectVariant;
    /** On clear callback. */
    onClear?(event: SyntheticEvent, value?: string): void;
    /** On blur callback. */
    onBlur?(): void;
    /** On filter text change callback (with 500ms debounce). */
    onFilter?(): void;
    /** On input click callback (can be used for dropdown toggle). */
    onInputClick?(): void;
    /** On dropdown close callback. */
    onDropdownClose?(): void;
    /** On scroll end callback. */
    onInfiniteScroll?(): void;
    /** Render value function. Default: Renders the value as a string. */
    selectedValueRender?(choice: string): ReactNode | string;
}
