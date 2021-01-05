import { IconButtonProps } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils';
import { RefObject } from 'react';

/**
 * Defines the props of the component.
 */
export interface DatePickerProps extends GenericProps {
    /** Default month. */
    defaultMonth?: Date;
    /** Locale (language or region) to use. */
    locale: string;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Props to pass to the next month button (minus those already set by the DatePickerControlled props). */
    nextButtonProps: Pick<IconButtonProps, 'label'> & Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Props to pass to the previous month button (minus those already set by the DatePickerControlled props). */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Reference to the <button> element corresponding to the current date or the selected date. */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;
    /** Currently selected date. */
    value: Date | undefined;
    /** On change callback. */
    onChange(value: Date | undefined): void;
}
