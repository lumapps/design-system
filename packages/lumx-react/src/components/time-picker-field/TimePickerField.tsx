import React, { type SyntheticEvent, useCallback, useMemo, useState } from 'react';

import type { HasClassName, HasTheme } from '@lumx/core/js/types';
import {
    TimePickerField as UI,
    type TimePickerFieldProps as UIProps,
    type TimePickerFieldWrapperProps,
    type TimePickerFieldOwnedSelectProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/TimePickerField';
import { getCurrentLocale } from '@lumx/react/utils/locale/getCurrentLocale';
import {
    buildTimeList,
    formatTime,
    getDateAtTime,
    isDateOnTime,
    parseTimeInput,
    snapTimeToBounds,
    type TimeOfDay,
} from '@lumx/core/js/utils/time';

import { SelectTextField, SingleSelectTextFieldProps } from '../select-text-field';

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Inherited SelectTextField props (less the parts owned by TimePickerField).
 */
type InheritedSelectTextFieldProps = Omit<
    SingleSelectTextFieldProps<TimeOfDay>,
    TimePickerFieldOwnedSelectProps | 'onChange'
>;

/**
 * `TimePickerField` props.
 */
export interface TimePickerFieldProps
    extends HasClassName,
        HasTheme,
        InheritedSelectTextFieldProps,
        TimePickerFieldWrapperProps {
    /**
     * Change handler. Called with a new `Date` whose date part is inherited from
     * the previous `value` (or today, if none) and whose time-of-day matches the
     * user selection. May also be called with `undefined` when the field is
     * cleared.
     */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;
}

/**
 * A select-style picker for choosing a time of day. Wraps `SelectTextField`
 * with a generated list of times built from `step`, `minTime`, and `maxTime`.
 *
 * Out-of-range options (strictly before `minTime` or after `maxTime`) remain
 * visible in the dropdown but are rendered as disabled.
 *
 * Free-form typed input (e.g. `"10:30 PM"`, `"14"`, `"930"`) is parsed on blur.
 *
 * @param props Component props.
 * @return React element.
 */
export const TimePickerField: React.FC<TimePickerFieldProps> = (props) => {
    const {
        value,
        onChange,
        locale = getCurrentLocale(),
        step = DEFAULT_PROPS.step,
        minTime,
        maxTime,
        className,
        theme,
        translations,
        ...forwardedProps
    } = props;

    // Build the option list — re-computed only when bounds/step/locale change.
    const timeList = useMemo(() => buildTimeList({ step, minTime, maxTime, locale }), [step, minTime, maxTime, locale]);

    // Track the user's typed input separately from the SelectTextField's internal search state,
    // so blur can convert it to a Date.
    const [searchValue, handleSearch] = useState<string>('');

    // Resolve the option that matches the current value (by time-of-day).
    const selectedOption = useMemo(() => {
        if (!value) return undefined;
        return { hour: value.getHours(), minute: value.getMinutes(), name: formatTime(value, locale) };
    }, [value, locale]);

    const handleChange: UIProps['handleChange'] = useCallback(
        (next) => {
            const date = next ? getDateAtTime(next, value) : undefined;
            onChange(date, forwardedProps.name);
        },
        [forwardedProps.name, onChange, value],
    );

    const handleBlur: UIProps['handleBlur'] = useCallback(() => {
        if (!searchValue) return;
        const parsed = parseTimeInput(searchValue);
        // Reset our local typed-value tracking; SelectTextField clears its own internal copy.
        handleSearch('');
        if (!parsed) return;

        // Snap to bounds if needed, then dedup against the current value.
        const time = snapTimeToBounds(parsed, minTime, maxTime);
        if (value && isDateOnTime(value, time)) return;

        onChange(getDateAtTime(time, value), forwardedProps.name);
    }, [maxTime, minTime, forwardedProps.name, onChange, searchValue, value]);

    const searchInputValue = value ? formatTime(value, locale) : undefined;

    return UI(
        {
            ...forwardedProps,
            value: selectedOption,
            options: timeList,
            translations,
            className,
            theme,
            handleChange,
            handleSearch,
            handleBlur,
            searchInputValue,
        },
        { SelectTextField, Option: SelectTextField.Option },
    );
};

TimePickerField.displayName = COMPONENT_NAME;
