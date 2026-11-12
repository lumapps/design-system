import { Ref, useEffect, useReducer, useRef, useState } from 'react';

import { Button, FlexBox, IconButton, Text, TextField, TextFieldProps } from '@lumx/react';
import { DatePicker as UI } from '@lumx/core/js/components/DatePicker/DatePicker';
import { createCalendarState, type CalendarStateProps } from '@lumx/core/js/components/DatePicker/createCalendarState';
import { getCurrentLocale } from '@lumx/core/js/utils/locale/getCurrentLocale';
import { onEnterPressed } from '@lumx/core/js/utils';
import { useId } from '@lumx/react/hooks/useId';

import type { DatePickerProps } from './types';

/** Props of {@link useCalendar}: the `DatePicker` props, with the optional controlled month layer. */
export type CalendarProps = DatePickerProps & CalendarStateProps;

/**
 * Render the calendar (`DatePicker` template) on the core calendar state (`createCalendarState`).
 * The shown month is controlled when `selectedMonth` is set, else held by the state.
 */
export function useCalendar(props: CalendarProps, ref: Ref<HTMLDivElement>) {
    const {
        locale = getCurrentLocale(),
        minDate,
        maxDate,
        nextButtonProps,
        previousButtonProps,
        todayOrSelectedDateRef,
        // Read by the calendar state.
        value,
        defaultMonth,
        onChange,
        selectedMonth,
        onPrevMonthChange,
        onNextMonthChange,
        onMonthChange,
        ...forwardedProps
    } = props;

    // Bridge: the state reads the latest props and asks for a render on change.
    const latestProps = useRef(props);
    latestProps.current = props;
    const [, forceUpdate] = useReducer((count: number) => count + 1, 0);
    const [state] = useState(() => createCalendarState({ getProps: () => latestProps.current, onUpdate: forceUpdate }));

    const gridRef = useRef<HTMLDivElement>(null);
    useEffect(() => (gridRef.current ? state.attachGrid(gridRef.current) : undefined), [state]);
    useEffect(() => state.afterRender());

    const monthLabelId = useId();
    const { yearText, ...view } = state.getView();
    const onYearChange: TextFieldProps['onChange'] = (text, _, event) =>
        state.inputYear(text, (event?.nativeEvent as InputEvent | undefined)?.inputType);

    return UI(
        {
            ...forwardedProps,
            ...view,
            ref,
            locale,
            minDate,
            maxDate,
            monthLabelId,
            previousButtonProps,
            nextButtonProps,
            yearInputProps:
                yearText === undefined
                    ? undefined
                    : {
                          value: yearText,
                          onChange: onYearChange,
                          onBlur: state.commitYear,
                          onKeyPress: onEnterPressed(state.commitYear),
                      },
            gridRef,
            rovingDayRef: todayOrSelectedDateRef,
        },
        { IconButton, Button, TextField, FlexBox, Text },
    );
}
