import React, { KeyboardEventHandler, forwardRef } from 'react';
import classNames from 'classnames';
import { DatePickerProps, Emphasis, FlexBox, IconButton, Text, TextField, Toolbar } from '@lumx/react';
import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Comp } from '@lumx/react/utils/type';
import { getMonthCalendar } from '@lumx/react/utils/date/getMonthCalendar';
import { isSameDay } from '@lumx/react/utils/date/isSameDay';
import { getCurrentLocale } from '@lumx/react/utils/locale/getCurrentLocale';
import { parseLocale } from '@lumx/react/utils/locale/parseLocale';
import { Locale } from '@lumx/react/utils/locale/types';
import { usePreviousValue } from '@lumx/react/hooks/usePreviousValue';
import { getYearDisplayName } from '@lumx/react/utils/date/getYearDisplayName';
import { onEnterPressed } from '@lumx/react/utils/event';
import { addMonthResetDay } from '@lumx/react/utils/date/addMonthResetDay';
import { formatDayNumber } from '@lumx/react/utils/date/formatDayNumber';
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
export const DatePickerControlled: Comp<DatePickerControlledProps, HTMLDivElement> = forwardRef((props, ref) => {
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
    } = props;
    const { weeks, weekDays } = React.useMemo(() => {
        const localeObj = parseLocale(locale) as Locale;
        return getMonthCalendar(localeObj, selectedMonth, minDate, maxDate);
    }, [locale, minDate, maxDate, selectedMonth]);

    const selectedYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric' }).slice(0, 4);
    const [textFieldYearValue, setTextFieldYearValue] = React.useState(selectedYear);
    const isYearValid = Number(textFieldYearValue) > 0 && Number(textFieldYearValue) <= 9999;

    // Updates month offset when validating year. Adds or removes 12 months per year when updating year value.
    const updateMonthOffset = React.useCallback(() => {
        if (isYearValid) {
            const yearNumber = selectedMonth.getFullYear();
            const offset = (Number(textFieldYearValue) - yearNumber) * 12;
            if (onMonthChange) {
                onMonthChange(addMonthResetDay(selectedMonth, offset));
            }
        }
    }, [isYearValid, selectedMonth, textFieldYearValue, onMonthChange]);

    const monthYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long' });

    // Year can only be validated by pressing Enter key or on Blur. The below handles the press Enter key case
    const handleKeyPress: KeyboardEventHandler = React.useMemo(
        () => onEnterPressed(updateMonthOffset),
        [updateMonthOffset],
    );

    // Required to update year in the TextField when the user changes year by using prev next month arrows
    React.useEffect(() => {
        if (Number(textFieldYearValue) !== selectedMonth.getFullYear()) {
            setTextFieldYearValue(selectedMonth.getFullYear().toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth]);

    const prevSelectedMonth = usePreviousValue(selectedMonth);
    const monthHasChanged = prevSelectedMonth && !isSameDay(selectedMonth, prevSelectedMonth);

    // Only set the aria-live after the month has changed otherwise it can get announced on mount when used in the popover dialog
    const [labelAriaLive, setLabelAriaLive] = React.useState<'polite'>();
    React.useEffect(() => {
        if (monthHasChanged) setLabelAriaLive('polite');
    }, [monthHasChanged]);

    const label = getYearDisplayName(locale);

    return (
        <div ref={ref} className={`${CLASSNAME}`}>
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
                        <span aria-live={labelAriaLive} className={onMonthChange ? 'visually-hidden' : ''} dir="auto">
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
                                {RegExp(`(.*)(${selectedYear})(.*)`)
                                    .exec(monthYear)
                                    ?.slice(1)
                                    .filter((part) => part !== '')
                                    .map((part) =>
                                        part === selectedYear ? (
                                            <TextField
                                                value={textFieldYearValue}
                                                aria-label={label}
                                                onChange={setTextFieldYearValue}
                                                type="number"
                                                max={9999}
                                                min={0}
                                                onBlur={updateMonthOffset}
                                                onKeyPress={handleKeyPress}
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
                                        <button
                                            ref={isSelected || (!value && isToday) ? todayOrSelectedDateRef : null}
                                            className={classNames(`${CLASSNAME}__month-day`, {
                                                [`${CLASSNAME}__month-day--is-selected`]: isSelected,
                                                [`${CLASSNAME}__month-day--is-today`]: isToday,
                                            })}
                                            disabled={isOutOfRange}
                                            type="button"
                                            onClick={() => onChange(date)}
                                        >
                                            <span aria-hidden>{formatDayNumber(locale, date)}</span>
                                            <span className="visually-hidden">
                                                {date.toLocaleDateString(locale, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </button>
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
