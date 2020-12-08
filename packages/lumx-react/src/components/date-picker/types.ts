import { GenericProps } from '@lumx/react/utils';
import { RefObject } from 'react';

/**
 * Defines the props of the component.
 */
export interface DatePickerProps extends GenericProps {
    /** The month to display by default. */
    defaultMonth?: Date;
    /** The locale (language or region) to use. */
    locale: string;
    /** The date after which no date can be selected. */
    maxDate?: Date;
    /** The date before which no date can be selected. */
    minDate?: Date;
    /** The reference passed to the <button> element if it corresponds to the current date or the selected date. */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;
    /** The current value of the text field. */
    value: Date | undefined;

    /** The function called on change. */
    onChange(value: Date | undefined): void;
}
