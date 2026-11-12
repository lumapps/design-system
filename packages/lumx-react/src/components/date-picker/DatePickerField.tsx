import { SyntheticEvent, useRef } from 'react';

import { IconButtonProps, PopoverDialog, TextField, TextFieldProps } from '@lumx/react';
import type { GenericProps } from '@lumx/core/js/types';
import { DatePickerField as UI } from '@lumx/core/js/components/DatePicker/DatePickerField';
import { createDatePickerFieldState } from '@lumx/core/js/components/DatePicker/createDatePickerFieldState';
import { useCoreState } from '@lumx/react/hooks/useCoreState';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

import { FIELD_COMPONENT_NAME } from './constants';
import { DatePicker } from './DatePicker';

/**
 * Defines the props of the component.
 */
export interface DatePickerFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'>, GenericProps {
    /** Default month. */
    defaultMonth?: Date;
    /** Locale (language or region) to use. */
    locale?: string;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Props to pass to the next month button (minus those already set by the DatePickerControlled props). */
    nextButtonProps: Pick<IconButtonProps, 'label'> & Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Props to pass to the previous month button (minus those already set by the DatePickerControlled props). */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Currently selected date. */
    value: Date | undefined;
    /** On change callback. */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;
}

/**
 * DatePickerField component: an editable `role="combobox"` input that opens a modal dialog with the calendar
 * (`DatePicker`).
 *
 * - Down, Alt+Down or a click on the input open the dialog and focus the roving day (the selected day, else today).
 * - The user can type a date (long format or numeric date of the locale). The typed text is committed on Enter
 *   and on blur: `onChange` is called with the parsed date (snapped to `minDate`/`maxDate`), then the input shows
 *   the formatted `value` again.
 * - An empty text clears the value only when the field has a clear button (`clearButtonProps`).
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerField = forwardRef<DatePickerFieldProps, HTMLDivElement>((props, ref) => {
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const { onChange, onClear, ...forwardedProps } = otherProps;

    const anchorRef = useRef<HTMLDivElement>(null);
    const dialogId = useId();
    const state = useCoreState(createDatePickerFieldState<SyntheticEvent>, otherProps);
    const { focusElement, ...view } = state.getView();

    return UI(
        {
            ...forwardedProps,
            ...disabledStateProps,
            ref,
            onClear(event?: SyntheticEvent) {
                state.clear();
                onClear?.(event);
            },
            ...view,
            dialogId,
            anchorRef,
            focusElement: { current: focusElement ?? null },
        },
        { TextField, PopoverDialog, DatePicker },
    );
});
DatePickerField.displayName = FIELD_COMPONENT_NAME;
