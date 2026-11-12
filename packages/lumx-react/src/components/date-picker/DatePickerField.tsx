import { SyntheticEvent, useEffect, useReducer, useRef, useState } from 'react';

import { IconButtonProps, PopoverDialog, TextField, TextFieldProps } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { DatePickerField as UI } from '@lumx/core/js/components/DatePicker/DatePickerField';
import {
    createDatePickerFieldState,
    type DatePickerFieldStateProps,
} from '@lumx/core/js/components/DatePicker/createDatePickerFieldState';
import { getCurrentLocale } from '@lumx/core/js/utils/locale/getCurrentLocale';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

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
 * Component display name.
 */
const COMPONENT_NAME = 'DatePickerField';

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
    const {
        defaultMonth,
        locale = getCurrentLocale(),
        maxDate,
        minDate,
        name,
        nextButtonProps,
        onChange,
        onClear,
        previousButtonProps,
        value,
        label,
        'aria-label': ariaLabel,
        ...forwardedProps
    } = otherProps;

    const anchorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dialogId = useId();

    // Bridge: the state reads the latest props and asks for a render on change.
    const latestProps = useRef<DatePickerFieldStateProps>({});
    latestProps.current = {
        value,
        locale,
        minDate,
        maxDate,
        name,
        clearButtonProps: forwardedProps.clearButtonProps,
        onChange(newValue, changeName, event) {
            if (event) onChange(newValue, changeName, event as unknown as SyntheticEvent);
            else onChange(newValue, changeName);
        },
    };
    const [, forceUpdate] = useReducer((count: number) => count + 1, 0);
    const [state] = useState(() =>
        createDatePickerFieldState({ getProps: () => latestProps.current, onUpdate: forceUpdate }),
    );
    useEffect(() => (inputRef.current ? state.attachInput(inputRef.current) : undefined), [state]);

    const { focusElement, ...view } = state.getView();

    return UI(
        {
            ...forwardedProps,
            ...disabledStateProps,
            ref,
            name,
            label,
            'aria-label': ariaLabel,
            onClear(event?: SyntheticEvent) {
                state.clear();
                onClear?.(event);
            },
            ...view,
            dialogId,
            handleInputChange: state.inputText,
            handleClose: state.close,
            anchorRef,
            inputRef,
            focusElement: { current: focusElement ?? null },
            datePickerProps: {
                locale,
                value,
                minDate,
                maxDate,
                defaultMonth,
                nextButtonProps,
                previousButtonProps,
                todayOrSelectedDateRef: state.setRovingDayElement,
                onChange: state.pickDay,
            },
        },
        { TextField, PopoverDialog, DatePicker },
    );
});
DatePickerField.displayName = COMPONENT_NAME;
