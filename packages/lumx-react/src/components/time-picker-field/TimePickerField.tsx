import React, { type SyntheticEvent, useCallback, useMemo, useState } from 'react';

import type { GenericProps, HasTheme } from '@lumx/core/js/types';
import {
    TimePickerField as UI,
    type TimePickerFieldProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    buildTimeList,
    getCurrentLocale,
} from '@lumx/core/js/components/TimePickerField';
import { getTime, parseTimeInput, snapTimeToBounds, type TimeOfDay } from '@lumx/core/js/utils/time';

import { SelectTextField, SelectTextFieldTranslations, SingleSelectTextFieldProps } from '../select-text-field';

export { CLASSNAME, COMPONENT_NAME };

/**
 * Inherited SelectTextField props (less the parts owned by TimePickerField).
 */
type InheritedSelectTextFieldProps = Omit<
    SingleSelectTextFieldProps<TimeOfDay>,
    | 'value'
    | 'onChange'
    | 'listStatus'
    | 'translations'
    | 'options'
    | 'getOptionId'
    | 'getOptionName'
    | 'renderOption'
    | 'filter'
    | 'onBlur'
    | 'onSearch'
    | 'selectionType'
>;

/**
 * `TimePickerField` props.
 */
export interface TimePickerFieldProps extends GenericProps, HasTheme, InheritedSelectTextFieldProps {
    /**
     * Currently selected time. Only the time-of-day component is consumed; the
     * date part is preserved when emitting `onChange`.
     */
    value?: Date;

    /**
     * Change handler. Called with a new `Date` whose date part is inherited from
     * the previous `value` (or today, if none) and whose time-of-day matches the
     * user selection. May also be called with `undefined` when the field is
     * cleared.
     */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;

    /**
     * BCP-47 locale string (e.g. `'en-US'`, `'fr-FR'`).
     * @default getCurrentLocale()
     */
    locale?: string;

    /**
     * Minute interval between option entries.
     * @default 30
     */
    step?: number;

    /**
     * Lower bound. Options strictly before this time remain **visible** in the
     * dropdown but are rendered as disabled (cannot be picked). Typed input
     * below this bound is snapped up to it on blur.
     */
    minTime?: Date;

    /**
     * Upper bound. Options strictly after this time remain **visible** in the
     * dropdown but are rendered as disabled (cannot be picked). Typed input
     * above this bound is snapped down to it on blur.
     */
    maxTime?: Date;

    /**
     * Translations label for clear and show suggestions buttons
     */
    translations: Pick<SelectTextFieldTranslations, 'clearLabel' | 'showSuggestionsLabel'>;
}

/**
 * A select-style picker for choosing a time of day. Wraps `SelectTextField`
 * with a generated list of times built from `step`, `minTime`, and `maxTime`.
 *
 * Out-of-range options (strictly before `minTime` or after `maxTime`) remain
 * visible in the dropdown but are rendered as disabled.
 *
 * Free-form typed input (e.g. `"10:30 PM"`, `"14"`, `"930"`) is parsed on blur
 * via `resolveTypedTimeChange` — supports both 12-hour and 24-hour formats.
 *
 * @param props Component props.
 * @return React element.
 */
export const TimePickerField: React.FC<TimePickerFieldProps> = (props) => {
    const {
        value,
        onChange,
        locale = getCurrentLocale(),
        step = 30,
        minTime,
        maxTime,
        label,
        className,
        theme,
        translations,
        ...forwardedProps
    } = props;

    // Build the option list — re-computed only when bounds/step/locale change.
    // `id` and `name` are populated by buildTimeList so we can use the entries
    // directly as select options (no custom selectors needed).
    const timeList = useMemo(() => buildTimeList({ step, minTime, maxTime, locale }), [step, minTime, maxTime, locale]);

    // Track the user's typed input separately from the SelectTextField's internal search state,
    // so blur can convert it to a Date.
    const [typedValue, setTypedValue] = useState<string>('');

    // Resolve the option that matches the current value (by time-of-day).
    const selectedOption = useMemo(() => {
        if (!value) return undefined;
        return timeList.find((entry) => entry.hour === value.getHours() && entry.minute === value.getMinutes());
    }, [timeList, value]);

    const handleChange: UIProps['onChange'] = useCallback(
        (next) => {
            const date = next ? getTime(next.hour, next.minute, value) : undefined;
            onChange(date, forwardedProps.name);
        },
        [forwardedProps.name, onChange, value],
    );

    const handleBlur: UIProps['onBlur'] = useCallback(() => {
        if (!typedValue) return;
        const parsed = parseTimeInput(typedValue);
        // Reset our local typed-value tracking; SelectTextField clears its own internal copy.
        setTypedValue('');
        if (!parsed) return;

        // Snap to bounds if needed, then dedup against the current value.
        const { hour, minute } = snapTimeToBounds(parsed, minTime, maxTime);
        if (value && value.getHours() === hour && value.getMinutes() === minute) return;

        onChange(getTime(hour, minute, value), forwardedProps.name);
    }, [maxTime, minTime, forwardedProps.name, onChange, typedValue, value]);

    return UI(
        {
            label,
            value: selectedOption,
            timeList,
            translations,
            className,
            theme,
            onChange: handleChange,
            onSearch: setTypedValue,
            onBlur: handleBlur,
            extraProps: forwardedProps,
        },
        { SelectTextField, Option: SelectTextField.Option },
    );
};

TimePickerField.displayName = COMPONENT_NAME;
