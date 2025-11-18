import React, { KeyboardEventHandler } from 'react';

import classNames from 'classnames';

import {
    Button,
    DatePickerProps,
    Emphasis,
    FlexBox,
    IconButton,
    Text,
    TextField,
    TextFieldProps,
    Toolbar,
} from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { getMonthCalendar } from '@lumx/react/utils/date/getMonthCalendar';
import { isSameDay } from '@lumx/react/utils/date/isSameDay';
import { getCurrentLocale } from '@lumx/react/utils/locale/getCurrentLocale';
import { parseLocale } from '@lumx/react/utils/locale/parseLocale';
import { Locale } from '@lumx/react/utils/locale/types';
import { usePreviousValue } from '@lumx/react/hooks/usePreviousValue';
import { getYearDisplayName } from '@lumx/react/utils/date/getYearDisplayName';
import { onEnterPressed } from '@lumx/core/js/utils';
import { addMonthResetDay } from '@lumx/react/utils/date/addMonthResetDay';
import { formatDayNumber } from '@lumx/react/utils/date/formatDayNumber';
import { VISUALLY_HIDDEN } from '@lumx/react/constants';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface DatePickerControlledProps extends DatePickerProps {
    /** Selected month to display. */
    selectedMonth: Date;
    /** On previous month change callback. */
    onPrevMonthChange(): void;
    /** On next month change callback. */
    onNextMonthChange(): void;
    /** On month/year change callback. */
    onMonthChange?: (newMonth: Date) => void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DatePickerControlled';

/**
 * DatePickerControlled component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerControlled = forwardRef<DatePickerControlledProps, HTMLDivElement>((props, ref) => {
    const {
        locale = getCurrentLocale(),
        maxDate,
        minDate,
        nextButtonProps,
        onChange,
        onNextMonthChange,
        onPrevMonthChange,
        previousButtonProps,
        selectedMonth,
        todayOrSelectedDateRef,
        value,
        onMonthChange,
        style,
    } = props;
    const { weeks, weekDays } = React.useMemo(() => {
        const localeObj = parseLocale(locale) as Locale;
        return getMonthCalendar(localeObj, selectedMonth, minDate, maxDate);
    }, [locale, minDate, maxDate, selectedMonth]);

    const selectedYear = selectedMonth.getFullYear();
    const formattedYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric' }).slice(0, 4);
    const [currentYear, setCurrentYear] = React.useState(String(selectedYear));

    // Updates month offset when validating year. Adds or removes 12 months per year when updating year value.
    const updateMonthOffset = React.useCallback(
        (newYearValue: string) => {
            const yearNumber = Number(newYearValue);
            if (yearNumber < 0 && yearNumber >= 9999) {
                return;
            }

            const previousYearNumber = selectedMonth.getFullYear();
            const offset = (yearNumber - previousYearNumber) * 12;
            onMonthChange?.(addMonthResetDay(selectedMonth, offset));
        },
        [selectedMonth, onMonthChange],
    );

    const onYearChange = React.useCallback<TextFieldProps['onChange']>(
        (newYearValue, _, event) => {
            setCurrentYear(newYearValue);

            // Detect if change is coming from the spin up/down arrows
            const inputType = (event?.nativeEvent as any)?.inputType;
            if (
                // Chrome/Safari
                !inputType ||
                // Firefox
                inputType === 'insertReplacementText'
            ) {
                updateMonthOffset(newYearValue);
            }
        },
        [updateMonthOffset],
    );

    const updateYear = React.useCallback(() => {
        updateMonthOffset(currentYear);
    }, [updateMonthOffset, currentYear]);

    const updateYearOnEnterPressed: KeyboardEventHandler = React.useMemo(
        () => onEnterPressed(updateYear),
        [updateYear],
    );

    const monthYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long' });

    // Update current year when selected year changes
    React.useEffect(() => {
        setCurrentYear(String(selectedYear));
    }, [selectedYear]);

    const prevSelectedMonth = usePreviousValue(selectedMonth);
    const monthHasChanged = prevSelectedMonth && !isSameDay(selectedMonth, prevSelectedMonth);

    // Only set the aria-live after the month has changed otherwise it can get announced on mount when used in the popover dialog
    const [labelAriaLive, setLabelAriaLive] = React.useState<'polite'>();
    React.useEffect(() => {
        if (monthHasChanged) setLabelAriaLive('polite');
    }, [monthHasChanged]);

    const yearLabel = getYearDisplayName(locale);

    return (
        <div ref={ref} className={`${CLASSNAME}`} style={style}>
            <Toolbar
                className={`${CLASSNAME}__toolbar`}
                after={
                    <IconButton
                        {...nextButtonProps}
                        emphasis={Emphasis.low}
                        icon={mdiChevronRight}
                        onClick={onNextMonthChange}
                    />
                }
                before={
                    <IconButton
                        {...previousButtonProps}
                        emphasis={Emphasis.low}
                        icon={mdiChevronLeft}
                        onClick={onPrevMonthChange}
                    />
                }
                label={
                    <>
                        <span aria-live={labelAriaLive} className={onMonthChange ? VISUALLY_HIDDEN : ''} dir="auto">
                            {monthYear}
                        </span>
                        {onMonthChange && (
                            <FlexBox
                                className={`${CLASSNAME}__month`}
                                orientation="horizontal"
                                hAlign="center"
                                gap="regular"
                                vAlign="center"
                                dir="auto"
                            >
                                {RegExp(`(.*)(${formattedYear})(.*)`)
                                    .exec(monthYear)
                                    ?.slice(1)
                                    .filter((part) => part !== '')
                                    .map((part) =>
                                        part === formattedYear ? (
                                            <TextField
                                                value={currentYear}
                                                aria-label={yearLabel}
                                                onChange={onYearChange}
                                                type="number"
                                                max={9999}
                                                min={0}
                                                onBlur={updateYear}
                                                onKeyPress={updateYearOnEnterPressed}
                                                key="year"
                                                className={`${CLASSNAME}__year`}
                                            />
                                        ) : (
                                            <Text as="p" key={part}>
                                                {part}
                                            </Text>
                                        ),
                                    )}
                            </FlexBox>
                        )}
                    </>
                }
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {weekDays.map(({ letter, number, long }) => (
                        <div key={number} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`} aria-hidden>
                                {letter.toLocaleUpperCase()}
                            </span>
                            <span className="visually-hidden">{long}</span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {weeks.flatMap((week, weekIndex) => {
                        return weekDays.map((weekDay, dayIndex) => {
                            const { date, isOutOfRange } = week[weekDay.number] || {};
                            const key = `${weekIndex}-${dayIndex}`;
                            const isToday = !isOutOfRange && date && isSameDay(date, new Date());
                            const isSelected = date && value && isSameDay(value, date);

                            return (
                                <div key={key} className={`${CLASSNAME}__day-wrapper`}>
                                    {date && (
                                        <Button
                                            ref={isSelected || (!value && isToday) ? todayOrSelectedDateRef : null}
                                            className={classNames(`${CLASSNAME}__month-day`, {
                                                [`${CLASSNAME}__month-day--is-today`]: isToday,
                                            })}
                                            disabled={isOutOfRange}
                                            isSelected={isSelected}
                                            emphasis="low"
                                            onClick={() => onChange(date)}
                                        >
                                            <span aria-hidden>{formatDayNumber(locale, date)}</span>
                                            <span className={VISUALLY_HIDDEN}>
                                                {date.toLocaleDateString(locale, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </Button>
                                    )}
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
        </div>
    );
});
DatePickerControlled.displayName = COMPONENT_NAME;
DatePickerControlled.className = CLASSNAME;
